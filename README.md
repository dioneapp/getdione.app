# Dione Platform

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
git clone https://github.com/dioneapp/getdione.app
cd getdione.app

# install dependencies
pnpm install

# copy environment variables template
cp .env.example .env

# edit .env file with your configuration
# then run development servers
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

## Environment Variables

All applications share the same environment variables configured in a single `.env` file at the root level. This follows Turborepo best practices for environment variable management.

Copy `.env.example` to `.env` and configure the following variables:

- `BETA_DISCORD_WEBHOOK_URL` - Discord webhook URL for beta submissions
- `FEATURED_DISCORD_WEBHOOK_URL` - Discord webhook URL for featured submissions  
- `GITHUB_TOKEN` - GitHub personal access token for API access
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_KEY` - Supabase anonymous key (public)
- `SUPABASE_URL` - Supabase project URL (server-side)
- `SUPABASE_ANON_KEY` - Supabase anonymous key (server-side)

Variables prefixed with `NEXT_PUBLIC_` are available in the browser for the Next.js web application.

## License

This project is licensed under the terms of the MIT license included in the repository.