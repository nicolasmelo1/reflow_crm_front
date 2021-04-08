import React, { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import { strings, paths } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import { View , Text, RefreshControl } from 'react-native'
import Styled from './styles'

const Router = dynamicImport('next/router')

/**
 * This component is responsible for loading all of the notifications cards that was created for him from all of the formularies and all of the notification
 * configuration. This renders the notification as cards in the page. Each card is clickable so the user navigates to the formulary.
 * 
 * @param {Function} onReadNotifications - Redux action responsible for updating read notifications, when the user clicks the notification we mark as read
 * in the backend and then navigates the user to the homepage to read the formulary of this notification.
 * @param {Function} onGetNotifications - Redux action responsible for retrieving notification data. There's a pagination on the number of data retrieved 
 * so we update the page as the user scrolls the container.
 * @param {Object} cancelToken - A axios cancel token, we use this so we can cancel a request when a user unmounts a component before the data be retrieved
 * @param {Object} notification - Check redux/reducers/notification/notification for further reference, this references to a object in the redux reducer
 * that holds all of the notification objects inside a list and also the pagination data.
 * @param {Object} dateFormat - How to format the date in the notification. We have this defined in the `login` reducer
 */
const NotificationRecieved = (props) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const [hasFiredRequestForNewPage, _setHasFiredRequestForNewPage] = useState(false)
    const notificationContainerRef = React.useRef()
    const sourceRef = React.useRef()
    const paginationRef = React.useRef()

    // Check Components/Utils/Select for reference and explanation
    // We use this so we know the request for a new page was fired and then we doesn't fire again 
    // if the user scroll to top and then back to the bottom again
    const hasFiredRequestForNewPageRef = React.useRef(hasFiredRequestForNewPage);
    const setHasFiredRequestForNewPage = data => {
        hasFiredRequestForNewPageRef.current = data;
        _setHasFiredRequestForNewPage(data);
    }

    /**
     * Function responsible to navigate the user to a specific formulary when he clicks a notification. Card.
     * When he navigates the formulary opened for him.
     * 
     * @param {BigInteger} notificationIndex - The index of this notification card, this way we can get more data of it in the
     * array. And update `has_read` from it in the redux reducer to True. This argument represents that the user has read the notificaiton.
     * Then we send this object to the backend so we can persist this data there.
     * @param {String} formName - The form_name works like an id, but it is unique for a single company, many companies can have the same form_name.
     * we use this to navigate to the specific formulary from this notification is this from `sales`, `product`, etc formulary? 
     * @param {BigInteger} formId - Differently from the form_name the formId is an specific ID from a single formulary data inserted from this `form_name`.
     */
    const onClickNotification = (notificationIndex, formName, formId) => {
        const notificationsData = JSON.parse(JSON.stringify(props.notification.data))
        notificationsData[notificationIndex].has_read = true
        props.onReadNotifications(notificationsData, notificationsData[notificationIndex].id)

        // TODO: navigate mobile
        
        if (process.env['APP'] === 'web') {
            Router.push({
                pathname: paths.home().asUrl,
                query: {
                    formId: formId
                }
            }, {
                pathname: paths.home(formName).asUrl,
                query: {
                    formId: formId
                }
            }, {shallow: true})
        } else{
            const Linking = require('expo-linking')
            Linking.openURL(Linking.makeUrl(paths.home(formName).asUrl, { formId: formId }))
        }
    }

    /**
     * Just checks if the text is a variable or not, if it is the string becomes Bolder and the color of the string becomes green.
     * 
     * @param {String} text - Each chunk of the string, check the render components for details.
     */
    const isVariable = (text) => {
        return text.charAt(0) === '{' && text.charAt(text.length-1) === '}' 
    }

    /**
     * This function is used to fire a new request when the user scrolls to the bottom of the scroll.
     * This way he just needs to scroll to the bottom to get new notifications.
     * 
     * @param {Object} e - The event object
     */
    const onScroll = (e) => {
        const hasReachedBottom = process.env['APP'] === 'web' ? 
            (notificationContainerRef.current.scrollTop >= (notificationContainerRef.current.scrollHeight - notificationContainerRef.current.offsetHeight)) : 
            e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >= e.nativeEvent.contentSize.height
        if (!hasFiredRequestForNewPageRef.current && paginationRef.current.current < paginationRef.current.total && hasReachedBottom)  {
            setHasFiredRequestForNewPage(true) 
            const page = paginationRef.current.current + 1
            props.onGetNotifications(sourceRef, { page: page }).then(response => {
                if (response && response.status === 200) {
                    setHasFiredRequestForNewPage(false) 
                }
            })
        }
    }

    /**
     * This is needed to retrieve new notifications on React Native if the user uses Pull to Refresh
     */
    const onRefresh = useCallback(() => {
        setRefreshing(true)
        props.onGetNotifications(sourceRef, { page: 1 }).then(_ => {
            setRefreshing(false)
        }) 
      }, [refreshing]);

    useEffect(() => {
        // sets source
        sourceRef.current = props.cancelToken.source()
        return () => {
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        // updates the notifications.
        paginationRef.current = props.notification.pagination
    }, [props.notification])


    const renderMobile = () => {
        return(
            <View>
                <Styled.NotificationContainer onScroll={e=> {onScroll(e)}} scrollEventThrottle={16} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    { props.notification && props.notification.data && props.notification.data.length === 0 ? (
                        <View style={{height: 30, alignItems: 'center'}}>
                            <Text style={{ color: '#bfbfbf'}}>
                                {strings['pt-br']['notificationPullToRefreshLabel']}
                            </Text>
                        </View>
                    ) : null}
                    {props.notification && props.notification.data ? props.notification.data.map((notification, index)=> {
                        const notificationText = notification.notification
                        const splittedNotificationSentences = notificationText.split(/{(.*?)}(?!})/g)
                        const date = moment(notification.created_at).format(props.dateFormat)
                        return (
                            <Styled.NotificationCard key={index} hasRead={notification.has_read} onPress={e=> {onClickNotification(index, notification.form_name, notification.form)}}>
                                <Styled.NotificationDate>
                                    {date}
                                </Styled.NotificationDate>
                                <Text style={{ margin: 0 }}>
                                    {splittedNotificationSentences.map((notificationSentence, notificationSentenceIndex) => {
                                    const notificationIsVariable = isVariable(notificationSentence)
                                    if (notificationIsVariable) {
                                        notificationSentence = notificationSentence.replace(/^{/, '')
                                        notificationSentence = notificationSentence.replace(/}$/, '')
                                    }
                                    if (notificationSentence !== '') {
                                        return (
                                            <Styled.NotificationText isVariable={notificationIsVariable} key={notificationSentenceIndex}>
                                                {notificationSentence}
                                            </Styled.NotificationText>
                                        )
                                    } else {
                                        return ''
                                    }
                                    })}
                                </Text>
                            </Styled.NotificationCard>
                        )    
                    }) : null}
                </Styled.NotificationContainer>
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <Styled.NotificationTitle>{strings['pt-br']['notificationRecievedTitleLabel']}</Styled.NotificationTitle>
                <Styled.NotificationContainer ref={notificationContainerRef} onScroll={e => onScroll()}>
                    {props.notification.data.map((notification, index)=> {
                        const notificationText = notification.notification
                        const splittedNotificationSentences = notificationText.split(/{(.*?)}(?!})/g)
                        const date = moment(notification.created_at).format(props.dateFormat)
                        return (
                            <Styled.NotificationCard key={notification.id} hasRead={notification.has_read} onClick={e=> {onClickNotification(index, notification.form_name, notification.form)}}>
                                <Styled.NotificationDate>
                                    {date}
                                </Styled.NotificationDate>
                                <p style={{ margin: '0' }}>
                                    {splittedNotificationSentences.map((notificationSentence, notificationSentenceIndex) => {
                                    const notificationIsVariable = isVariable(notificationSentence)
                                    if (notificationIsVariable) {
                                        notificationSentence = notificationSentence.replace(/^{/, '')
                                        notificationSentence = notificationSentence.replace(/}$/, '')
                                    }
                                    if (notificationSentence !== '') {
                                        return (
                                            <Styled.NotificationText isVariable={notificationIsVariable} key={notificationSentenceIndex}>
                                                {notificationSentence}
                                            </Styled.NotificationText>
                                        )
                                    } else {
                                        return ''
                                    }
                                    })}
                                </p>
                            </Styled.NotificationCard>
                        )    
                    })}
                </Styled.NotificationContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationRecieved