import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 10px 0;
    border-radius: 10px;
    background-color: ${props => props.isSelected ? "#00000020" : "transparent"};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`
:
null