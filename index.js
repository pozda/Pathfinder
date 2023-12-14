const glyphs = {
    VERTICAL: '|',
    HORIZONTAL: '-',
    TURN: '+',
    START: '@',
    END: 'x',
    NONE: null,
}

const directions = {
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left',
    NONE: null,
}

const errorMessage = {
    MISSING_START_GLYPH: 'ERROR! Glitch (missing start glyph) in the matrix!',
    MISSING_END_GLYPH: 'ERROR! Glitch (missing end glyph) in the matrix!',
    MISSING_UNIQUE_GLYPH: 'ERROR! Glitch (missing glyph) in the matrix! ',
    MULTIPLE_START_GLYPHS: 'ERROR! Glitch (multiple start glyphs) in the matrix! Should have just 1 start glyph, but it has ',
    MULTIPLE_END_GLYPHS: 'ERROR! Glitch (multiple end glyphs) in the matrix! Should have just 1 end glyph, but it has ',
    MULTIPLE_UNIQUE_GLYPHS: 'ERROR! Glitch (multiple glyphs) in the matrix! Should have just 1 unique glyph, but it has ',
    INVALID_GLYPH: 'ERROR! Glitch (invalid glyph) in the matrix!',
    MULTIPLE_PATHS: 'ERROR! Glitch (multiple paths) in the matrix!',
    FORK: 'ERROR! Glitch (fork) in the matrix!',
    FAKE_TURN: 'ERROR! Glitch (fake turn) in the matrix!',
    BROKEN_PATH: 'ERROR! Glitch (broken path) in the matrix!'
}

class Pathfinder {
    constructor(matrix) {
        this.matrix = matrix
        this.validLetters = /^[A-Z]{1}$/
        this.validGlyphs = /(^[A-Z@x|+-]{1}$)/
        this.validMatrixFieldValues = /^[A-Z@x|+-\s]{1}$/
        this.startPosition = this.findStartAndFinishPosition(this.matrix, glyphs.START)
        this.endPosition = this.findStartAndFinishPosition(this.matrix, glyphs.END)
        this.currentGlyph = glyphs.NONE
        this.currentDirection = directions.NONE
        this.currentPosition = this.startPosition
        this.path = []
        this.letterCoordinates = []
    }

    //some helper methods
    isValidLetter = (glyph) => this.validLetters.test(glyph)
    isValidGlyph = (glyph) => this.validGlyphs.test(glyph)
    isValidMatrixFieldValue = (glyph) => this.validMatrixFieldValues.test(glyph)
    compareArrays = (arrayOne, arrayTwo) => JSON.stringify(arrayOne) === JSON.stringify(arrayTwo)

    // methods
    findStartAndFinishPosition(array, glyph) {
        const rowResults = [] 
        const position = []

        if(this.isValidGlyph(glyph)) {
            for(let i = 0; i<array.length; i++){
                const rowResult = array[i].filter(g => g === glyph)
                rowResults.push(rowResult.length)
                if (rowResult.length === 1){
                    position.push(i, array[i].indexOf(glyph))
                } else if (rowResult > 1) {
                    if(glyph === glyphs.START){
                        throw new Error(errorMessage.MULTIPLE_START_GLYPHS + `${numberOfGlyphs}!`)
                    } else if(glyph === glyphs.END){
                        throw new Error(errorMessage.MULTIPLE_END_GLYPHS + `${numberOfGlyphs}!`)
                    } else {
                        throw new Error(errorMessage.MULTIPLE_UNIQUE_GLYPHS + `${numberOfGlyphs}!`)
                    }
                }
            }
        } else {
            throw new Error(errorMessage.INVALID_GLYPH)
        }
        const numberOfGlyphs = rowResults.reduce(
            (acc, currentValue) => acc + currentValue, 0
        )

        if(numberOfGlyphs === 1){
            return position
        } else if(numberOfGlyphs === 0){
            if(glyph === glyphs.START){
                throw new Error(errorMessage.MISSING_START_GLYPH)
            } else if(glyph === glyphs.END){
                throw new Error(errorMessage.MISSING_END_GLYPH)
            } else {
                throw new Error(errorMessage.MISSING_UNIQUE_GLYPH + `You have been looking for ${glyph}!`)
            }
        } else {
            if(glyph === glyphs.START){
                throw new Error(errorMessage.MULTIPLE_START_GLYPHS + `${numberOfGlyphs}!`)
            } else if(glyph === glyphs.END){
                throw new Error(errorMessage.MULTIPLE_END_GLYPHS + `${numberOfGlyphs}!`)
            } else {
                throw new Error(errorMessage.MULTIPLE_UNIQUE_GLYPHS + `${numberOfGlyphs}!`)
            }
        }
    }

