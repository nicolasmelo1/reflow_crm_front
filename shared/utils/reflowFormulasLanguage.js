import { buildParser } from 'lezer-generator'
import { LanguageSupport,LezerLanguage, foldNodeProp, foldInside, indentNodeProp, delimitedIndent } from "@codemirror/language"
import { HighlightStyle, styleTags, tags as t } from "@codemirror/highlight"
import { completeFromList } from "@codemirror/autocomplete"
import { EditorState, basicSetup } from "@codemirror/basic-setup"
import { EditorView, keymap } from "@codemirror/view"
import { defaultTabBinding } from "@codemirror/commands"

const reflowLanguage = (context) => {
    // To understand this you might need to understand the codemirror parser
    // Example with explanation: https://codemirror.net/6/examples/lang-package/
    // A real language implementation: https://github.com/lezer-parser/javascript (go to src/javascript.grammar)
    // Lezer documentation: https://lezer.codemirror.net/ (i didn't read well enough when programming, i know that improvements can be made)
    let programGrammar = String.raw`
        @dialects { ref }

        @top Program { expression* }

        @skip { space }
        
        expression {
            FunctionCall |
            FunctionDeclaration |
            IfStatement |
            Block |
            Operators |
            Number |
            ReflowVariable | 
            String |
            VariableName |
            kw<"{{null}}"> |
            Boolean
        }

        Boolean {
            @specialize[@name=Boolean]<Identifier, "{{booleanTrue}}" | "{{booleanFalse}}">
        }
        
        ParameterDefinitionList { "(" ParameterCommaSeparator<Parameter>? ")" }
        ParameterCommaSeparator<expression> { expression ("{{positionalArgumentSeparator}}" expression)* "{{positionalArgumentSeparator}}"? }
        Parameter { VariableName (kw<"="> expression)? }

        Block {
            kw<"do"> expression* kw<"end">
        }

        FunctionDeclaration {
            kw<"function"> VariableDefinition
            ParameterDefinitionList
            Block
        }

        FunctionCall {
            VariableDefinition
            ParameterDefinitionList
        }

        ElseClause { kw<"else"> (Block | IfStatement)}

        IfStatement {
            kw<"if"> expression Block
            ElseClause?
        }

        VariableName { Identifier }
        VariableDefinition { Identifier }
        
        @tokens {

            CompareOperators { "<" | ">" | $[<>=!] "=" | "<>" }
            ArithimeticOperators { "\*" | "^" | "+" | "-" | "/" }

            Operators { (CompareOperators | ArithimeticOperators) }
            
            Number { {{numberFloat}} }

            ReflowVariable { '\{\{' (std.asciiLetter+|std.digit+)? '\}\}' } 

            IdentifierChar { std.asciiLetter | $[_\u{a1}-\u{10ffff}] }
            Word { IdentifierChar (std.digit | IdentifierChar)* }
            Identifier { Word }

            String { '"' (!["\\] | "\\" _)* '"' }
                
            space { $[ \t\n\r]+ }
                
            "(" ")"
        }

        // Keywords
        kw<term> { @specialize[@name={term}]<Identifier, term> }

        @detectDelim
    `
    programGrammar = programGrammar.replace('{{null}}', context.null)
    programGrammar = programGrammar.replace('{{booleanTrue}}', context.boolean.true)
    programGrammar = programGrammar.replace('{{booleanFalse}}', context.boolean.false)
    programGrammar = programGrammar.replace('{{numberFloat}}', context.number.float)
    programGrammar = programGrammar.replace('{{positionalArgumentSeparator}}', context.positionalArgumentSeparator)
    
    // buildParser is not documented, you can see here that lezer-generator exposes this function https://github.com/lezer-parser/lezer-generator/blob/master/src/index.ts
    // Similar to the grammar, the codemirror language implementation: https://github.com/codemirror/lang-javascript/blob/main/src/javascript.ts
    const parser = buildParser(programGrammar)

    const parserWithMetadata = parser.configure({
        props: [
            styleTags({
                Boolean: t.bool,
                None: t.null,
                String: t.string,
                Number: t.number,
                VariableName: t.variableName,
                VariableDefinition: t.definition(t.variableName),
                "FunctionDeclaration/VariableDefinition": t.function(t.definition(t.variableName)),
                "( )": t.paren,
                ReflowVariable: t.propertyName,
                "if else do end": t.controlKeyword,
                "function": t.definitionKeyword,
                Operators: t.operatorKeyword
            }),
            indentNodeProp.add({
                Block: delimitedIndent({closing: "end"}),
            }),
            foldNodeProp.add({
                "Block": foldInside
            }),
        ]
    })

    const exampleLanguage = LezerLanguage.define({
        parser: parserWithMetadata,
        languageData: {
            indentOnInput: /^\s*(do|end)$/,
        }
      })

    const exampleCompletion = exampleLanguage.data.of({
        autocomplete: completeFromList([
            {label: "False", type: "constant"},
            {label: "True", type: "constant"},
            {label: "None", type: "constant"},
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
    const reflowLang = reflowLanguage(context)
    const reflowTheme = editorStyle()
    const state = {
        extensions: [basicSetup, keymap.of([defaultTabBinding]), reflowLang, reflowTheme],
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

export default initializeEditor