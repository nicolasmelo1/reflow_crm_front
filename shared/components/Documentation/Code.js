import React, { useEffect } from 'react'
import initializeCodeEditor from '../../utils/codeEditor'


/**
 * This renders a CodeMirror text editor for the documentations
 */
const Code = (props) => {
    const editorRef = React.useRef()
    const textEditorRef = React.useRef()

    useEffect(() => { 
        editorRef.current = initializeCodeEditor({
            languagePack: props.languagePack, 
            parent:textEditorRef.current, 
            code: props.code,
            editable: false
        })

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy()
            }
        }
    }, [])

    useEffect(() => { 
        if (editorRef.current) {
            editorRef.current.destroy()
        }
        editorRef.current = initializeCodeEditor({
            languagePack: props.languagePack, 
            parent:textEditorRef.current, 
            code: props.code,
            removeLineCounter: true,
            editable: true
        })
    }, [props.code])

    return(
        <div 
        ref={textEditorRef}
        />
    )
}

export default Code