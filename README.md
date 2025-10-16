# Dione ecosystem

A comprehensive platform for script management and execution, built with modern web technologies and deployed on Cloudflare's edge network.

## Components

### Web Application (`apps/web`)
A modern web application built with Next.js, TypeScript, Supabase and Tailwind CSS. Provides the main user interface for script discovery, installation, and management.

### API Service (`apps/api`)
A high-performance API service for the Dione platform, built with Hono.js and deployed on Cloudflare Workers. Provides backend functionality for script management, user authentication, and real-time communication.

### Documentation Site (`apps/docs`)
A modern documentation site built with Astro, TypeScript, and Tailwind CSS. Provides comprehensive guides, tutorials, and API documentation for developers and users.

## Installation

```bash
# clone the repository
git clone https://github.com/dioneapp/getdione.app.git
cd getdione.app

# install dependencies
pnpm install

# run development servers
pnpm dev
```

## Development

This is a monorepo using pnpm workspaces. Each component can be developed independently:

```bash
# run web app
pnpm --filter web dev

# run api
pnpm --filter api dev

# run docs
pnpm --filter docs dev
```

## License

This project is licensed under the terms of the MIT license included in the repository.
