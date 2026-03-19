<script setup>
import { ref, onMounted } from 'vue'

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE

const canvas = ref(null)

const snake = ref([
  { x: 11, y: 10 },
  { x: 10, y: 10 },
  { x: 9, y: 10 },
])

function draw() {
  const ctx = canvas.value.getContext('2d')

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  ctx.strokeStyle = '#2a2a4a'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath()
    ctx.moveTo(i * CELL_SIZE, 0)
    ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, i * CELL_SIZE)
    ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE)
    ctx.stroke()
  }

  snake.value.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e'
    ctx.fillRect(
      segment.x * CELL_SIZE + 1,
      segment.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    )
  })
}

onMounted(() => {
  draw()
})
</script>

<template>
  <div class="game-board">
    <canvas
      ref="canvas"
      :width="CANVAS_SIZE"
      :height="CANVAS_SIZE"
    />
  </div>
</template>

<style scoped>
.game-board {
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  border: 2px solid #4ade80;
  background-color: #0f0f23;
}
</style>
