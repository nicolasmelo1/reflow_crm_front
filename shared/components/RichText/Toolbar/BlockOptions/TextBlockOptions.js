import React from 'react'
import { View } from 'react-native'
import { 
    TextBlockOptionAlignmentButton,
    TextBlockOptionAlignmentButtonIcon
} from '../../../../styles/RichText'

/**
 * The toolbar for the text block, this just control the alignment position of the text inside of the block.
 * 
 * @param {BigInteger} alignmentTypeId - The id of the selected alignment type
 * @param {Function} onChangeAlignmentType - A function that recieves the alignmentTypeId as parameter and is used
 * to change the alignmentType selected
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 */
const TextBlockOptions = (props) => {
    const getIconFromAlignmentTypeName = (name) => {
        switch (name) {
            case 'left':
                return 'align-left'
            case 'center':
                return 'align-center'
            case 'right':
                return 'align-right'
        }
    }

    const renderMobile = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {props.types.rich_text.alignment_type.map(textAlignmentType => (
                    <TextBlockOptionAlignmentButton
                    key={textAlignmentType.id}
                    onPress={(e) => props.onChangeAlignmentType(textAlignmentType.id)}
                    >
                        <TextBlockOptionAlignmentButtonIcon
                        isSelected={props.alignmentTypeId === textAlignmentType.id}
                        icon={getIconFromAlignmentTypeName(textAlignmentType.name)}
                        />
                    </TextBlockOptionAlignmentButton>
                ))}
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {props.types.rich_text.alignment_type.map(textAlignmentType => (
                    <TextBlockOptionAlignmentButton
                    key={textAlignmentType.id}
                    onClick={(e) => props.onChangeAlignmentType(textAlignmentType.id)}
                    >
                        <TextBlockOptionAlignmentButtonIcon
                        isSelected={props.alignmentTypeId === textAlignmentType.id}
                        icon={getIconFromAlignmentTypeName(textAlignmentType.name)}
                        />
                    </TextBlockOptionAlignmentButton>
                ))}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TextBlockOptions