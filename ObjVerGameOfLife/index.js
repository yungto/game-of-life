const unitLength = 20
let penColor = 150
const strokeColor = 50
let columns /* To be determined by window width */
let rows /* To be determined by window height */
let board
let pattern = generatePattern()
let penColorInput = document.querySelector('#penColor')
// colorMode: 'pen' | 'rainbow'
let colorMode = 'pen'
let time = 0

penColorInput.value = penColor
penColorInput.addEventListener('change', () => {
  penColor = penColorInput.value
  console.log('change color:', penColor)
})

document.querySelector('#toggle-color-mode').addEventListener('click', () => {
  if (colorMode === 'pen') {
    colorMode = 'rainbow'
  } else {
    colorMode = 'pen'
  }
})

function generatePattern() {
  let patternText = `
.....
.x...
..xx.
.xx..
.....
`

  let lines = patternText.split('\n')
  lines = lines.slice(1, lines.length - 1)

  let values = lines.map(line =>
    line
      .trim()
      .split('')
      .map(char => (char === '.' ? 0 : 1)),
  )

  let height = values.length
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0,
  )

  let halfHeight = Math.floor(height / 2)
  let halfWidth = Math.floor(width / 2)

  return {
    values,
    halfWidth,
    halfHeight,
  }
}

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth, windowHeight - 100)
  canvas.parent(document.querySelector('#canvas'))

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength)
  rows = floor(height / unitLength)

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  board = []
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init() // Set the initial values of the currentBoard and nextBoard
}

/**
 * Initialize/reset the board state
 */
function init() {
  for (let i = 0; i < columns; i++) {
    board[i] = []
    for (let j = 0; j < rows; j++) {
      board[i][j] = {
        alive: 0,
        nextAlive: 0,
        color: penColor,
        generation: 0,
      }
    }
  }
}

function getRainbowColor(x, y) {
  let r = (x / columns) * 255
  // r = (r + time) % 255
  let g = (y / rows) * 255
  let b = (x + y) / (columns + rows) / 255
  b = 127
  let colorCodes = [r, g, b].map(value => value / 2 + 127)
  return color(colorCodes)
}

function draw() {
  background(255)
  generate()
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let cell = board[x][y]
      if (cell.alive == 1) {
        if (colorMode === 'pen') {
          fill(cell.color)
        } else {
          fill(getRainbowColor(x, y))
        }
      } else {
        fill(255)
        // fill(getRainbowColor(x, y))
      }
      stroke(strokeColor)
      rect(x * unitLength, y * unitLength, unitLength, unitLength)
    }
  }
}

function generate() {
  time++
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let cell = board[x][y]
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0
      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          if (dx == 0 && dy == 0) {
            // the cell itself is not its own neighbor
            continue
          }
          // The modulo operator is crucial for wrapping on the edge
          let peerX = (x + dx + columns) % columns
          let peerY = (y + dy + rows) % rows
          neighbors += board[peerX][peerY].alive
        }
      }

      // Rules of Life
      if (cell.alive == 1 && neighbors < 2) {
        // Die of Loneliness
        cell.nextAlive = 0
      } else if (cell.alive == 1 && neighbors > 3) {
        // Die of Overpopulation
        cell.nextAlive = 0
      } else if (cell.alive == 0 && neighbors == 3) {
        // New life due to Reproduction
        cell.nextAlive = 1
      } else {
        // Stasis
        cell.nextAlive = cell.alive
      }
    }
  }

  // Swap the nextAlive to be the current alive
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let cell = board[x][y]
      cell.alive = cell.nextAlive
    }
  }
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    return
  }
  const sx = Math.floor(mouseX / unitLength)
  const sy = Math.floor(mouseY / unitLength)

  const cy = sy - pattern.halfHeight
  const cx = sx - pattern.halfWidth

  pattern.values.forEach((line, yIndex) => {
    line.forEach((value, xIndex) => {
      let y = yIndex + cy
      let x = xIndex + cx
      placeCell(x, y, value)
    })
  })
}

function placeCell(x, y, value) {
  x = (x + columns) % columns
  y = (y + rows) % rows

  board[x][y].alive = value
  board[x][y].color = penColor
  if (value == 1) {
    fill(penColor)
  } else {
    fill(255)
  }
  stroke(strokeColor)
  rect(x * unitLength, y * unitLength, unitLength, unitLength)
}

/**
 * When mouse is pressed
 */
function mousePressed() {
  noLoop()
  mouseDragged()
}

/**
 * When mouse is released
 */
function mouseReleased() {
  loop()
}

document.querySelector('#reset-game').addEventListener('click', function () {
  init()
})
