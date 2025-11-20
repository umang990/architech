// client/src/utils/highlight.js
export const highlightCode = (code) => {
  if (!code) return '';
  
  // Escape HTML characters to prevent XSS when rendering
  let safeCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return safeCode
    // Keywords (Purple/Pink)
    .replace(/\b(import|export|default|from|const|let|var|function|return|if|else|new|true|false|await|async|try|catch)\b/g, '<span class="text-[#c586c0]">$1</span>')
    // React/Mongoose specific (Teal)
    .replace(/\b(React|useState|useEffect|useRef|mongoose|Schema|model|express|router)\b/g, '<span class="text-[#4ec9b0]">$1</span>')
    // Strings (Orange/Brown)
    .replace(/(['"`].*?['"`])/g, '<span class="text-[#ce9178]">$1</span>')
    // Comments (Green)
    .replace(/(\/\/.*)/g, '<span class="text-[#6a9955]">$1</span>')
    // Brackets/Parantheses (Yellow)
    .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="text-[#ffd700]">$1</span>')
    // Numbers (Light Green)
    .replace(/\b(\d+)\b/g, '<span class="text-[#b5cea8]">$1</span>');
};