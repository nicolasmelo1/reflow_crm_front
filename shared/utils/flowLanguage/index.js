import * as lexer from './lexer'

import { buildParser } from 'lezer-generator'
import { LanguageSupport,LezerLanguage, foldNodeProp, foldInside, indentNodeProp, delimitedIndent } from "@codemirror/language"
import { HighlightStyle, styleTags, tags as t } from "@codemirror/highlight"
import { completeFromList } from "@codemirror/autocomplete"
import { EditorState, basicSetup } from "@codemirror/basic-setup"
import { EditorView, keymap } from "@codemirror/view"
import { defaultTabBinding } from "@codemirror/commands"


const flowLanguage = (context) => {
    // To understand this you might need to understand the codemirror parser
    // Example with explanation: https://codemirror.net/6/examples/lang-package/
    // A real language implementation: https://github.com/lezer-parser/javascript (go to src/javascript.grammar)
    // Lezer documentation: https://lezer.codemirror.net/ (i didn't read well enough when programming, i know that improvements can be made)
    let programGrammar = `
        @dialects { ref }

        @top Program { expression* }

        @skip { space }
        
        expression {
            FunctionCall |
            FunctionDeclaration |
            ModuleDeclaration |
            IfStatement |
            Block |
            Operators |
            Number |
            String |
            ReflowVariable | 
            VariableName |
            kw<"${context.nullKeyword}"> |
            kw<"${context.includeKeyword}"> |
            kw<"${context.inversionKeyword}"> |
            kw<"${context.conjunctionKeyword}"> |    
            kw<"${context.disjunctionKeyword}"> |    
            Boolean
        }

        Boolean {
            @specialize[@name=Boolean]<Identifier, "${context.booleanKeywords.true}" | "${context.booleanKeywords.false}">
        }
        
        ParameterDefinitionList { 
            "(" ParameterCommaSeparator<Parameter>? ")" 
        }
        ParameterCommaSeparator<expression> { 
            expression ("${context.positionalArgumentSeparator}" expression)* "${context.positionalArgumentSeparator}"?  
        }
        Parameter { 
            VariableName (kw<"="> expression)? 
        }

        Block {
            kw<"${context.blockKeywords.do}"> expression* kw<"${context.blockKeywords.end}">
        }
        
        ModuleDeclaration {
            kw<"${context.moduleKeyword}"> VariableDefinition
            ParameterDefinitionList?
        }

        FunctionDeclaration {
            kw<"${context.functionKeyword}"> VariableDefinition?
            ParameterDefinitionList
            Block
        }

        FunctionCall {
            VariableDefinition
            ParameterDefinitionList
        }

        ElseClause { kw<"${context.ifKeywords.else}"> (Block | IfStatement) }

        IfStatement {
            kw<"${context.ifKeywords.if}"> expression Block
            ElseClause?
        }

        VariableName { Identifier }
        VariableDefinition { Identifier }
        
        @tokens {

            CompareOperators { "<" | ">" | $[<>=!] "=" | "<>" }
            ArithimeticOperators { "\*" | "^" | "+" | "-" | "/" }

            Operators { (CompareOperators | ArithimeticOperators) }
            
            Number { (std.digit+ ("${context.decimalPointCharacter}" std.digit+)?) }
            
            ReflowVariable { "{{" ((std.asciiLetter|std.digit|"_")+)? "}}" } 

            IdentifierChar { std.asciiLetter | $[_\u{a1}-\u{10ffff}] }
            Word { IdentifierChar (std.digit | IdentifierChar)* }
            Identifier { Word }
            
            String { '"' (!["\\\\] | "\\\\" _)* '"' }

            space { $[ \t\n\r]+ }
                
            "(" ")"
        }

        // Keywords
        kw<term> { @specialize[@name={term}]<Identifier, term> }

        @detectDelim
    `    
    // buildParser is not documented, you can see here that lezer-generator exposes this function https://github.com/lezer-parser/lezer-generator/blob/master/src/index.ts
    // Similar to the grammar, the codemirror language implementation: https://github.com/codemirror/lang-javascript/blob/main/src/javascript.ts
    const parser = buildParser(programGrammar)
    
    let styles={
        Boolean: t.bool,
        String: t.string,
        Number: t.number,
        VariableName: t.variableName,
        VariableDefinition: t.definition(t.variableName),
        "FunctionDeclaration/VariableDefinition": t.function(t.definition(t.variableName)),
        "( )": t.paren,
        ReflowVariable: t.propertyName,
        Operators: t.operatorKeyword
    }

    const nullKeyword = `${context.nullKeyword}`
    styles[nullKeyword] = t.null

    const controlKeywords = `${context.ifKeywords.if} ${context.ifKeywords.else} ${context.blockKeywords.do} ${context.blockKeywords.end} ${context.conjunctionKeyword} ${context.disjunctionKeyword} ${context.inversionKeyword} ${context.includeKeyword}`
    styles[controlKeywords] = t.controlKeyword

    const definitionKeywords = `${context.functionKeyword} ${context.moduleKeyword}`
    styles[definitionKeywords] = t.definitionKeyword


    const parserWithMetadata = parser.configure({
        props: [
            styleTags(styles),
            indentNodeProp.add({
                Block: delimitedIndent({closing: context.blockKeywords.end}),
            }),
            foldNodeProp.add({
                "Block": foldInside
            }),
        ]
    })

    const indentOnInput = `/^\s*([\\}\\]\\)]|${context.blockKeywords.end})$/`

    const exampleLanguage = LezerLanguage.define({
        parser: parserWithMetadata,
        languageData: {
            closeBrackets: {brackets: ["(", "[", "{", "`", '"']},
            indentOnInput: new RegExp(indentOnInput),
        }
      })

    const exampleCompletion = exampleLanguage.data.of({
        autocomplete: completeFromList([
            {label: context.booleanKeywords.true, type: "constant"},
            {label: context.booleanKeywords.false, type: "constant"},
            {label: context.nullKeyword, type: "constant"},
            {label: "do end", type: "keyword"},
            {label: "if condition do \n    code_here\nend", type: "function"},
            {label: "function functionName() do \n    code_here\nend", type: "function"},
        ])
    })
    return new LanguageSupport(exampleLanguage, [exampleCompletion])
}

