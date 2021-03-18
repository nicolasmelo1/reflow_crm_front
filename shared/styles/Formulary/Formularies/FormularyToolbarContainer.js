import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%; 
    background-color: #17242D; 
    margin: 0 0 10px 0;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 4px 3px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    z-index: 10;
    align-items: center;
    padding: 5px
`
:
styled(View)``
