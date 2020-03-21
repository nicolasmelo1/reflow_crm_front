import styled from 'styled-components'
import React from 'react'

export default styled(React.forwardRef(({hasBorder, optionDividerColor, optionOnHoverBackgroundColor, optionOnHoverColor, ...rest}, ref) => <li {...rest} ref={ref}/>))`
    padding: 5px;
    border-bottom: ${props=> props.hasBorder ? `1px solid ${props.optionDividerColor ? props.optionDividerColor : '#bfbfbf'}` : '0'};
    user-select: none;

    &:hover {
        background-color: ${props => props.optionOnHoverBackgroundColor ? props.optionOnHoverBackgroundColor : '#bfbfbf'};
        color: ${props => props.optionOnHoverColor ? props.optionOnHoverColor : '#444'}
    }
`