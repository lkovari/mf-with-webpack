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
          <h1 class="header-title">${config.title}</h1>
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

