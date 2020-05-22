import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Animated, Easing } from 'react-native'

const Form = (props) => {
    const _isMounted = React.useRef(true)
    const [opacity] = useState(new Animated.Value(0))

    useEffect(() => {
        _isMounted.current = true

        setTimeout(() => {
            if (_isMounted.current) { 
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.ease,
                    useNativeDrive: true
                }).start()
            }
        }, 2000)

        return () => {
            _isMounted.current = false
        }
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
    background-color: #f2f2f2;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    opacity: ${props => props.showForm ? '1': '0'};
    transition: opacity 1s ease-in-out;
`
:
styled(Form)`
    width: 70%;
    background-color: #f2f2f2;
    border-radius: 20px;
    padding: 20px;
`