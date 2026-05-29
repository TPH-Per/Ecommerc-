import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import UnoCSS from 'unocss/vite';
import { fileURLToPath, URL } from 'node:url';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter({
            dts: 'src/typed-router.d.ts',
        }),
        vue(),
        UnoCSS(),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                'pinia',
            ],
            dts: 'src/auto-imports.d.ts',
        }),
        Components({
            dts: 'src/components.d.ts',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
