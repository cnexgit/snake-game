<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const GRID_SIZE = 20
const TICK_INTERVAL = 150

const canvas = ref(null)
const canvasSize = ref(400)
const cellSize = computed(() => canvasSize.value / GRID_SIZE)
const score = ref(0)
const gameOver = ref(false)
const gameStarted = ref(false)

const INITIAL_SNAKE = [
  { x: 11, y: 10 },
  { x: 10, y: 10 },
  { x: 9, y: 10 },
]

const snake = ref([...INITIAL_SNAKE.map(s => ({ ...s }))])

const direction = ref({ x: 1, y: 0 })
const nextDirection = ref({ x: 1, y: 0 })
const food = ref(null)
let gameLoop = null
let touchStartX = 0
let touchStartY = 0

function calculateCanvasSize() {
  const maxWidth = window.innerWidth - 24
  const maxHeight = window.innerHeight - 160
  const maxDim = Math.min(maxWidth, maxHeight, 400)
  canvasSize.value = Math.floor(maxDim / GRID_SIZE) * GRID_SIZE
}

function spawnFood() {
  let x, y
  do {
    x = Math.floor(Math.random() * GRID_SIZE)
    y = Math.floor(Math.random() * GRID_SIZE)
  } while (snake.value.some(seg => seg.x === x && seg.y === y))
  food.value = { x, y }
}

function draw() {
  const ctx = canvas.value.getContext('2d')
  const cs = cellSize.value
  const size = canvasSize.value

  ctx.clearRect(0, 0, size, size)

  ctx.strokeStyle = '#2a2a4a'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cs, 0)
    ctx.lineTo(i * cs, size)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, i * cs)
    ctx.lineTo(size, i * cs)
    ctx.stroke()
  }

  if (food.value) {
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(
      food.value.x * cs + 1,
      food.value.y * cs + 1,
      cs - 2,
      cs - 2
    )
  }

  snake.value.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e'
    ctx.fillRect(
      segment.x * cs + 1,
      segment.y * cs + 1,
      cs - 2,
      cs - 2
    )
  })
}

function checkCollision(head) {
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true
  }
  if (snake.value.some((seg, i) => i > 0 && seg.x === head.x && seg.y === head.y)) {
    return true
  }
  return false
}

function stopGame() {
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
  gameOver.value = true
}

function tick() {
  direction.value = { ...nextDirection.value }

  const head = snake.value[0]
  const newHead = {
    x: head.x + direction.value.x,
    y: head.y + direction.value.y,
  }

  if (checkCollision(newHead)) {
    stopGame()
    return
  }

  snake.value.unshift(newHead)

  if (food.value && newHead.x === food.value.x && newHead.y === food.value.y) {
    score.value += 10
    spawnFood()
  } else {
    snake.value.pop()
  }

  draw()
}

function changeDirection(newDir) {
  if (!gameStarted.value || gameOver.value) return
  const dir = direction.value
  if (newDir.x + dir.x === 0 && newDir.y + dir.y === 0) return
  nextDirection.value = newDir
}

function handleKeydown(e) {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  }
  const newDir = keyMap[e.key]
  if (newDir) {
    changeDirection(newDir)
    e.preventDefault()
  }
}

function handleTouchStart(e) {
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

function handleTouchEnd(e) {
  if (!gameStarted.value || gameOver.value) return
  const touch = e.changedTouches[0]
  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY
  const minSwipe = 30
  if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return
  if (Math.abs(dx) > Math.abs(dy)) {
    changeDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
  } else {
    changeDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 })
  }
}

function beginGame() {
  gameStarted.value = true
  spawnFood()
  draw()
  gameLoop = setInterval(tick, TICK_INTERVAL)
}

function resetGame() {
  snake.value = INITIAL_SNAKE.map(s => ({ ...s }))
  direction.value = { x: 1, y: 0 }
  nextDirection.value = { x: 1, y: 0 }
  score.value = 0
  gameOver.value = false
  food.value = null
  spawnFood()
  draw()
  gameLoop = setInterval(tick, TICK_INTERVAL)
}

function handleResize() {
  calculateCanvasSize()
  if (canvas.value) requestAnimationFrame(() => draw())
}

onMounted(() => {
  calculateCanvasSize()
  requestAnimationFrame(() => draw())
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="game-board">
    <div class="score">Score: {{ score }}</div>
    <div
      class="canvas-wrapper"
      @touchstart.prevent="handleTouchStart"
      @touchend.prevent="handleTouchEnd"
    >
      <canvas
        ref="canvas"
        :width="canvasSize"
        :height="canvasSize"
      />
      <div v-if="!gameStarted" class="overlay">
        <div class="overlay-content">
          <h2 class="start-title">Snake Game</h2>
          <p class="start-hint">Use arrow keys or swipe to control</p>
          <button @click="beginGame" @touchend.stop="beginGame">Start Game</button>
        </div>
      </div>
      <div v-if="gameOver" class="overlay">
        <div class="overlay-content">
          <h2 class="game-over-title">Game Over</h2>
          <p class="final-score">Final Score: {{ score }}</p>
          <button @click="resetGame" @touchend.stop="resetGame">Play Again</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-board {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  touch-action: none;
}

.score {
  font-size: 24px;
  color: #4ade80;
  font-weight: bold;
  letter-spacing: 1px;
}

.canvas-wrapper {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

canvas {
  border: 2px solid #4ade80;
  background-color: #0f0f23;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.85);
}

.overlay-content {
  text-align: center;
  color: #ffffff;
}

.start-title {
  font-size: 40px;
  color: #4ade80;
  margin-bottom: 8px;
}

.start-hint {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 24px;
}

.game-over-title {
  font-size: 36px;
  color: #ef4444;
  margin-bottom: 10px;
}

.final-score {
  font-size: 20px;
  color: #4ade80;
  margin-bottom: 20px;
}

.overlay-content button {
  padding: 12px 32px;
  font-size: 18px;
  background: #4ade80;
  color: #0f0f23;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.overlay-content button:hover {
  background: #22c55e;
}

@media (max-width: 480px) {
  .score {
    font-size: 20px;
  }

  .start-title {
    font-size: 28px;
  }

  .game-over-title {
    font-size: 28px;
  }

  .final-score {
    font-size: 18px;
  }

  .overlay-content button {
    padding: 14px 36px;
    font-size: 20px;
  }
}
</style>
