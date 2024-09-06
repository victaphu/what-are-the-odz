/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules?.push({
      blockchain: "blockchain",
    });
    return config;
  },
};

export default nextConfig;
