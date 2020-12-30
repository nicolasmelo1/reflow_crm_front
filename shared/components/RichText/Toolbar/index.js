import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    ToolbarContainer,
    ToolbarFullContainer,
    ToolbarOptionsSeparator,
    ToolbarDefaultBlockOptionsButton
} from '../../../styles/RichText'
/**
 * {Description of your component, what does it do}
 * @param {Boolean} isBlockActive - {go in detail about every prop it recieves}
 */
const Toolbar = (props) => {
    const toolbarRef = React.useRef(null)
    const [webToolbarWidth, setWebToolbarWidth] = useState(0)

    const onResizeRichTextWeb = (e) => {
        setWebToolbarWidth(toolbarRef.current.closest('.rich-text-container').offsetWidth)
    } 

    useEffect(() => {
        if (process.env['APP'] === 'web') { 
            setWebToolbarWidth(toolbarRef.current.closest('.rich-text-container').offsetWidth)
            window.addEventListener('resize', onResizeRichTextWeb)
        }
        return () => {
            if (process.env['APP'] === 'web') { 
                window.removeEventListener('resize', onResizeRichTextWeb)
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <ToolbarFullContainer>
                <ToolbarContainer horizontal={true} keyboardShouldPersistTaps={'always'}>
                {props.contentOptions ? props.contentOptions : null}
                    {props.contentOptions && props.blockOptions ? (
                        <ToolbarOptionsSeparator/>
                    ) : null}
                    {props.blockOptions ? props.blockOptions : null}
                </ToolbarContainer>
            </ToolbarFullContainer>

        )
    }

    const renderWeb = () => {
        return (
            <ToolbarFullContainer 
            width={webToolbarWidth}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }}
            >
                <div style={{position: 'relative'}}>
                    <ToolbarContainer ref={toolbarRef}>
                            {props.contentOptions ? props.contentOptions : null}
                            {props.contentOptions && props.blockOptions ? (
                                <ToolbarOptionsSeparator/>

                            ) : null}
                            {props.blockOptions ? props.blockOptions : null}
                            {props.contentOptions && props.blockOptions ? (
                                <ToolbarOptionsSeparator/>
                            ) : null}
                            <div style={{ display: 'flex', flexDirection: 'row'}}>
                                <ToolbarDefaultBlockOptionsButton onClick={(e) => props.onDuplicateBlock()}>
                                    <FontAwesomeIcon icon={'copy'}/>
                                </ToolbarDefaultBlockOptionsButton>
                                <ToolbarDefaultBlockOptionsButton onClick={(e) => props.onDeleteBlock()}>
                                    <FontAwesomeIcon icon={'trash'}/>
                                </ToolbarDefaultBlockOptionsButton>
                            </div>
                    </ToolbarContainer>
                </div>

            </ToolbarFullContainer>
        )
    }
    if (props.isBlockActive) {
        return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
    } else {
        return null
    }
}

export default Toolbar