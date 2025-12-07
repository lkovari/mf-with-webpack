export interface LayoutConfig {
  title: string;
  subtitle: string;
  onNavigate: (page: 'home' | 'remote-a' | 'remote-b') => void;
}

export function createMainLayout(config: LayoutConfig): void {
  const appRoot = document.getElementById('host-root');
  if (!appRoot) {
    throw new Error('Host root element not found');
  }

  appRoot.innerHTML = `
    <div id="main-layout">
      <header id="layout-header">
        <div class="header-content">
          <div class="header-title-row">
            <h1 class="header-title">${config.title}</h1>
            <a href="https://github.com/lkovari/mf-with-webpack/tree/main" target="_blank" rel="noopener noreferrer" class="github-icon-link" aria-label="View source code on GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
          <p class="header-subtitle">${config.subtitle}</p>
        </div>
        <nav id="layout-nav">
          <button class="nav-item" data-page="home">Info</button>
          <button class="nav-item" data-page="remote-a">Remote-A</button>
          <button class="nav-item" data-page="remote-b">Remote-B</button>
        </nav>
      </header>
      <main id="layout-body">
        <div id="content-area"></div>
      </main>
      <footer id="layout-footer">
        <div id="footer-content"></div>
      </footer>
    </div>
  `;

  attachNavigationEvents(config.onNavigate);
}

function attachNavigationEvents(onNavigate: (page: 'home' | 'remote-a' | 'remote-b') => void): void {
  const navButtons = document.querySelectorAll('.nav-item');
  
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      const page = target.getAttribute('data-page') as 'home' | 'remote-a' | 'remote-b';
      
      navButtons.forEach(btn => btn.classList.remove('active'));
      target.classList.add('active');
      
      onNavigate(page);
    });
  });

  const homeButton = document.querySelector('[data-page="home"]');
  if (homeButton) {
    homeButton.classList.add('active');
  }
}

export function getContentArea(): HTMLElement | null {
  return document.getElementById('content-area');
}

export function getFooter(): HTMLElement | null {
  return document.getElementById('footer-content');
}

