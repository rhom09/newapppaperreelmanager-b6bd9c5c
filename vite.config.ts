import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sw-build-date',
      apply: 'build',
      closeBundle() {
        const swPath = path.resolve(__dirname, 'dist/sw.js');
        if (fs.existsSync(swPath)) {
          let swContent = fs.readFileSync(swPath, 'utf-8');
          const buildDate = Date.now().toString();
          swContent = swContent.replace(/__BUILD_DATE__/g, buildDate);
          fs.writeFileSync(swPath, swContent);
          console.log(`\n[sw-build-date] Injected timestamp: ${buildDate} into dist/sw.js`);
        }
      }
    }
  ],
})
