# Webpack Module Federation – TypeScript + HTML Bare-Metal Example

This is a **production-ready**, native (bare-metal) Webpack Module Federation example
**without Angular**, using only TypeScript + plain HTML:

- `host/` – host application that loads remotes and the common library
- `remote-a/` – remote application that exports a TS function called by the host
- `remote-b/` – second remote application demonstrating multi-remote architecture
- `lk-common-lib/` – shared library with utilities, constants, and types (lazily loaded)

## Features

### Core Module Federation
- Host-remote architecture
- **Lazy Loading**: Dynamic imports for on-demand module loading
- **Shared Library**: lk-common-lib with utilities, constants, and types
- TypeScript type definitions for all remote modules
- Standalone execution for all applications (host, remote-a, lk-common-lib)

### Production-Ready Enhancements
- **Error Handling**: Comprehensive error handling and loading states
- **Environment Variables**: Configurable remote URLs and publicPath
- **Production Build**: Optimized, minified production builds
- **CSS & Asset Support**: Style loader and asset module support
- **CORS Configuration**: Cross-origin support on dev servers
- **HMR**: Hot Module Replacement in development environment
- **Shared Dependencies**: Pre-configured structure for shared dependencies

## Prerequisites

- Node.js >= 18
- pnpm >= 8

> **Note**: This project uses pnpm as the package manager. If you don't have it installed, run:
> ```bash
> npm install -g pnpm
> ```

## Key Dependencies Explained

### Why These Webpack Plugins?

**copy-webpack-plugin (^12.0.2)**
- Copies static files (like README.md) to the build output directory
- Required for the host app to dynamically load README.md at runtime
- Without it, the README content wouldn't be available in the dist folder

**html-webpack-plugin (^5.6.0)**
- Automatically generates HTML files with injected webpack bundles
- Simplifies the build process by auto-inserting `<script>` tags
- Essential for serving the applications with proper bundle references

**webpack-dev-server (^5.0.4)**
- Provides live development server with Hot Module Replacement (HMR)
- Enables CORS headers for cross-origin module loading
- Required for serving the host and remotes during development
- Without it, Module Federation wouldn't work in development mode

## Quick Start

### 1. Installation

```bash
pnpm install
```

### 2. Start Development Environment

**Option A: Separate terminals**
```bash
# Terminal 1 - Common Library (port 8082)
pnpm run serve:lib

# Terminal 2 - Remote-A (port 8081)
pnpm run serve:remote-a

# Terminal 3 - Remote-B (port 8083)
pnpm run serve:remote-b

# Terminal 4 - Host application (port 8080)
pnpm run serve:host
```

**Option B: All at once**
```bash
pnpm run serve:all
```

This will start:
- **Common Library** on http://localhost:8082
- **Remote-A** on http://localhost:8081
- **Remote-B** on http://localhost:8083
- **Host** on http://localhost:8080

### 3. Open in Browser

**Host Application:** `http://localhost:8080`
- Default view shows the README content in a grid-based layout
- Click **"Remote-A"** in the navigation to lazy load and display remote-a
- Click **"Remote-B"** in the navigation to lazy load and display remote-b
- Click **"Info"** to return to the README content
- Footer displays the current date using lk-common-lib utilities

**Remote-A Standalone:** `http://localhost:8081`
- View the remote-a module running independently

**Remote-B Standalone:** `http://localhost:8083`
- View the remote-b module running independently

**Common Library Standalone:** `http://localhost:8082`
- Test the common library utilities in standalone mode

## Build Process

### Development Build

```bash
# Separately
pnpm run build:lib
pnpm run build:remote-a
pnpm run build:remote-b
pnpm run build:host

# All at once
pnpm run build:all
```

### Production Build

```bash
# Production build with optimization
pnpm run build:lib:prod
pnpm run build:remote-a:prod
pnpm run build:remote-b:prod
pnpm run build:host:prod

# All at once
pnpm run build:all:prod
```

Build output location:
- Common Library: `dist/lk-common-lib/`
- Remote-A: `dist/remote-a/`
- Remote-B: `dist/remote-b/`
- Host: `dist/host/`

## GitHub Pages Deployment

This project is configured for easy deployment to GitHub Pages with all Module Federation features working correctly.

### Prerequisites

1. GitHub repository with push access
2. gh-pages package installed (already in devDependencies)

### Deployment Steps

**Step 1: Install dependencies (if not already done)**
```bash
pnpm install
```

**Step 2: Build for GitHub Pages**
```bash
pnpm run gitbuild
```

