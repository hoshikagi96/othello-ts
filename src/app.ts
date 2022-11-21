enum StoneState {
    None,
    Black,
    White
}

interface Stone {
    id: string,
    state: StoneState
}

let mode: 'black' | 'white' = 'black'

function createGameBord(): Stone[][] {
    const gameBord = [...Array(8)].map((_, i1) => {
        return [...Array(8)].map((_, i2) => {
            return {
                id: String(i1) + String(i2),
                state: StoneState.None
            }
        })
    })
    console.log(gameBord)
    return gameBord
}

const bord = createGameBord()
const container = document.getElementById('game-bord') as HTMLDivElement
bord.forEach((rowItems, i1) => {
    const rowEl = document.createElement('div')
    rowEl.classList.add('stone-row')
    rowEl.id = `stone-row-${i1}`
    rowItems.forEach((item, i2) => {
        const exEl = document.createElement('div')
        const el = document.createElement('div')
        exEl.classList.add('stone-container')
        el.classList.add('stone', 'none')
        el.id = `stone-${item.id}`
        exEl.appendChild(el)
        rowEl.appendChild(exEl)
    })
    container.appendChild(rowEl)
})

function changeMode() {
    const modeStr = mode === 'white' ? '白' : '黒'
    const showContainer = document.getElementById('show-turn') as HTMLDivElement
    showContainer.className = mode
    showContainer.innerText = `${modeStr}のターンです`
}

function initGame() {
    changeMode()
    const initStones: Stone[] = [
        { id: '33', state: StoneState.White },
        { id: '34', state: StoneState.Black },
        { id: '43', state: StoneState.Black },
        { id: '44', state: StoneState.White },
    ]
    initStones.forEach((item) => {
        const el = document.getElementById(`stone-${item.id}`)
        el?.classList.remove('none')
        const stateName = item.state === StoneState.White ? 'white' : 'black'
        el?.classList.add(stateName)

        const [y, x] = item.id.split('').map(i => Number(i))
        bord[y][x].state = item.state
    })
}

initGame()

function getIdsByIdName(idName: string): number[] {
    return idName.split('-')[1].split('').map(id => Number(id))
}



const stoneContainers = document.getElementsByClassName('stone-container')
console.log(stoneContainers)
for (let i = 0; i < stoneContainers.length; i++) {
    console.log(stoneContainers[i])
    const container = stoneContainers[i] as HTMLDivElement
    container.addEventListener('click', (event) => {
        console.log(event)
        const stoneEl = container.firstChild as HTMLDivElement
        const [y, x] = getIdsByIdName(stoneEl.id)
        const stone: Stone = bord[y][x]
        stone.state = mode === 'black' ? StoneState.Black : StoneState.White

        if (checkState(y, x, stone.state).length) {
            stoneEl.classList.remove('none')
            stoneEl.classList.add(mode)
            turnStones(stone)
            mode = mode === 'black' ? 'white': 'black'
            changeMode()
        } else {
            alert('おけないよ！')
        }
    })
}

const directionList = [
    [0, -1],  // left
    [0, 1],   // right
    [-1, 0],  // up
    [1, 0],   // down
    [-1, -1], // upleft
    [-1, 1],  // upright
    [1, -1],  // downleft
    [1, 1]    // downright
]

function checkState(putY: number, putX: number, target: StoneState): number[][] {
    let changableIds: any[] = [];
    // 各方向についてチェック
    for (const [y, x] of directionList) {
        let tmpIds: number[][] = []
        let currY = putY + y
        let currX = putX + x
        while ((0 <= currY && currY < 8) && (0 <= currX && currX < 8)) {
            console.log(bord[currY][currX])
            if (bord[currY][currX].state === StoneState.None) {
                break;
            }
            if (bord[currY][currX].state === target) {
                if (tmpIds.length) {
                    changableIds.push(...tmpIds)
                }
                break;
            } else {
                tmpIds.push([currY, currX])
                currY += y
                currX += x
            }
        }
    }
    return changableIds
}

function changeState(changeableList: number[][], targetState: StoneState) {
    changeableList.forEach(([y, x]) => {
        console.log([y, x])
        bord[y][x].state = targetState
        const el = document.getElementById(`stone-${bord[y][x].id}`) as HTMLDivElement
        console.log(el)
        const stateName = targetState === StoneState.White ? 'white' : 'black'
        el.className = `stone ${stateName}`
        console.log(bord)
    })
}

function turnStones(putStone: Stone) {
    const targetState: StoneState = putStone.state
    const [putY, putX] = putStone.id.split('').map(id => Number(id))
    const changeableList = checkState(putY, putX, targetState)
    console.log('list', changeableList)
    changeState(changeableList, targetState)
}

