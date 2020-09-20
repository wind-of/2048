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
export function findLastIndex(array, predicate) {
  for(let idx = array.length - 1; idx >= 0; idx--) {
    if(predicate(array[idx])) {
      return idx
    }
  }
}
export function resetBox(box) {
  box.score = null
  box.active = false
}
export function oneOf(element, ...element) {
  return elements.includes(element)
}