let text = `
.......
...x...
...x...
.xxxxx. 
...x...
...x...
.......
`

let lines = patternText.split('\n')
// lines.pop()
// lines.shift()
lines = lines.slice(1, lines.length - 1)

console.log({ lines })

let pattern = lines.map(line =>
  line.trim().split('').map(char => (char === '.' ? 0 : 1)),
)

console.log({ pattern })
