import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(React.forwardRef(({searchValueColor, ...rest}, ref) => <input {...rest} ref={ref}/>))`
    color: ${props=>props.searchValueColor ? props.searchValueColor : 'black'};
    caret-color: ${props=>props.searchValueColor ? props.searchValueColor : 'black'};
    background-color: transparent;
    display: inline-block;
    border: 0;
    line-height: normal;
    padding: .156rem 0;
    margin: .406rem .75rem;
    width: 50%;

    &:focus {
        outline: none;
    }
`
:
styled(React.forwardRef(({searchValueColor, ...rest}, ref) => <TextInput {...rest} ref={ref}/>))`
    color: ${props=>props.searchValueColor ? props.searchValueColor : 'black'};
    flex: 1;
    border: 0;
    padding: 4px;
    margin: 1px 2px;
    min-width: 80px
`
