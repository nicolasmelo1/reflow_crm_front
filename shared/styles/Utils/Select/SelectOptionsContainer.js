import styled from 'styled-components'
import React from 'react'

export default styled(React.forwardRef(({optionBackgroundColor, optionColor, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    width: 100%; 
    background-color: ${props => props.optionBackgroundColor ? props.optionBackgroundColor: '#444'};
    color: ${props => props.optionColor ? props.optionColor: '#f2f2f2'};
    overflow-y: auto;
    
    @media(max-width: 420px) {
        height: 100vh;
        float: bottom;
    }
    @media(min-width: 420px) {
        max-height: 300px;
        position: absolute;
        z-index: 5;
    }
`