import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    text-align: center;
    vertical-align: middle;
    border-radius: .25rem;
    padding: 10px;
    z-index: 1;
    height: 140px;
    position: sticky;
    ${props => props.hasValues !== 1 ? `
        left: 0;
    `: ''}
    border-right: ${props => props.hasValues ? '1px solid #f2f2f2': '0'};
    width: ${props => props.hasValues ? '150px': ''};
    display: ${props => props.hasValues ? 'inline-block' : ''};
    background-color: ${props => props.isSectionConditional ? '#17242D' : props.isDragging ? '#bfbfbf' : '#fff'};
`
:
styled(View)``