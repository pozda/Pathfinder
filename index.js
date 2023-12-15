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
    MISSPLACED_START_GLYPH: 'ERROR! Glitch (missplaced start glyph) in the matrix! Should be placed on either end of the path!',
    INVALID_GLYPH: 'ERROR! Glitch (invalid glyph) in the matrix!',
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
        this.startPosition = null
        this.endPosition = null
        this.currentGlyph = glyphs.NONE
        this.currentDirection = directions.NONE
        this.currentPosition = null
        this.path = []
        this.letterCoordinates = []
    }
    
    // utility methods
    isValidLetter = (glyph) => this.validLetters.test(glyph)
    isValidGlyph = (glyph) => this.validGlyphs.test(glyph)
    isValidMatrixFieldValue = (glyph) => this.validMatrixFieldValues.test(glyph)
   
    // methods
    findStartEndPosition(array, glyph) {
        // can be used to check if there is just one instance of glyph present in the matrix
        const rowResults = [] 
        const position = []

        if(this.isValidGlyph(glyph)) {
            for(let i = 0; i<array.length; i++){
                const rowResult = array[i].filter(g => g === glyph)
                rowResults.push(rowResult.length)

                //if found, push the coordinates(position)
                if (rowResult.length === 1){
                    position.push(i, array[i].indexOf(glyph))

                } else if (rowResult > 1) {
                    // if there is multiple instances of glyph in the row, throw appropriate error
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

        // sum up rows
        const numberOfGlyphs = rowResults.reduce(
            (acc, currentValue) => acc + currentValue, 0
        )
        
        // there can be only one
        if(numberOfGlyphs === 1) {
            return position

        } else {

            if(glyph === glyphs.START){
                throw numberOfGlyphs === 0 
                    ? new Error(errorMessage.MISSING_START_GLYPH)
                    : new Error(errorMessage.MULTIPLE_START_GLYPHS + `${numberOfGlyphs}!`)

            } else if(glyph === glyphs.END){
                throw numberOfGlyphs === 0 
                    ? new Error(errorMessage.MISSING_END_GLYPH)
                    : new Error(errorMessage.MULTIPLE_END_GLYPHS + `${numberOfGlyphs}!`)

            } else {
                throw numberOfGlyphs === 0 
                    ? new Error(errorMessage.MISSING_UNIQUE_GLYPH + `You have been looking for ${glyph}!`)
                    : new Error(errorMessage.MULTIPLE_UNIQUE_GLYPHS + `${numberOfGlyphs}!`)
            }
        }
    }
    getNewPositionData(direction) { 

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
    isPathBroken(direction){
        // only direction pathfinder can go if the path is broken is back
        // checking accordingly
        switch(this.currentDirection) {
        case directions.UP:
            return direction === directions.DOWN
        case directions.DOWN:
            return direction === directions.UP
        case directions.RIGHT:
            return direction === directions.LEFT
        case directions.LEFT:
            return direction === directions.RIGHT
        }
    }
    removeUnnecessaryDirectionsOnTurns(directionsData) {
        const newDirectionsData = []
    
        switch(this.currentDirection) {
        case directions.UP:
        case directions.DOWN:
            newDirectionsData.push(...directionsData.filter(obj => obj.direction !== directions.UP && obj.direction !== directions.DOWN))
            return newDirectionsData

        case directions.RIGHT:
        case directions.LEFT:
            newDirectionsData.push(...directionsData.filter(obj => obj.direction !== directions.RIGHT && obj.direction !== directions.LEFT))
            return newDirectionsData
        }
    }
    setDirection() {
        const directionsData = []

        if (this.currentPosition[0] !== 0) {
            const glyphUp = this.getNewPositionData(directions.UP)
            this.isValidGlyph(glyphUp.glyph) && directionsData.push(glyphUp)
        }

        if(this.currentPosition[0] !== this.matrix.length-1) {
            const glyphDown = this.getNewPositionData(directions.DOWN)
            this.isValidGlyph(glyphDown.glyph) && directionsData.push(glyphDown)
        }

        if(this.currentPosition[1] !== this.matrix[this.currentPosition[0]].length-1) {
            const glyphRight = this.getNewPositionData(directions.RIGHT)
            this.isValidGlyph(glyphRight.glyph) && directionsData.push(glyphRight)
        }

        if (this.currentPosition[1] !== 0) {
            const glyphLeft = this.getNewPositionData(directions.LEFT)
            this.isValidGlyph(glyphLeft.glyph) && directionsData.push(glyphLeft)
        }

        if(directionsData.length === 1) {

            if (this.currentDirection !== directions.NONE ) {

                if(this.isPathBroken(directionsData[0].direction)) {
                    throw new Error(errorMessage.BROKEN_PATH)
                }
            }

            this.currentDirection = directionsData[0].direction
            return this.currentDirection

        } else if (directionsData.length > 1 && this.currentGlyph !== glyphs.TURN) {

            if(this.currentGlyph === glyphs.START){
                throw new Error(errorMessage.MISSPLACED_START_GLYPH)
            }

            const isSameDirectionAvailable = directionsData.some(obj => obj.direction === this.currentDirection)

            if (isSameDirectionAvailable) {
                return this.currentDirection
            } else {
                const newDirectionData = this.removeUnnecessaryDirectionsOnTurns(directionsData)
                this.currentDirection = newDirectionData[0].direction
                return this.currentDirection
            }

        } else if (this.currentGlyph === glyphs.TURN) {

            const newDirectionData = this.removeUnnecessaryDirectionsOnTurns(directionsData)

            if (newDirectionData.length > 1){
                throw new Error(errorMessage.FORK)
            } else if (newDirectionData.length === 0){ 
                throw new Error(errorMessage.FAKE_TURN)
            } else {
                this.currentDirection = newDirectionData[0].direction
                return this.currentDirection
            }
        }
    }
    getResult() {
        const finishedPath = this.path
        let path = []

        for(let i = 0; i < finishedPath.length; i++){
            path.push(this.matrix[finishedPath[i][0]][finishedPath[i][1]])
        }

        const letters = Array.from(new Set(this.letterCoordinates.map(JSON.stringify)), JSON.parse)
        let word = []
        
        for(let i = 0; i < letters.length; i++){
            word.push(this.matrix[letters[i][0]][letters[i][1]])
        }
        
        path = path.join('')
        word = word.join('')
        
        console.log({path, word})
        return {path, word}
    }
    getNextPosition() {
        
        /** more readable alternative
        
        const newDirection = this.setDirection()
        const newPositionData = this.getNewPositionData(newDirection)
        const { position } = newPositionData
        return position
        
        */

        return this.getNewPositionData(this.setDirection()).position
    }
    updateVariables(position) {

        const glyph = this.matrix[position[0]][position[1]]

        if(this.isValidGlyph(glyph)) {
            this.currentGlyph = glyph
            this.currentPosition = position
            this.path.push(position)
        
            if(this.isValidLetter(glyph)) {
                this.letterCoordinates.push(position)
            }

        } else {
            throw new Error(errorMessage.INVALID_GLYPH)
        }
    }
    walk(position) {
        this.updateVariables(position)

        if(this.currentGlyph === glyphs.END){
            return this.getResult()
        }
        
        return this.walk(this.getNextPosition())
    }
    findPath() {
        try {
            this.startPosition = this.findStartEndPosition(this.matrix, glyphs.START)
            // endPosition is just here to test if there is only one end glyph
            this.endPosition = this.findStartEndPosition(this.matrix, glyphs.END)

            return this.walk(this.startPosition)
        } catch (error) {
            
            // to show the messages on console while testing
            console.log(error.message)
            return error
        }
    }
}

module.exports = {
    Pathfinder
}