const { Pathfinder } = require('./')

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
test('Basic example', () => {
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    
    expect(result.word).toBe('ACB')
    expect(result.path).toBe('@---A---+|C|+---+|+-B-x')
})

test('Go straight through intersections', () => {
    const testMatrix = [
        [' ', ' ', '@'], 
        [' ', ' ', '|', ' ', '+', '-', 'C', '-', '-', '+'], 
        [' ', ' ', 'A', ' ', '|', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', '+', '-', '-', '-', 'B', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', 'x'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'D', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result.word).toBe('ABCD')
    expect(result.path).toBe('@|A+---B--+|+--C-+|-||+---D--+|x')
})

test('Glyphs may be found on turns', () => {
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'C']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result.word).toBe('ACB')
    expect(result.path).toBe('@---A---+|||C---+|+-B-x')
})

test('Do not collect a letter from the same location twice', () => {
    const testMatrix = [
        [' ', ' ', ' ', ' ', '+', '-', 'O', '-', 'N', '-', '+'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '+', '-', 'I', '-', '+'],
        ['@', '-', 'G', '-', 'O', '-', '+', ' ', '|', ' ', '|', ' ', '|'],
        [' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '+', '-', '+', ' ', 'E'],
        [' ', ' ', ' ', ' ', '+', '-', '+', ' ', ' ', ' ', ' ', ' ', 'S'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result.word).toBe('GOONIES')
    expect(result.path).toBe('@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x')
})

test('Keep direction, even in a compact space', () => {
    const testMatrix = [
        [' ', '+', '-', 'L', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result.word).toBe('BLAH')
    expect(result.path).toBe('@B+++B|+-L-+A+++A-+Hx')
})

test('Ignore stuff after end of path', () => {
    const testMatrix = [
        ['@', '-', 'A', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', '+', '-', 'B', '-', '-', 'x', '-', 'C', '-', '-', 'D']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result.word).toBe('AB')
    expect(result.path).toBe('@-A--+|+-B--x')
})

test('Illegal glyphs in the matrix', () => {
    const testMatrix = [
        [' ', '+', '-', 'ß', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result instanceof Error).toBe(true)
})

test('Missing start glyph', () => {
    const testMatrix = [
        [' ', ' ', ' ', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MISSING_START_GLYPH)
})

test('Missing end glyph', () => {
    const testMatrix = [
        [' ', '@', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MISSING_END_GLYPH)
})

test('Multiple start glyphs', () => {
    const testMatrix = [
        [' ', '@', '-', '-', 'A', '-', '@', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_START_GLYPHS + '2!')
})

test('Multiple end glyphs', () => {
    const testMatrix = [
        [' ', '@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['x', 'x', 'B', '-', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_END_GLYPHS+ '2!')
})

test('Broken path with multiple start glyphs', () => {
    const testMatrix = [
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x'], 
        [' ', ' ', ' ', ' ', ' ', ' ', '@', '-', 'B', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_START_GLYPHS + '2!')
})

test('Broken path', () => {
    const testMatrix = [
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '+', 'B', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.BROKEN_PATH)
})

test('Double paths, double everything', () => {
    const testMatrix = [
        [' ', '@', '-', '-', 'A', '-', '-', 'x'], 
        [' '], 
        ['x', '-', 'B', '-', '+'], 
        [' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '@']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_START_GLYPHS + '2!')
})

test('Double paths, single start and end glyph', () => {
    const testMatrix = [
        [' ', 'I', '-', '-', 'L', '-', '-', 'x'], 
        [' '], 
        ['A', '-', 'F', '-', '+'], 
        [' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '@']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.BROKEN_PATH)
})

test('Fork and two end glyphs', () => {
    const testMatrix = [
        [' ', ' ', ' ', ' ', ' ', 'x', '-', 'B'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', 'x', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_END_GLYPHS + '2!')
})

test('Fork and open ended second path', () => {
    const testMatrix = [
        [' ', ' ', ' ', ' ', ' ', ' ', '-', 'B'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', 'x', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.FORK)
})

test('Broken path', () => {
    const testMatrix = [
        ['@', '-', '-', 'A', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', '|'], 
        [' '], 
        [' ', ' ', ' ', ' ', ' ', 'B', '-', 'x']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.BROKEN_PATH)
})

test('Start glyph in the middle and two end glyphs', () => {
    const testMatrix = [
        ['x', '-', 'B', '-', '@', '-', 'A', '-', 'x']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_END_GLYPHS + '2!')
})


test('Start glyph in the middle', () => {
    const testMatrix = [
        ['x', '-', 'B', '-', '@', '-', 'A', '-', 'H']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MISSPLACED_START_GLYPH)
})

test('Fake turn', () => {
    const testMatrix = [
        ['@', '-', 'A', '-', '+', '-', 'B', '-', 'x']
    ] 

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.FAKE_TURN)
})

test('Keep direction, even in a compact space 2', () => {
    const testMatrix = [
        [' ', 'L', '-', '-', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result.word).toBe('BLAH')
    expect(result.path).toBe('@B+++B|L---+A+++A-+Hx')
})

test('Keep direction, even in a compact space 3', () => {
    const testMatrix = [
        [' ', 'A', 'H', 'x'],
        [' ', 'L'],
        ['@', 'B', '+'],
        [' ', '+', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findPath()

    expect(result.word).toBe('BLAH')
    expect(result.path).toBe('@B+++BLAHx')
})


test('Is provided glyph valid 1', () => {
    const testGlyph = 'A'
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidGlyph(testGlyph)

    expect(result).toBe(true)
})

test('Is provided glyph valid 2', () => {
    const testGlyph = '+'
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidGlyph(testGlyph)

    expect(result).toBe(true)
})

test('Is provided glyph valid 3', () => {
    const testGlyph = 'ß'
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidGlyph(testGlyph)

    expect(result).toBe(false)
})

test('Is provided glyph uppercase letter 1', () => {
    const testGlyph = '+'
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidLetter(testGlyph)

    expect(result).toBe(false)
})

test('Is provided glyph uppercase letter 2', () => {
    const testGlyph = 'C'
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidLetter(testGlyph)

    expect(result).toBe(true)
})

test('Is provided glyph uppercase letter 3', () => {
    const testGlyph = 'A'
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidLetter(testGlyph)

    expect(result).toBe(true)
})

test('Is provided glyph uppercase letter 4', () => {
    const testGlyph = 'c'
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidLetter(testGlyph)

    expect(result).toBe(false)
})

test('Is provided glyph valid matrix field value 1', () => {
    const testGlyph = ' '
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidMatrixFieldValue(testGlyph)

    expect(result).toBe(true)
})

test('Is provided glyph valid matrix field value 2', () => {
    const testGlyph = ''
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidMatrixFieldValue(testGlyph)

    expect(result).toBe(false)
})

test('Is provided glyph valid matrix field value 3', () => {
    const testGlyph = '='
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isValidMatrixFieldValue(testGlyph)

    expect(result).toBe(false)
})

test('Is starting glyph on the right coordinate', () => {
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findStartEndPosition(testMatrix, '@')

    expect(JSON.stringify(result)).toBe(JSON.stringify([0, 0]))
})

test('Is ending glyph on the right coordinate', () => {
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.findStartEndPosition(testMatrix, 'x')

    expect(JSON.stringify(result)).toBe(JSON.stringify([2, 0]))
})

test('Is there next position data available 1', () => {
    const currentPosition = [0,8]
    const direction = directions.DOWN
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.getNewPositionData(direction, currentPosition)
    const expectedResult = {
        position: [1,8],
        direction: directions.DOWN,
        glyph: glyphs.VERTICAL,
    }

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

test('Is there next position data available 2', () => {
    const currentPosition = [2,8]
    const direction = directions.DOWN
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.getNewPositionData(direction, currentPosition)
    const expectedResult = {
        position: [3,8],
        direction: directions.DOWN,
        glyph: glyphs.VERTICAL,
    }

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

test('Is there next position data available 3', () => {
    const currentPosition = [2,4]
    const direction = directions.LEFT
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.getNewPositionData(direction, currentPosition)
    const expectedResult = {
        position: [2,3],
        direction: directions.LEFT,
        glyph: glyphs.HORIZONTAL,
    }

    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

test('Is path broken 1', () => {
    // if path broken, only direction it can go is back,
    // which is always opposite  - LEFT and RIGHT, or UP and DOWN
    // matrix here doesn't matter as this is in place current data check,
    // not matrix-related check
    const currentDirection = directions.LEFT
    const direction = directions.RIGHT
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', ' ', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isPathBroken(direction, currentDirection)

    expect(result).toBe(true)
})

test('Is path broken 2', () => {
    // if path broken, only direction it can go is back,
    // which is always opposite  - LEFT and RIGHT, or UP and DOWN
    // matrix here doesn't matter as this is in place current data check,
    // not matrix-related check
    const currentDirection = directions.UP
    const direction = directions.DOWN
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', ' ', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isPathBroken(direction, currentDirection)

    expect(result).toBe(true)
})

test('Is path broken 2', () => {
    // if path broken, only direction it can go is back,
    // which is always opposite  - LEFT and RIGHT, or UP and DOWN
    // matrix here doesn't matter as this is in place current data check,
    // not matrix-related check
    const currentDirection = directions.DOWN
    const direction = directions.DOWN
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', ' ', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.isPathBroken(direction, currentDirection)

    expect(result).toBe(false)
})

test('Is there need to weed out unnecessary directions on turns 1', () => {
    const directionsData = [
        {
            position: [3,4],
            direction: directions.UP,
            glyph: glyphs.VERTICAL,
        },
        {
            osition: [4,5],
            direction: directions.LEFT,
            glyph: glyphs.HORIZONTAL,
        }
    ]
    const currentDirection = directions.LEFT
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.removeUnnecessaryDirectionsOnTurns(directionsData, currentDirection)
    const expectedResult = [{
        position: [3,4],
        direction: directions.UP,
        glyph: glyphs.VERTICAL,
    }]
    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

test('Is there need to weed out unnecessary directions on turns 2', () => {
    const directionsData = [
        {
            position: [3,8],
            direction: directions.DOWN,
            glyph: glyphs.VERTICAL,
        },
        {
            position: [4,7],
            direction: directions.LEFT,
            glyph: glyphs.HORIZONTAL,
        }
    ]
    const currentDirection = directions.DOWN
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.removeUnnecessaryDirectionsOnTurns(directionsData, currentDirection)
    const expectedResult = [{
        position: [4,7],
        direction: directions.LEFT,
        glyph: glyphs.HORIZONTAL,
    }]
    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

test('Is there new direction 1', () => {
    const currentPosition = [0,0]
    const currentDirection = directions.NONE
    const testMatrix = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.setDirection(currentPosition, currentDirection)
    const expectedResult = directions.RIGHT
    expect(result).toBe(expectedResult)
})

test('Is there a new direction 2', () => {
    const currentPosition = [0,0]
    const currentDirection = directions.NULL
    const testMatrix = [
        ['@', '-', 'A', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', '+', '-', 'B', '-', '-', 'C', '-', '-', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.setDirection(currentPosition, currentDirection)
    const expectedResult = directions.RIGHT
    expect(result).toBe(expectedResult)
})

test('Is there a new direction 3', () => {
    const currentPosition = [0,5]
    const currentDirection = directions.RIGHT
    const testMatrix = [
        [' ', '+', 'A', '-', '-', '+'], 
        [' ', '@', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', '+', '-', 'B', '-', '-', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.setDirection(currentPosition, currentDirection)
    const expectedResult = directions.DOWN
    expect(result).toBe(expectedResult)
})

test('Is there a new direction 4', () => {
    const currentPosition = [0,1]
    const currentDirection = directions.UP
    const testMatrix = [
        [' ', '+', '-', 'L', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.setDirection(currentPosition, currentDirection)
    const expectedResult = directions.RIGHT
    expect(result).toBe(expectedResult)
})

test('Is there next position after turn?', () => {
    const currentPosition = [0,1]
    const currentDirection = directions.UP
    const testMatrix = [
        [' ', '+', '-', 'L', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.getNextPosition(currentPosition, currentDirection)
    const expectedResult = [0,2]
    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

test('Is there next position after turn?', () => {
    const currentPosition = [0,1]
    const currentDirection = directions.UP
    const testMatrix = [
        [' ', '+', '-', 'L', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.getNextPosition(currentPosition, currentDirection)
    const expectedResult = [0,2]
    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

test('Is there result available?', () => {
    const pathCoordinates =     [
        [ 2, 0 ], [ 2, 1 ], [ 2, 2 ],
        [ 3, 2 ], [ 3, 1 ], [ 2, 1 ],
        [ 1, 1 ], [ 0, 1 ], [ 0, 2 ],
        [ 0, 3 ], [ 0, 4 ], [ 0, 5 ],
        [ 1, 5 ], [ 2, 5 ], [ 2, 4 ],
        [ 1, 4 ], [ 1, 5 ], [ 1, 6 ],
        [ 1, 7 ], [ 2, 7 ], [ 3, 7 ]
    ]
    const letterCoordinates = [ [ 2, 1 ], [ 2, 1 ], [ 0, 3 ], [ 1, 5 ], [ 1, 5 ], [ 2, 7 ] ]
    const testMatrix = [
        [' ', '+', '-', 'L', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix)
    const result = pathfinder.getResult(pathCoordinates, letterCoordinates)
    const expectedResult = { path: '@B+++B|+-L-+A+++A-+Hx', word: 'BLAH' }
    expect(JSON.stringify(result)).toBe(JSON.stringify(expectedResult))
})

