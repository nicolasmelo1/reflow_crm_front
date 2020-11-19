import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
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

    const onMouseDownPlusFontSize = () => {
        isFontSizePlusIconPressedRef.current = true
        setTextSize(textSizeRef.current + 1)
        setTimeout(async () => {
            while (isMounted.current && isFontSizePlusIconPressedRef.current) {
                await sleep(200)
                setTextSize(textSizeRef.current + 1)
            }
        }, 1500)
    }

    const onMouseUpPlusFontSize = () => {
        isFontSizePlusIconPressedRef.current = false
    }

    const onClickButtonsOnFontSize = () => {
        props.onChangeSelectionState('textSize', null, '', textSizeRef.current)
    }

    const onMouseDownMinusFontSize = () => {
        isFontSizeMinusIconPressedRef.current = true
        setTextSize(textSizeRef.current - 1)
        setTimeout(async () => {
            let safeCounter = textSizeRef.current - 1
            while (isMounted.current && isFontSizeMinusIconPressedRef.current && safeCounter> 0) {
                await sleep(200)
                setTextSize(textSizeRef.current - 1)
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
            <View></View>
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
                        {`${textSize}pt`}
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