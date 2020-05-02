import styled from 'styled-components'
import { Col } from 'react-bootstrap'
import React from 'react'


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

const getShadowOnHover = (props) => {
    if (props.isConditional) {
        return 'inset 2px 2px 1px #323232, inset -2px -2px 1px #565656;'
    } else {
        return 'inset 5px 5px 10px #b3b3b3, inset -5px -5px 10px #ffffff'
    }
}

export default styled(React.forwardRef(({isOpen, isConditional, ...rest}, ref) => <Col {...rest} ref={ref}/>))`
    color: ${props=> props.isConditional ? '#f2f2f2': '#17242D'};
    border-radius: 5px;
    margin: 10px 10px;
    box-shadow: ${props=> getShadow(props)};
    text-align: center;
    cursor: pointer;
    background-color: ${props=> props.isConditional ? '#fffff': 'transparent'};

    &:hover {
        background-color: ${props=> props.isConditional ? '#0f181e' : '#f2f2f2'};
    }
`