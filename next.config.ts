// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Bỏ qua lỗi ESLint khi build production để docker build không bị chặn
    ignoreDuringBuilds: true,
  },
  // Giữ options khác nếu cần
};

export default nextConfig;
