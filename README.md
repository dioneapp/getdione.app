# Dione Website

A modern monorepo web application built with Next.js, TypeScript, Supabase, Tailwind CSS, and Turborepo.

## Monorepo Structure

This repository is organized as a monorepo using Turborepo:

```
├── apps/
│   └── web/          # Main Next.js application
├── packages/         # Shared packages (future)
├── .env              # Shared environment variables
├── turbo.json        # Turborepo configuration
└── package.json      # Root package.json with workspaces
```

## Getting Started

1. Fork the repository
2. Clone the repository:
```bash
git clone https://github.com/yourusername/getdione.app.git
cd getdione.app
```

3. Install dependencies:
```bash
npm install
```

4. Copy the environment variables:
```bash
cp .env.example .env
```

5. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server for all apps
- `npm run build` - Build all apps for production
- `npm run preview` - Preview production build
- `npm run lint` - Run type checking and linting
- `npm run deploy` - Deploy to production

## Environment Variables

All applications in this monorepo share the same environment variables located in the root `.env` file. This simplifies configuration management and ensures consistency across all apps.

## Deploy
We use Cloudflare Workers to deploy the site.
 
- `npm run deploy` - Deploy to production


## License

This project is licensed under the terms of the license included in the repository.