import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { strings } from '../utils/constants'
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
} from '../styles/Alert'

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
 * @param {Boolean} show - This is a obligatory props, we use this to open and to close the formulary.
 * @param {Function} onHide - This is a callback for when you close the alert. You probably will use this to update your props.
 * @param {String} alertTitle - The title of your alert.
 * @param {String} alertMessage - The message, or content of your alert.
 * @param {Function} onAccept - (optional) - If it is set we are gonna display a "OK" button, so the user can accept this alert.
 */
const Alerts = (props) => {
    const _isMounted = React.useRef(null)
    const [isOpen, setIsOpen] = useState(props.show)

    const onClose = () => {
        setTimeout(() => {
            if (_isMounted.current) {
                props.onHide()
            }
        }, 300)
        setIsOpen(false)
    }

    useEffect(() => {
        if (props.show) {
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
            <View></View>
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
                        <p>{props.alertMessage}</p>
                        <AlertButtonsContainer>
                            <AlertCancelButton onClick={e=> {onClose()}}>
                                <AlertCancelText>
                                    {strings['pt-br']['alertCancelButtonLabel']}
                                </AlertCancelText>
                            </AlertCancelButton>
                            {props.onAccept ? (
                                <AlertOkButton onClick={e=> {
                                    onClose()
                                    props.onAccept()
                                }}>
                                    <AlertOkText>
                                        {strings['pt-br']['alertOkButtonLabel']}
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