import React, { useState, useEffect } from 'react'
import { Animated, Dimensions, Easing, SafeAreaView } from 'react-native'
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
styled.div`
    overflow-y: auto;
    height: calc(var(--app-height) - 112px);

    scrollbar-color: #bfbfbf transparent;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: transparent;
    }
`
:
styled(SafeAreaView)``