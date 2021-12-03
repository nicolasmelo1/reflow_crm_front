import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, View, TextInput, Animated, Easing, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

// ------------------------------------------------------------------------------------------
export const LoginOnboardingButton = process.env['APP'] === 'web' ?
styled.button`
    margin-top: 10px;
    color: #0dbf7e;
    font-weight: bold;
    background-color: transparent;
    border-radius: 4px;
    border: 1px solid #0dbf7e;
    width: 100%;
    padding: 5px;   

    &:hover {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
`
:
styled(TouchableOpacity)`
    background-color: transparent;
    border-radius: 4px;
    border: 1px solid #0dbf7e;
    margin: 5px 0;
    padding: 10px;
    align-items: center;
`
// ------------------------------------------------------------------------------------------
export const LoginContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: var(--app-height);
`
:
styled(View)`
    top: 25%;
    justify-content: center;
    align-items: center
`
// ------------------------------------------------------------------------------------------
export const LoginInput = process.env['APP'] === 'web' ?
styled.input`
    display: block;
    width: 100%; 
    border-radius: 5px;
    color: #20253F;
    border: 1px solid ${props => props.error ? 'red': '#20253F'};
    padding: .375rem .75rem;
    
    &:focus {
        color: #20253F;
        border: 1px solid #0dbf7e;
        box-shadow: none;
        outline: 0;
    };
`
:
styled(TextInput)`
    width: ${props => props.isPassword ? '80%' : '100%'}; 
    border-radius: 4px;
    color: #20253F;
    border: 1px solid ${props => props.error ? 'red': props.isFocused ? '#0dbf7e' : '#20253F'};
    padding: 10px;
    background-color: #fff;
`
// ------------------------------------------------------------------------------------------
export const LoginButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: #0dbf7e;
    font-weight: bold;
    border-radius: 4px;
    border: 0;
    width: 100%;
    padding: 5px;   

    &:hover {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
`
:
styled(TouchableOpacity)`
    background-color: #0dbf7e;
    border-radius: 4px;
    margin: 5px 0;
    padding: 10px;
    align-items: center;
`
// ------------------------------------------------------------------------------------------
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
                    useNativeDriver: true
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

export const LoginFormContainer = process.env['APP'] === 'web' ?
styled.div`
    background-color: #fff;
    box-shadow: 4px 4px 12px rgb(56 66 95 / 0.08);
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
// ------------------------------------------------------------------------------------------
const Logo = (props) => {
    const [xAnim] = useState(new Animated.Value(0))
    const [opacity] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                easing: Easing.ease,
                useNativeDriver: true
            }),
            Animated.timing(xAnim, {
                toValue: -210,
                duration: 1000,
                easing: Easing.ease,
                useNativeDriver: true
            })
        ], {useNativeDriver: true}).start()
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

export const LoginLogo = process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    width: 30%;
    max-width: 200px;
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
// ------------------------------------------------------------------------------------------
export const LoginLabel = process.env['APP'] === 'web' ?
styled.label`
    display: block;
    font-weight: bold;
    margin: 0 0 5px 0;
    align-self: flex-start;
`
:
styled(Text)`
    font-weight: bold;
    margin: 0 0 5px 0;
    align-self: flex-start;
`
// ------------------------------------------------------------------------------------------
export const LoginFieldError = process.env['APP'] === 'web' ?
styled.small`
    color: red;
    min-height: 20px;
    align-self: flex-start;
    margin-bottom: 5px;
`
:
styled(Text)`
    min-height: 30px;
    align-self: flex-start;
    color: red;
`
// ------------------------------------------------------------------------------------------
export const LoginForgotPassword = process.env['APP'] === 'web' ?
styled.small`
    color: #0dbf7e;
    min-height: 20px;
    align-self: flex-start;
    margin-bottom: 20px;
    user-select: none;
    cursor: pointer;
`
:
styled(Text)`
    color: #0dbf7e;
    min-height: 20px;
    align-self: flex-start;
    margin-bottom: 20px;
    margin-top: 10px;
`
// ------------------------------------------------------------------------------------------
export const LoginInputContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
`
:
styled(View)`
    flex-direction: row;
`
// ------------------------------------------------------------------------------------------
export const LoginVisualizePasswordIcon = process.env['APP'] === 'web' ?
styled(FontAwesomeIcon)`
    align-self: center;
    margin-left: 10px;
    cursor: pointer;
    width: 1.25em !important
`
:
styled(FontAwesomeIcon)`
`
// ------------------------------------------------------------------------------------------