This command:
- Builds all applications in production mode
- Sets correct `publicPath` for GitHub Pages
- Configures all remote URLs to GitHub Pages locations
- Creates a root `index.html` that redirects to the host app
- Adds `.nojekyll` file to prevent Jekyll processing

**Step 3: Deploy to GitHub Pages**
```bash
pnpm run gitdeploy
```

Or use the shortcut:
```bash
pnpm run deploy
```

This command:
- Runs the build process
- Deploys the `dist` folder to the `gh-pages` branch
- Publishes to `https://your-username.github.io/mf-with-webpack/`

### GitHub Pages URL Structure

Once deployed, your application will be available at:

```
https://lkovari.github.io/mf-with-webpack/              → Redirects to host
https://lkovari.github.io/mf-with-webpack/host/         → Host application
https://lkovari.github.io/mf-with-webpack/remote-a/     → Remote-A (standalone)
https://lkovari.github.io/mf-with-webpack/remote-b/     → Remote-B (standalone)
https://lkovari.github.io/mf-with-webpack/lk-common-lib/ → Common library (standalone)
```

### How It Works

The `gitbuild` script sets environment variables for production deployment:

```bash
NODE_ENV=production
PUBLIC_PATH=/mf-with-webpack/
REMOTE_A_URL=https://lkovari.github.io/mf-with-webpack/remote-a
REMOTE_B_URL=https://lkovari.github.io/mf-with-webpack/remote-b
COMMON_LIB_URL=https://lkovari.github.io/mf-with-webpack/lk-common-lib
```

The webpack configs use these variables to:
1. Set correct `publicPath` for each application
2. Configure Module Federation remotes to point to GitHub Pages URLs
3. Ensure all assets load correctly from the GitHub Pages domain

### Customization

If you fork this repository or use a different repository name, update the URLs in `package.json`:

```json
{
  "scripts": {
    "gitbuild": "NODE_ENV=production PUBLIC_PATH=/your-repo-name/ REMOTE_A_URL=https://your-username.github.io/your-repo-name/remote-a REMOTE_B_URL=https://your-username.github.io/your-repo-name/remote-b COMMON_LIB_URL=https://your-username.github.io/your-repo-name/lk-common-lib pnpm run build:all:prod && pnpm run organize:gh-pages"
  }
}
```

### Troubleshooting

**404 errors after deployment:**
- Ensure GitHub Pages is enabled in repository settings
- Check that the source is set to `gh-pages` branch
- Wait a few minutes for GitHub Pages to process the deployment

**Module Federation not loading remotes:**
- Verify all URLs in the `gitbuild` script match your GitHub Pages URL
- Check browser console for CORS or 404 errors
- Ensure `.nojekyll` file is present in the dist folder

**Assets not loading:**
- Verify `publicPath` in webpack configs matches your repository structure
- Check that all applications have the correct base path

## Configuration

### Environment Variables

#### REMOTE_A_URL
The remote-a application URL (used by the host)

```bash
# Development (default)
REMOTE_A_URL=http://localhost:8081 pnpm run serve:host

# Staging
REMOTE_A_URL=https://staging-remote-a.example.com pnpm run serve:host

# Production build
REMOTE_A_URL=https://remote-a.example.com pnpm run build:host:prod
```

#### REMOTE_B_URL
The remote-b application URL (used by the host)

```bash
# Development (default)
REMOTE_B_URL=http://localhost:8083 pnpm run serve:host

# Production build
REMOTE_B_URL=https://remote-b.example.com pnpm run build:host:prod
```

#### COMMON_LIB_URL
The common library URL (used by host and remote-a)

```bash
# Development (default)
COMMON_LIB_URL=http://localhost:8082 pnpm run serve:host

# Production
COMMON_LIB_URL=https://common-lib.example.com pnpm run build:host:prod
```

#### PUBLIC_PATH
The public path for applications (for assets and bundles)

```bash
# Custom CDN URL
PUBLIC_PATH=https://cdn.example.com/ pnpm run build:host:prod

# Relative path
PUBLIC_PATH=/app/ pnpm run build:host:prod
```

#### NODE_ENV
Build mode configuration

```bash
# Production mode
NODE_ENV=production pnpm run build:host

# Development mode (default)
pnpm run build:host
```

### Webpack Configuration

#### Host (webpack.host.config.cjs)
- **Mode**: Development / Production (based on NODE_ENV)
- **Port**: 8080
- **Remotes**: 
  - `remoteApp` @ http://localhost:8081/remoteEntry.js
  - `remoteBApp` @ http://localhost:8083/remoteEntry.js
  - `commonLib` @ http://localhost:8082/remoteEntry.js
