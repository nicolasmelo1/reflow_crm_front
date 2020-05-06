import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    flex-direction: column;
    display: flex;
    max-width: 45%;
`
:
styled(View)``