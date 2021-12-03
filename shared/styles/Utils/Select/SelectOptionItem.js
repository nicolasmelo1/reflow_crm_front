import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(React.forwardRef(({hasBorder, optionDividerColor, optionOnHoverBackgroundColor, optionOnHoverColor, ...rest}, ref) => <li {...rest} ref={ref}/>))`
    padding: 5px;
    border-bottom: ${props=> props.hasBorder ? `1px solid ${props.optionDividerColor ? props.optionDividerColor : '#bfbfbf'}` : '0'};
    user-select: none;

    &:hover {
        background-color: ${props => props.optionOnHoverBackgroundColor ? props.optionOnHoverBackgroundColor : '#bfbfbf'};
        color: ${props => props.optionOnHoverColor ? props.optionOnHoverColor : '#20253F'}
    }
`
:
styled(React.forwardRef(({hasBorder, optionDividerColor, optionOnHoverBackgroundColor, optionOnHoverColor, ...rest}, ref) => <TouchableOpacity {...rest} ref={ref}/>))`
    padding: 5px;
    margin: 10px;
`