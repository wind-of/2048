export function createMatrix(matrixLength) {
  const result = [];
  for(let rowIdx = 0; rowIdx < matrixLength; rowIdx++) {
    result[rowIdx] = []
    for(let columnIdx = 0; columnIdx < matrixLength; columnIdx++) {
      result[rowIdx][columnIdx] = { active: false, score: null }
    }
  }
  return result
}
export function random(max, min) {
  return Math.floor(Math.random() * (max - min)) + min
}
export function findLastActiveBoxIdx(boxes) {
  for(let idx = boxes.length - 1; idx >= 0; idx--) {
    if(boxes[idx].active) {
      return idx
    }
  }
}
export function resetBox(box) {
  box.score = null
  box.active = false
}