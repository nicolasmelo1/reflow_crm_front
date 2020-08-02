import React from 'react'
import styled from 'styled-components'
import { Text, View, processColor } from 'react-native'

const StyledCheckboxLabel = process.env['APP'] === 'web' ?
styled.label`
    margin: 0
`
:
styled(Text)``

const StyledCheckboxContainer = process.env['APP'] === 'web' ?
styled.div`
    background-color: #fff; 
    padding: 10px 5px
`
:
styled(View)``

/**
 * @param {function} onChange - the onChange function when the user clicks
 * @param {Boolean} checked - the checked data
 * @param {String} text - the text to show to the user in the label
 */
const CheckboxBox = (props) => {
    const renderMobile = () => (
        <View></View>
    )

    const renderWeb = () => (
        <StyledCheckboxContainer>
            <StyledCheckboxLabel>
                <input type="checkbox" checked={props.checked} onChange={e => {props.onChange()}}/>&nbsp;{props.text}
            </StyledCheckboxLabel>
        </StyledCheckboxContainer>
    )
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default CheckboxBox