    getNewPositionData(direction) { 
        //returns new position data, other method decides which data it will use 
        switch(direction) {
        case directions.UP:
            return ({
                position: [this.currentPosition[0] - 1, this.currentPosition[1]],
                direction: directions.UP,
                glyph: this.matrix[this.currentPosition[0] - 1][this.currentPosition[1]]
            })
        case directions.RIGHT:
            return ({
                position: [this.currentPosition[0], this.currentPosition[1] + 1],
                direction: directions.RIGHT,
                glyph: this.matrix[this.currentPosition[0]][this.currentPosition[1] + 1]
            })
        case directions.DOWN:
            return ({
                position: [this.currentPosition[0] + 1, this.currentPosition[1]],
                direction: directions.DOWN,
                glyph: this.matrix[this.currentPosition[0] + 1][this.currentPosition[1]]
            })
        case directions.LEFT:
            return ({
                position: [this.currentPosition[0], this.currentPosition[1] - 1],
                direction: directions.LEFT,
                glyph: this.matrix[this.currentPosition[0]][this.currentPosition[1] - 1]
            })
        }
    }

    updateVariables(position){
        this.currentPosition = position
        this.path.push(position)
        this.currentGlyph = this.matrix[position[0]][position[1]]
        
        if(this.isValidLetter(this.currentGlyph)){
            this.letterCoordinates.push(position)
        }
    }

    setDirection() {
        const glyphsCollected = []
        const directionChanges = []
        const directionObjects = []

        if (this.currentPosition[0] !== 0) { //all but first row
            const glyphUp = this.getNewPositionData(directions.UP)
            directionObjects.push(glyphUp)
            if(this.currentDirection !== directions.DOWN){
                if(this.isValidGlyph(glyphUp.glyph)) {
                    glyphsCollected.push(glyphUp.glyph)
                    directionChanges.push(directions.UP)
                    this.currentDirection = directions.UP
                }
            }
        }  
        if(this.currentPosition[0] !== this.matrix.length-1) { //all but last row
            const glyphDown = this.getNewPositionData(directions.DOWN)
            directionObjects.push(glyphDown)
            if(this.currentDirection !== directions.UP) {
                if(this.isValidGlyph(glyphDown.glyph)) {
                    glyphsCollected.push(glyphDown.glyph)
                    directionChanges.push(directions.DOWN)
                    this.currentDirection = directions.DOWN
                }
            }
        }
        if(this.currentPosition[1] !== this.matrix[this.currentPosition[0]].length-1) { // all but last column) 
            const glyphRight = this.getNewPositionData(directions.RIGHT)
            directionObjects.push(glyphRight)
            if(this.currentDirection !== directions.LEFT) {
                if(this.isValidGlyph(glyphRight.glyph)) {
                    glyphsCollected.push(glyphRight.glyph)
                    directionChanges.push(directions.RIGHT)
                    this.currentDirection = directions.RIGHT
                }
            }
        }
        if (this.currentPosition[1] !== 0) { //all but first column
            const glyphLeft = this.getNewPositionData(directions.LEFT)
            directionObjects.push(glyphLeft)
            if(this.currentDirection !== directions.RIGHT) {
                if(this.isValidGlyph(glyphLeft.glyph)) {
                    glyphsCollected.push(glyphLeft.glyph)
                    directionChanges.push(directions.LEFT)
                    this.currentDirection = directions.LEFT
                }
            }
        }


        if(directionChanges.length === 1){
            this.currentDirection = directionChanges[0]
            // will need to double check for fake turns or such
            return this.currentDirection
        } else if(directionChanges.length === 2) {
            const newDirection = directionObjects.filter(obj => obj.direction !== this.currentDirection)
            this.currentDirection = newDirection[0].direction
            return this.currentDirection
        } else if(directionChanges.length > 2) {
            return this.currentDirection
        }       

    
    }

