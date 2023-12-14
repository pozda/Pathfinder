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
    findStartAndFinishPosition = (array, glyph) => {
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

    getNewPositionData = (direction) => { 
        //returns new position data, other method decides which data it will use 
        switch(direction) {
        case directions.UP:
            return ({
                position: [this.currentPosition[0] - 1, this.currentPosition[1]],
                direction: directions.UP,
                glyph: this.matrix[this.position[0] - 1][this.position[1]]
            })
        case directions.RIGHT:
            return ({
                position: [this.currentPosition[0], this.currentPosition[1] + 1],
                direction: directions.RIGHT,
                glyph: this.matrix[this.position[0]][this.position[1] + 1]
            })
        case directions.DOWN:
            return ({
                position: [this.currentPosition[0] + 1, this.currentPosition[1]],
                direction: directions.DOWN,
                glyph: this.matrix[this.position[0] + 1][this.position[1]]
            })
        case directions.LEFT:
            return ({
                position: [this.currentPosition[0], this.currentPosition[1] - 1],
                direction: directions.LEFT,
                glyph: this.matrix[this.position[0]][this.position[1] - 1]
            })
        }
    }

    updateVariables = (position) => {
        this.currentPosition = position
        this.path.push(position)
        this.currentGlyph = this.matrix[position[0]][position[1]]
        
        if(this.isValidLetter(this.currentGlyph)){
            this.letterCoordinates.push(position)
        }
    }

    setDirection = () => {
        const glyphsCollected = []
        const directions = []

        if (this.currentPosition[0] !== 0) { //all but first row
            // console.log('loop 1, checks up')
            const glyphUp = getGlyph(position, directions.UP)
            if(this.currentDirection !== directions.DOWN){
                if(this.isValidGlyph(glyphUp)) {
                    glyphsCollected.push(glyphUp)
                    directions.push(directions.UP)
                    this.currentDirection = directions.UP
                }
            }
        }  
        if(position[0] !== matrix.length-1) { //all but last row
            // console.log('loop 2, checks down')
            const glyphDown = getGlyph(position, direction.DOWN)
            if(this.currentDirection !== direction.UP) {
                if(isValidGlyph(glyphDown)) {
                    glyphsCollected.push(glyphDown)
                    directions.push(direction.DOWN)
                    this.currentDirection = direction.DOWN
                }
            }
        }
        if(position[1] !== matrix[position[0]].length-1) { // all but last column) 
            // console.log('loop 3, checks right')
            const glyphRight = getGlyph(position, direction.RIGHT)
            if(this.currentDirection !== direction.LEFT) {
                if(isValidGlyph(glyphRight)) {
                    glyphsCollected.push(glyphRight)
                    directions.push(direction.RIGHT)
                    this.currentDirection = direction.RIGHT
                }
            }
        }
        if (position[1] !== 0) { //all but first column
            // console.log('loop 4, checks left')
            const glyphLeft = getGlyph(position, direction.LEFT)
            if(this.currentDirection !== direction.RIGHT) {
                if(isValidGlyph(glyphLeft)) {
                    glyphsCollected.push(glyphLeft)
                    directions.push(direction.LEFT)
                    this.currentDirection = direction.LEFT
                }
            }
        }
    }

    walk = (position) => {
        this.updateVariables(position)

        if(this.currentGlyph === glyphs.START){
            console.log('should setDirection')
        }

        if(this.isValidLetter(this.currentGlyph)){
            console.log('should check surrounding glyphs')
        }

        if(this.currentGlyph === glyphs.TURN){
            console.log('should change direction')
        }

        if(this.currentGlyph === glyphs.END){
            console.log('found path')
        }
        
        const newPosition = this.findNextPosition()
        this.walk(newPosition)
    }

    findPath = () => {
        try {
            // walk(startPosition, endPosition)
            return this.findStartAndFinishPosition(this.matrix, glyphs.START)
        } catch (error) {
            console.log(error)
        }
    }
}

const matrix1 = [
    [' ', '@', '-', '-', '+'],
    [' ', ' ', ' ', ' ', '|', ' ', 'x', '+'],
    [' ', ' ', ' ', ' ', 'A', '-', 'B', '-'],
]

try {
    const pathfinder = new Pathfinder(matrix1)
    const findPath = pathfinder.findPath()
    console.log(findPath)
} catch (error) {
    console.log(error)
}

