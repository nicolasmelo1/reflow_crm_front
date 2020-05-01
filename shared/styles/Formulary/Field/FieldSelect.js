import React from 'react'
import styled from 'styled-components'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    background-color: white;
    color: #17242D;
    border: 1px solid ${props=>props.isOpen ? '#17242D': '#0dbf7e'};
    caret-color: #17242D;
    border-radius: .25rem;
    outline: none !important
`