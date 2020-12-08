import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

const calculateLeft = (left) => {
    if (window.innerWidth - left < 200) {
        return left-215
    } else {
        return left
    }
}

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute; 
    background-color: #fff;
    display: flex;
    padding: 10px;
    flex-direction: column;
    width: 200px;
    top: ${props => `${props.top}px`};
    left: ${props => `${calculateLeft(props.left+10)}px`};
    border-radius: 5px;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
`
:
styled(View)``