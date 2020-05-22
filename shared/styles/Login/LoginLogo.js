import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Animated, Image, Easing } from 'react-native'

const Logo = (props) => {
    const [xAnim] = useState(new Animated.Value(0))
    const [opacity] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                easing: Easing.ease,
                useNativeDrive: true
            }),
            Animated.timing(xAnim, {
                toValue: -210,
                duration: 1000,
                easing: Easing.ease,
                useNativeDrive: true
            })
        ]).start()
    }, [])
  
    return (
      <Animated.Image // Special animatable View
        source={props.source}
        style={{
            ...props.style['0'],
            opacity: opacity,
            transform: [{
                translateY: xAnim
            }], // Bind opacity to animated value
        }}>
        {props.children}
      </Animated.Image>
    )
}


export default process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    max-width: 30%;
    opacity: ${props => props.showLogo ? '1 !important': '0 !important'};
    transform: ${props => props.slideLogo ? 'translateY(-235px)': 'translateY(0px)'};
    transition: transform 1s ease-in-out, opacity 0.9s ease-in-out;
`
:
styled(Logo)`
    position: absolute;
    width: 50%;
    align-self: center;
    resize-mode: contain;
    z-index: 5
`