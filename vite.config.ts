import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, type Plugin} from 'vite';

function videoUploadPlugin(): Plugin {
  return {
    name: 'video-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-video', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const buffer = Buffer.concat(chunks);
            if (!buffer || buffer.length === 0) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'No video data received' }));
              return;
            }

            const publicDir = path.resolve(__dirname, 'public');
            const targetFile = path.join(publicDir, 'video_demostrativo_fu_dose.mp4');
            const targetVideosDir = path.join(publicDir, 'videos');
            const targetFileInVideos = path.join(targetVideosDir, 'video_demostrativo_fu_dose.mp4');

            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }
            if (!fs.existsSync(targetVideosDir)) {
              fs.mkdirSync(targetVideosDir, { recursive: true });
            }

            fs.writeFileSync(targetFile, buffer);
            fs.writeFileSync(targetFileInVideos, buffer);

            const srcAssetsVideos = path.resolve(__dirname, 'src/assets/videos');
            if (fs.existsSync(srcAssetsVideos)) {
              fs.writeFileSync(path.join(srcAssetsVideos, 'video_demostrativo_fu_dose.mp4'), buffer);
            }

            const distDir = path.resolve(__dirname, 'dist');
            if (fs.existsSync(distDir)) {
              fs.writeFileSync(path.join(distDir, 'video_demostrativo_fu_dose.mp4'), buffer);
              const distVideos = path.join(distDir, 'videos');
              if (fs.existsSync(distVideos)) {
                fs.writeFileSync(path.join(distVideos, 'video_demostrativo_fu_dose.mp4'), buffer);
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              bytesWritten: buffer.length,
              url: '/video_demostrativo_fu_dose.mp4'
            }));
          } catch (err: any) {
            console.error('Error writing video file:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Failed to save video' }));
          }
        });
      });

      // Video streaming middleware with HTTP 206 Partial Content (Range requests)
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url?.split('?')[0];
        if (
          rawUrl === '/video_demostrativo_fu_dose.mp4' || 
          rawUrl === '/videos/video_demostrativo_fu_dose.mp4' ||
          rawUrl === '/video/video_demostrativo_fu_dose.mp4'
        ) {
          const publicDir = path.resolve(__dirname, 'public');
          let targetFile = path.join(publicDir, 'video_demostrativo_fu_dose.mp4');
          if (!fs.existsSync(targetFile)) {
            targetFile = path.join(publicDir, 'video', 'video_demostrativo_fu_dose.mp4');
          }
          if (!fs.existsSync(targetFile)) {
            targetFile = path.join(publicDir, 'videos', 'video_demostrativo_fu_dose.mp4');
          }
          if (!fs.existsSync(targetFile)) {
            return next();
          }

          try {
            const stat = fs.statSync(targetFile);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
              const parts = range.replace(/bytes=/, '').split('-');
              const start = parseInt(parts[0], 10);
              const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
              const chunksize = (end - start) + 1;
              const fileStream = fs.createReadStream(targetFile, { start, end });

              res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
              });
              fileStream.pipe(res);
            } else {
              res.writeHead(200, {
                'Content-Length': fileSize,
                'Accept-Ranges': 'bytes',
                'Content-Type': 'video/mp4',
              });
              fs.createReadStream(targetFile).pipe(res);
            }
            return;
          } catch (streamErr) {
            console.warn('Video range stream error:', streamErr);
            return next();
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), videoUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