    getResult(){
        const finishedPath = this.path
        let path = []
        for(let i = 0; i < finishedPath.length; i++){
            path.push(this.matrix[finishedPath[i][0]][finishedPath[i][1]])
        }
        const letterArr = Array.from(new Set(this.letterCoordinates.map(JSON.stringify)), JSON.parse)
        let word = []
        for(let i = 0; i < letterArr.length; i++){
            word.push(this.matrix[letterArr[i][0]][letterArr[i][1]])
        }
        path = path.join('')
        word = word.join('')
        console.log({path, word})
        return {path, word}
    }

    walk(position) {
        this.updateVariables(position)

        if(this.currentGlyph === glyphs.START){
            const firstDirection = this.setDirection()
            const newPosition = this.getNewPositionData(firstDirection)
            return this.walk(newPosition.position)
        }

        if(this.isValidLetter(this.currentGlyph)){
            const newDirection = this.setDirection()
            const newPosition = this.getNewPositionData(newDirection)
            return this.walk(newPosition.position)
        }

        if(this.currentGlyph === glyphs.TURN){
            const newDirection = this.setDirection()
            const newPosition = this.getNewPositionData(newDirection)
            return this.walk(newPosition.position)
        }

        if(this.currentGlyph === glyphs.END){
            return this.getResult()
        }
        
        const newPosition = this.getNewPositionData(this.currentDirection)
        return this.walk(newPosition.position)
    }

    findPath() {
        try {
            return this.walk(this.startPosition)
        } catch (error) {
            console.log(error)
        }
    }
}

