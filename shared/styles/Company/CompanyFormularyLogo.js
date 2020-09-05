import React from 'react'
import styled from 'styled-components'
import { Image } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.img`
    width: 150px;
    border-radius: 5px;
`
:
styled(Image)`
    width: 150px;
    height: 150px;
    resize-mode: contain;
    border-radius: 5px;
`