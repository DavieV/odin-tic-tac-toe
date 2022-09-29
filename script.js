const X = 'x'
const O = 'o'
const SIZE = 3

const gameBoard = (() => {
  // Represents the tic-tac-toe board. '_' represents an empty space.
  board = ['_', '_', '_', '_', '_', '_', '_', '_', '_']

  const reset = () => {
    for (let i = 0; i < board.length; ++i) {
      board[i] = '_'
    }
  }

  const getBoardIndex = (x, y) => {
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) {
      return -1
    }
    return x + y * SIZE
  }

  const print = () => {
    console.log(board)
  }

  const getCell = (idx) => {
    if (idx < 0 || idx >= board.length) {
      return undefined
    }
    return board[idx]
  }

  // Attempts to make a move updating |board| at position |idx| to |move|.
  // Returns true if the move was completed, false otherwise.
  const move = (idx, move) => {
    if (board[idx] !== '_' || (move !== X && move !== O) || state() !== '_') {
      return false
    }
    board[idx] = move
    return true
  }

  const state = () => {
    // Check rows and columns
    let empty = 0
    for (let i = 0; i < SIZE; ++i) {
      let row_xs = 0
      let col_xs = 0
      let row_os = 0
      let col_os = 0
      for (let j = 0; j < SIZE; ++j) {
        let row_cell = board[getBoardIndex(j, i)]
        let col_cell = board[getBoardIndex(i, j)]
        if (row_cell === X) {
          row_xs++
        }
        if (col_cell === X) {
          col_xs++
        }
        if (row_cell === O) {
          row_os++
        }
        if (col_cell === O) {
          col_os++
        }
        if (row_cell === '_') {
          empty++
        }
      }
      if (row_xs === 3 || col_xs === 3) {
        return X
      }
      if (row_os === 3 || col_os === 3) {
        return O
      }
    }

    // Check diagonals.
    if (board[0] !== '_' && board[0] === board[4] && board[4] === board[8]) {
      return board[0]
    }

    if (board[2] !== '_' && board[2] === board[4] && board[4] === board[6]) {
      return board[2]
    }

    if (empty === 0) {
      return 'tie'
    }

    return '_'
  }

  const render = () => {
    let div = document.createElement('div')
    div.classList.add('board')
    for (let i = 0; i < SIZE; ++i) {
      for (let j = 0; j < SIZE; ++j) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        let cellContent = document.createElement('div')
        cellContent.classList.add('cell-content')
        let cellValue = board[getBoardIndex(j, i)]
        if (cellValue !== '_') {
          cellContent.textContent = cellValue
        }
        cell.appendChild(cellContent)
        div.appendChild(cell)
      }
    }
    return div
  }

  return {
    print,
    reset,
    getCell,
    move,
    state,
    render,
  }
})()

const Player = (name_, piece_) => {
  const name = () => {
    return name_
  }

  const piece = () => {
    return piece_
  }

  return {
    name,
    piece,
  }
}

const gameController = ((board) => {
  let turn = 0
  let container = document.querySelector('.container')
  let status = document.querySelector('.status')
  let form = document.querySelector('form')

  let player1 = null
  let player2 = null

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    turn = 1
    player1 = Player(event.target[0].value, 'x')
    player2 = Player(event.target[1].value, 'o')

    status.textContent = `${player1.name()}'s turn.`
  })

  const render = () => {
    status.textContent = "Let's play tic-tac-toe!"

    let boardDiv = document.querySelector('.board')
    if (boardDiv === null) {
      boardDiv = board.render()
      container.appendChild(boardDiv)
    }
  }

  const setup = () => {
    render()
    let cells = document.querySelectorAll('.cell')
    cells.forEach((cell, idx) => {
      cell.addEventListener('click', () => {
        if (board.getCell(idx) === '_') {
          move(idx, cell)
        }
      })
    })
  }

  const move = (idx, cell) => {
    if (turn === 0) {
      return
    }
    let player = turn % 2 === 1 ? player1 : player2
    let moved = board.move(idx, player.piece())
    if (!moved) {
      return
    }
    let content = cell.querySelector('.cell-content')
    content.textContent = board.getCell(idx)
    board.print()

    let state = board.state()
    if (state !== '_') {
      if (state === 'tie') {
        status.textContent = "It's a tie!"
      } else {
        status.textContent = `The winner is ${player.name()}!`
      }
    }

    status.text
    turn++
  }

  return {
    setup,
  }
})(gameBoard)

gameController.setup()
