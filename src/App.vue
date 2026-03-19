<script setup>
import { ref } from 'vue'

const message = ref('Snake Game - Coming Soon')
</script>

<template>
  <div id="game">
    <h1>{{ message }}</h1>
  </div>
</template>

<style scoped>
#game {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: sans-serif;
}

h1 {
  color: #4fc08d;
}
</style>
