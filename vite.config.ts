import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, vitePlugin as remixVitePlugin } from '@remix-run/dev';
import UnoCSS from 'unocss/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

// Obtener el hash del commit de git con un fallback
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'no-git-info';
  }
};

export default defineConfig((config) => {
  const isProduction = config.mode === 'production';

  return {
    define: {
      __COMMIT_HASH: JSON.stringify(getGitHash()),
      __APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    build: {
      target: 'esnext',
      outDir: 'build/client',
      rollupOptions: {
        output: {
          manualChunks: undefined, // Evitar fragmentación innecesaria
        },
      },
    },
    server: {
      fs: {
        strict: false, // Permitir el acceso a archivos fuera de la raíz del proyecto
      },
    },
    plugins: [
      nodePolyfills({
        include: ['path', 'buffer', 'process'],
      }),
      !isProduction && remixCloudflareDevProxy(),
      remixVitePlugin({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      UnoCSS(),
      tsconfigPaths(),
      viteStaticCopy({
        targets: [
          {
            src: '_redirects',
            dest: './', // Asegura que el archivo _redirects se copie al directorio de salida
          },
        ],
      }),
      chrome129IssuePlugin(),
      isProduction && optimizeCssModules({ apply: 'build' }),
    ],
    envPrefix: [
      'VITE_',
      'OPENAI_LIKE_API_BASE_URL',
      'OLLAMA_API_BASE_URL',
      'LMSTUDIO_API_BASE_URL',
      'TOGETHER_API_BASE_URL',
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  };
});

function chrome129IssuePlugin() {
  return {
    name: 'chrome129IssuePlugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const raw = req.headers['user-agent']?.match(/Chrom(e|ium)\/([0-9]+)\./);

        if (raw) {
          const version = parseInt(raw[2], 10);

          if (version === 129) {
            res.setHeader('content-type', 'text/html');
            res.end(
              `<body>
                <h1>Please use Chrome Canary for testing.</h1>
                <p>Chrome 129 has an issue with JavaScript modules & Vite local development. 
                   See <a href="https://Terretacode.com">for more information.</a></p>
                <p><b>Note:</b> This only impacts <u>local development</u>. 
                   \`pnpm run build\` and \`pnpm run start\` will work fine in this browser.</p>
              </body>`,
            );

            return;
          }
        }

        next();
      });
    },
  };
}
