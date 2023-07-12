import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";

import { nodePolyfills } from 'vite-plugin-node-polyfills';

import { BootstrapVueNextResolver } from "unplugin-vue-components/resolvers";

const config = defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "bootstrap-vue-next": ["bootstrap-vue-next"],
          "rdf-ext": ["rdf-ext"],
          "rdf-parse": ["rdf-parse"],
        },
      },
    },
  },

  plugins: [
    nodePolyfills(),
    vue(),
    Components({
      resolvers: [
        BootstrapVueNextResolver(),
        IconsResolver(),
      ],
      dts: "src/components.d.ts",
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true
    }),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core"],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
      }
    }),
  ],

  server: {
    port: 3333,
    base: "./",
  },

  base: "./",

  test: {
    globals: true,
    environment: 'jsdom',
    reporters: 'dot',
    deps: {
      inline: [
        'vue',
      ],
    },
  }
});

export default config;
