import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				pathname: "/avatars/**",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				pathname: "/embed/avatars/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.imgur.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "github.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "pbs.twimg.com",
				pathname: "/**",
			},
		],
  },
};

export default nextConfig;
