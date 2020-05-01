import styled from 'styled-components'
import { Col } from 'react-bootstrap'
import React from 'react'


const getShadow = (props) => {
    if (props.isOpen) {
        return 'inset 2px 2px 1px #949494, inset -2px -2px 1px #ffffff'
    } else if (props.isConditional) {
        return '2px 2px 1px #323232, -2px -2px 1px #565656;'
    } else {
        return '2px 2px 1px #0ba26b, -2px -2px 1px #0fdc91'
    }
}

const getShadowOnHover = (props) => {
    if (props.isConditional) {
        return 'inset 2px 2px 1px #323232, inset -2px -2px 1px #565656;'
    } else {
        return 'inset 2px 2px 1px #0ba26b, inset -2px -2px 1px #0fdc91'
    }
}

export default styled(React.forwardRef(({isOpen, isConditional, ...rest}, ref) => <Col {...rest} ref={ref}/>))`
    color: ${props=> props.isConditional && !props.isOpen ? '#f2f2f2': '#17242D'};
    border-radius: 5px;
    margin: 10px 10px;
    box-shadow: ${props=> getShadow(props)};
    text-align: center;
    cursor: pointer;
    background-color: ${props=> props.isOpen ? '#f2f2f2': 'transparent'};

    &:hover {
        box-shadow: ${props=> getShadowOnHover(props)};
    }
`