import React from 'react'
import { View } from 'react-native'
import Content from '../Content'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Text = (props) => {



    const onChangeText = (index, text) => {
        
        let contents = props.block.rich_text_block_contents

        
        if (text === '') {
            contents.splice(index, 1)
            let newContents = []
            for (let i =0; i<contents.length-1; i++) {
                if (contents[i].is_bold === contents[i+1].is_bold && 
                    contents[i].is_italic === contents[i+1].is_italic &&
                    contents[i].is_code === contents[i+1].is_code && 
                    contents[i].is_underline === contents[i+1].is_underline && 
                    contents[i].marker_color === contents[i+1].marker_color &&
                    contents[i].text_color === contents[i+1].text_color) {

                    newContents.push(props.createNewContent({
                        isBold: contents[i].is_bold, 
                        isCode: contents[i].is_code, 
                        isItalic: contents[i].is_italic, 
                        isUnderline: contents[i].is_underline, 
                        latexEquation: contents[i].latex_equation, 
                        link: contents[i].link, 
                        markerColor: contents[i].marker_color, 
                        order: newContents.length+1, 
                        textColor: contents[i].text_color,
                        text: contents[i].text + contents[i+1].text
                    }))
                } else {
                    newContents.push(props.createNewContent({
                        isBold: contents[i].is_bold, 
                        isCode: contents[i].is_code, 
                        isItalic: contents[i].is_italic, 
                        isUnderline: contents[i].is_underline, 
                        latexEquation: contents[i].latex_equation, 
                        link: contents[i].link, 
                        markerColor: contents[i].marker_color, 
                        order: newContents.length+1, 
                        textColor: contents[i].text_color,
                        text: contents[i].text
                    }))
                }
            }
            console.log(newContents)
            //while props.block.rich_text_block_contents
        }
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {props.block.rich_text_block_contents.map((content, index) => (
                    <Content key={index} content={content} onChange={(text) => onChangeText(index, text)}/>
                ))}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Text