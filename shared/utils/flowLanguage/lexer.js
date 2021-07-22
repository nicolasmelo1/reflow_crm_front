const settings = {
    stringDelimiter: '"',
    validBraces: ['{', '}', '(', ')', '[', ']'],
    validNumberCharacters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    operationCharacters: ['>' ,'<', '=', '!', '/', '+', '*', '%', '-', '^', ':'],
    decimalPointCharacter: '.',
    positionalArgumentSeparator: ',',
    validCharactersForIdentityOrKeywords: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'ç','Ç', 'ã', 'Ã', '_', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ],
    blockKeywords: {
        do: 'do',
        end: 'end'
    },
    ifKeywords: {
        if: 'if',
        else: 'else'
    },
    booleanKeywords: {
        true: 'True',
        false: 'False'
    },
    nullKeyword: 'None',
    moduleKeyword: 'module',
    functionKeyword: 'function',
    conjunctionKeyword: 'and',
    disjunctionKeyword: 'or',
    inversionKeyword: 'not',
    includeKeyword: 'in'
}

const contextFactory = (decimalPointCharacter='.', positionalArgumentSeparator=',', blockKeywordsDo='do',blockKeywordsEnd='end',
                        ifKeywordsIf='if', ifKeywordsElse='else', booleanKeywordsTrue='True', booleanKeywordsFalse='False',
                        nullKeyword='None', moduleKeyword='module', functionKeyword='function', conjunctionKeyword='and',
                        disjunctionKeyword='or', inversionKeyword='not', includeKeyword='in') => {
    return {
        decimalPointCharacter: decimalPointCharacter,
        positionalArgumentSeparator: positionalArgumentSeparator,
        blockKeywords: {
            do: blockKeywordsDo,
            end: blockKeywordsEnd
        },
        ifKeywords: {
            if: ifKeywordsIf,
            else: ifKeywordsElse
        },
        booleanKeywords: {
            true: booleanKeywordsTrue,
            false: booleanKeywordsFalse
        },
        nullKeyword: nullKeyword,
        moduleKeyword: moduleKeyword,
        functionKeyword: functionKeyword,
        conjunctionKeyword: conjunctionKeyword,
        disjunctionKeyword: disjunctionKeyword,
        inversionKeyword: inversionKeyword,
        includeKeyword: includeKeyword
    }
}


/**
 * The idea is simple, this makes a lexical analysis in the code and translates it. We were going by a way in which we do this 
 * in the backend, but since it runs in the backend it can be quite cumbersome to manage. If we start running the code in the frontend
 * this might come handy, but right now the better idea will be to translate the code in the front-end to giv it back translated 
 * to the backend.
 * 
 * On the future we can translate the code directly on the backend but this is the better idea for now
 */
