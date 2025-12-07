# LK Common Library API Reference

## Overview

The `lk-common-lib` is a shared federated module that provides utilities, constants, and type definitions for use across all micro-frontends in the Module Federation setup.

**Port**: 8082  
**Remote Name**: `commonLib`  
**Loading**: Lazy (on-demand via dynamic import)

## Exposed Modules

### `commonLib/index`
Main entry point that exports everything from utils, constants, and types.

```typescript
import { logger, formatDate, COLORS, User } from 'commonLib/index';
```

### `commonLib/utils`
Utility functions for common operations.

### `commonLib/constants`
Shared constants used across applications.

### `commonLib/types`
TypeScript type definitions and interfaces.

---

## API Documentation

### Utils (`commonLib/utils`)

#### `formatDate(date: Date): string`
Formats a date using the Intl.DateTimeFormat API.

```typescript
const { formatDate } = await import('commonLib/utils');
const formatted = formatDate(new Date());
// Output: "December 7, 2025"
```

#### `capitalize(str: string): string`
Capitalizes the first letter of a string.

```typescript
const { capitalize } = await import('commonLib/utils');
const result = capitalize('hello world');
// Output: "Hello world"
```

#### `logger(message: string, level?: 'info' | 'warn' | 'error'): void`
Logs messages to the console with timestamps and severity levels.

```typescript
const { logger } = await import('commonLib/utils');
logger('Application started', 'info');
logger('Warning: Low memory', 'warn');
logger('Fatal error occurred', 'error');
```

**Console Output**:
```
[2025-12-07T10:30:00.000Z] [INFO] Application started
[2025-12-07T10:30:05.000Z] [WARN] Warning: Low memory
[2025-12-07T10:30:10.000Z] [ERROR] Fatal error occurred
```

#### `debounce<T>(func: T, delay: number): (...args: Parameters<T>) => void`
Creates a debounced version of a function.

```typescript
const { debounce } = await import('commonLib/utils');

const handleSearch = debounce((query: string) => {
  console.log('Searching for:', query);
}, 300);

handleSearch('test'); // Will execute after 300ms
```

#### `generateId(): string`
Generates a unique identifier.

```typescript
const { generateId } = await import('commonLib/utils');
const id = generateId();
// Output: "1733572800000-x7k9m2p4q"
```

---

### Constants (`commonLib/constants`)

#### `APP_NAME: string`
Application name constant.

```typescript
const { APP_NAME } = await import('commonLib/constants');
console.log(APP_NAME); // "Module Federation Demo"
```

#### `APP_VERSION: string`
Application version constant.

```typescript
const { APP_VERSION } = await import('commonLib/constants');
console.log(APP_VERSION); // "1.0.0"
```

#### `COLORS`
Predefined color palette for consistent styling.

```typescript
const { COLORS } = await import('commonLib/constants');

console.log(COLORS.primary);   // "#3b82f6"
console.log(COLORS.secondary); // "#8b5cf6"
console.log(COLORS.success);   // "#10b981"
console.log(COLORS.danger);    // "#ef4444"
console.log(COLORS.warning);   // "#f59e0b"
console.log(COLORS.info);      // "#06b6d4"
console.log(COLORS.dark);      // "#1f2937"
console.log(COLORS.light);     // "#f3f4f6"
```

**Usage Example**:
```typescript
element.style.color = COLORS.primary;
element.style.borderColor = COLORS.secondary;
```

#### `API_ENDPOINTS`
Centralized API endpoint configuration.

```typescript
const { API_ENDPOINTS } = await import('commonLib/constants');

console.log(API_ENDPOINTS.base);  // "http://localhost:3000"
console.log(API_ENDPOINTS.users); // "/api/users"
console.log(API_ENDPOINTS.posts); // "/api/posts"
console.log(API_ENDPOINTS.auth);  // "/api/auth"
```

**Usage Example**:
```typescript
const response = await fetch(`${API_ENDPOINTS.base}${API_ENDPOINTS.users}`);
```

#### `MESSAGES`
Common user-facing messages.

```typescript
const { MESSAGES } = await import('commonLib/constants');

console.log(MESSAGES.loading);   // "Loading..."
console.log(MESSAGES.success);   // "Operation completed successfully"
console.log(MESSAGES.error);     // "An error occurred"
console.log(MESSAGES.notFound);  // "Resource not found"
```

---

### Types (`commonLib/types`)

#### `User` Interface
User entity type definition.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt?: Date;
  updatedAt?: Date;
}
```

**Usage**:
```typescript
import type { User } from 'commonLib/types';

const user: User = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
};
```

#### `ApiResponse<T>` Interface
Generic API response wrapper.

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
}
```

**Usage**:
```typescript
import type { ApiResponse, User } from 'commonLib/types';

const response: ApiResponse<User[]> = {
  data: [/* users */],
  status: 200,
  message: 'Users fetched successfully',
  timestamp: new Date().toISOString()
};
```

#### `LogLevel` Type
Log severity levels.

```typescript
type LogLevel = 'info' | 'warn' | 'error';
```

#### `ModuleConfig` Interface
Module configuration structure.

```typescript
interface ModuleConfig {
  name: string;
  version: string;
  port: number;
  remoteUrl?: string;
}
```

#### `CallbackFunction<T>` Type
Generic callback function type.

```typescript
type CallbackFunction<T = void> = (data: T) => void;
```

**Usage**:
```typescript
import type { CallbackFunction } from 'commonLib/types';

const onSuccess: CallbackFunction<string> = (message) => {
  console.log(message);
};
```

---

## Usage Patterns

### Pattern 1: Import Everything
```typescript
const commonLib = await import('commonLib/index');
commonLib.logger('Hello', 'info');
const date = commonLib.formatDate(new Date());
```

### Pattern 2: Destructured Import
```typescript
const { logger, formatDate, COLORS } = await import('commonLib/index');
logger('Hello', 'info');
const date = formatDate(new Date());
```

### Pattern 3: Specific Module Import
```typescript
const { COLORS } = await import('commonLib/constants');
const { logger } = await import('commonLib/utils');
```

### Pattern 4: Type-Only Import
```typescript
import type { User, ApiResponse } from 'commonLib/types';
// No runtime import, only types
```

---

## Best Practices

### DO:
- Use dynamic imports (`await import()`) for lazy loading
- Import only what you need from specific modules
- Use type imports for TypeScript definitions
- Handle import errors gracefully

### ❌ DON'T:
- Use static imports at the top of files (prevents lazy loading)
- Import the entire library when you only need one function
- Ignore error handling for dynamic imports

---

## Error Handling

Always wrap dynamic imports in try-catch blocks:

```typescript
try {
  const { logger } = await import('commonLib/utils');
  logger('Success', 'info');
} catch (error) {
  console.error('Failed to load common library:', error);
  // Fallback behavior
}
```

---

## Testing

The common library can be tested in standalone mode:

```bash
pnpm run serve:lib
```

Open http://localhost:8082 and use the demo buttons to test each utility function.

---

## TypeScript Support

Full TypeScript support with type definitions in `declarations.d.ts`. Your IDE will provide:
- Autocomplete
- Type checking
- IntelliSense
- Error detection

---

## Version

Current Version: **1.0.0**

For updates and changes, check the project's commit history.

