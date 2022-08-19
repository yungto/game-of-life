const unitLength = 20
const boxColor = 150
const strokeColor = 200

let columns /* To be determined by window width */
let rows /* To be determined by window height */
let currentBoard
let nextBoard
let board
let stopRun = true
let fr
let slider

let pattern = generatePattern()

// function updateCellInfo(board){
//   for (let i = 0; i < columns; i++) {
//     board[i] = []
//     for (let j = 0; j < rows; j++) {
//       board[i][j] = {
//         color: {
//           r: 255,
//           b: 255,
//           g: 255,
//         },
//         gen: 0,
//         live: 0,
//         nextLive:0
//       }
//     }
//   }
// }

//setup the Canvas on the browser
function setup() {
  /* Set the canvas to be under the element #canvas*/
  // const canvas = createCanvas(windowWidth * 0.975, windowHeight * 0.8)
  let canvas

  if (windowWidth < 768) {
    canvas = createCanvas(windowWidth * 0.975, windowHeight - 265)
  } else {
    canvas = createCanvas(windowWidth * 0.975, windowHeight - 120)
  }
  canvas.parent(document.querySelector("#canvas")) //parent is location

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength)
  rows = floor(height / unitLength)

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = []
  nextBoard = []
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = []
    nextBoard[i] = []
  }
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init() // Set the initial values of the currentBoard and nextBoard

  slider = createSlider(0, 30, 15)
  // slider.position(10, 10)
  slider.style("width", "80px")
  slider.parent(document.querySelector(".slidecontainer"))
}
//resize the canvas when the browser resizing
function windowResized() {
  stopRun = true
  if (windowWidth < 768) {
    resizeCanvas(windowWidth * 0.975, windowHeight - 265)
  } else {
    resizeCanvas(windowWidth * 0.975, windowHeight - 120)
  }

  columns = floor(width / unitLength)
  rows = floor(height / unitLength)

  for (let i = 0; i < columns; i++) {
    if (!currentBoard[i]) {
      currentBoard[i] = []
      nextBoard[i] = []
    }
    for (let j = 0; j < rows; j++) {
      if (!currentBoard[i][j]) {
        currentBoard[i][j] = 0
        nextBoard[i][j] = 0
      }
    }
  }
  setTimeout(function () {
    stopRun = false
  }, 1000)
}

/**
 * Initialize/reset the board state
 */
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0
      nextBoard[i][j] = 0
    }
  }
}

function draw() {
  let fr = slider.value()
  console.log(fr + 1)
  frameRate(fr)

  background(255)
  if (stopRun != true) {
    generate()
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        fill(boxColor)
      } else {
        fill(255)
      }
      stroke(strokeColor)
      rect(i * unitLength, j * unitLength, unitLength, unitLength, 20)
    }
  }
}

function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0
      // for (let i of [-1, 0, 1]) {
      //   for (let j of [-1, 0, 1]) {
      //     if (i == 0 && j == 0) {
      //       // the cell itself is not its own neighbor
      //       continue
      //     }
      //     // The modulo operator is crucial for wrapping on the edge
      //     neighbors +=
      //       currentBoard[(x + i + columns) % columns][(y + j + rows) % rows]
      //   }
      // }
      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          if (dx == 0 && dy == 0) {
            // the cell itself is not its own neighbor
            continue
          }
          // The modulo operator is crucial for wrapping on the edge
          let peerX = (x + dx + columns) % columns
          let peerY = (y + dy + rows) % rows
          neighbors += currentBoard[peerX][peerY]
        }
      }
      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        // Die of Loneliness
        nextBoard[x][y] = 0
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        // Die of Overpopulation
        nextBoard[x][y] = 0
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
        // New life due to Reproduction
        nextBoard[x][y] = 1
        // let c = color(255, 204, 0)
        // fill(c)
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y]
      }
    }
  }

  // Swap the nextBoard to be the current Board
  ;[currentBoard, nextBoard] = [nextBoard, currentBoard]
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
  const x = Math.floor(mouseX / unitLength)
  const y = Math.floor(mouseY / unitLength)
  // currentBoard[x][y] = 1
  // fill(boxColor)
  // stroke(strokeColor)
  // rect(x * unitLength, y * unitLength, unitLength, unitLength)
  desirePattern.values.forEach((line, yIndex) => {
    line.forEach((value, xIndex) => {
      let y = yIndex + cy
      let x = xIndex + cx
      placeCell(x, y, value)
    })
  })
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

document.querySelector("#reset-game").addEventListener("click", function () {
  init()
})
// CMS m
// document.querySelector('#reset-game')
// 	.addEventListener('click', function() {
// 		init();
// 	});

let start = document.querySelector("#startstop")
start.addEventListener("click", function () {
  stopRun = !stopRun
})

// let speedControl = document.querySelector("#myRange")
// speedControl.addEventListener("click", function () {
//   frameRate(slider.value)
// })

// document.querySelector("#myRange").addEventListener("click", function (e) {
//   const val = e.target.value
//   frameRate(floor(val))
// })

/* Random function and coding */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}
// function randomLife() {
//   for (let i = 0; i < columns; i++) {
//     for (let j = 0; j < rows; j++) {
//       currentBoard[i][j] = getRandomInt(2)
//     }
//   }
// }
document.querySelector("#randomPat").addEventListener("click", function () {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = random() > 0.8 ? 1 : 0
      nextBoard[i][j] = 0
    }
  }
})

/* Add Pattern function */
// ----------------------------------------------------------------

function patternChose() {
  // let patternText = `
  // .....
  // .x...
  // ..xx.
  // .xx..
  // .....
  // `
  // let glider = `
  // .....
  // .xxx.
  // .x...
  // ..X..
  // .....
  // `
  // let lightWeightSpaceShip = `
  // .......
  // ..x..x.
  // .x.....
  // .X...x.
  // .xxxx..
  // .......
  // `
  // let Fpentomino = `
  // .....
  // ..xx.
  // .xx..
  // ..X..
  // .....
  // `
  let acorn = `
  .........
  ..x......
  ....x....
  .xx..xxx.
  .........
  `

  let pattern = acorn
  return pattern
}

function generatePattern() {
  let patternText = patternChose()
  let lines = patternText.split("\n")
  lines = lines.slice(1, lines.length - 1)

  let values = lines.map(line =>
    line
      .trim()
      .split("")
      .map(char => (char === "." ? 0 : 1))
  )

  let height = values.length
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0
  )

  let halfHeight = Math.floor(height / 2)
  let halfWidth = Math.floor(width / 2)

  return {
    values,
    halfWidth,
    halfHeight,
  }
}

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

  currentBoard[x][y] = value
  if (value == 1) {
    fill(boxColor)
  } else {
    fill(255)
  }
  stroke(strokeColor)
  rect(x * unitLength, y * unitLength, unitLength, unitLength, 20)
}

// pattern.js
// --------------------------------

// let text = `
// .......
// ...x...
// ...x...
// .xxxxx.
// ...x...
// ...x...
// .......
// `

// let lines = patternText.split("\n")
// // lines.pop()
// // lines.shift()
// lines = lines.slice(1, lines.length - 1)

// console.log({ lines })

// let pattern2 = lines.map(line =>
//   line
//     .trim()
//     .split("")
//     .map(char => (char === "." ? 0 : 1))
// )

// console.log({ pattern2 })
