<script setup lang="ts">
import { BoardState, cols, rows } from "../gobang";

defineProps<{
    state: BoardState;
    x: number;
    y: number;
    selected?: boolean;
    marked?: boolean;
}>();
</script>

<template>
    <div
        :class="[
            'd:inline-flex',
            'justify-content:center',
            'align-items:center',
            'transition:all;0.25s',
            `background:gold-${selected ? 84 : 76}`,
            `r:${selected ? 8 : 0}`,
            'outline:none:focus',
        ]"
    >
        <div
            :class="[
                'position:absolute',
                'background:black',
                'height:2',
                `width:${x === 0 || x === cols - 1 ? 50 : 100}%`,
                `left:${x === 0 ? 50 : 0}%`,
            ]"
        ></div>
        <div
            :class="[
                'position:absolute',
                'background:black',
                'width:2',
                `height:${y === 0 || y === rows - 1 ? 50 : 100}%`,
                `top:${y === 0 ? 50 : 0}%`,
            ]"
        ></div>
        <div
            v-if="(x + 1) % 4 === 0 && (y + 1) % 4 === 0"
            :class="['position:absolute', 'background:black', 'width:25%', 'height:25%', 'r:100%']"
        ></div>

        <div
            v-if="state === BoardState.Black || state === BoardState.White"
            :class="[
                `background:${state === BoardState.Black ? 'black' : 'white'}`,
                'r:100%',
                'width:70%',
                'height:70%',
                'width:60%@md',
                'height:60%@md',
                marked ? 'shadow:0;0;3;3;violet-70 @pulse;1s;infinite' : '',
            ]"
        ></div>
    </div>
</template>
