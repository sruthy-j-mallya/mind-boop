# Mind Boop

This template should help get you started developing with Tauri, React and Typescript in Vite.

See [docs/idea.md](docs/idea.md) for the product idea and pitch behind this project.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (with [pnpm](https://pnpm.io/installation))
- [Rust](https://www.rust-lang.org/tools/install)
- Tauri's platform-specific system dependencies — see the [Tauri prerequisites guide](https://tauri.app/start/prerequisites/)

### Setup

Install dependencies:

```sh
pnpm install
```

### Running the app

Start the app in development mode (opens the Tauri desktop window with hot reload):

```sh
pnpm tauri dev
```

To run just the Vite frontend in a browser instead:

```sh
pnpm dev
```

### Building

Build the frontend and the desktop app for production:

```sh
pnpm tauri build
```

### Linting & Formatting

```sh
pnpm lint        # check for lint errors
pnpm lint:fix     # fix lint errors
pnpm format       # format files with Prettier
pnpm format:check # check formatting without writing
```
