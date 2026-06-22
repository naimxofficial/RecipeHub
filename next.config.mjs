/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "i.ibb.co.com",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "commons.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
