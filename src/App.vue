<script setup lang="ts">
import { reactive, ref } from "vue";
import "@master/css";
import "@master/normal.css";
import "@master/keyframes.css";
import Board from "./components/Board.vue";
import { download } from "./download";
import { BoardState, check_winner, cols, rows } from "./gobang";

const board = reactive(Array.from({ length: cols * rows }, () => BoardState.Empty));
const ui_state = reactive(
    Array.from({ length: cols * rows }, () => ({ selected: false, marked: false })),
);
const logs = reactive<{ x: number; y: number; state: BoardState }[]>([]);

const current = ref(BoardState.Black);
const status = reactive({ winner: BoardState.Empty, stones: <number[]>[] });
const logs_elm = ref<HTMLDivElement | null>();

function set(x: number, y: number, state: BoardState, swap = true) {
    if (status.winner !== BoardState.Empty) {
        alert(
            `Game is over, ${
                status.winner === BoardState.Black ? "Black" : "White"
            } is the winner.`,
        );
        return;
    }
    if (board[y * cols + x] === BoardState.Empty) {
        board[y * cols + x] = state;
        if (swap) {
            current.value =
                current.value === BoardState.Black ? BoardState.White : BoardState.Black;
        }
        log({ x, y, state });

        console.time("check_winner");
        const checked = check_winner(board);
        [status.winner, status.stones] = [checked.winner, checked.stones];
        console.timeEnd("check_winner");

        if (status.winner !== BoardState.Empty) {
            for (const stone of status.stones) {
                ui_state[stone].marked = true;
            }

            setTimeout(
                () => alert(`${status.winner === BoardState.Black ? "Black" : "White"} wins!`),
                10,
            );
        }
    }
}

function log({ x, y, state }: { x: number; y: number; state: BoardState }) {
    logs.push({ x, y, state });
    setTimeout(() => logs_elm.value?.scrollTo({ top: -999_999_999, behavior: "smooth" }), 10);
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
            <div :class="`width:90% height:90% display:grid grid-cols:${cols} background:gold-76`">
                <Board
                    v-for="(state, i) in board"
                    :key="i"
                    :state="state"
                    :x="i % cols"
                    :y="Math.floor(i / cols)"
                    :selected="ui_state[i].selected"
                    :marked="ui_state[i].marked"
                    @click="set(i % cols, Math.floor(i / cols), current)"
                    @mouseenter="ui_state[i].selected = true"
                    @mouseleave="ui_state[i].selected = false"
                    :class="[`cursor:${state === BoardState.Empty ? 'pointer' : 'not-allowed'}`]"
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
                        class="ml-4 cursor:pointer font:1rem color:gold-84 color:gold-72:hover transition:all;0.2s"
                        @click="download(JSON.stringify(logs, null, 2), 'logs.json')"
                        >Download</span
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
                        @mouseenter="ui_state[log.y * cols + log.x].selected = true"
                        @mouseleave="ui_state[log.y * cols + log.x].selected = false"
                    >
                        {{ i + 1 }}.
                        {{ log.state === BoardState.Black ? "●" : "○" }}
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
