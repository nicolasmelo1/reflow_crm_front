import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import {
    TextContentOptionBoldButton,
    TextContentOptionItalicButton,
    TextContentOptionUnderlineButton,
    TextContentOptionCodeButton,
    TextContentOptionMarkerColorContainer,
    TextContentOptionMarkerColorActivationButton,
    TextContentOptionMarkerColorOptionsContainer,
    TextContentOptionMarkerColorOptionButton,
    TextContentOptionTextColorContainer,
    TextContentOptionTextColorActivationButton,
    TextContentOptionTextColorOptionsContainer,
    TextContentOptionTextColorOptionButton,
    TextContentOptionFontSizeContainer,
    TextContentOptionFontSizeButton
} from '../../../../styles/RichText'


/**
 * This block is the Toolbar options for the contents for the Text block.
 * 
 * In simple words: this holds everything you can change in the contents in the text block.
 * 
 * @param {Function} onOpenModal - On mobile we open a modal to show the color options we need to notify
 * the text block that this has happened.
 * @param {Function} onChangeSelectionState - Function that recieves 3 parameters: 
 * - A string saying what parameter you are changing from the content 
 * - True or false wheather this parameter recieves a boolean
 * - A color string if you are changing a color
 * - And a text size integer if you are changing the textSize
 * You usually change one parameter only, the others must be set to null. For exammple Bold is always true or false
 * because of that we send the first parameter will be 'bold', the second will be true, the third will be null and the last
 * will be null. This way i can change the contents as bold, underlined and so on.
 * @param {Object} stateOfSelection - Follows this structure:
 * {
 *      isBold: false,
 *      isItalic: false,
 *      isUnderline: false,
 *      isCode: false,
 *      isCustom: false,
 *      customValue: null,
 *      markerColor: '',
 *      textColor: '',
 *      textSize: 12
 * }
 */
