<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE
const TICK_INTERVAL = 150

const canvas = ref(null)

const snake = ref([
  { x: 11, y: 10 },
  { x: 10, y: 10 },
  { x: 9, y: 10 },
])

const direction = ref({ x: 1, y: 0 })
const nextDirection = ref({ x: 1, y: 0 })
let gameLoop = null

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

function tick() {
  direction.value = { ...nextDirection.value }

  const head = snake.value[0]
  const newHead = {
    x: head.x + direction.value.x,
    y: head.y + direction.value.y,
  }

  snake.value.unshift(newHead)
  snake.value.pop()

  draw()
}

function handleKeydown(e) {
  const key = e.key
  const dir = direction.value

  if (key === 'ArrowUp' && dir.y !== 1) {
    nextDirection.value = { x: 0, y: -1 }
  } else if (key === 'ArrowDown' && dir.y !== -1) {
    nextDirection.value = { x: 0, y: 1 }
  } else if (key === 'ArrowLeft' && dir.x !== 1) {
    nextDirection.value = { x: -1, y: 0 }
  } else if (key === 'ArrowRight' && dir.x !== -1) {
    nextDirection.value = { x: 1, y: 0 }
  }
}

function startGame() {
  if (gameLoop) clearInterval(gameLoop)
  gameLoop = setInterval(tick, TICK_INTERVAL)
}

onMounted(() => {
  draw()
  window.addEventListener('keydown', handleKeydown)
  startGame()
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
  window.removeEventListener('keydown', handleKeydown)
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
