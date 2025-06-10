declare namespace App {
  interface Locals {
    runtime: {
      env: {
        FEATURED_DISCORD_WEBHOOK_URL: string;
        BETA_DISCORD_WEBHOOK_URL: string;
        PUBLIC_SUPABASE_URL: string;
        PRIVATE_SUPABASE_KEY: string;
        GITHUB_TOKEN: string;
      };
    };
  }
}