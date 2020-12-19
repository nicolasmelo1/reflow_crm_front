import React from 'react'
import { View } from 'react-native'
import {
    ContentOptionContainer,
    ContentOptionFullContainer
} from '../../../styles/RichText'
/**
 * {Description of your component, what does it do}
 * @param {Boolean} isBlockActive - {go in detail about every prop it recieves}
 */
const Options = (props) => {

    const renderMobile = () => {
        return (
            <ContentOptionFullContainer>
                <ContentOptionContainer horizontal={true} keyboardShouldPersistTaps={'always'}>
                {props.contentOptions ? props.contentOptions : null}
                    {props.contentOptions && props.blockOptions ? (
                        <View style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 0,
                            marginBottom: 0,
                            height: 40,
                            width: 2,
                            backgroundColor: '#f2f2f2'
                        }}/>
                    ) : null}
                    {props.blockOptions ? props.blockOptions : null}
                </ContentOptionContainer>
            </ContentOptionFullContainer>

        )
    }

    const renderWeb = () => {
        return (
            <ContentOptionFullContainer 
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
            </ContentOptionFullContainer>
        )
    }
    if (props.isBlockActive) {
        return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
    } else {
        return null
    }
}

export default Options