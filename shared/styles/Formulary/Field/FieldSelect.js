import React from 'react'
import styled from 'styled-components'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    background-color: white;
    color: #17242D;
    border: 2px solid ${props=>props.isOpen ? '#0dbf7e': '#f2f2f2'};
    caret-color: #17242D;
    border-radius: .25rem;
    outline: none !important
`