const TextContentOptions = (props) => {
    const isMounted = React.useRef(false)
    const [isMarkerColorOptionOpen, setIsMarkerColorOptionOpen] = useState(false)
    const [isTextColorOptionOpen, setIsTextColorOptionOpen] = useState(false)

    const textColors = [
        '', 
        '#0dbf7e', 
        '#17242D', 
        '#bfbfbf', 
        '#444444', 
        '#ff5ac4', 
        '#ff158a', 
        '#bb3354', 
        '#7f5347',
        '#ff662e',
        '#ffcb00',
        '#cab641',
        '#9cd326',
        '#037f4b',
        '#0086c0',
        '#579cfc',
        '#66ccff'
    ]
    const markerColors = [
        '',
        '#0dbf7e50', 
        '#17242D50', 
        '#bfbfbf50', 
        '#44444450', 
        '#ff5ac450', 
        '#ff158a50', 
        '#bb335450', 
        '#7f534750',
        '#ff662e50',
        '#ffcb0050',
        '#cab64150',
        '#9cd32650',
        '#037f4b50',
        '#0086c050',
        '#579cfc50',
        '#66ccff50'
    ]
    // ------------------------------------------------------------------------------------------
    /**
     * This sets that the TextColor selection is open so the user can select the new color of the text.
     * 
     * @param {Boolean} isOpen - sets the state of the TextColor selection box.
     */
    const onChangeTextColorIsOpen = (isOpen) => {
        if (isOpen && isMarkerColorOptionOpen) {
            setIsMarkerColorOptionOpen(false)
            setIsTextColorOptionOpen(isOpen)
        } else {
            setIsTextColorOptionOpen(isOpen)
            if (props.onOpenModal) {
                props.onOpenModal(isOpen)
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This sets if the marker color options container is open or closed. If it's closed the user is not able to 
     * select colors on the rich text.
     * 
     * @param {Boolean} isOpen - sets the state of the MarkerColor selection box.
     */
    const onChangeMarkerColorIsOpen = (isOpen) => {
        if (isOpen && isTextColorOptionOpen) {
            setIsTextColorOptionOpen(false)
            setIsMarkerColorOptionOpen(isOpen)
        } else {
            setIsMarkerColorOptionOpen(isOpen)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * The maximum text size of the text is 400 pt. This function is fired when the user clicks the plus(+) icon
     * in to set the size of the text.
     */
    const onClickPlusFontSize = () => {
        if (props.stateOfSelection.textSize + 1 < 400) {
            props.onChangeSelectionState('textSize', null, '', parseInt(props.stateOfSelection.textSize) + 1)
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * The maximum text size of the text is 1 pt. This function is fired when the user clicks the minus(-) icon
     * in to set the size of the text.
     */
    const onClickMinusFontSize = () => {
        if (props.stateOfSelection.textSize - 1 > 1) {
            props.onChangeSelectionState('textSize', null, '', parseInt(props.stateOfSelection.textSize) - 1)
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])
    //########################################################################################//
    const renderMobile = () => {
        return (
            <View style={{flexDirection: 'row'}}>
                <TextContentOptionBoldButton 
                isBold={props.stateOfSelection.isBold}
                onPress={(e) => props.onChangeSelectionState('bold', !props.stateOfSelection.isBold, '')}
                >
                    <Text style={{color: props.stateOfSelection.isBold ? '#0dbf7e': '#17242D'}}>{'B'}</Text>
                </TextContentOptionBoldButton>
                <TextContentOptionItalicButton 
                isItalic={props.stateOfSelection.isItalic}
                onPress={(e) => props.onChangeSelectionState('italic', !props.stateOfSelection.isItalic, '')} 
                >
                    <Text style={{fontStyle: 'italic', color: props.stateOfSelection.isItalic ? '#0dbf7e': '#17242D'}}>{'I'}</Text>
                </TextContentOptionItalicButton>
                <TextContentOptionUnderlineButton
                isUnderline={props.stateOfSelection.isUnderline}
                onPress={(e) => props.onChangeSelectionState('underline', !props.stateOfSelection.isUnderline, '')}
                >
                    <Text style={{color: props.stateOfSelection.isUnderline ? '#0dbf7e': '#17242D'}}>{'U'}</Text>
                </TextContentOptionUnderlineButton>
                <TextContentOptionCodeButton
                isCode={props.stateOfSelection.isCode}
                onPress={(e) => props.onChangeSelectionState('code', !props.stateOfSelection.isCode, '')}
                >
                    <Text style={{color: props.stateOfSelection.isCode ? '#0dbf7e': '#17242D'}}>{'<>'}</Text>
                </TextContentOptionCodeButton>
                <TextContentOptionFontSizeContainer>
                    <TextContentOptionFontSizeButton
                    onPress={(e) => onClickMinusFontSize()}
                    >
                        <Text>{'-'}</Text>
                    </TextContentOptionFontSizeButton>
                        <Text>{props.stateOfSelection?.textSize ? `${props.stateOfSelection.textSize}pt` : '12pt'}</Text>
                    <TextContentOptionFontSizeButton
                    onPress={(e) => onClickPlusFontSize()}
                    >
                        <Text>{'+'}</Text>
                    </TextContentOptionFontSizeButton>
                </TextContentOptionFontSizeContainer>
                <TextContentOptionTextColorActivationButton
                onPress={(e) => onChangeTextColorIsOpen(!isTextColorOptionOpen)}
                textColor={props.stateOfSelection.textColor}
                >   
                    <Text style={{color: props.stateOfSelection.textColor && !['', null, undefined].includes(props.stateOfSelection.textColor) ? props.stateOfSelection.textColor : '#000'}}>{'A'}</Text>
                </TextContentOptionTextColorActivationButton>
                {isTextColorOptionOpen ? (
                    <TextContentOptionTextColorOptionsContainer transparent={true} animationType={'slide'}>
                        <SafeAreaView style={{height: '100%', backgroundColor: '#00000050', flexDirection: 'row'}}>
                            <View style={{height: '60%', alignSelf: 'flex-end', backgroundColor: '#fff', width: '100%', bottom: -100, paddingBottom: 100}}>
                                <TouchableOpacity onPress={(e) => {onChangeTextColorIsOpen(!isTextColorOptionOpen)}} style={{ alignSelf: 'flex-end', margin: 10}}>
                                    <Text>Cancelar</Text>
                                </TouchableOpacity>
                                <ScrollView keyboardShouldPersistTaps={'always'}>
                                    {textColors.map(textColor => (
                                        <TextContentOptionTextColorOptionButton 
                                        key={textColor}
                                        onPress={(e) => {
                                            onChangeTextColorIsOpen(!isTextColorOptionOpen)
                                            props.onChangeSelectionState('textColor', null, textColor)
                                        }}
                                        >
                                            <Text style={{color: textColor && !['', null, undefined].includes(textColor) ? textColor : '#000'}}>A</Text>
                                        </TextContentOptionTextColorOptionButton>
                                    ))}
                                </ScrollView>
                            </View>
                        </SafeAreaView>
                    </TextContentOptionTextColorOptionsContainer> 
                ) : null}
                <TextContentOptionMarkerColorActivationButton
                onPress={(e) => onChangeMarkerColorIsOpen(!isMarkerColorOptionOpen)}
                markerColor={props.stateOfSelection.markerColor}
                >   
                    <Text>{'A'}</Text>
                </TextContentOptionMarkerColorActivationButton>
                {isMarkerColorOptionOpen ? (
                    <TextContentOptionTextColorOptionsContainer transparent={true} animationType={'slide'}>
                        <SafeAreaView style={{height: '100%', backgroundColor: '#00000050', flexDirection: 'row'}}>
                            <View style={{height: '60%', alignSelf: 'flex-end', backgroundColor: '#fff', width: '100%', bottom: -100, paddingBottom: 100}}>
                                <TouchableOpacity onPress={(e) => {onChangeMarkerColorIsOpen(!isMarkerColorOptionOpen)}} style={{ alignSelf: 'flex-end', margin: 10}}>
                                    <Text>Cancelar</Text>
                                </TouchableOpacity>
                                <ScrollView keyboardShouldPersistTaps={'always'}>
                                    {markerColors.map(markerColor => (
                                        <TextContentOptionMarkerColorOptionButton 
                                        key={markerColor}
                                        onPress={(e) => {
                                            onChangeMarkerColorIsOpen(!isMarkerColorOptionOpen)
                                            props.onChangeSelectionState('markerColor', null, markerColor)
                                        }}
                                        markerColor={markerColor}
                                        >
                                            <Text>A</Text>
                                        </TextContentOptionMarkerColorOptionButton>
                                    ))}
                                </ScrollView>
                            </View>
                        </SafeAreaView>
                    </TextContentOptionTextColorOptionsContainer> 
                ) : null}
            </View>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <div>
                <TextContentOptionBoldButton 
                isBold={props.stateOfSelection.isBold}
                onClick={(e) => props.onChangeSelectionState('bold', !props.stateOfSelection.isBold, '')} 
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;}}
                >
                    B
                </TextContentOptionBoldButton>
                <TextContentOptionItalicButton 
                isItalic={props.stateOfSelection.isItalic}
                onClick={(e) => props.onChangeSelectionState('italic', !props.stateOfSelection.isItalic, '')} 
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
                >
                    I
                </TextContentOptionItalicButton>
                <TextContentOptionUnderlineButton
                isUnderline={props.stateOfSelection.isUnderline}
                onClick={(e) => props.onChangeSelectionState('underline', !props.stateOfSelection.isUnderline, '')} 
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
                >
                    U
                </TextContentOptionUnderlineButton>
                <TextContentOptionCodeButton
                isCode={props.stateOfSelection.isCode}
                onClick={(e) => props.onChangeSelectionState('code', !props.stateOfSelection.isCode, '')} 
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }}
                >
                    {'<>'}
                </TextContentOptionCodeButton>
                <TextContentOptionFontSizeContainer>
                    <TextContentOptionFontSizeButton
                    onClick={(e) => onClickMinusFontSize()}
                    >
                        {'-'}
                    </TextContentOptionFontSizeButton>
                        {props.stateOfSelection?.textSize ? `${props.stateOfSelection.textSize}pt` : ''}
                    <TextContentOptionFontSizeButton
                    onClick={(e) => onClickPlusFontSize()}
                    >
                        {'+'}
                    </TextContentOptionFontSizeButton>
                </TextContentOptionFontSizeContainer>
                <TextContentOptionTextColorContainer>
                    <TextContentOptionTextColorActivationButton
                    onClick={(e) => onChangeTextColorIsOpen(!isTextColorOptionOpen)}
                    textColor={props.stateOfSelection.textColor}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    >   
                    {'A'}
                    </TextContentOptionTextColorActivationButton>
                    {isTextColorOptionOpen ? (
                        <TextContentOptionTextColorOptionsContainer>
                            {textColors.map(textColor => (
                                <TextContentOptionTextColorOptionButton 
                                key={textColor}
                                onClick={(e) => {
                                    onChangeTextColorIsOpen(!isTextColorOptionOpen)
                                    props.onChangeSelectionState('textColor', null, textColor)
                                }}
                                textColor={textColor} 
                                >
                                    A
                                </TextContentOptionTextColorOptionButton>
                            ))}
                        </TextContentOptionTextColorOptionsContainer> 
                    ) : ''}
                </TextContentOptionTextColorContainer>
                <TextContentOptionMarkerColorContainer>
                    <TextContentOptionMarkerColorActivationButton
                    onClick={(e) => onChangeMarkerColorIsOpen(!isMarkerColorOptionOpen)}
                    markerColor={props.stateOfSelection.markerColor}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    >   
                        {'A'}
                    </TextContentOptionMarkerColorActivationButton>
                    {isMarkerColorOptionOpen ? (
                        <TextContentOptionMarkerColorOptionsContainer>
                            {markerColors.map(markerColor => (
                                    <TextContentOptionMarkerColorOptionButton 
                                    key={markerColor}
                                    onClick={(e) => {
                                        onChangeMarkerColorIsOpen(!isMarkerColorOptionOpen)
                                        props.onChangeSelectionState('markerColor', null, markerColor)
                                    }}
                                    markerColor={markerColor}
                                    >
                                        A
                                    </TextContentOptionMarkerColorOptionButton>
                                ))}
                        </TextContentOptionMarkerColorOptionsContainer> 
                    ) : ''}
                </TextContentOptionMarkerColorContainer>
            </div>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TextContentOptions