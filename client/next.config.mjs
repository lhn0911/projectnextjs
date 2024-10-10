/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"], // Thêm hostname ở đây
  },
};

export default nextConfig;
