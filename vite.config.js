import { defineConfig } from 'vite'
import { resolve } from 'path'
import { renameSync, mkdirSync, existsSync } from 'fs'

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        academia: resolve(__dirname, 'academia.html'),
        link: resolve(__dirname, 'link.html'),
        soon: resolve(__dirname, 'soon.html'),
      },
    },
  },
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Rewrite /about → /about.html etc. for dev server
          const cleanUrls = ['/about', '/portfolio', '/academia', '/link', '/soon']
          if (cleanUrls.includes(req.url)) {
            req.url = req.url + '.html'
          }
          next()
        })
      },
      // After build, move about.html → about/index.html etc.
      // so /about resolves on any web server without rewrites
      closeBundle() {
        const distDir = resolve(__dirname, 'dist')
        const pages = ['about', 'portfolio', 'academia', 'link', 'soon']
        for (const page of pages) {
          const htmlFile = resolve(distDir, `${page}.html`)
          if (existsSync(htmlFile)) {
            const dir = resolve(distDir, page)
            mkdirSync(dir, { recursive: true })
            renameSync(htmlFile, resolve(dir, 'index.html'))
          }
        }
      },
    },
  ],
})
