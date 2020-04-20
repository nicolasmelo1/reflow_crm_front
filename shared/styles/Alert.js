import React from 'react'
import styled, { keyframes } from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: ${props => props.variant === 'error' ? '#f8d7da' : '#d4edda' };
    padding: 10px;
    margin-bottom: 5px;
    animation: ${keyframes`
                    0% {
                        transform: translateY(0);
                    }
                    
                    75% {
                        transform: translateY(0);
                    }

                    100% {
                        transform: translateY(-100%);
                    }
                `} 5s;
`
:
styled(View)`
    background-color: ${props => props.variant === 'error' ? '#f8d7da' : '#d4edda' };
    padding: 10px;               
`