- **Features**: HMR, CORS headers, CSS support, source maps, lazy loading

#### Remote-A (webpack.remote.config.cjs)
- **Mode**: Development / Production (based on NODE_ENV)
- **Port**: 8081
- **Remotes**: `commonLib` @ http://localhost:8082/remoteEntry.js
- **Exposes**: `./remoteApi` → `./remote-a/src/remote.ts`
- **Features**: HMR, CORS headers, CSS support, source maps, lazy loading

#### Remote-B (webpack.remote-b.config.cjs)
- **Mode**: Development / Production (based on NODE_ENV)
- **Port**: 8083
- **Remotes**: `commonLib` @ http://localhost:8082/remoteEntry.js
- **Exposes**: `./remoteContent` → `./remote-b/src/remote.ts`
- **Features**: HMR, CORS headers, CSS support, source maps, lazy loading

#### Common Library (webpack.common-lib.config.cjs)
- **Mode**: Development / Production (based on NODE_ENV)
- **Port**: 8082
- **Exposes**: 
  - `./utils` → utilities (formatDate, logger, etc.)
  - `./constants` → shared constants (COLORS, API_ENDPOINTS, etc.)
  - `./types` → TypeScript type definitions
  - `./index` → all exports combined
- **Features**: HMR, CORS headers, CSS support, source maps

## Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                   Host App (localhost:8080)                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  • Error handling & loading states                          │  │
│  │  • Lazy loads commonLib on button click                     │  │
│  │  • Lazy loads remote-a on button click                      │  │
│  │  • Lazy loads remote-b on button click                      │  │
│  └─────────────────────────────────────────────────────────────┘  │
│         ↓                    ↓                    ↓                │
│    (lazy load)          (lazy load)          (lazy load)           │
│         ↓                    ↓                    ↓                │
│  ┌──────────────┐     ┌─────────────┐     ┌─────────────┐         │
│  │ Common Lib   │←────│  Remote-A   │     │  Remote-B   │         │
│  │ (8082)       │     │  (8081)     │     │  (8083)     │         │
│  │              │  ┌──→              │←────┘             │         │
│  │ Exposes:     │  │  │ Exposes:    │    Exposes:       │         │
│  │ • ./utils    │  │  │ • ./remoteApi│   • ./remoteContent│       │
│  │ • ./constants│  │  │             │                   │         │
│  │ • ./types    │  │  │ Uses        │   Uses commonLib  │         │
│  │ • ./index    │  │  │ commonLib   │   utilities       │         │
│  └──────────────┘  │  └─────────────┘   └─────────────┘          │
│         ↑          │                                               │
│         └──────────┘                                               │
└───────────────────────────────────────────────────────────────────┘

