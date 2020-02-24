import styled from 'styled-components'
import React from 'react'

export default styled(React.forwardRef(({optionDividerColor, optionOnHoverBackgroundColor, optionOnHoverColor, ...rest}, ref) => <li {...rest} ref={ref}/>))`
    padding: 5px;
    border-top: 1px solid ${props => props.optionDividerColor ? props.optionDividerColor : '#bfbfbf'};
    user-select: none;

    &:hover {
        background-color: ${props => props.optionOnHoverBackgroundColor ? props.optionOnHoverBackgroundColor : '#bfbfbf'};
        color: ${props => props.optionOnHoverColor ? props.optionOnHoverColor : '#444'}
    }
`