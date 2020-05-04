import React, { useState, useEffect, useCallback } from 'react'
import { NotificationText, NotificationDate, NotificationContainer, NotificationTitle, NotificationCard } from '../../styles/Notification'
import moment from 'moment'
import { strings, paths } from '../../utils/constants'
import Router from 'next/router'
import { View , Text, RefreshControl } from 'react-native'

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


    const onClickNotification = (notificationIndex, formName, formId) => {
        const notificationsData = JSON.parse(JSON.stringify(props.notification.data))
        notificationsData[notificationIndex].has_read = true
        props.onReadNotifications(notificationsData, notificationsData[notificationIndex].id)

        // TODO: navigate mobile
        
        if (process.env['APP'] === 'web') {
            Router.push({
                pathname: paths.home(formName, true),
                query: {
                    formId: formId
                }
            }, {
                pathname: paths.home(formName),
                query: {
                    formId: formId
                }
            }, {shallow: true})
        } else{
            props.navigation.navigate('Home')
        }
    }

    const isVariable = (text) => {
        return text.charAt(0) === '{' && text.charAt(text.length-1) === '}' 
    }

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

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        props.onGetNotifications(sourceRef, { page: 1 }).then(_ => {
            setRefreshing(false)
        }) 
      }, [refreshing]);

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        if (notificationContainerRef.current) { 
            notificationContainerRef.current.addEventListener('scroll', onScroll)
        }
        return () => {
            if (notificationContainerRef.current) { 
                notificationContainerRef.current.removeEventListener('scroll', onScroll)
            }
            if(sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        paginationRef.current = props.notification.pagination
    }, [props.notification])


    const renderMobile = () => {
        return(
            <View>
                <NotificationContainer onScroll={e=> {onScroll(e)}} scrollEventThrottle={16} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    { props.notification && props.notification.data && props.notification.data.length === 0 ? (
                        <View style={{height: 30, alignItems: 'center'}}>
                            <Text style={{ color: '#bfbfbf'}}>
                                Puxe para baixo carregar as notificações
                            </Text>
                        </View>
                    ) : null}
                    {props.notification && props.notification.data ? props.notification.data.map((notification, index)=> {
                        const notificationText = notification.notification
                        const splittedNotificationSentences = notificationText.split(/{(.*?)}(?!})/g)
                        const date = moment(notification.created_at).format(props.dateFormat)
                        return (
                            <NotificationCard key={index} hasRead={notification.has_read} onPress={e=> {onClickNotification(index, notification.form_name, notification.form)}}>
                                <NotificationDate>
                                    {date}
                                </NotificationDate>
                                <Text style={{ margin: 0 }}>
                                    {splittedNotificationSentences.map((notificationSentence, notificationSentenceIndex) => {
                                    const notificationIsVariable = isVariable(notificationSentence)
                                    if (notificationIsVariable) {
                                        notificationSentence = notificationSentence.replace(/^{/, '')
                                        notificationSentence = notificationSentence.replace(/}$/, '')
                                    }
                                    if (notificationSentence !== '') {
                                        return (
                                            <NotificationText isVariable={notificationIsVariable} key={notificationSentenceIndex}>
                                                {notificationSentence}
                                            </NotificationText>
                                        )
                                    } else {
                                        return ''
                                    }
                                    })}
                                </Text>
                            </NotificationCard>
                        )    
                    }) : null}
                </NotificationContainer>
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <NotificationTitle>{strings['pt-br']['notificationRecievedTitleLabel']}</NotificationTitle>
                <NotificationContainer ref={notificationContainerRef}>
                    {props.notification.data.map((notification, index)=> {
                        const notificationText = notification.notification
                        const splittedNotificationSentences = notificationText.split(/{(.*?)}(?!})/g)
                        const date = moment(notification.created_at).format(props.dateFormat)
                        return (
                            <NotificationCard key={notification.id} hasRead={notification.has_read} onClick={e=> {onClickNotification(index, notification.form_name, notification.form)}}>
                                <NotificationDate>
                                    {date}
                                </NotificationDate>
                                <p style={{ margin: '0' }}>
                                    {splittedNotificationSentences.map((notificationSentence, notificationSentenceIndex) => {
                                    const notificationIsVariable = isVariable(notificationSentence)
                                    if (notificationIsVariable) {
                                        notificationSentence = notificationSentence.replace(/^{/, '')
                                        notificationSentence = notificationSentence.replace(/}$/, '')
                                    }
                                    if (notificationSentence !== '') {
                                        return (
                                            <NotificationText isVariable={notificationIsVariable} key={notificationSentenceIndex}>
                                                {notificationSentence}
                                            </NotificationText>
                                        )
                                    } else {
                                        return ''
                                    }
                                    })}
                                </p>
                            </NotificationCard>
                        )    
                    })}
                </NotificationContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NotificationRecieved