Key: All modules support standalone execution & lazy loading
```

## How Webpack Module Federation Works

### Core Concept

Module Federation is a JavaScript architecture that allows multiple independent builds (micro-frontends) to work together as a single application. Each build can expose modules and consume modules from other builds at runtime.

### Key Components

**1. Host Application**
- The main application that consumes remote modules
- Defines which remotes it can load via the `remotes` configuration
- Uses dynamic imports to lazy load remotes on demand

**2. Remote Applications**
- Independent applications that expose modules to be consumed
- Define what to expose via the `exposes` configuration
- Can also consume other remotes (bi-directional federation)

**3. Shared Dependencies**
- Common libraries that should only load once
- Configured via the `shared` option
- Prevents duplicate code and reduces bundle size

### Step-by-Step Loading Process

**Step 1: Host Initialization**
```
1. Host app loads (localhost:8080)
2. Webpack reads ModuleFederationPlugin config
3. Host is aware of available remotes but doesn't load them yet
```

**Step 2: User Interaction**
```
1. User clicks "Remote-A" button
2. Host executes: await import('remoteApp/remoteApi')
3. This triggers Module Federation lazy loading
```

**Step 3: Remote Entry Loading**
```
1. Webpack fetches: http://localhost:8081/remoteEntry.js
2. remoteEntry.js is a special file generated by ModuleFederationPlugin
3. It contains metadata about what Remote-A exposes
4. It provides functions to load the actual modules
```

**Step 4: Module Loading**
```
1. Webpack requests the specific module: './remoteApi'
2. Remote-A's webpack serves the module bundle
3. The module is evaluated in the host's context
4. The exported function (renderRemoteMessage) is now available
```

**Step 5: Shared Dependency Resolution**
```
1. If Remote-A needs commonLib, it follows the same process
2. Webpack checks if commonLib is already loaded
3. If loaded, reuses the existing instance (singleton pattern)
4. If not loaded, fetches from localhost:8082
```

### Configuration Mapping

**In Host (webpack.host.config.cjs):**
```javascript
remotes: {
  remoteApp: 'remoteApp@http://localhost:8081/remoteEntry.js'
}
```
- `remoteApp` = How you import it in code
- First `remoteApp` = Name defined in remote's config
- URL = Where the remote is hosted

**In Remote-A (webpack.remote.config.cjs):**
```javascript
name: 'remoteApp',  // Must match host's remote name
exposes: {
  './remoteApi': './remote-a/src/remote.ts'
}
```
- `name` = Identifier for this remote
- `./remoteApi` = Import path suffix (remoteApp/remoteApi)
- `./remote-a/src/remote.ts` = Actual file to expose

**Usage in Code:**
```typescript
// Dynamic import combines remote name + exposed path
const module = await import('remoteApp/remoteApi');
//                           ^^^^^^^^  ^^^^^^^^^
//                           remote    exposed
//                           name      path
```

### Benefits

**1. Independent Deployment**
- Each micro-frontend can be deployed separately
- No need to rebuild the entire application
- Host can point to different remote versions

**2. Lazy Loading**
- Remotes load only when needed
- Improves initial page load time
- Better performance and user experience

**3. Code Sharing**
- Common libraries load once (via shared config)
- Reduces bundle size
- Consistent versions across micro-frontends

**4. Technology Agnostic**
- Different remotes can use different frameworks
- Host and remotes are loosely coupled
- Team autonomy and flexibility

### Runtime vs Build Time

**Traditional Approach (Build Time):**
- All code bundled together during build
- Changes require full rebuild
- Large bundle size

**Module Federation (Runtime):**
- Code loaded dynamically at runtime
- Independent builds and deployments
- Smaller initial bundles
- Flexible architecture

## Error Handling

The host application implements comprehensive error handling:

1. **Loading indicator**: Displays while the module is loading
2. **Error boundary**: Catches remote loading errors
3. **User-friendly messages**: Friendly error messages with user feedback
4. **Detailed error logging**: Console logging and expandable error details
5. **Graceful degradation**: The application works even if the remote is unavailable

### Testing Error Handling

```bash
# Start only the host (without remote)
pnpm run serve:host

# Open http://localhost:8080 and click the button
# → You should see an error message about remote unavailability
```

## Shared Dependencies

The webpack config is prepared for shared dependencies usage:

```javascript
// Example shared config usage
shared: {
  'lodash': {
    singleton: true,
    strictVersion: true,
    requiredVersion: '^4.17.21'
  },
  'date-fns': {
    singleton: true,
    requiredVersion: '^3.0.0'
  }
}
```

This ensures that:
- Only a single instance of each shared library loads
- Version compatibility checking occurs
- The total bundle size is reduced

## Lazy Loading Pattern

This project demonstrates **best practice lazy loading** for Module Federation:

### How It Works

1. **Initial Load**: Only the host application loads initially
2. **On Demand**: Modules load when user interacts (button click)
3. **Network Efficient**: Modules are fetched only when needed
4. **Code Splitting**: Each module is a separate chunk

### Example: Host Application

```typescript
// LAZY - Loads only when button is clicked
button.addEventListener('click', async () => {
  const { logger, formatDate } = await import('commonLib/index');
  logger('Common lib loaded on demand!', 'info');
});
```

### Example: Remote Using Common Library

```typescript
// LAZY - remote-a loads commonLib on demand
export async function renderRemoteMessage(containerId: string): Promise<void> {
  const { logger, COLORS } = await import('commonLib/index');
  logger('Rendering with shared utilities', 'info');
  // Use COLORS, logger, etc.
}
```

### Verification

Open Browser DevTools → Network tab:
1. **Initial load**: Only host bundle loads
2. **Click button**: Watch commonLib chunk load
3. **Click another button**: Watch remote-a chunk load

### Benefits

- **Faster initial load** - Only load what's needed
- **Better performance** - Smaller initial bundle size
- **Optimal caching** - Each module cached separately
- **Scalable** - Add more remotes without impacting initial load

## CSS and Asset Support

### Using CSS

```typescript
// remote-a/src/styles.css
.remote-container {
  padding: 1rem;
  border: 1px solid #888;
}

// remote-a/src/remote.ts
import './styles.css';
```

### Images and Other Assets

```typescript
import logoUrl from './assets/logo.png';

