import React, { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import { strings } from '../../utils/constants'
import { 
    AlertContainer,
    AlertBoxContainer,
    AlertBoxContentContainer,
    AlertButtonsContainer,
    AlertCancelButton,
    AlertCancelText,
    AlertOkButton,
    AlertOkText,
    AlertTitleContainer
} from '../../styles/Alert'

/**
 * Component responsible for showing alerts to the users when they do a risky action.
 * This renders a modal. It's the only component that renders modals 
 * (i fu**ing hate modals, they are dumb, you open, than you don't know how to close (yes, i know it's on the X, but it's not that good for newbies)
 * they are not mobile friendly). Anyway, don't create modals, unless they cover the hole page.
 * This way you can focus the attention of the user on a single point of action.
 * 
 * Why i use this here you might ask? Because this is a RISKY operation, you should stop everything and see that you
 * are doing something that is probably dumb and they might don't want to do.
 * 
 * @param {object} props - The props this component recieves.
 * @param {Boolean} props.show - This is a obligatory props, we use this to open and to close the formulary.
 * @param {Function} props.onHide - This is a callback for when you close the alert. You probably will use this to update your props.
 * @param {String} props.alertTitle - The title of your alert.
 * @param {String} props.alertMessage - The message, or content of your alert.
 * @param {Function} props.onAccept - (optional) - If it is set we are gonna display a "OK" button, so the user can accept this alert.
 * @param {String} props.onAcceptButtonLabel - (optional) - if `onAccept` is defined, you can edit the `ok` button with a new label.
 */
const Alerts = (props) => {
    const _isMounted = React.useRef(null)
    const [isOpen, setIsOpen] = useState(props.show)

    /**
     * When we close the alert, we call onHide after 3 miliseconds so it shows a nice animation. of it fading and going up.
     * 
     * Also since we have the same logic when we click the "OK" button and when we call the "cancel" botton. We will only call
     * the props.onHide callback if the user clicked the "cancel" button, otherwise we will call the `props.onAccept` callback.
     * 
     * @param {boolean} isClickingAccept - If the user clicked the "OK" button, we will call the `props.onAccept` callback only and
     * we ignore the onHide callback.
     */
    const onClose = (isClickingAccept=false) => {
        setTimeout(() => {
            if (_isMounted.current && isClickingAccept === false) {
                props.onHide()
            }
        }, 300)
        setIsOpen(false)
    }

    const onCreateReactNativeAlert = () => {
        let buttonsArray = [
            {
                text: strings['pt-br']['alertCancelButtonLabel'],
                onPress: () =>  props.onHide(),
                style: "cancel"
            },
            
        ]
        if (props.onAccept) {
            buttonsArray.push({
                text: props.onAcceptButtonLabel ? props.onAcceptButtonLabel : strings['pt-br']['alertOkButtonLabel'],
                onPress: () => props.onAccept()
            })
        }
        Alert.alert(
            props.alertTitle,
            props.alertMessage,
            buttonsArray,
            { 
                cancelable: false 
            }
        )
    }

    useEffect(() => {
        if (props.show) {
            if (process.env['APP'] !== 'web') {
                onCreateReactNativeAlert()
            }
            setIsOpen(props.show)
        }
    }, [props.show])

    useEffect(() => {
        _isMounted.current = true
        return () => {
            _isMounted.current = false
        }
    }, [])

    const renderMobile = () => {
        return (
            <View/>
        )
    }

    const renderWeb = () => {
        return (
            <AlertContainer isOpen={isOpen} show={props.show}>
                <AlertBoxContainer isOpen={isOpen}>
                    <AlertTitleContainer>
                        <h2 style={{ margin: '0' }}>
                            {props.alertTitle}
                        </h2>
                    </AlertTitleContainer>
                    <AlertBoxContentContainer>
                        <p style={{ margin: '0' }}>
                            {props.alertMessage}
                        </p>
                        <AlertButtonsContainer withAccept={props.onAccept}>
                            <AlertCancelButton onClick={e=> {onClose()}}>
                                <AlertCancelText>
                                    {props.onAccept ? strings['pt-br']['alertCancelButtonLabel'] : strings['pt-br']['alertOkButtonLabel']}
                                </AlertCancelText>
                            </AlertCancelButton>
                            {props.onAccept ? (
                                <AlertOkButton onClick={e=> {
                                    onClose(true)
                                    props.onAccept()
                                }}>
                                    <AlertOkText>
                                        {props.onAcceptButtonLabel ? props.onAcceptButtonLabel : strings['pt-br']['alertOkButtonLabel']}
                                    </AlertOkText>
                                </AlertOkButton>
                            ) : ''}
                        </AlertButtonsContainer>
                    </AlertBoxContentContainer>
                    
                </AlertBoxContainer>
            </AlertContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Alerts