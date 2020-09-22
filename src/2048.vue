<template>
  <div id="app">
    <div class="box-wrapper">
      <div class="title">
        <h1>2048</h1>
        <h3>Enjoy!</h3>
      </div>
      <div class="gamebox">
        <div 
            class="row" 
            v-for="(row, rowIdx) in matrix" 
            :key="rowIdx"
            >
          <div 
              class="box" 
              v-for="({ score }, idx) in row" 
              :key="rowIdx + String(idx)" 
              :style="{ backgroundColor: getBackgroundColor(score) }"
              >
            {{ score || "" }}
          </div>
        </div>
      </div>
      <div class="controls">
        <div class="move-keys" v-if="gameStarted">
          <button 
              v-for="({ direction, character }, idx) in controls()" 
              :key="character + direction + idx" 
              @click="makeMove(direction)"
              >
            {{ character }}
          </button>
        </div>
        <button @click="startGame" v-else>
          Start
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MATRIX_SIZE, START_SCORE, DIRECTIONS } from "@/constants.js"
import { createMatrix, random, findLastIndex, resetBox, oneOf } from "@/util.js"
import { backgroundTypes, controls } from "@/static.js"
export default {
  name: 'App',

  data() {
    return { 
      matrix: createMatrix(MATRIX_SIZE),
      gameStarted: false,
      touchStartCoordinate: {
        x: null,
        y: null
      }
    }
  },

  watch: {
    gameStarted(isStarted) {
      const listenerControlMethod = isStarted ? "addEventListener" : "removeEventListener"
      window[listenerControlMethod]('keydown', this.keypressHandler)
      window[listenerControlMethod]('touchstart', this.touchStartHandler)
      window[listenerControlMethod]('touchend', this.touchEndHandler)
    }
  },

  methods: {
    controls() {
      return controls
    },
    
    getBackgroundColor(score) {
      return backgroundTypes[Math.log2(score || 1)]
    },

    startGame() {
      this.gameStarted = true
      this.activateBox(2)
    },

    makeMove(direction) {
      let isMoveUseless = true
      const { UP, DOWN, RIGHT, LEFT } = DIRECTIONS
      for(let xCoordinate = 0; xCoordinate < MATRIX_SIZE; xCoordinate++) {
        const singleLevelBoxes = []
        const arrayAddingMethod = oneOf(direction, DOWN, RIGHT) ? "unshift" : "push"
        for(let yCoordinate = 0; yCoordinate < MATRIX_SIZE; yCoordinate++) {
          const newItem = oneOf(direction, DOWN, UP)
                ? this.matrix[yCoordinate][xCoordinate]
                : this.matrix[xCoordinate][yCoordinate]
          singleLevelBoxes[arrayAddingMethod](newItem)
        }
        for(let currentBoxIdx = 0; currentBoxIdx < singleLevelBoxes.length; currentBoxIdx++) {
          const currentBox = singleLevelBoxes[currentBoxIdx]
          if(!currentBox.active) {
            continue
          }
          const nextActiveBox = singleLevelBoxes.slice(currentBoxIdx + 1).find((box) => box.active)
          if(nextActiveBox && nextActiveBox.score === currentBox.score) {
            currentBox.score *= 2
            resetBox(nextActiveBox)
            isMoveUseless = false
          }
          const previousActiveBoxIdx = findLastIndex(singleLevelBoxes.slice(0, currentBoxIdx), (box) => box.active)
          const moveCurrentBoxToIdx = singleLevelBoxes[previousActiveBoxIdx] ? previousActiveBoxIdx + 1 : 0
          if(currentBoxIdx === moveCurrentBoxToIdx) {
            continue
          }
          const score = currentBox.score
          resetBox(currentBox)
          singleLevelBoxes[moveCurrentBoxToIdx].score = score
          singleLevelBoxes[moveCurrentBoxToIdx].active = true
          isMoveUseless = false
        }
      }
      if(!isMoveUseless) {
        this.activateBox()
      }
    },

    activateBox(amount = 1, startScore = START_SCORE) {
      for(let count = 0, activeBoxes = new Set(); count < amount && activeBoxes.size !== MATRIX_SIZE**2; count++) {
        const current = this.matrix[random(MATRIX_SIZE, 0)][random(MATRIX_SIZE, 0)]
        if(current.active) {
          activeBoxes.add(current)
          --count
          continue
        }
        current.active = true
        current.score = startScore * (Math.random() > .95 ? 2 : 1)
      }
    },

    keypressHandler({ key, repeat }) {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key) || repeat) {
        return
      }
      const mapKeyToDirection = {
        'ArrowUp': DIRECTIONS.UP,
        'ArrowDown': DIRECTIONS.DOWN,
        'ArrowLeft': DIRECTIONS.LEFT,
        'ArrowRight': DIRECTIONS.RIGHT,
      }
      this.makeMove(mapKeyToDirection[key])
    },

    touchStartHandler({ changedTouches: [{ pageX, pageY }] }) {
      this.touchStartCoordinate.x = pageX
      this.touchStartCoordinate.y = pageY
    },

    touchEndHandler({ changedTouches: [{ pageX, pageY }] }) {
      const horizontalDifference = this.touchStartCoordinate.x - pageX
      const verticalDifference = this.touchStartCoordinate.y - pageY

      if(Math.abs(verticalDifference) > Math.abs(horizontalDifference)) {
        this.makeMove(DIRECTIONS[verticalDifference > 0 ? "UP" : "DOWN"])
      } else {
        this.makeMove(DIRECTIONS[horizontalDifference > 0 ? "LEFT" : "RIGHT"])
      }
    }
  },
}
</script>





<style>
body, h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c2c2c;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.box-wrapper {
  width: 1000px;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.box-wrapper .gamebox {
  background-color: rgb(243, 243, 243);
  border: 1px solid grey;
}
.box-wrapper .controls, .box-wrapper .title {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.box-wrapper .title h1, .box-wrapper .title h3 {
  margin: 5px 0;
}
.box-wrapper .gamebox .box{
  font-weight: 500;
  color: whitesmoke;
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.box-wrapper .gamebox .row {
  display: flex;
}
.box-wrapper .controls .move-keys button{
  margin: 0 3px;
}
</style>
