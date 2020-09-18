<template>
  <div id="app">
    <div class="box-wrapper">
      <div class="title">
        <h1>2048</h1>
        <h3>Enjoy!</h3>
      </div>
      <div class="gamebox">
        <div class="row" v-for="(row, rowIdx) in matrix" :key="rowIdx">
          <div class="box" v-for="({ score }, idx) in row" :key="rowIdx + String(idx)" :style="boxStyles(score)">
            {{ score || "" }}
          </div>
        </div>
      </div>
      <div class="controls">
        <div class="move-keys" v-if="gameStarted">
          <template v-for="({ direction, character }, idx) in $options.moves">
            <button :key="character + direction + idx " @click="makeMove(direction)">
              {{ character }}
            </button>
          </template>
        </div>
        <button @click="start" v-else>
          Start
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { HEAVY_FONT_COLOR_BORDER, MATRIX_SIZE, START_SCORE, DIRECTIONS } from "@/constants.js"
import { createMatrix, random, findLastActiveBoxIdx, resetBox } from "@/util.js"
import { backgroundTypes, moves } from "@/static.js"
export default {
  name: 'App',

  moves,

  data() {
    return { 
      matrix: createMatrix(MATRIX_SIZE),
      gameStarted: false,
    }
  },

  methods: {
    boxStyles(score) {
      const degree = Math.log2(score)
      return { 
        backgroundColor: score ? backgroundTypes[degree] : "",
        color: degree <= HEAVY_FONT_COLOR_BORDER ? "#333" : "#ccc"
      }
    },

    start() {
      this.gameStarted = true
      this.activateBox(2)
    },

    makeMove(direction) {
      const { UP, DOWN, RIGHT, LEFT } = DIRECTIONS
      for(let xCoordinate = 0; xCoordinate < MATRIX_SIZE; xCoordinate++) {
        const singleLevelBoxes = []
        const arrayAddingMethod = [DOWN, RIGHT].includes(direction) ? "unshift" : "push"
        for(let yCoordinate = 0; yCoordinate < MATRIX_SIZE; yCoordinate++) {
          const newItem = [DOWN, UP].includes(direction) 
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
          }
          const previousActiveBoxIdx = findLastActiveBoxIdx(singleLevelBoxes.slice(0, currentBoxIdx))
          const moveCurrentBoxToIdx = singleLevelBoxes[previousActiveBoxIdx] ? previousActiveBoxIdx + 1 : 0
          const score = currentBox.score
          resetBox(currentBox)
          singleLevelBoxes[moveCurrentBoxToIdx].score = score
          singleLevelBoxes[moveCurrentBoxToIdx].active = true
        }
      }
      this.activateBox(1)
    },

    activateBox(amount = 1, startScore = START_SCORE) {
      const activeBoxes = new Set()
      for(let count = 0; count < amount; count++) {
        const current = this.matrix[random(MATRIX_SIZE, 0)][random(MATRIX_SIZE, 0)]
        if(activeBoxes.size === MATRIX_SIZE**2) {
          break
        }
        if(current.active) {
          activeBoxes.add(current)
          --count
          continue
        }
        current.active = true
        current.score = startScore
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
