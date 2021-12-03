import React from 'react'
import styled from 'styled-components'

export default styled(React.forwardRef(({isOpen, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    background-color: white;
    color: #20253F;
    border: 2px solid ${props=>props.isOpen ? '#0dbf7e': '#f2f2f2'};
    caret-color: #20253F;
    border-radius: .25rem;
    outline: none !important
`