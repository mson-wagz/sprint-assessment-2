// create websocket object
// pass URL and port no. of the server you want to connect to
// every time server sends a message to client, on message event is triggered
// to send message to the server, send method of the websocket object is used

// Pass in the string which represents the url and port number where our websocket server is listening
let clientId 
let gameId
let socket
let symbol
const create = document.querySelector(".create")
create.disabled = true
const join = document.querySelector(".join")
join.disabled = true
join.addEventListener("click", ()=>{
    socket.send(JSON.stringify({
        'tag': 'join',
        'clientId': clientId,
        'gameId': gameId
    }))
})
const cells = document.querySelectorAll('.cell')
const board = document.querySelector('.tictactoeboard')
const list = document.querySelector("ul")
const bottomBar = document.querySelector(".bottombar")
const connectUs = document.querySelector('.connect')
connectUs .addEventListener("click", (source) => {
    socket = new WebSocket('ws://localhost:8080')
    socket.onmessage = onMessage
    source.target.disabled = true 
})

// this on message is going to get past the reply object whic is sent from the server
function onMessage(msg) {
const data = JSON.parse(msg.data)
switch(data.tag){
    case 'connected':
        clientId = data.clientId
        console.log(data.clientId)
        const label = document.createElement("label")
        label.innerText = data.clientId
        label.style.textAlign = "center"
        bottomBar.insertBefore(label, connectUs)
        create.disabled = false
        join.disabled = false
        break
    case 'gamesList':
        const games = data.list
        while(list.firstChild){
            list.removeChild(list.lastChild)
        }
        games.forEach( game => {
            
            const li = document.createElement('li')
            li.textContent = game
            li.style.textAlign = "center"
            list.appendChild(li)
            li.addEventListener("click", ()=>{gameId = game})
        })

            break
    case 'created':
        gameId = data.gameId
        create.disabled = true
        join.disabled = true
        console.log(gameId)
        break
    case 'joined':
        document.querySelector('.tictactoeboard').style.display='grid'
        symbol = data.symbol
        if(symbol=='x')
            board.classList.add('cross')
        else board.classList.add('circle')
        break
    case 'updateBoard':
        cells.forEach(cell=>{
            if(cell.classList.contains('cross'))
                cell.classList.remove('cross')
            else if(cell.classList.contains('circle'))
                cell.classList.remove('circle')
        })
        for(i=0; i<9; i++){
            if(data.board[i]=='x')
                cells[i].classList.add('cross')
            else if(data.board[i]=='o')
                cells[i].classList.add('circle')
        }
        if(data.isTurn)
            makeMove()
        break
    case 'winner':
        alert(`The winner is ${data.winner}! 😮‍💨`)
        break
    case 'gameDraw':
        alert(`It's a tie! 🤝`)
        break      
}
}

function makeMove() {
    cells.forEach(cell=>{
        if(!cell.classList.contains('cross') && !cell.classList.contains('circle'))
            cell.addEventListener('click', cellClicked)
    })
}

function cellClicked(src) {
    let icon
    if(symbol=='x')
        icon = 'cross'
    else icon = 'circle'
    src.target.classList.add(icon)
    const board = []
    for(i=0; i<9; i+=1){
        if (cells[i].classList.contains('circle'))
            board[i] = 'o'
        else if (cells[i].classList.contains('cross'))
            board[i] = 'x'
        else
            board[i] = ''
    }
    //To stop a player from making another move unless its their turn
    cells.forEach(cell=>{
        cell.removeEventListener('click', cellClicked)
    })
    socket.send(JSON.stringify({
        'tag': 'moveMade',
        'board': board,
        'clientId': clientId,
        'gameId': gameId
    }))
}





create.addEventListener("click", ()=>{
    socket.send(JSON.stringify({
        'tag': 'create',
        'clientId': clientId
    }))
})