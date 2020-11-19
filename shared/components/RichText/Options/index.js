import React from 'react'
import { View } from 'react-native'
import {
    ContentOptionContainer
} from '../../../styles/RichText'
/**
 * {Description of your component, what does it do}
 * @param {Boolean} isBlockActive - {go in detail about every prop it recieves}
 */
const Options = (props) => {

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div 
            style={{ position: 'absolute', top: 0, left:0, width: '100%', marginTop: '0px'}}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }}
            >
                <ContentOptionContainer>
                    {props.contentOptions ? props.contentOptions : null}
                    {props.contentOptions && props.blockOptions ? (
                        <div style={{
                            margin: '0 10px',
                            height: '20px',
                            width: '2px',
                            backgroundColor: '#f2f2f2'
                        }}/>
                    ) : null}
                    {props.blockOptions ? props.blockOptions : null}
                </ContentOptionContainer>
            </div>
        )
    }
    if (props.isBlockActive) {
        return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
    } else {
        return null
    }
}

export default Options