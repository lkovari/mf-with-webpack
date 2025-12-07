export async function loadReadmeContent(): Promise<string> {
  try {
    const response = await fetch('./README.md');
    if (!response.ok) {
      throw new Error('Failed to load README');
    }
    const markdown = await response.text();
    return `<div class="readme-textbox">${convertMarkdownToHTML(markdown)}</div>`;
  } catch (error) {
    console.error('Error loading README:', error);
    return `
      <div class="error-message">
        <h3>Unable to load README content</h3>
        <p>The README.md file could not be loaded. Please check the console for details.</p>
      </div>
    `;
  }
}

function convertMarkdownToHTML(markdown: string): string {
  let html = markdown;

  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre><code>$2</code></pre>');
  
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/<\/ul>\n<ul>/g, '');
  
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  
  html = html.replace(/^(.+)$/gm, (match) => {
    if (!match.startsWith('<') && match.trim().length > 0) {
      return `<p>${match}</p>`;
    }
    return match;
  });
  
  html = html.replace(/<p><h/g, '<h');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p><ul>/g, '<ul>');
  html = html.replace(/<\/ul><\/p>/g, '</ul>');
  html = html.replace(/<p><pre>/g, '<pre>');
  html = html.replace(/<\/pre><\/p>/g, '</pre>');
  html = html.replace(/<p><blockquote>/g, '<blockquote>');
  html = html.replace(/<\/blockquote><\/p>/g, '</blockquote>');
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  return html;
}

