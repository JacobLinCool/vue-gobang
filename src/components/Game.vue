<script setup lang="ts">
import { reactive, ref } from "vue";
import Board from "./Board.vue";
import { BoardState, check_winner, cols, rows } from "../gobang";

interface Payload {
    board: BoardState[];
    turn: number;
    current: BoardState;
    winner: {
        color: BoardState;
        stones: number[];
    };
}

const { disable_win, disable_click } = defineProps<{
    ui?: { selected: boolean; marked: boolean }[];
    disable_hover?: boolean;
    disable_win?: boolean;
    disable_click?: boolean;
}>();

const emit = defineEmits<{
    (event: "init", payload: Payload & { ui: { selected: boolean; marked: boolean }[] }): void;
    (event: "set", payload: Payload & { stone: { x: number; y: number; color: BoardState } }): void;
    (event: "over", payload: Payload): void;
}>();

const board = reactive(Array.from({ length: cols * rows }, () => BoardState.Empty));
const ui = reactive(
    Array.from({ length: cols * rows }, () => ({ selected: false, marked: false })),
);

const turn = ref(0);
const current = ref(BoardState.Black);
const winner = reactive({ color: BoardState.Empty, stones: <number[]>[] });

function set(x: number, y: number, state: BoardState, swap = true) {
    if (winner.color !== BoardState.Empty) {
        emit("over", { board, turn: turn.value, current: current.value, winner });
        return;
    }

    if (disable_click) {
        return;
    }

    if (board[y * cols + x] === BoardState.Empty) {
        board[y * cols + x] = state;
        turn.value++;
        if (swap) {
            current.value =
                current.value === BoardState.Black ? BoardState.White : BoardState.Black;
        }

        const checked = check_winner(board);
        [winner.color, winner.stones] = [checked.winner, checked.stones];

        emit("set", {
            board,
            turn: turn.value,
            current: current.value,
            winner,
            stone: { x, y, color: state },
        });

        if (winner.color !== BoardState.Empty) {
            for (const stone of winner.stones) {
                ui[stone].marked = !disable_win;
            }

            emit("over", { board, turn: turn.value, current: current.value, winner });
        }
    }
}

emit("init", { board, turn: turn.value, current: current.value, winner, ui });
</script>

<template>
    <div :class="`width:100% height:100% display:grid grid-cols:${cols} background:gold-76`">
        <Board
            v-for="(state, i) in board"
            :key="i"
            :state="state"
            :x="i % cols"
            :y="Math.floor(i / cols)"
            :selected="ui[i].selected"
            :marked="ui[i].marked"
            @click="set(i % cols, Math.floor(i / cols), current)"
            @mouseenter="disable_hover || (ui[i].selected = true)"
            @mouseleave="disable_hover || (ui[i].selected = false)"
            :class="[
                `cursor:${
                    !disable_click && state === BoardState.Empty ? 'pointer' : 'not-allowed'
                }`,
            ]"
        />
    </div>
</template>
