import React from 'react'
import { NotificationText } from '../../styles/Notification'

class Notification extends React.Component {
    constructor(props) {
        super(props)
    }

    isVariable = (text) => {
        return text.charAt(0) === '{' && text.charAt(text.length-1) === '}' 
    }

    render() {
        return (
            <div>
                <h2>Suas notificações</h2>
                {this.props.notifications.map((notification, index)=> {
                    const notificationText = notification.notification
                    const splittedNotificationSentences = notificationText.split(/{(.*?)}(?!})/g)
                    return (
                        <p key={index}>
                            {splittedNotificationSentences.map((notificationSentence, notificationSentenceIndex) => {
                            const isVariable = this.isVariable(notificationSentence)
                            if (isVariable) {
                                notificationSentence = notificationSentence.replace(/^{/, '')
                                notificationSentence = notificationSentence.replace(/}$/, '')
                            }
                            return (
                                <NotificationText isVariable={isVariable} key={notificationSentenceIndex}>
                                    {notificationSentence}
                                </NotificationText>
                            )
                            })}
                        </p>    
                    )    
                })}
            </div>
        )
    }
}

export default Notification