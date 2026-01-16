/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for simple hosting if needed
  // output: 'export',  // Uncomment this for static hosting on GitHub Pages

  // Configure page extensions to include MDX
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

export default nextConfig;
