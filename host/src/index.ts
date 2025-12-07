// Import local CSS and modules
import './styles.css';
import { createMainLayout, getContentArea, getFooter } from './main-layout';
import { loadReadmeContent } from './readme-content';

/**
 * Bootstrap function - Entry point of the host application
 * This initializes the layout, footer, and loads the default home page
 */
async function bootstrap(): Promise<void> {
  // Create the main grid-based layout (header, body, footer)
  createMainLayout({
    title: 'Host App',
    subtitle: 'Demonstrating Module Federation with lazy loading',
    onNavigate: handleNavigation
  });

  // !!! MODULE FEDERATION: Initialize footer with date from common library (lazy loaded)
  await initializeFooter();
  
  // Load the default page (README content)
  await loadHomePage();
}

/**
 * !!! MODULE FEDERATION: Initialize footer with lazy-loaded common library
 * This demonstrates dynamic import of a federated module
 */
async function initializeFooter(): Promise<void> {
  const footer = getFooter();
  if (!footer) return;

  try {
    // !!! DYNAMIC IMPORT: Lazy load the common library only when needed
    // Syntax: import('remoteName/exposedModule')
    // - 'commonLib' matches the key in webpack remotes configuration
    // - '/index' matches the exposed module in common library's exposes config
    const { formatDate } = await import('commonLib/index');
    
    const currentDate = formatDate(new Date());
    footer.innerHTML = `Last update: ${currentDate}`;
  } catch (error) {
    // Graceful fallback if the remote is unavailable
    console.error('Failed to load date in footer:', error);
    footer.innerHTML = `Last update: ${new Date().toLocaleDateString()}`;
  }
}

async function handleNavigation(page: 'home' | 'remote-a' | 'remote-b'): Promise<void> {
  const contentArea = getContentArea();
  if (!contentArea) return;

  contentArea.innerHTML = '<div class="loading-message">Loading...</div>';

  switch (page) {
    case 'home':
      await loadHomePage();
      break;
    case 'remote-a':
      await loadRemoteA();
      break;
    case 'remote-b':
      await loadRemoteB();
      break;
  }
}

async function loadHomePage(): Promise<void> {
  const contentArea = getContentArea();
  if (!contentArea) return;

  const readmeContent = await loadReadmeContent();
  contentArea.innerHTML = readmeContent;
}

/**
 * !!! MODULE FEDERATION: Load Remote-A application dynamically
 * This demonstrates lazy loading of a remote micro-frontend
 */
async function loadRemoteA(): Promise<void> {
  const contentArea = getContentArea();
  if (!contentArea) return;

  try {
    // !!! STEP 1: Load common library for utilities
    const { logger, MESSAGES } = await import('commonLib/index');
    logger('Loading Remote-A module...', 'info');
    
    contentArea.innerHTML = `<div class="loading-message">${MESSAGES.loading}</div>`;
    
    // Create a temporary container for the remote content
    const tempContainer = document.createElement('div');
    tempContainer.id = 'temp-remote-a-container';
    tempContainer.className = 'remote-container';
    contentArea.innerHTML = '';
    contentArea.appendChild(tempContainer);

    // !!! STEP 2: Dynamically load Remote-A application
    // webpack will fetch http://localhost:8081/remoteEntry.js
    // Then load the specific module './remoteApi' that Remote-A exposes
    const remoteModule = await import('remoteApp/remoteApi');
    await remoteModule.renderRemoteMessage('temp-remote-a-container');
    
    logger('Remote-A module loaded successfully!', 'info');
  } catch (error) {
    // Error handling with graceful degradation
    console.error('Failed to load Remote-A module:', error);
    
    try {
      const { logger } = await import('commonLib/index');
      logger('Remote-A module failed to load', 'error');
    } catch {}
    
    contentArea.innerHTML = `
      <div class="error-message">
        <h3>Failed to load Remote-A module</h3>
        <p>The Remote-A application is currently unavailable. Please try again later.</p>
        <details style="margin-top: 0.5rem;">
          <summary style="cursor: pointer;">Error details</summary>
          <pre style="margin-top: 0.5rem; padding: 0.5rem; background: #fff; border-radius: 4px; overflow-x: auto; font-size: 0.875rem;">${error instanceof Error ? error.message : String(error)}</pre>
        </details>
      </div>
    `;
  }
}

/**
 * !!! MODULE FEDERATION: Load Remote-B application dynamically
 * Same pattern as Remote-A but loading a different remote
 */
async function loadRemoteB(): Promise<void> {
  const contentArea = getContentArea();
  if (!contentArea) return;

  try {
    // Load common library utilities
    const { logger, MESSAGES } = await import('commonLib/index');
    logger('Loading Remote-B module...', 'info');
    
    contentArea.innerHTML = `<div class="loading-message">${MESSAGES.loading}</div>`;
    
    // Create container for the remote content
    const tempContainer = document.createElement('div');
    tempContainer.id = 'temp-remote-b-container';
    tempContainer.className = 'remote-container';
    contentArea.innerHTML = '';
    contentArea.appendChild(tempContainer);

    // !!! DYNAMIC IMPORT: Load Remote-B application
    // webpack will fetch http://localhost:8083/remoteEntry.js
    // Then load the './remoteContent' module that Remote-B exposes
    // Note: Different exposed name than Remote-A ('./remoteContent' vs './remoteApi')
    const remoteModule = await import('remoteBApp/remoteContent');
    await remoteModule.renderRemoteContent('temp-remote-b-container');
    
    logger('Remote-B module loaded successfully!', 'info');
  } catch (error) {
    // Error handling with graceful degradation
    console.error('Failed to load Remote-B module:', error);
    
    try {
      const { logger } = await import('commonLib/index');
      logger('Remote-B module failed to load', 'error');
    } catch {}
    
    contentArea.innerHTML = `
      <div class="error-message">
        <h3>Failed to load Remote-B module</h3>
        <p>The Remote-B application is currently unavailable. Please try again later.</p>
        <details style="margin-top: 0.5rem;">
          <summary style="cursor: pointer;">Error details</summary>
          <pre style="margin-top: 0.5rem; padding: 0.5rem; background: #fff; border-radius: 4px; overflow-x: auto; font-size: 0.875rem;">${error instanceof Error ? error.message : String(error)}</pre>
        </details>
      </div>
    `;
  }
}

bootstrap().catch((err) => console.error(err));
