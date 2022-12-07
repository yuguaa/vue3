import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
const vitePluginVueDynamicPath = require('vite-plugin-vue-dynamic-path')
const path = require('path')
const VITE_PUBLIC_PATH = '/vue3-project/'
const root = process.cwd()
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  base: VITE_PUBLIC_PATH,
  root,
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },
  plugins: [
    vue(),
    vitePluginVueDynamicPath({
      loadSourceConfig: {
        sourcePath: '/vue3-project/',
        insertTimeout: 400,
        retryCount: 5,
        filePath: '/sourceConfig.json'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference)"${path.resolve(
            'src/styles/index.less'
          )}";`
        },
        javascriptEnabled: true
      }
    }
  },
  build: {
    // chunk 大小警告的限制
    chunkSizeWarningLimit: 500,
    // // 浏览器兼容性  "esnext"|"modules"
    // target: "modules",
    // // 输出路径
    // outDir: "dist",
    // // 生成静态资源的存放路径
    // assetsDir: "assets",
    // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
    assetsInlineLimit: 4096,
    // // 构建后是否生成 source map 文件
    // sourcemap: false,
    cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     // warnings: false,
    //     drop_console: true,  //打包时删除console
    //     drop_debugger: true, //打包时删除 debugger
    //     pure_funcs: ['console.log'],
    //   },
    //   output: {
    //     // 去掉注释内容
    //     comments: true,
    //   },
    // },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          // 拆分代码，这个就是分包，配置完后自动按需加载，现在还比不上webpack的splitchunk，不过也能用了。
          vue: ['vue', 'vue-router', 'pinia']
          // vant: ['vant']
          // echarts: ['echarts'],
        }
      }
    },
    brotliSize: false
  }
})
