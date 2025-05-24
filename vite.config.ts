import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
      output: {
        manualChunks: (id) => {
          // Create separate chunks for major libraries
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@tensorflow')) {
            return 'tensorflow';
          }
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  publicDir: 'public',
});
