export async function loadReadmeContent(): Promise<string> {
  try {
    const response = await fetch('./README.md');
    if (!response.ok) {
      throw new Error('Failed to load README');
    }
    const markdown = await response.text();
    return `<textarea id="readme-textarea" name="readme-textarea" readonly>${markdown}</textarea>`;
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

