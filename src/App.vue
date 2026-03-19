<script setup>
import GameBoard from './components/GameBoard.vue'
</script>

<template>
  <div id="game">
    <h1>Snake Game</h1>
    <GameBoard />
    <p class="footer">Use arrow keys or swipe to move</p>
  </div>
</template>

<style scoped>
#game {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
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

@media (max-width: 480px) {
  #game {
    gap: 8px;
    padding: 10px;
  }

  h1 {
    font-size: 24px;
  }

  .footer {
    font-size: 12px;
  }
}
</style>