el.innerHTML = `<img src="${logoUrl}" alt="Logo" />`;
```

Supported formats: PNG, SVG, JPG, JPEG, GIF

## Testing Scenarios

### 1. Lazy Loading Demo
```bash
pnpm run serve:all
# Open localhost:8080
# Notice: commonLib is NOT loaded yet (check Network tab)
# Click "Show Date & Info" → commonLib loads on demand
# Click "Load Remote-A" → remote-a loads (which also uses commonLib)
# Click "Load Remote-B" → remote-b loads (which also uses commonLib)
```

### 2. Multiple Remotes Demo
```bash
pnpm run serve:all
# Open localhost:8080
# Load both Remote-A and Remote-B to see different modules side by side
# Each remote has its own styling (purple for A, green for B)
```

### 3. Standalone Modules
```bash
# Test each module independently
pnpm run serve:lib     # localhost:8082
pnpm run serve:remote-a # localhost:8081
pnpm run serve:remote-b # localhost:8083
```

### 4. Remote Offline (Error Handling)
```bash
pnpm run serve:host
# Don't start the remotes → error messages appear with graceful degradation
```

### 5. Hot Module Replacement
```bash
pnpm run serve:all
# Edit any .ts file → automatic refresh across all modules
```

### 6. Production Build
```bash
pnpm run build:all:prod
# Check the dist/ folder → optimized, minified builds for all modules
```

## Project Structure

```
mf-with-webpack/
├── host/
│   ├── index.html              # Host HTML template
│   └── src/
│       ├── index.ts            # Host entry point (with lazy loading)
│       ├── main-layout.ts      # CSS grid-based layout (header, body, footer)
│       ├── readme-content.ts   # README content loader and markdown converter
│       └── styles.css          # Application styles
├── remote-a/
│   ├── index.html              # Remote-A HTML template
│   └── src/
│       └── remote.ts           # Remote-A exposed module (uses commonLib)
├── remote-b/
│   ├── index.html              # Remote-B HTML template
│   └── src/
│       └── remote.ts           # Remote-B exposed module (uses commonLib)
├── lk-common-lib/              # Shared library module
│   ├── index.html              # Common lib standalone page
│   ├── API.md                  # API documentation
│   └── src/
│       ├── index.ts            # Main exports
│       ├── utils.ts            # Utility functions
│       ├── constants.ts        # Shared constants
│       ├── types.ts            # TypeScript types
│       └── demo.ts             # Standalone demo
├── declarations.d.ts           # TypeScript type declarations (all modules)
├── tsconfig.json               # TypeScript configuration
├── webpack.host.config.cjs     # Host webpack config
├── webpack.remote.config.cjs   # Remote-A webpack config
├── webpack.remote-b.config.cjs # Remote-B webpack config
├── webpack.common-lib.config.cjs # Common library webpack config
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Next Steps

### Suggested Enhancements

1. **Add Shared Dependencies**
   - Add common libraries (e.g., lodash, date-fns)
   - Configure shared webpack settings

3. **Improve Type Safety**
   - Generate type definitions for exposed modules
   - Use @module-federation/typescript

4. **E2E Tests**
   - Playwright or Cypress tests
   - Test module federation scenarios

5. **CI/CD Pipeline**
   - GitHub Actions or GitLab CI
   - Automated build and deploy

6. **Environment Files**
   - `.env`, `.env.production` files
   - Use dotenv-webpack plugin

7. **Monitoring and Logging**
   - Sentry integration for remote loading errors
   - Analytics for module usage

## Troubleshooting

### Remote Not Loading

**Problem**: "Failed to load remote module" error message

**Solutions**:
1. Check if the remote server is running: `http://localhost:8081`
2. Check the browser console for detailed error messages
3. Verify the `REMOTE_A_URL` environment variable
4. Check the Network tab in DevTools

### CORS Errors

**Problem**: CORS policy blocks remote loading

**Solution**:
- The dev server already includes CORS headers
- In production environment, configure your web server's CORS policy

### TypeScript Errors

**Problem**: Type errors during import

**Solution**:
1. Check the `declarations.d.ts` file
2. Update type definitions if the remote API changes
3. Run: `pnpm run build:remote` to verify types

### Build Failed

**Problem**: Webpack build error

**Solution**:
1. Delete the `dist/` folder: `rm -rf dist/`
2. Delete `node_modules/` folder and reinstall
3. Check webpack config syntax

## Additional Resources

- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [Webpack 5 Documentation](https://webpack.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT License - see the LICENSE file for details.

## Contributing

If you find a bug or have an enhancement idea, feel free to open an issue or pull request!

---

**Built for production-ready micro-frontend development**