const editorStyle = () => {
    const editorViewReflowTheme = EditorView.theme({
        "&": {
          color: "white",
          backgroundColor: "#034"
        },
        ".cm-content": {
          caretColor: "#0e9"
        },
        "&.cm-focused": {
            outline: 'none !important',
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: "#0e9"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            outline: 'none',
              backgroundColor: "#074"
        },
        ".cm-gutters": {
          backgroundColor: "#045",
          color: "#ddd",
          border: "none"
        }
    }, {dark: true})

    const editorSyntaxHighlightTheme = HighlightStyle.define([
        {
            tag: t.operatorKeyword,
            color: '#1E90FF'
        },
        {
            tag: t.propertyName,
            color: '#ff7c7c'
        },
        {
            tag: t.controlKeyword,
            color: '#0dbf7e'
        },
        {
            tag: t.definitionKeyword,
            color: '#0dbf7e'
        },
        {
            tag: t.null,
            color: 'orange'
        },
        {
            tag: t.bool,
            color: '#eaa0ff'
        },
        {
            tag: t.string,
            color: '#bbffaf'
        },
        {
            tag: t.number,
            color: '#afb0ff'
        },
    ])

    return [editorViewReflowTheme, editorSyntaxHighlightTheme]
}


const initializeEditor = (parent, context, dispatchCallback=null, editorState={}) => {
    const flowLang = flowLanguage(context)
    const reflowTheme = editorStyle()
    const state = {
        extensions: [basicSetup, keymap.of([defaultTabBinding]), flowLang, reflowTheme],
        ...editorState
    }
    
    let editor = null
    if (dispatchCallback) {
        editor = new EditorView({
            state: EditorState.create(state),
            parent: parent,
            dispatch: dispatchCallback()
        })
    } else {
        editor = new EditorView({
            state: EditorState.create(state),
            parent: parent
        })
    }

    return editor
}

export { lexer, initializeEditor }