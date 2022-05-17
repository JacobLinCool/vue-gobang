<script setup lang="ts">
import { BoardState } from "../gobang";

defineProps<{
    state: BoardState;
    x: number;
    y: number;
}>();
</script>

<template>
    <div
        class="display:inline-flex font:6 background:gold-76 justify-content:center align-items:center transition:all;0.25s background:gold-84:hover border-radius:8px:hover"
    >
        <div
            :class="[
                'position:absolute',
                'background:black',
                'height:2',
                `width:${y == 0 || y == 18 ? 50 : 100}%`,
                `left:${y == 0 ? 50 : 0}%`,
            ]"
        ></div>
        <div
            :class="[
                'position:absolute',
                'background:black',
                'width:2',
                `height:${x == 0 || x == 18 ? 50 : 100}%`,
                `top:${x == 0 ? 50 : 0}%`,
            ]"
        ></div>

        <div
            v-if="state == BoardState.Black"
            class="background:black border-radius:100% width:60% height:60% width:50%@md height:50%@md"
        ></div>
        <div
            v-else-if="state == BoardState.White"
            class="background:white border-radius:100% width:60% height:60% width:50%@md height:50%@md"
        ></div>
    </div>
</template>
