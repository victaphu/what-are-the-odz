/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules?.push({
      test: 'blockchain',
      loader: "ignore-loader",
    });
    return config;
  },
};

export default nextConfig;
