/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules?.push({
      loader: "blockchain",
    });
    return config;
  },
};

export default nextConfig;
