import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { View } from 'react-native'
import { 
    TextBlockOptionAlignmentButton,
    TextBlockOptionAlignmentButtonIcon
} from '../../../../styles/RichText'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
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