const lexerAndSubstitute = (expression, originalContext, contextToSubstitute) => {
    const defaultSettings = {
        ...settings,
        ...originalContext
    }

    expression = expression.split('')
    const newExpression = []
    let currentPosition = 0

    const advanceToNextPosition = (positionsToAdvance=1) => {
        currentPosition = currentPosition + positionsToAdvance
    }

    const peekNextCharacter = (numberOfCharactersToPeek=1) => {
        const position = currentPosition + numberOfCharactersToPeek
        if (position <= expression.length - 1) {
            return expression[position]
        } else {
            return null
        }
    }

    /**
     * Handles when the token is a string 
     */
    const handleString = () => {
        const string = []
        let counter = 1
        while (peekNextCharacter(counter) !== defaultSettings.stringDelimiter) {
            string.push(expression[currentPosition + counter])
            counter++
        }
        newExpression.push(`${defaultSettings.stringDelimiter}${string.join('')}${defaultSettings.stringDelimiter}`)
        advanceToNextPosition(counter + 1)
    }

    /**
     * Handles when the token is a number 
     */
    const handleNumber = () => {
        const number = []
        let counter = 0
        while (
            defaultSettings.validNumberCharacters.includes(peekNextCharacter(counter)) ||
            peekNextCharacter(counter) === defaultSettings.decimalPointCharacter
        ) {
            if (expression[currentPosition + counter] === defaultSettings.decimalPointCharacter) {
                number.push(contextToSubstitute.decimalPointCharacter)
            } else {
                number.push(expression[currentPosition + counter])
            }
            counter++
        }
        newExpression.push(number.join(''))
        advanceToNextPosition(counter)
    }

    /**
     * Handles when the token is a keyword, where most of the translation takes place 
     */
    const handleKeyword = () => {
        const keyword = []
        let counter = 0

        while (defaultSettings.validCharactersForIdentityOrKeywords.includes(peekNextCharacter(counter))) { 
            keyword.push(expression[currentPosition + counter])
            counter++
        }
        advanceToNextPosition(counter)
        const keywordString = keyword.join('')

        if (keywordString === defaultSettings.blockKeywords.do) {
            newExpression.push(contextToSubstitute.blockKeywords.do)
        } else if (keywordString === defaultSettings.blockKeywords.end) {
            newExpression.push(contextToSubstitute.blockKeywords.end)
        } else if (keywordString === defaultSettings.ifKeywords.if) {
            newExpression.push(contextToSubstitute.ifKeywords.if)
        } else if (keywordString === defaultSettings.ifKeywords.else) {
            newExpression.push(contextToSubstitute.ifKeywords.else)
        } else if (keywordString === defaultSettings.booleanKeywords.true) {
            newExpression.push(contextToSubstitute.booleanKeywords.true)
        } else if (keywordString === defaultSettings.booleanKeywords.false) {
            newExpression.push(contextToSubstitute.booleanKeywords.false)
        } else if (keywordString === defaultSettings.nullKeyword) {
            newExpression.push(contextToSubstitute.nullKeyword)
        } else if (keywordString === defaultSettings.moduleKeyword) {
            newExpression.push(contextToSubstitute.moduleKeyword)
        } else if (keywordString === defaultSettings.functionKeyword) {
            newExpression.push(contextToSubstitute.functionKeyword)
        } else if (keywordString === defaultSettings.conjunctionKeyword) {
            newExpression.push(contextToSubstitute.conjunctionKeyword)
        } else if (keywordString === defaultSettings.disjunctionKeyword) {
            newExpression.push(contextToSubstitute.disjunctionKeyword)
        } else if (keywordString === defaultSettings.inversionKeyword) {
            newExpression.push(contextToSubstitute.inversionKeyword)
        } else if (keywordString === defaultSettings.includeKeyword) {
            newExpression.push(contextToSubstitute.includeKeyword)
        } else {
            newExpression.push(keywordString)
        }
    }

    const handleOperation = () => {
        const currentCharacter = expression[currentPosition]
        // be aware, the ordering of the conditions here are extremely important.
        // first we get the conditions that match most characters, than the ones with least number of characters
        // if we had '===' we would add this condition at the top of all the other conditions.
        if (currentCharacter === '=' && peekNextCharacter() === '=') {
            advanceToNextPosition(2)
            newExpression.push('==')
        } else if (currentCharacter === '!' && peekNextCharacter() === '=') {
            advanceToNextPosition(2)
            newExpression.push('!=')
        } else if (currentCharacter === '<' && peekNextCharacter() === '=') {
            advanceToNextPosition(2)
            newExpression.push('<=')
        } else if (currentCharacter == '>' && peekNextCharacter() === '=') {
            advanceToNextPosition(2)
            newExpression.push('>=')
        } else if (currentCharacter == '=') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '+') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '-') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '*') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '/') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '^') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '%') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '<') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == '>') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        } else if (currentCharacter == ':') {
            advanceToNextPosition()
            newExpression.push(currentCharacter)
        }
    }

    while (currentPosition < expression.length) {
        if (expression[currentPosition] === defaultSettings.stringDelimiter) {
            handleString()
        } else if (defaultSettings.validNumberCharacters.includes(expression[currentPosition])) {
            handleNumber()
        } else if (defaultSettings.validCharactersForIdentityOrKeywords.includes(expression[currentPosition])) {
            handleKeyword()
        } else if (defaultSettings.operationCharacters.includes(expression[currentPosition])) {
            handleOperation()
        } else if (defaultSettings.validBraces.includes(expression[currentPosition])) {
            newExpression.push(expression[currentPosition])
            advanceToNextPosition()
        } else if (expression[currentPosition] === defaultSettings.positionalArgumentSeparator) {
            advanceToNextPosition()
            newExpression.push(contextToSubstitute.positionalArgumentSeparator)
        } else {
            newExpression.push(expression[currentPosition])
            advanceToNextPosition()
        }
    }
    return newExpression.join('')
}

/**
lexerAndSubstitute(
`
module Struct(a, b=3.0, c=5) 
module Teste(a, b)


struct = Struct{a=2, b=5, c=Teste{1, 2}}

struct.c = "Ola"

struct.c
`
)
*/
export {
    lexerAndSubstitute,
    contextFactory
}
