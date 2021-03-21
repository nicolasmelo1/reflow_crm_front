import React, { useEffect } from 'react'
import { Modal, SafeAreaView, Text } from 'react-native'
import { types } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    BlockSelectorContainer,
    BlockSelectorButton,
    BlockSelectorIcon,
    BlockSelectorModalHeader,
    BlockSelectorModalGoBackButton
} from '../../styles/RichText'


/**
 * This component is the block selector. When the user types '/' in a text block at the very beginning we open 
 * this block. And this block is simply a container of buttons that is shown above of the richText, as a modal
 * on mobile or as an absolute positioned element on web.
 * 
 * This modal will have many buttons and each of those buttons will be a different block type to be selected. 
 * When the user clicks on one of those buttons, we change the type of the block. 
 * 
 * Besides the ref we also sends the following props
 * 
 * @param {Function} changeBlockType - Function responsible for handling when the user clicks on a blockType
 * @param {Array<Object>} blockOptions - Array of rich_text.block_type which are the each block type the user can select.
 * remember that this is filtered
 * @param {Function} setIsBlockSelectionOpen - To close the modal we need to use this function to change the state
 * in the block component.
 */
const BlockSelector = (props) => {
    const blockSelectorRef = React.useRef(null)
    // ------------------------------------------------------------------------------------------
    /**
     * Gets each icon to show next to the block label for each block type
     * 
     * @param {String} blockName - Each block has a name, it's not the name we show to the user
     * but instead the name we identify each block individually.
     * 
     * @returns {String} - Return the icon name to use
     */
    const iconByBlockName = (blockName) => {
        return {
            text: 'font',
            image: 'image',
            list: 'list',
            table: 'table',
        }[blockName]
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This is for closing the block selector container when the user clicks outside of the block selector.
     * 
     * @param {Object} e - The event object.
     */
    const onMouseDownWeb = (e) => {
        if (blockSelectorRef.current && !blockSelectorRef.current.contains(e.target)) {
            props.setIsBlockSelectionOpen(false)
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (process.env['APP'] === 'web') {
            document.addEventListener("mousedown", onMouseDownWeb)
        } 
        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener("mousedown", onMouseDownWeb)
            } 
        }
    }, [])
    //########################################################################################//
    const renderMobile = () => {
        return (
            <Modal animationType="slide">
                <SafeAreaView>
                    <BlockSelectorModalHeader>
                        <BlockSelectorModalGoBackButton onPress={(e) => props.setIsBlockSelectionOpen(false)}>
                            <FontAwesomeIcon icon={'times'} />
                        </BlockSelectorModalGoBackButton>
                    </BlockSelectorModalHeader>
                    <BlockSelectorContainer>
                        {props.blockOptions.map((blockOption, index) => (
                            <BlockSelectorButton 
                            key={index}
                            onPress={(e) => {props.changeBlockType(blockOption.id)}}
                            >
                                <BlockSelectorIcon size={ 24 } style={{color: '#0dbf7e'}} icon={iconByBlockName(blockOption.name)}/>
                                <Text style={{ color: '#17242D', fontSize: 24 }}>{' ' + types('pt-br', 'block_type', blockOption.name)}</Text>
                            </BlockSelectorButton>
                        ))}
                    </BlockSelectorContainer>
                </SafeAreaView>
            </Modal>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <BlockSelectorContainer ref={blockSelectorRef}>
                {props.blockOptions.map((blockOption, index) => (
                    <BlockSelectorButton 
                    key={index}
                    onClick={(e) => {props.changeBlockType(blockOption.id)}}
                    >
                        <BlockSelectorIcon icon={iconByBlockName(blockOption.name)}/>{' ' + types('pt-br', 'block_type', blockOption.name)}
                    </BlockSelectorButton>
                ))}
            </BlockSelectorContainer>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default BlockSelector