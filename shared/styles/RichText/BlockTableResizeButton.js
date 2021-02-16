import React from 'react'
import styled from 'styled-components'
import { Pressable } from 'react-native'

const getButtonParams = (typeOfButton) => {
    let params = ``
    if (typeOfButton.isTop || typeOfButton.isBottom) {
        if (process.env['APP'] === 'web') {
            params = `
                cursor: row-resize !important;
                height: 2px;
                width: 100%;
                left: 0;
            `
        } else {
            params = `
                height: 13px;
                left: 0;
                right: 0;
            `
        }
        if (typeOfButton?.isTop) {
            return params + `
                top: 0;
            `
        } else {
            return params + `
                bottom: 0;
            `
        }
    } else {
        if (process.env['APP'] === 'web') {
            params = `
                cursor: col-resize !important;
                bottom: 0;
                top: 0;
                width: 2px;
            `
        } else {
            params = `
                width: 13px;
                bottom: 0;
                top: 0;
            `
        }
        if (typeOfButton?.isRight) {
            return params + `
                right: 0;
            `
        } else {
            return params + `
                left: 0;
            `
        }
    }
}

const StyledPressable = (props) => {
    return <Pressable {...props} style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? '#0dbf7e'
            : 'transparent'
        },
        props.style[0]
      ]}/>
}

export default process.env['APP'] === 'web' ?
styled.button`
    position: absolute;
    ${props => getButtonParams(props.buttonType)}
    padding: 0;
    border: 0;
    background-color: transparent;

    &:hover {
        background-color: #17242D;
    }
`
:
styled(StyledPressable)`
    position: absolute;
    ${props => getButtonParams(props.buttonType)}
`