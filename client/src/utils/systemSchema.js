import { 
  Shield, Database, Layout, Server, Globe, Terminal, 
  Lock, Zap, Box, Activity, Users, GitBranch, 
  Layers, Cloud, Smartphone, Code 
} from 'lucide-react';

export const SYSTEM_MODULES = [
  {
    id: 'core',
    label: 'Core Identity',
    icon: Terminal,
    description: 'Project metadata and foundational settings',
    config: [
      { key: 'appName', label: 'Application Name', type: 'input', default: 'MernApp' },
      { key: 'version', label: 'Initial Version', type: 'input', default: '1.0.0' },
      { key: 'license', label: 'License', type: 'select', options: ['MIT', 'Apache 2.0', 'Proprietary'], default: 'MIT' },
      { key: 'language', label: 'Language', type: 'select', options: ['JavaScript', 'TypeScript'], default: 'JavaScript' },
      { key: 'pwa', label: 'PWA Support', type: 'toggle', default: false },
      { key: 'a11y', label: 'Accessibility Std', type: 'select', options: ['WCAG AA', 'WCAG AAA', 'None'], default: 'WCAG AA' },
      { key: 'seo', label: 'SEO Optimization', type: 'toggle', default: true },
      { key: 'analytics', label: 'Analytics Engine', type: 'select', options: ['Google', 'Plausible', 'None'], default: 'None' },
      { key: 'env', label: 'Environment', type: 'select', options: ['Node', 'Bun'], default: 'Node' },
      { key: 'docker', label: 'Dockerize', type: 'toggle', default: true }
    ]
  },
  {
    id: 'auth',
    label: 'Authentication',
    icon: Shield,
    description: 'Security protocols and user access',
    config: [
      { key: 'authType', label: 'Auth Strategy', type: 'select', options: ['JWT', 'Session', 'OAuth Only'], default: 'JWT' },
      { key: 'oauth_google', label: 'Google OAuth', type: 'toggle', default: false },
      { key: 'oauth_github', label: 'GitHub OAuth', type: 'toggle', default: false },
      { key: 'mfa', label: 'Multi-Factor Auth', type: 'toggle', default: false },
      { key: 'password_policy', label: 'Password Strength', type: 'select', options: ['Standard', 'Strict', 'NIST'], default: 'Standard' },
      { key: 'session_timeout', label: 'Session Timeout', type: 'select', options: ['15m', '1h', '1d', '7d'], default: '1d' },
      { key: 'roles', label: 'RBAC (Roles)', type: 'toggle', default: true },
      { key: 'email_verify', label: 'Email Verification', type: 'toggle', default: true },
      { key: 'rate_limit', label: 'Login Rate Limit', type: 'toggle', default: true },
      { key: 'forgot_pass', label: 'Forgot Password Flow', type: 'toggle', default: true }
    ]
  },
  {
    id: 'ui',
    label: 'User Interface',
    icon: Layout,
    description: 'Design system and component libraries',
    config: [
      { key: 'framework', label: 'CSS Framework', type: 'select', options: ['Tailwind', 'MUI', 'Chakra', 'Styled-Comp'], default: 'Tailwind' },
      { key: 'theme_mode', label: 'Theme Mode', type: 'select', options: ['Light', 'Dark', 'System'], default: 'System' },
      { key: 'primary_color', label: 'Primary Color', type: 'color', default: '#808000' },
      { key: 'animations', label: 'Animations', type: 'select', options: ['Framer Motion', 'GSAP', 'CSS Only'], default: 'Framer Motion' },
      { key: 'icons', label: 'Icon Set', type: 'select', options: ['Lucide', 'Heroicons', 'FontAwesome'], default: 'Lucide' },
      { key: 'fonts', label: 'Font Family', type: 'select', options: ['Inter', 'Roboto', 'Poppins'], default: 'Inter' },
      { key: 'charts', label: 'Charting Lib', type: 'select', options: ['Recharts', 'ChartJS', 'None'], default: 'None' },
      { key: 'forms', label: 'Form Logic', type: 'select', options: ['React Hook Form', 'Formik'], default: 'React Hook Form' },
      { key: 'tables', label: 'Data Tables', type: 'select', options: ['TanStack Table', 'Basic'], default: 'Basic' },
      { key: 'toast', label: 'Notifications', type: 'select', options: ['Sonner', 'Toastify', 'Custom'], default: 'Sonner' }
    ]
  },
  {
    id: 'db',
    label: 'Database',
    icon: Database,
    description: 'Data persistence and schema architecture',
    config: [
      { key: 'db_type', label: 'Primary DB', type: 'select', options: ['MongoDB', 'PostgreSQL', 'MySQL'], default: 'MongoDB' },
      { key: 'orm', label: 'ORM/ODM', type: 'select', options: ['Mongoose', 'Prisma', 'TypeORM'], default: 'Mongoose' },
      { key: 'caching', label: 'Caching Layer', type: 'select', options: ['Redis', 'Memcached', 'None'], default: 'None' },
      { key: 'soft_delete', label: 'Soft Delete', type: 'toggle', default: true },
      { key: 'timestamps', label: 'Auto Timestamps', type: 'toggle', default: true },
      { key: 'indexing', label: 'Auto Indexing', type: 'toggle', default: true },
      { key: 'seeding', label: 'Seed Scripts', type: 'toggle', default: true },
      { key: 'migration', label: 'Migration Tool', type: 'toggle', default: false },
      { key: 'encryption', label: 'Data Encryption', type: 'toggle', default: false },
      { key: 'backup', label: 'Backup Strategy', type: 'select', options: ['Daily', 'Weekly', 'None'], default: 'None' }
    ]
  },
  {
    id: 'api',
    label: 'API Strategy',
    icon: Globe,
    description: 'Networking and data transport layers',
    config: [
      { key: 'arch', label: 'Architecture', type: 'select', options: ['REST', 'GraphQL', 'TRPC'], default: 'REST' },
      { key: 'doc', label: 'Documentation', type: 'select', options: ['Swagger', 'Postman', 'None'], default: 'Swagger' },
      { key: 'validation', label: 'Validation', type: 'select', options: ['Zod', 'Joi', 'Yup'], default: 'Zod' },
      { key: 'versioning', label: 'API Versioning', type: 'toggle', default: true },
      { key: 'cors', label: 'CORS Policy', type: 'select', options: ['Strict', 'Permissive'], default: 'Strict' },
      { key: 'compression', label: 'Compression', type: 'toggle', default: true },
      { key: 'logging', label: 'Request Logging', type: 'select', options: ['Morgan', 'Winston'], default: 'Morgan' },
      { key: 'upload', label: 'File Uploads', type: 'select', options: ['Multer (Local)', 'S3', 'Cloudinary'], default: 'Multer (Local)' },
      { key: 'pagination', label: 'Pagination', type: 'select', options: ['Cursor', 'Offset'], default: 'Cursor' },
      { key: 'websockets', label: 'Real-time', type: 'select', options: ['Socket.io', 'WS', 'None'], default: 'None' }
    ]
  },
  {
    id: 'backend',
    label: 'Server Logic',
    icon: Server,
    description: 'Node.js runtime configuration',
    config: [
      { key: 'framework', label: 'Framework', type: 'select', options: ['Express', 'NestJS', 'Fastify'], default: 'Express' },
      { key: 'module', label: 'Module System', type: 'select', options: ['ES Modules', 'CommonJS'], default: 'CommonJS' },
      { key: 'structure', label: 'Folder Structure', type: 'select', options: ['MVC', 'Modular', 'Clean Arch'], default: 'MVC' },
      { key: 'cron', label: 'Scheduled Jobs', type: 'select', options: ['Node-Cron', 'Agenda', 'None'], default: 'None' },
      { key: 'mailer', label: 'Email Service', type: 'select', options: ['Nodemailer', 'SendGrid', 'None'], default: 'Nodemailer' },
      { key: 'cluster', label: 'Clustering', type: 'toggle', default: false },
      { key: 'error_h', label: 'Global Error Handler', type: 'toggle', default: true },
      { key: 'async', label: 'Async Wrapper', type: 'toggle', default: true },
      { key: 'sanitization', label: 'Input Sanitization', type: 'toggle', default: true },
      { key: 'helmet', label: 'Helmet Security', type: 'toggle', default: true }
    ]
  },
  {
    id: 'devops',
    label: 'DevOps & CI/CD',
    icon: Cloud,
    description: 'Deployment and integration pipelines',
    config: [
      { key: 'ci', label: 'CI Provider', type: 'select', options: ['GitHub Actions', 'GitLab CI', 'None'], default: 'GitHub Actions' },
      { key: 'container', label: 'Containerization', type: 'select', options: ['Docker', 'Podman', 'None'], default: 'Docker' },
      { key: 'orchestration', label: 'Orchestration', type: 'select', options: ['K8s', 'Docker Swarm', 'None'], default: 'None' },
      { key: 'hosting', label: 'Target Hosting', type: 'select', options: ['Vercel/Render', 'AWS', 'DigitalOcean'], default: 'Vercel/Render' },
      { key: 'linting', label: 'Linting', type: 'select', options: ['ESLint + Prettier', 'Standard', 'None'], default: 'ESLint + Prettier' },
      { key: 'testing', label: 'Testing Framework', type: 'select', options: ['Jest', 'Mocha', 'Vitest'], default: 'Jest' },
      { key: 'e2e', label: 'E2E Testing', type: 'select', options: ['Cypress', 'Playwright', 'None'], default: 'None' },
      { key: 'husky', label: 'Git Hooks (Husky)', type: 'toggle', default: true },
      { key: 'monitor', label: 'Uptime Monitor', type: 'toggle', default: false },
      { key: 'terraform', label: 'IaC (Terraform)', type: 'toggle', default: false }
    ]
  }
];