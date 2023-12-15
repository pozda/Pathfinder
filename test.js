const { Pathfinder } = require('./')

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
    const testMatrix01 = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix01)
    const result = pathfinder.findPath()
    
    expect(result.word).toBe('ACB')
    expect(result.path).toBe('@---A---+|C|+---+|+-B-x')
})

test('Go straight through intersections', () => {
    const testMatrix02 = [
        [' ', ' ', '@'], 
        [' ', ' ', '|', ' ', '+', '-', 'C', '-', '-', '+'], 
        [' ', ' ', 'A', ' ', '|', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', '+', '-', '-', '-', 'B', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', 'x'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'D', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix02)
    const result = pathfinder.findPath()

    expect(result.word).toBe('ABCD')
    expect(result.path).toBe('@|A+---B--+|+--C-+|-||+---D--+|x')
})

test('Glyphs may be found on turns', () => {
    const testMatrix03 = [
        ['@', '-', '-', '-', 'A', '-', '-', '-', '+', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', 'C']
    ]
    const pathfinder = new Pathfinder(testMatrix03)
    const result = pathfinder.findPath()

    expect(result.word).toBe('ACB')
    expect(result.path).toBe('@---A---+|||C---+|+-B-x')
})

test('Do not collect a letter from the same location twice', () => {
    const testMatrix04 = [
        [' ', ' ', ' ', ' ', '+', '-', 'O', '-', 'N', '-', '+'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '+', '-', 'I', '-', '+'],
        ['@', '-', 'G', '-', 'O', '-', '+', ' ', '|', ' ', '|', ' ', '|'],
        [' ', ' ', ' ', ' ', '|', ' ', '|', ' ', '+', '-', '+', ' ', 'E'],
        [' ', ' ', ' ', ' ', '+', '-', '+', ' ', ' ', ' ', ' ', ' ', 'S'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x']
    ]
    const pathfinder = new Pathfinder(testMatrix04)
    const result = pathfinder.findPath()

    expect(result.word).toBe('GOONIES')
    expect(result.path).toBe('@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x')
})

test('Keep direction, even in a compact space', () => {
    const testMatrix05 = [
        [' ', '+', '-', 'L', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]
    const pathfinder = new Pathfinder(testMatrix05)
    const result = pathfinder.findPath()

    expect(result.word).toBe('BLAH')
    expect(result.path).toBe('@B+++B|+-L-+A+++A-+Hx')
})

test('Ignore stuff after end of path', () => {
    const testMatrix06 = [
        ['@', '-', 'A', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', '+', '-', 'B', '-', '-', 'x', '-', 'C', '-', '-', 'D']
    ]
    const pathfinder = new Pathfinder(testMatrix06)
    const result = pathfinder.findPath()

    expect(result.word).toBe('AB')
    expect(result.path).toBe('@-A--+|+-B--x')
})

test('Illegal glyphs in the matrix', () => {
    const testMatrix07 = [
        [' ', '+', '-', 'ß', '-', '+'],
        [' ', '|', ' ', ' ', '+', 'A', '-', '+'],
        ['@', 'B', '+', ' ', '+', '+', ' ', 'H'],
        [' ', '+', '+', ' ', ' ', ' ', ' ', 'x']
    ]

    const pathfinder = new Pathfinder(testMatrix07)
    const result = pathfinder.findPath()

    expect(result instanceof Error).toBe(true)
})

test('Missing start glyph', () => {
    const testMatrix08 = [
        [' ', ' ', ' ', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix08)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MISSING_START_GLYPH)
})

test('Missing end glyph', () => {
    const testMatrix09 = [
        [' ', '@', '-', '-', 'A', '-', '-', '-', '+'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'],
        [' ', ' ', 'B', '-', '+', ' ', ' ', ' ', 'C'],
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'],
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ]
    const pathfinder = new Pathfinder(testMatrix09)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MISSING_END_GLYPH)
})

test('Multiple start glyphs', () => {
    const testMatrix10 = [
        [' ', '@', '-', '-', 'A', '-', '@', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['x', '-', 'B', '-', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix10)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_START_GLYPHS + '2!')
})

test('Multiple end glyphs', () => {
    const testMatrix11 = [
        [' ', '@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['x', 'x', 'B', '-', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix11)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_END_GLYPHS+ '2!')
})

test('Broken path with multiple start glyphs', () => {
    const testMatrix12 = [
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x'], 
        [' ', ' ', ' ', ' ', ' ', ' ', '@', '-', 'B', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix12)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_START_GLYPHS + '2!')
})

test('Broken path', () => {
    const testMatrix13 = [
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ', 'C'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '+', 'B', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix13)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.BROKEN_PATH)
})

test('Double paths, double everything', () => {
    const testMatrix14 = [
        [' ', '@', '-', '-', 'A', '-', '-', 'x'], 
        [' '], 
        ['x', '-', 'B', '-', '+'], 
        [' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '@']
    ] 

    const pathfinder = new Pathfinder(testMatrix14)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_START_GLYPHS + '2!')
})

test('Double paths, single start and end glyph', () => {
    const testMatrix15 = [
        [' ', 'I', '-', '-', 'L', '-', '-', 'x'], 
        [' '], 
        ['A', '-', 'F', '-', '+'], 
        [' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', ' ', '@']
    ] 

    const pathfinder = new Pathfinder(testMatrix15)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.BROKEN_PATH)
})

test('Fork and two end glyphs', () => {
    const testMatrix16 = [
        [' ', ' ', ' ', ' ', ' ', 'x', '-', 'B'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', 'x', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix16)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_END_GLYPHS + '2!')
})

test('Fork and open ended second path', () => {
    const testMatrix17 = [
        [' ', ' ', ' ', ' ', ' ', ' ', '-', 'B'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        ['@', '-', '-', 'A', '-', '-', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', '|'], 
        [' ', ' ', 'x', '+', ' ', ' ', ' ', 'C'], 
        [' ', ' ', ' ', '|', ' ', ' ', ' ', '|'], 
        [' ', ' ', ' ', '+', '-', '-', '-', '+']
    ] 

    const pathfinder = new Pathfinder(testMatrix17)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.FORK)
})

test('Broken path', () => {
    const testMatrix18 = [
        ['@', '-', '-', 'A', '-', '+'], 
        [' ', ' ', ' ', ' ', ' ', '|'], 
        [' '], 
        [' ', ' ', ' ', ' ', ' ', 'B', '-', 'x']
    ] 

    const pathfinder = new Pathfinder(testMatrix18)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.BROKEN_PATH)
})

test('Start glyph in the middle and two end glyphs', () => {
    const testMatrix19 = [
        ['x', '-', 'B', '-', '@', '-', 'A', '-', 'x']
    ] 

    const pathfinder = new Pathfinder(testMatrix19)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MULTIPLE_END_GLYPHS + '2!')
})


test('Start glyph in the middle', () => {
    const testMatrix20 = [
        ['x', '-', 'B', '-', '@', '-', 'A', '-', 'H']
    ] 

    const pathfinder = new Pathfinder(testMatrix20)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.MISSPLACED_START_GLYPH)
})

test('Fake turn', () => {
    const testMatrix21 = [
        ['@', '-', 'A', '-', '+', '-', 'B', '-', 'x']
    ] 

    const pathfinder = new Pathfinder(testMatrix21)
    const result = pathfinder.findPath()
    expect(result instanceof Error).toBe(true)
    expect(result.message).toBe(errorMessage.FAKE_TURN)
})