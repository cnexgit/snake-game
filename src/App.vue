<script setup>
import GameBoard from './components/GameBoard.vue'
</script>

<template>
  <div id="game">
    <h1>Snake Game</h1>
    <GameBoard />
    <p class="footer">Use arrow keys to move</p>
  </div>
</template>

<style scoped>
#game {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 16px;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 20px;
}

h1 {
  color: #4ade80;
  font-size: 32px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.footer {
  color: #64748b;
  font-size: 14px;
}
</style>
