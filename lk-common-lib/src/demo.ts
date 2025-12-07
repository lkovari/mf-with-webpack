import { logger, formatDate, capitalize, generateId } from './utils';
import { COLORS, APP_NAME, APP_VERSION } from './constants';

export function initDemo(): void {
  logger('Demo initialized', 'info');

  const loggerBtn = document.getElementById('demo-logger');
  const formatBtn = document.getElementById('demo-format');
  const colorsBtn = document.getElementById('demo-colors');
  const output = document.getElementById('demo-output');

  if (loggerBtn) {
    loggerBtn.addEventListener('click', () => {
      logger('This is an info message', 'info');
      logger('This is a warning message', 'warn');
      logger('This is an error message', 'error');
      
      if (output) {
        output.innerHTML = `
          <div style="padding: 1rem; background: #f3f4f6; border-radius: 6px; margin-top: 1rem;">
            <p style="margin: 0; color: #1f2937;">Check the browser console to see the logger output!</p>
          </div>
        `;
      }
    });
  }

  if (formatBtn) {
    formatBtn.addEventListener('click', () => {
      const today = new Date();
      const formatted = formatDate(today);
      const id = generateId();
      
      logger(`Generated ID: ${id}`, 'info');
      
      if (output) {
        output.innerHTML = `
          <div style="padding: 1rem; background: #f3f4f6; border-radius: 6px; margin-top: 1rem;">
            <p style="margin: 0.5rem 0; color: #1f2937;"><strong>Formatted Date:</strong> ${formatted}</p>
            <p style="margin: 0.5rem 0; color: #1f2937;"><strong>Generated ID:</strong> ${id}</p>
            <p style="margin: 0.5rem 0; color: #1f2937;"><strong>Capitalized:</strong> ${capitalize('hello world')}</p>
          </div>
        `;
      }
    });
  }

  if (colorsBtn) {
    colorsBtn.addEventListener('click', () => {
      if (output) {
        output.innerHTML = `
          <div style="padding: 1rem; background: #f3f4f6; border-radius: 6px; margin-top: 1rem;">
            <h3 style="margin: 0 0 1rem 0; color: #1f2937;">Available Colors</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem;">
              ${Object.entries(COLORS).map(([name, color]) => `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div style="width: 30px; height: 30px; background: ${color}; border-radius: 4px; border: 1px solid #e5e7eb;"></div>
                  <span style="font-size: 0.875rem; color: #1f2937;">${name}</span>
                </div>
              `).join('')}
            </div>
            <p style="margin: 1rem 0 0 0; color: #6b7280; font-size: 0.875rem;">
              <strong>${APP_NAME}</strong> v${APP_VERSION}
            </p>
          </div>
        `;
      }
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initDemo();
  });
}

