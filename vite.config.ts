import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue(), Icons({ compiler: "vue3" })],
    base: "/vue-gobang/",
});
