import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-contents: space-between;
    width: 100%;
    text-align: center;
    margin: 10px auto 10px auto
`
:
styled(Text)``