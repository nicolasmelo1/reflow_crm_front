import styled from 'styled-components'
import React from 'react'

export default styled(React.forwardRef(({optionBackgroundColor, optionColor, ...rest}, ref) => <div {...rest} ref={ref}/>))`
    position: absolute;
    max-height: 100px;
    width: 100%; 
    background-color: ${props => props.optionBackgroundColor ? props.optionBackgroundColor: '#444'};
    color: ${props => props.optionColor ? props.optionColor: '#f2f2f2'};
    overflow-y: auto;
`