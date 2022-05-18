<script setup lang="ts">
import { reactive, ref } from "vue";
import IonDownloadOutline from "~icons/ion/download-outline";
import IonPlayOutline from "~icons/ion/play-outline";
import IonReloadOutline from "~icons/ion/reload-outline";
import Game from "./components/Game.vue";
import { download } from "./download";
import { BoardState, cols } from "./gobang";

const logs = reactive<{ x: number; y: number; color: BoardState }[]>([]);
const logs_elm = ref<HTMLDivElement | null>();

const key = ref(Date.now());
const game = ref<typeof Game>();

function log({ x, y, color }: { x: number; y: number; color: BoardState }) {
    logs.push({ x, y, color });
    setTimeout(() => logs_elm.value?.scrollTo({ top: -999_999_999, behavior: "smooth" }), 10);
}

function say(msg: string) {
    setTimeout(() => alert(msg), 10);
}

function clear() {
    key.value = Date.now();
    logs.splice(0, logs.length);
}

function replay() {
    const file = document.createElement("input");
    file.type = "file";
    file.accept = ".json";
    file.onchange = async () => {
        if (!file.files || !file.files[0]) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const data = JSON.parse(reader.result as string) as {
                x: number;
                y: number;
                color: BoardState;
            }[];
            clear();
            await new Promise((r) => setTimeout(r, 1_000));
            for (const { x, y, color } of data) {
                if (game.value) {
                    game.value.set(x, y, color);
                    game.value.ui[y * cols + x].selected = true;
                    await new Promise((r) => setTimeout(r, 1_000));
                    game.value.ui[y * cols + x].selected = false;
                }
            }
        };
        reader.readAsText(file.files[0]);
    };
    file.click();
    file.remove();
}
</script>

<template>
    <div class="height:3rem width:100%">
        <h1 class="font:heavy font:italic p:2 ml:0.5rem d:inline-block">GoBang!</h1>
        <a
            href="https://github.com/JacobLinCool/vue-gobang/"
            target="_blank"
            class="mx-8 float:right font:1.4rem p:12 color:gold-80 color:gold-72:hover transition:all;0.3s"
        >
            GitHub
        </a>
    </div>
    <div class="height:calc(100%-3rem) width:100% d:flex flex:col flex:row@md">
        <div
            class="width:100vmin height:100vmin width:calc(100vmin-3rem)@md height:calc(100vmin-3rem)@md d:flex justify-content:center align-items:center"
        >
            <div class="width:90% height:90%">
                <Game
                    ref="game"
                    :key="key"
                    @set="
                        ({ stone }) => {
                            log(stone);
                        }
                    "
                    @over="
                        ({ winner }) => {
                            say(
                                `Game over. ${
                                    winner.color === BoardState.White ? 'White' : 'Black'
                                } wins!`,
                            );
                        }
                    "
                />
            </div>
        </div>
        <div
            class="flex:1 height:calc(100%-100vmin) height:calc(100vmin-3rem)@md d:flex justify-content:center align-items:center"
        >
            <div
                class="d:flex flex-direction:col width:90% height:90% p:12 border:1px;solid;gold-76 r:12"
            >
                <h2>
                    Logs
                    <span
                        class="ml:16 top:2 cursor:pointer font:1.2rem color:gold-84 color:gold-72:hover transition:all;0.2s"
                        @click="clear"
                        title="restart the game"
                    >
                        <IonReloadOutline class="d:inline @heart;1s;1:hover" />
                    </span>
                    <span
                        class="ml:16 top:2 cursor:pointer font:1.2rem color:gold-84 color:gold-72:hover transition:all;0.2s"
                        @click="download(JSON.stringify(logs, null, 2), `logs-${key}.json`)"
                        title="download the logs as JSON file"
                    >
                        <IonDownloadOutline class="d:inline @heart;1s;1:hover" />
                    </span>
                    <span
                        class="ml:16 top:2 cursor:pointer font:1.2rem color:gold-84 color:gold-72:hover transition:all;0.2s"
                        @click="replay"
                        title="replay a game from a JSON file"
                    >
                        <IonPlayOutline class="d:inline @heart;1s;1:hover" />
                    </span>
                </h2>
                <div
                    class="mt:16 flex-1 overflow-y:auto d:flex flex-direction:col-reverse"
                    ref="logs_elm"
                >
                    <div
                        v-for="(log, i) in logs"
                        :key="i"
                        class="my:8 font-family:monospace"
                        @mouseenter="game && (game.ui[log.y * cols + log.x].selected = true)"
                        @mouseleave="game && (game.ui[log.y * cols + log.x].selected = false)"
                    >
                        {{ i + 1 }}.
                        {{ log.color === BoardState.Black ? "●" : "○" }}
                        <span class="font:bold">{{ log.x + 1 }},{{ log.y + 1 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
* {
    position: relative;
}

html,
body,
#app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fafafa;
}
</style>
