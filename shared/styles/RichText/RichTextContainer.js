import React from 'react'
import styled from 'styled-components'
import { Dimensions, View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    background-color: transparent;
    position: relative;
`
:
styled(View)`
    height: 100%;
    flex-direction: column;
`