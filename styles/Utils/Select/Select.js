import styled from 'styled-components'
import React from 'react'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <div {...rest} ref={ref}/>))`
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