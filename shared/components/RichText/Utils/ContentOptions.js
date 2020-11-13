import React, {useState} from 'react'
import { View } from 'react-native'
import {
    ContentOptionBoldButton,
    ContentOptionItalicButton,
    ContentOptionUnderlineButton,
    ContentOptionCodeButton,
    ContentOptionContainer
} from '../../../styles/RichText'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const ContentOptions = (props) => {
    const [isMarkerColorOptionOpen, setIsMarkerColorOptionOpen] = useState(false)
    const [isTextColorOptionOpen, setIsTextColorOptionOpen] = useState(false)
    const textColors = [
        '#000000', 
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
        '#ffffff',
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
    
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div style={{ position: 'absolute', top: 0, left:0, width: '100%'}}>
                <ContentOptionContainer>
                    <ContentOptionBoldButton 
                    isBold={props.stateOfSelection.isBold}
                    onClick={(e) => props.onChangeSelectionState('bold', !props.stateOfSelection.isBold)} 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;}}
                    >
                        B
                    </ContentOptionBoldButton>
                    <ContentOptionItalicButton 
                    isItalic={props.stateOfSelection.isItalic}
                    onClick={(e) => props.onChangeSelectionState('italic', !props.stateOfSelection.isItalic)} 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    >
                        I
                    </ContentOptionItalicButton>
                    <ContentOptionUnderlineButton
                    isUnderline={props.stateOfSelection.isUnderline}
                    onClick={(e) => props.onChangeSelectionState('underline', !props.stateOfSelection.isUnderline)} 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    >
                        U
                    </ContentOptionUnderlineButton>
                    <ContentOptionCodeButton
                    isCode={props.stateOfSelection.isCode}
                    onClick={(e) => props.onChangeSelectionState('code', !props.stateOfSelection.isCode)} 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    >
                        {'<>'}
                    </ContentOptionCodeButton>
                    <button
                    onClick={(e) => setIsTextColorOptionOpen(!isTextColorOptionOpen)}
                    style={{color: '#000', border: 0, backgroundColor: 'white'}}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    >   
                        {'A'}
                        {isTextColorOptionOpen ? (
                            <div 
                            style={{
                                position: 'absolute', 
                                display: 'flex', 
                                flexWrap: 'wrap',
                                borderRadius: '5px', 
                                border:'1px solid #f2f2f2', 
                                backgroundColor: 'white', 
                                maxWidth: 'calc(var(--app-width) - 150px)'
                            }}>
                               {textColors.map(textColor => (
                                    <button value={textColor} style={{color: textColor, border: 0, backgroundColor: 'transparent', padding: '3px 10px'}}>
                                        A
                                    </button>
                                ))}
                           </div> 
                        ) : ''}
                    </button>
                    <button
                    onClick={(e) => setIsMarkerColorOptionOpen(!isMarkerColorOptionOpen)}
                    style={{color: '#000', border: 0, backgroundColor: 'white', border: '1px solid #bfbfbf', borderRadius: '5px'}}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }}
                    >   
                        {'A'}
                        {isMarkerColorOptionOpen ? (
                            <div 
                            style={{
                                position: 'absolute', 
                                display: 'flex', 
                                flexWrap: 'wrap',
                                borderRadius: '5px', 
                                border:'1px solid #f2f2f2', 
                                backgroundColor: 'white', 
                                maxWidth: 'calc(var(--app-width) - 150px)'
                            }}>
                               {markerColors.map(markerColor => (
                                    <button value={markerColor} style={{border: 0, backgroundColor: markerColor, padding: '3px 10px', borderRadius: '5px', margin: 3}}>
                                        A
                                    </button>
                                ))}
                           </div> 
                        ) : ''}
                    </button>
                </ContentOptionContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ContentOptions