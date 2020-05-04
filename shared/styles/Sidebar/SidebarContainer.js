import React,  { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Animated, View, Easing, Dimensions } from 'react-native'

const Screen = (props) => {
    const [xAnim, setXAnim] = useState(new Animated.Value(0))

    const width = Dimensions.get('window').width*0.8

    useEffect(() => {
        setXAnim(new Animated.Value(props.sidebarIsOpen ? -width : 0))
    }, [props.sidebarIsOpen])

    useEffect(() => {
        Animated.timing(xAnim, {
            toValue: props.sidebarIsOpen ? 0 : -width,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true
        }).start()
    }, [xAnim])

    return (
      <Animated.View
        style={{
            ...props.style[0],
            transform: [{
                translateX: xAnim
            }]
        }}>
        {props.children}
      </Animated.View>
    )
}

export default process.env['APP'] === 'web' ? 
styled.div``
:
styled(Screen)`
    height: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content:flex-start
`