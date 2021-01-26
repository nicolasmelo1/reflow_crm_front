import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

const getButtonParams = (typeOfButton) => {
    if (typeOfButton.isTop || typeOfButton.isBottom) {
        const params = `
            cursor: row-resize !important;
            height: 2px;
            width: 100%;
            left: 0;
        `
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
        const params = `
            cursor: col-resize !important;
            bottom: 0;
            top: 0;
            width: 2px;
        `
        if (typeOfButton?.isRight) {
            return params + `right: 0;`
        } else {
            return params + `left: 0;`
        }
    }
}

export default process.env['APP'] === 'web' ?
styled.button`
    position: absolute;
    background-color: transparent;
    ${props => getButtonParams(props.buttonType)}
    padding: 0;
    border: 0
`
:
styled(View)``