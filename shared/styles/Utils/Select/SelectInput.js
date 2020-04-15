import React from 'react'
import styled from 'styled-components'

export default styled(React.forwardRef(({searchValueColor, ...rest}, ref) => <input {...rest} ref={ref}/>))`
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