<script setup>
import GameBoard from './components/GameBoard.vue'
</script>

<template>
  <div id="game">
    <h1>Snake Game</h1>
    <GameBoard />
  </div>
</template>

<style scoped>
#game {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 20px;
  font-family: sans-serif;
}

h1 {
  color: #4ade80;
}
</style>
