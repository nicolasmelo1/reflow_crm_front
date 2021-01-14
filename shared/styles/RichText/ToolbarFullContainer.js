import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Animated, Easing, View } from 'react-native'

const Options = (props) => {
    const [opacity] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()
    }, [])
  
    return (
      <Animated.View // Special animatable View
        source={props.source}
        style={{
            ...props.style['0'],
            opacity: opacity,
        }}>
        {props.children}
      </Animated.View>
    )
}

export default process.env['APP'] === 'web' ?
styled.div`
    width: ${props => props.width}px;
    position: fixed;
    z-index: 10;
    white-space: nowrap;
    transform: translate3d(0, -55px, 0);
    transform: background-color .5s .8s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    
`
:
styled(Options)`
    width: 100%;
    height: 50px;
    padding: 5px 0 0 0;
    border-top-width: 1px;
    border-top-color: #0dbf7e;
    background-color: #fff;
    align-self: flex-end;
`