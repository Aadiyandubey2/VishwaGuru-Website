import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // This ensures assets are loaded with relative paths
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1600, // Increase warning limit for large libraries like TensorFlow
    cssCodeSplit: true,
    minify: 'terser', // Will fallback to esbuild if terser isn't available
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      // Ensure all external dependencies are properly bundled
      external: [],
      // Configuration for output files
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion'
          ],
          'tensorflow': ['@tensorflow/tfjs', '@tensorflow-models/handpose'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  publicDir: 'public',
});
