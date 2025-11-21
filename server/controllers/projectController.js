const Project = require('../models/Project');
const { generateFilePlanHelper, generateFileContentHelper, generateChatResponseHelper } = require('./aiController');

// --- BACKGROUND WORKER ---
const runBackgroundGeneration = async (projectId, isUpdate = false) => {
  console.log(`[Worker] Starting generation for Project ${projectId} (Update: ${isUpdate})`);
  
  try {
    let project = await Project.findById(projectId);
    if (!project) return;

    project.status = 'generating';
    project.logs.push({ message: isUpdate ? 'Analyzing changes...' : 'Initializing AI Architect...', type: 'info' });
    await project.save();

    // 1. Generate Plan (Pass existing files if update)
    const filePaths = await generateFilePlanHelper(project.originalPrompt, project.configuration, isUpdate ? project.files : []);
    
    project.logs.push({ message: isUpdate ? `Identified ${filePaths.length} files to modify.` : `Blueprint approved. Generating ${filePaths.length} files.`, type: 'success' });
    await project.save();

    // 2. Generate Files Loop
    let completed = 0;
    for (const path of filePaths) {
      // CHECK STOP
      project = await Project.findById(projectId);
      if (project.status === 'stopped') {
        project.logs.push({ message: 'Generation stopped by user.', type: 'error' });
        await project.save();
        return; 
      }

      project.logs.push({ message: `Writing ${path}...`, type: 'info' });
      await project.save(); 

      try {
        const code = await generateFileContentHelper(path, project.originalPrompt, project.configuration);
        
        // Upsert file logic
        const existingFileIndex = project.files.findIndex(f => f.path === path);
        if (existingFileIndex >= 0) {
           project.files[existingFileIndex].code = code; // Update existing
        } else {
           project.files.push({ path, code }); // Add new
        }

        completed++;
        // For updates, progress is based on new task list
        project.progress = Math.round((completed / filePaths.length) * 100);
        
        await project.save(); 
      } catch (err) {
        console.error(`Failed to generate ${path}`, err);
        project.logs.push({ message: `Error generating ${path}`, type: 'error' });
      }
    }

    // 3. Finish
    project.status = 'completed';
    project.logs.push({ message: 'Build complete. System ready.', type: 'success' });
    project.progress = 100;
    
    // Create a new version snapshot IF this was a successful run
    if (isUpdate) {
       project.versions.push({
          name: `v${project.versions.length + 2}`, // Next version number
          timestamp: new Date(),
          files: [...project.files], // Deep copy current state
          configuration: project.configuration,
          prompt: project.originalPrompt
       });
       project.currentVersion = project.versions.length + 1; // +1 because versions array tracks history, current is head
    }

    await project.save();
    console.log(`[Worker] Project ${projectId} Completed`);

  } catch (error) {
    console.error(`[Worker] Project ${projectId} Failed`, error);
    await Project.findByIdAndUpdate(projectId, { 
      status: 'failed',
      $push: { logs: { message: 'Critical System Failure.', type: 'error' } }
    });
  }
};


// --- CONTROLLER ACTIONS ---

const startGeneration = async (req, res) => {
  try {
    const { prompt, config, name } = req.body;

    const project = await Project.create({
      user: req.user._id,
      name: name || `Project ${new Date().toLocaleDateString()}`,
      originalPrompt: prompt,
      configuration: config,
      status: 'queued',
      // Initial Version 1 Snapshot
      versions: [{
         name: 'v1 - Initial',
         timestamp: new Date(),
         files: [],
         configuration: config,
         prompt: prompt
      }],
      logs: [{ message: 'Project queued.', type: 'info' }]
    });

    runBackgroundGeneration(project._id, false); // isUpdate = false

    res.status(201).json({ success: true, projectId: project._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start project', error: error.message });
  }
};

// NEW: Update Project (Apply Changes)
const updateProject = async (req, res) => {
  try {
    const { config, prompt } = req.body; // New config or prompt adjustments
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    // Snapshot current state before modifying (Save V(current) to history)
    // Actually, our model stores `files` as HEAD. 
    // So we just update HEAD, and push a NEW version when done? 
    // Better: Snapshot HEAD to `versions` NOW so we can revert.
    
    project.versions.push({
        name: `v${project.versions.length + 1} - Pre-Update`,
        timestamp: new Date(),
        files: [...project.files],
        configuration: project.configuration,
        prompt: project.originalPrompt
    });

    // Update HEAD metadata
    if (config) project.configuration = config;
    if (prompt) project.originalPrompt = prompt; // Append or replace prompt
    project.status = 'queued';
    project.progress = 0;
    project.logs.push({ message: 'Applying new changes...', type: 'info' });
    
    await project.save();

    // Trigger Update Worker
    runBackgroundGeneration(project._id, true); // isUpdate = true

    res.json({ success: true, message: 'Update started' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update failed' });
  }
};

const stopGeneration = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    if (project.status === 'queued' || project.status === 'generating') {
      project.status = 'stopped';
      await project.save();
    }
    res.json({ success: true, message: 'Generation stopped' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).select('name status progress createdAt').sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const sendChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userMsg = { role: 'user', text: message, timestamp: new Date() };
    project.chatHistory.push(userMsg);
    await project.save();

    const aiResponseText = await generateChatResponseHelper(project.chatHistory, message);
    const aiMsg = { role: 'ai', text: aiResponseText, timestamp: new Date() };
    project.chatHistory.push(aiMsg);
    await project.save();

    res.json({ success: true, message: aiMsg });
  } catch (error) {
    res.status(500).json({ message: 'Chat failed' });
  }
};

module.exports = { startGeneration, updateProject, stopGeneration, getProject, getMyProjects, deleteProject, sendChatMessage };