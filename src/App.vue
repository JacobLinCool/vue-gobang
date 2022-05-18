<script setup lang="ts">
import { reactive, ref } from "vue";
import Game from "./components/Game.vue";
import { download } from "./download";
import { BoardState, cols } from "./gobang";

const logs = reactive<{ x: number; y: number; color: BoardState }[]>([]);
const logs_elm = ref<HTMLDivElement | null>();

const ui = ref<{ selected: boolean; marked: boolean }[]>([]);
const key = ref(Date.now());

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
</script>

<template>
    <div class="height:3rem width:100%">
        <h1 class="font:heavy font:italic p:2 ml:0.5rem display:inline-block">GoBang!</h1>
        <a
            href="https://github.com/JacobLinCool/vue-gobang/"
            target="_blank"
            class="mx-8 float:right font:1.4rem p:12 color:gold-80 color:gold-72:hover transition:all;0.3s"
        >
            GitHub
        </a>
    </div>
    <div class="height:calc(100%-3rem) width:100% display:flex flex:col flex:row@md">
        <div
            class="width:100vmin height:100vmin width:calc(100vmin-3rem)@md height:calc(100vmin-3rem)@md display:flex justify-content:center align-items:center"
        >
            <div class="width:90% height:90%">
                <Game
                    :key="key"
                    :ui="ui"
                    @init="
                        (payload) => {
                            ui = payload.ui;
                        }
                    "
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
            class="flex:1 height:calc(100%-100vmin) height:calc(100vmin-3rem)@md display:flex justify-content:center align-items:center"
        >
            <div
                class="display:flex flex-direction:col width:90% height:90% p:12 border:1px;solid;gold-76 r:12"
            >
                <h1>
                    Logs
                    <span
                        class="ml:4 cursor:pointer font:1rem color:gold-84 color:gold-72:hover transition:all;0.2s"
                        @click="download(JSON.stringify(logs, null, 2), `logs-${key}.json`)"
                        >Download</span
                    >
                    <span
                        class="ml:8 cursor:pointer font:1rem color:gold-84 color:gold-72:hover transition:all;0.2s"
                        @click="clear"
                        >Clear</span
                    >
                </h1>
                <div
                    class="mt:16 flex-1 overflow-y:auto display:flex flex-direction:col-reverse"
                    ref="logs_elm"
                >
                    <div
                        v-for="(log, i) in logs"
                        :key="i"
                        class="my:8 font-family:monospace"
                        @mouseenter="ui[log.y * cols + log.x].selected = true"
                        @mouseleave="ui[log.y * cols + log.x].selected = false"
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
