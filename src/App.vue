<script setup lang="ts">
import Board from "./components/Board.vue";
import { download } from "./download";
import { BoardState } from "./gobang";
import "@master/css";
import "@master/normal.css";
import { reactive, ref } from "vue";

const board = reactive(Array.from({ length: 19 * 19 }, () => BoardState.Empty));
const logs = reactive<{ x: number; y: number; state: BoardState }[]>([]);

let current = ref(BoardState.Black);
let logs_elm = ref<HTMLDivElement | null>(null);
let winner = ref(BoardState.Empty);

function set(x: number, y: number, state: BoardState, swap = true) {
    if (winner.value !== BoardState.Empty) {
        alert(
            `Game is over, ${winner.value === BoardState.Black ? "Black" : "White"} is the winner.`,
        );
        return;
    }
    if (board[y * 19 + x] == BoardState.Empty) {
        board[y * 19 + x] = state;
        if (swap) {
            current.value = current.value == BoardState.Black ? BoardState.White : BoardState.Black;
        }
        log({ x, y, state });

        winner.value = check();
        if (winner.value !== BoardState.Empty) {
            setTimeout(
                () => alert(`${winner.value === BoardState.Black ? "Black" : "White"} wins!`),
                0,
            );
        }
    }
}

function log({ x, y, state }: { x: number; y: number; state: BoardState }) {
    logs.push({ x, y, state });
    if (logs_elm.value) {
        logs_elm.value.scrollTo({ top: -999_999_999, behavior: "smooth" });
    }
}

function check() {
    const { length } = board;
    for (let i = 0; i < length; i++) {
        if (board[i] == BoardState.Empty) {
            continue;
        }

        const state = board[i];
        const [x, y] = [i % 19, Math.floor(i / 19)];

        // check horizontal
        if (x < 17) {
            let count = 1;
            for (let j = 1; j < 5; j++) {
                if (board[i + j] == state) {
                    count++;
                } else {
                    break;
                }
            }
            if (count == 5) {
                return state;
            }
        }

        // check vertical
        if (y < 17) {
            let count = 1;
            for (let j = 1; j < 5; j++) {
                if (board[(y + j) * 19 + x] == state) {
                    count++;
                } else {
                    break;
                }
            }
            if (count == 5) {
                return state;
            }
        }

        // check left-top to right-bottom
        if (x < 17 && y < 17) {
            let count = 1;
            for (let j = 1; j < 5; j++) {
                if (board[(y + j) * 19 + x + j] == state) {
                    count++;
                } else {
                    break;
                }
            }
            if (count == 5) {
                return state;
            }
        }

        // check right-top to left-bottom
        if (x > 2 && y < 17) {
            let count = 1;
            for (let j = 1; j < 5; j++) {
                if (board[(y + j) * 19 + x - j] == state) {
                    count++;
                } else {
                    break;
                }
            }
            if (count == 5) {
                return state;
            }
        }
    }

    return BoardState.Empty;
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
            <div
                class="width:90% height:90% display:grid grid-cols:19 grid-rows:19 background:gold-76"
            >
                <Board
                    v-for="(state, i) in board"
                    :key="i"
                    :state="state"
                    :x="i % 19"
                    :y="Math.floor(i / 19)"
                    @click="set(i % 19, Math.floor(i / 19), current)"
                    :class="[`cursor:${state == BoardState.Empty ? 'pointer' : 'not-allowed'}`]"
                />
            </div>
        </div>
        <div
            class="flex:1 height:calc(100vmin-3rem) display:flex justify-content:center align-items:center"
        >
            <div
                class="display:flex flex-direction:col width:90% height:90% p:12 border:1px;solid;gold-76 border-radius:12"
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
                    <div v-for="(log, i) in logs" :key="i" class="my:8 font-family:monospace">
                        {{ i + 1 }}.
                        {{ log.state == BoardState.Black ? "●" : "○" }}
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
