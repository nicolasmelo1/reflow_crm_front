import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    flex-direction: column;
    color: black;
    padding: 10px 
`
:
styled(View)``