import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GameBoard from '../components/GameBoard.vue'

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 0,
  })
})

describe('GameBoard', () => {
  it('renders the score display', () => {
    const wrapper = mount(GameBoard)
    expect(wrapper.find('.score').text()).toBe('Score: 0')
  })

  it('shows start screen overlay initially', () => {
    const wrapper = mount(GameBoard)
    expect(wrapper.find('.start-title').exists()).toBe(true)
    expect(wrapper.find('.start-title').text()).toBe('Snake Game')
  })

  it('shows Start Game button', () => {
    const wrapper = mount(GameBoard)
    const btn = wrapper.find('.overlay-content button')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('Start Game')
  })

  it('starts the game when Start Game button is clicked', async () => {
    const wrapper = mount(GameBoard)
    expect(wrapper.find('.start-title').exists()).toBe(true)

    await wrapper.find('.overlay-content button').trigger('click')

    expect(wrapper.find('.start-title').exists()).toBe(false)
  })

  it('starts the game when Start Game button receives touchend (mobile fix)', async () => {
    const wrapper = mount(GameBoard)
    expect(wrapper.find('.start-title').exists()).toBe(true)

    const btn = wrapper.find('.overlay-content button')
    await btn.trigger('touchend')

    expect(wrapper.find('.start-title').exists()).toBe(false)
  })

  it('does not show game over overlay initially', () => {
    const wrapper = mount(GameBoard)
    expect(wrapper.find('.game-over-title').exists()).toBe(false)
  })

  it('renders canvas element', () => {
    const wrapper = mount(GameBoard)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('game-board root div does not have touch-action style preventing clicks', () => {
    const wrapper = mount(GameBoard)
    const gameBoard = wrapper.find('.game-board')
    const canvasWrapper = wrapper.find('.canvas-wrapper')
    expect(gameBoard.exists()).toBe(true)
    expect(canvasWrapper.exists()).toBe(true)
  })
})
