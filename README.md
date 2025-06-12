# Dione Website

A modern web application built with Next.js, TypeScript, Supabase and Tailwind CSS.

## Getting Started

1. Fork the repository
2. Clone the repository:
```bash
git clone https://github.com/yourusername/getdione.app.git
cd getdione.app
```

3. Install dependencies:
```bash
pnpm install
```

4. Copy the environment variables:
```bash
cp .env.example .env
```

5. Start the development server:
```bash
pnpm dev
```

The site will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm format` - Format code
- `pnpm lint` - Run type checking and linting

## Deploy
We use Cloudflare Workers to deploy the site.
 
- `pnpm deploy` - Deploy to production


## License

This project is licensed under the terms of the license included in the repository.