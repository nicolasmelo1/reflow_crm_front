import styled from 'styled-components'
import React from 'react'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    border: 0;
    background-color: white;
    color: #444;
    border: 1px solid ${props=>props.isOpen ? '#444': '#0dbf7e'};
    min-height: calc(1.5em + .75rem + 2px - 8px);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    caret-color: #444;
    border-radius: .25rem;
    outline: none !important
`