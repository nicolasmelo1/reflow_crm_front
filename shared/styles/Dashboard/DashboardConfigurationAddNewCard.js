import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 1px dashed #0dbf7e;
    padding: 5px;
    background-color: transparent;
    margin: 5px;
    height: 250px;
    width: 250px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    user-select: none;
`
:
styled(View)``