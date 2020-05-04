import React, { useState, useEffect } from 'react'
import { Animated, Dimensions, Easing, View } from 'react-native'
import styled from 'styled-components'

const Screen = (props) => {
    const [xAnim] = useState(new Animated.Value(Dimensions.get('window').width))

    useEffect(() => {
      Animated.timing(xAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDrive: true
      }).start()
    }, [])
  
    return (
      <Animated.View // Special animatable View
        style={{
            ...props.style,
            transform: [{
                translateX: xAnim
            }], // Bind opacity to animated value
        }}>
        {props.children}
      </Animated.View>
    )
}

export default process.env['APP'] === 'web' ?
styled.div``
:
styled(View)``