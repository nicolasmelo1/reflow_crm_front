import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, Modal } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(React.forwardRef(({isOpen, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    border: 0;
    min-height: calc(1.5em + .75rem + 2px - 8px);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    outline: none !important;

    &:after{
        content: "";
        clear: both;
    };

    @media(max-width: 420px) {
        z-index: 6;
        ${props => props.isOpen ? 'position: fixed;': ''}
        top: 0;
        left:0;
        width: 100%
    }
`
:
styled(React.forwardRef(({isOpen, ...rest}, ref) => {
    const Component = isOpen ? Modal : TouchableOpacity
    return ( <Component {...rest} ref={ref}/> )
}))`
    border: 0;
    z-index: 6;
    ${props => props.isOpen ? 'position: absolute;': ''}
    top: 0;
    left:0;
    width: 100%
`
