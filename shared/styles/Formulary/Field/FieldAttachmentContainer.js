import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(({isInitial, numberOfItems, isSectionConditional, isDragging,...rest}) => <div {...rest}/>)`
    ${props=> props.isInitial ? `
        position: sticky;
        ${props.numberOfItems !== 1 ? 'left: 0;': ''}
        height: 200px;
        background-color: ${props.isSectionConditional ? '#17242D' : props.isDragging ? '#bfbfbf' : '#fff'};
        border-right: 1px solid #f2f2f2;
        z-index: 1;
    ` : ''}
    width: ${props=> props.numberOfItems !== 1 ? '150px': ''};
    text-align: center;
    display: ${props=> props.numberOfItems !== 1 ? 'inline-block' : ''};
    vertical-align: middle;
    border-radius: .25rem;
    padding: 10px;
` 
:
styled(View)``