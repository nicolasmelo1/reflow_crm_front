import React from 'react'
import StyledAlert from '../styles/Alert'
import actions from '../redux/actions'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'


/*** 
 * Really simple component to create notifications on the page you are in.
 * You need to use redux onAddNotification action to add new notifications to this component
 */
class Notify extends React.Component {
    constructor (props) {
        super(props)
    }
    
    componentDidUpdate() {
        if (this.props.notify.notification.length > 0) {
            setTimeout(() => {
                this.props.onRemoveNotification()
            }, 5000)
        }
    }

    renderWeb() {
        return (
            <div style={{
                position: 'absolute',
                top:0,
                left: 0,
                width: '100%',
                zIndex: 1000
            }}>
                {this.props.notify.notification.map((notification, index) => (
                    <StyledAlert key={index} variant={notification.variant}>
                        {notification.message}
                    </StyledAlert>
                ))}
            </div>
        )
    }

    renderMobile() {
        return (
            <View styled={{
                flex: 1,
                flexDirection: 'row', 
                flexWrap: 'nowrap', 
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
            }}>
                {this.props.notify.notification ? this.props.notify.notification.map((notification, index) => (
                    <StyledAlert key={index} variant={notification.variant}>
                        <Text>
                            {notification.message}
                        </Text>
                    </StyledAlert>
                )): null }
            </View>
        )
    }

    render () {
        if (process.env['APP'] === 'web') {
            return this.renderWeb()
        } else {
            return this.renderMobile()
        }
    }
}

export default connect(state => ({ notify: state.notify }), actions)(Notify);