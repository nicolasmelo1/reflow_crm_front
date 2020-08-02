import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Animated, View, Dimensions } from 'react-native'


export default process.env['APP'] === 'web' ? 
styled.div``
:
styled(View)`
    width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content:flex-start
`