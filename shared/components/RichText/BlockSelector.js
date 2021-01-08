import React from 'react'
import { View } from 'react-native'
import { types } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    BlockSelectorContainer,
    BlockSelectorButton,
    BlockSelectorIcon
} from '../../styles/RichText'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const BlockSelector = React.forwardRef((props, ref) => {
    const iconByBlockName = (blockName) => {
        return {
            text: 'font',
            image: 'image',
            list: 'list',
            table: 'table',
        }[blockName]
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <BlockSelectorContainer ref={ref}>
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

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
})

export default BlockSelector