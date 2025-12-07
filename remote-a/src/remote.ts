/**
 * !!! MODULE FEDERATION: Remote-A exposed function
 * This function is exposed to the host via './remoteApi' in webpack.remote.config.cjs
 * The host can dynamically import and call this function
 */
export async function renderRemoteMessage(containerId: string): Promise<void> {
  const el = document.getElementById(containerId);

  if (!el) {
    console.error(`Container element with id "${containerId}" not found.`);
    return;
  }

  try {
    // !!! MODULE FEDERATION: Remote-A dynamically imports the common library
    // This demonstrates that remotes can also consume other remotes
    // The common library is lazy-loaded only when this function is called
    const { logger, formatDate, COLORS, APP_NAME, generateId } = await import('commonLib/index');
    
    logger('Remote-A module rendering with common library utilities', 'info');
    
    const title = 'Remote-A App';
    const now = new Date();
    const formattedDate = formatDate(now);
    const componentId = generateId();
    
    el.innerHTML = `
      <div style="padding: 1.5rem; border: 2px solid ${COLORS.secondary}; border-radius: 8px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="margin: 0 0 1rem 0; color: ${COLORS.secondary};">${title}</h2>
        <p style="margin: 0.5rem 0; color: ${COLORS.dark};">
          This text was rendered by the <strong>Remote-A</strong> application through Module Federation.
        </p>
        <div style="margin: 1rem 0; padding: 1rem; background: ${COLORS.light}; border-radius: 6px;">
          <p style="margin: 0.25rem 0; color: ${COLORS.dark};"><strong>App:</strong> ${APP_NAME}</p>
          <p style="margin: 0.25rem 0; color: ${COLORS.dark};"><strong>Current Date:</strong> ${formattedDate}</p>
          <p style="margin: 0.25rem 0; color: ${COLORS.dark};"><strong>Current Time:</strong> ${now.toLocaleTimeString()}</p>
        </div>
        <p style="margin: 0.5rem 0; color: ${COLORS.secondary};">
          Using shared utilities from <strong>lk-common-lib</strong> (loaded lazily)
        </p>
        <p style="margin: 0.5rem 0; color: #6b7280; font-size: 0.875rem;">
          Component ID: <code style="background: ${COLORS.light}; padding: 0.25rem 0.5rem; border-radius: 4px;">${componentId}</code>
        </p>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load common library in remote:', error);

    el.innerHTML = `
      <div style="padding: 1rem; border: 1px solid #888; border-radius: 8px;">
        <h2>Remote-A App</h2>
        <p>This text was rendered by the <strong>Remote-A</strong> application through Module Federation.</p>
        <p style="color: #f59e0b; font-size: 0.875rem;">Warning: Common library not available</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const debugContainerId = 'remote-root';
  let debugContainer = document.getElementById(debugContainerId);

  if (!debugContainer) {
    debugContainer = document.createElement('div');
    debugContainer.id = debugContainerId;
    document.body.appendChild(debugContainer);
  }

  await renderRemoteMessage(debugContainerId);
});