//matrices
const matrix1 = [
    ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
    ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
    [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
    [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
] //pass
const matrix2 = [
    [' ', ' ', '@'], 
    [' ', ' ', '|', ' ', '+', '-', 'C', '-', '-', '+'], 
    [' ', ' ', 'A', ' ', '|', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', '+', '-', '-', '-', 'B', '-', '-', '+'], 
    [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', 'x'], 
    [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'D', '-', '-', '+']
] //pass
const matrix3 = [
    ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    ['x', '-', 'B', '-', '+', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'C']
] //pass
const matrix4 = [
    [' ', ' ', ' ', ' ', ' ', '+', '-', 'O', '-', 'N', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '+', '-', 'I', '-', '+'], 
    [' ', '@', '-', 'G', '-', 'O', '-', '+', ' ', '|', ' ', '|', ' ', '|'], 
    [' ', ' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '+', '-', '+', ' ', 'E'], 
    [' ', ' ', ' ', ' ', ' ', '+', '-', '+', ' ', ' ', ' ', ' ', ' ', 'S'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x']
] //pass
const matrix5 = [
    [' ', '+', '-', 'L', '-', '+'], 
    [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
    ['@', 'B', '+', ' ', '+', '+', ' ', 'H'], 
    [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
] //pass
const matrix6 = [
    ['@', '-', 'A', '-', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', ' ', '+', '-', 'B', '-', '-', 'x', '-', 'C', '-', '-', 'D']
] // pass
//invalid matrices that should produce errors
const matrix7 =[
    [' ', ' ', ' ', '-', 'A', '-', '-', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'], 
    [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
] // pass
const matrix8 =
[
    ['@', '-', '-', 'A', '-', '-', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', 'B', '-', '+', ' ', ' ', ' ', 'C'], 
    [' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', '+', '-', '-', '-', '+']
] // pass
const matrix9 = 
[
    [' ', '@', '-', '-', 'A', '-', '@', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'], 
    [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
] // pass
const matrixa =
[
    ['@', '-', '-', 'A', '-', '-', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x'], 
    [' ', ' ', ' ', ' ', ' ', ' ', '@', '-', 'B', '-', '+']
] // pass, becase it errors on double starting character
const matrixab =
[
    ['@', '-', '-', 'A', '-', '-', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', '-', 'B', '-', '+']
] // pass, becase it errors on double starting character, fails if just 1
const matrixb =
[
    [' ', '@', '-', '-', 'A', '-', '-', 'x'], 
    [' '], 
    ['x', '-', 'B', '-', '+'], 
    [' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', ' ', '@']
] // pass because double starting and ending characters, but also when because of broken link
const matrixc =
[
    [' ', ' ', ' ', ' ', ' ', 'x', '-', 'B'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    ['@', '-', '-', 'A', '-', '-', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
    [' ', ' ', 'x', '+', ' ', ' ', ' ', 'C'], 
    [' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
    [' ', ' ', ' ', '+', '-', '-', '-', '+']
] // pass because double ending characters, but also pass if just one ending character
const matrixd =
[
    ['@', '-', '-', 'A', '-', '+'], 
    [' ', ' ', ' ', ' ', ' ', '|'], 
    [' '], 
    [' ', ' ', ' ', ' ', ' ', 'B', '-', 'x']
] // pass
const matrixe = 
[
    ['x', '-', 'B', '-', '@', '-', 'A', '-', 'x']
] // pass
const matrixf = 
[
    ['@', '-', 'A', '-', '+', '-', 'B', '-', 'x']
] // pass
const matrixg = [
    [' ','x','-','+'],
    [' ',' ',' ','|'],
    [' ',' ',' ','A'],
    [' ',' ',' ','|'],
    [' ',' ',' ','J'],
    [' ',' ',' ','|'],
    [' ',' ',' ','+'],
    [' ',' ',' ','|'],
    [' ',' ',' ','@'],
] // pass
const matrixTest = [
    [' ', '@', '-', '-', '+'],
    [' ', ' ', ' ', ' ', '|', ' ', 'x', '+'],
    [' ', ' ', ' ', ' ', 'A', '-', 'B', '-'],
]
const matrixTest2 = [
    [' ','x','-','+'],
    [' ',' ',' ','|'],
    [' ',' ',' ','A'],
    [' ',' ',' ','|'],
    [' ',' ',' ','|'],
    ['+','-','-','J'],
    ['|',' ',' ',' '],
    ['|',' ',' ',' '],
    ['+','-','-','@'],
] //pass

try {
    const pathfinder = new Pathfinder( matrix2 )
    const findPath = pathfinder.findPath()
} catch (error) {
    console.log(error)
}


/**
 * fails
 * mtx2
 * mtx4
 * mtx5
 * mtxab - broken path - need to check this one, it fails
 * mtxc2 - should try to invalidate fork situation if evereything else is ok
 * mtxd - broken path, goes through
 * mtxf - fake turn
 */




// /** matrices that should Error/FAIL
//  * mtx7: no start character
//  * mtx8: no end character
//  * mtx9: 2 start characters
//  * mtxa: broken path
//  * mtxab: broken path - need to check this one, it fails
//  * mtxb: 2 paths - double start and end characters
//  * mtxc: Fork and two ends
//  * mtxd: broken path - it powers through, should fail
//  * mtxe: 2 end characters, start character in the middle
//  * mtxf: fake TURN, goes through, need to add this one
//  */
