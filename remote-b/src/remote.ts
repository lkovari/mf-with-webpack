/**
 * !!! MODULE FEDERATION: Remote-B exposed function
 * This function is exposed to the host via './remoteContent' in webpack.remote-b.config.cjs
 * Note: Different exposed name than Remote-A to demonstrate flexibility
 */
export async function renderRemoteContent(containerId: string): Promise<void> {
  const el = document.getElementById(containerId);

  if (!el) {
    console.error(`Container element with id "${containerId}" not found.`);
    return;
  }

  try {
    // !!! MODULE FEDERATION: Remote-B also dynamically imports the common library
    // Both Remote-A and Remote-B share the same common library instance
    // This prevents loading duplicate code
    const { logger, formatDate, COLORS, APP_NAME, generateId } = await import('commonLib/index');
    
    logger('Remote-B module rendering with common library utilities', 'info');
    
    const now = new Date();
    const formattedDate = formatDate(now);
    const moduleId = generateId();
    
    el.innerHTML = `
      <div style="padding: 1.5rem; border: 2px solid ${COLORS.success}; border-radius: 8px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="margin: 0 0 1rem 0; color: ${COLORS.success};">Remote-B App</h2>
        <p style="margin: 0.5rem 0; color: ${COLORS.dark};">
          This is the <strong>Remote-B</strong> application, demonstrating a second remote in the Module Federation setup.
        </p>
        <div style="margin: 1rem 0; padding: 1rem; background: ${COLORS.light}; border-radius: 6px;">
          <p style="margin: 0.25rem 0; color: ${COLORS.dark};"><strong>App:</strong> ${APP_NAME}</p>
          <p style="margin: 0.25rem 0; color: ${COLORS.dark};"><strong>Current Date:</strong> ${formattedDate}</p>
          <p style="margin: 0.25rem 0; color: ${COLORS.dark};"><strong>Current Time:</strong> ${now.toLocaleTimeString()}</p>
        </div>
        <p style="margin: 0.5rem 0; color: ${COLORS.success};">
          Using shared utilities from <strong>lk-common-lib</strong> (loaded lazily)
        </p>
        <p style="margin: 0.5rem 0; color: #6b7280; font-size: 0.875rem;">
          Module ID: <code style="background: ${COLORS.light}; padding: 0.25rem 0.5rem; border-radius: 4px;">${moduleId}</code>
        </p>
      </div>
    `;
  } catch (error) {
    console.error('Failed to load common library in remote-b:', error);
    
    el.innerHTML = `
      <div style="padding: 1rem; border: 1px solid #10b981; border-radius: 8px;">
        <h2>Remote-B App</h2>
        <p>This is the <strong>Remote-B</strong> application running in fallback mode.</p>
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

  await renderRemoteContent(debugContainerId);
});

