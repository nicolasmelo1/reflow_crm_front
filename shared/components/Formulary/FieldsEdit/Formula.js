import React, { useEffect } from 'react'
import { View } from 'react-native'
import { strings } from '../../../utils/constants'
import { FormulariesEdit } from '../../../styles/Formulary'
import initializeEditor from '../../../utils/reflowFormulasLanguage'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Formula = (props) => {
    const textEditorRef = React.useRef()
    const editorRef = React.useRef()

    const dispatch = () => {
        return (transaction) => {
            editorRef.current.update([transaction])
        } 
    }

    useEffect(() => {
        const context = {
			boolean: {
				true: 'True',
				false: 'False'
			},
			number: {
				float: '(std.digit+ ("," std.digit+)?) '
			},
			null: 'None',
			positionalArgumentSeparator: ';'
		} 
        if (!editorRef.current) {
			editorRef.current = initializeEditor(textEditorRef.current, context)
		} else {
			editorRef.current = initializeEditor(textEditorRef.current, context, {doc: editorRef.current.state.doc.text.join('')}) 
		}
    }, [])
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                Formula
                <button onClick={(e) => logState()}>Log state</button>
                <div ref={textEditorRef}></div>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Formula