import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import dynamicImport from '../../../utils/dynamicImport'

const Col = dynamicImport('react-bootstrap', 'Col')

const getShadow = (props) => {
    if (props.isConditional) {
        if (props.isOpen) {
            return 'inset 5px 5px 10px #0f181e, inset -5px -5px 10px #1f303c'
        } else {
            return '5px 5px 10px #0f181e, -5px -5px 10px #1f303c'
        }
    } else {
        if (props.isOpen) {
            return 'inset 5px 5px 10px #b3b3b3, inset -5px -5px 10px #ffffff'
        } else {
            return '5px 5px 10px #b3b3b3, -5px -5px 10px #ffffff'
        }
    }
}

export default process.env['APP'] === 'web' && Col ? 
styled(React.forwardRef(({isOpen, isConditional, ...rest}, ref) => <Col {...rest} ref={ref}/>))`
    color: ${props=> props.isConditional ? '#fff': '#17242D'};
    border-radius: 5px;
    margin: 10px 10px;
    box-shadow: ${props=> getShadow(props)};
    text-align: center;
    cursor: pointer;
    background-color: ${props=> props.isConditional ? '#fffff': 'transparent'};

    &:hover {
        background-color: ${props=> props.isConditional ? '#0f181e' : '#fff'};
    }
`
:
styled(View)``