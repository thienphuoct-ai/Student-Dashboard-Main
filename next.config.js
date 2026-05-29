// Đổi 'student-dashboard' thành đúng tên repository GitHub của bạn
const repoName = 'Student-Dashboard-Main';
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },  // bắt buộc vì GitHub Pages không có image optimizer
  trailingSlash: true,
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
};

module.exports = nextConfig;