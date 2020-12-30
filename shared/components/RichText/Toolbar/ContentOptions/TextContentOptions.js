import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import sleep from '../../../../utils/sleep'
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

let OverlayTrigger = null
if (process.env['APP'] === 'web') { 
    OverlayTrigger = require('react-bootstrap').OverlayTrigger
}

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TextContentOptions = (props) => {
    const isMounted = React.useRef(false)
    const isFontSizePlusIconPressedRef = React.useRef(false)
    const isFontSizeMinusIconPressedRef = React.useRef(false)
    const textSizeRef = React.useRef(0)
    const [textSize, _setTextSize] = useState(0)
    const [isMarkerColorOptionOpen, setIsMarkerColorOptionOpen] = useState(false)
    const [isTextColorOptionOpen, setIsTextColorOptionOpen] = useState(false)
    const setTextSize = (data) => {
        _setTextSize(data)
        textSizeRef.current = data
    }
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

    const onChangeMarkerColorIsOpen = (isOpen) => {
        if (isOpen && isTextColorOptionOpen) {
            setIsTextColorOptionOpen(false)
            setIsMarkerColorOptionOpen(isOpen)
        } else {
            setIsMarkerColorOptionOpen(isOpen)
        }
    }

    const onClickPlusFontSize = () => {
        if (props.stateOfSelection.textSize + 1 < 400) {
            props.onChangeSelectionState('textSize', null, '', parseInt(props.stateOfSelection.textSize) + 1)
        }
    }

    const onClickMinusFontSize = () => {
        if (props.stateOfSelection.textSize - 1 > 1) {
            props.onChangeSelectionState('textSize', null, '', parseInt(props.stateOfSelection.textSize) - 1)
        }
    }

    const onMouseDownPlusFontSize = () => {
        isFontSizePlusIconPressedRef.current = true
        setTextSize(parseInt(textSizeRef.current) + 1)
        setTimeout(async () => {
            while (isMounted.current && isFontSizePlusIconPressedRef.current) {
                await sleep(200)
                setTextSize(parseInt(textSizeRef.current) + 1)
            }
        }, 1500)
    }

    const onMouseUpPlusFontSize = () => {
        isFontSizePlusIconPressedRef.current = false
    }

    const onClickButtonsOnFontSize = () => {
        props.onChangeSelectionState('textSize', null, '', parseInt(textSizeRef.current))
    }

    const onMouseDownMinusFontSize = () => {
        isFontSizeMinusIconPressedRef.current = true
        setTextSize(textSizeRef.current - 1)
        setTimeout(async () => {
            let safeCounter = parseInt(textSizeRef.current) - 1
            while (isMounted.current && isFontSizeMinusIconPressedRef.current && safeCounter> 0) {
                await sleep(200)
                setTextSize(parseInt(textSizeRef.current) - 1)
                safeCounter--
            }
        }, 1500)
    }

    const onMouseUpMinusFontSize = () => {
        isFontSizeMinusIconPressedRef.current = false
    }

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        setTextSize(props.stateOfSelection.textSize)
    }, [props.stateOfSelection.textSize])


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
                        <Text>{textSize ? `${textSize}pt` : '12pt'}</Text>
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
                    onMouseDown={(e) => onMouseDownMinusFontSize()}
                    onClick={(e) => onClickButtonsOnFontSize()}
                    onMouseUp={(e) => onMouseUpMinusFontSize()}
                    >
                        {'-'}
                    </TextContentOptionFontSizeButton>
                        {textSize ? `${textSize}pt` : ''}
                    <TextContentOptionFontSizeButton
                    onMouseDown={(e) => onMouseDownPlusFontSize()}
                    onClick={(e) => onClickButtonsOnFontSize()}
                    onMouseUp={(e) => onMouseUpPlusFontSize()}
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

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TextContentOptions