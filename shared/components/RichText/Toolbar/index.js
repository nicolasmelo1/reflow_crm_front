import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { strings } from '../../../utils/constants'
import Overlay from '../../../styles/Overlay'
import {
    ToolbarContainer,
    ToolbarFullContainer,
    ToolbarOptionsSeparator,
    ToolbarDefaultBlockOptionsButton
} from '../../../styles/RichText'

/**
 * This is the toolbar, for a nicer api we wanted that every toolbar should be defined in each block itself and not
 * on the rich text itself. With an API like this every block will be open to define its own custom toolbar when active.
 * 
 * @param {Boolean} isBlockActive - {go in detail about every prop it recieves}
 */
const Toolbar = (props) => {
    const toolbarRef = React.useRef(null)
    const [webToolbarWidth, setWebToolbarWidth] = useState(0)

    /**
     * Fired when the user resizes the window in web so we can make the toolbar shrink it's size.
     * 
     * @param {Object} e - The event object emmited by the browser
     */
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
                            {props.contentOptions ? (
                                <ToolbarOptionsSeparator/>

                            ) : null}
                            {props.blockOptions ? props.blockOptions : null}
                            {props.blockOptions ? (
                                <ToolbarOptionsSeparator/>
                            ) : null}
                            <div style={{ display: 'flex', flexDirection: 'row'}}>
                                <Overlay text={strings['pt-br']['richTextToolbarDuplicateBlockButtonOverlay']}>
                                    <ToolbarDefaultBlockOptionsButton onClick={(e) => props.onDuplicateBlock()}>
                                        <FontAwesomeIcon icon={'copy'}/>
                                    </ToolbarDefaultBlockOptionsButton>
                                </Overlay>
                                <Overlay text={strings['pt-br']['richTextToolbarDeleteBlockButtonOverlay']}>
                                    <ToolbarDefaultBlockOptionsButton onClick={(e) => props.onDeleteBlock()}>
                                        <FontAwesomeIcon icon={'trash'}/>
                                    </ToolbarDefaultBlockOptionsButton>
                                </Overlay>
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