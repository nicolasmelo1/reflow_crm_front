import React from 'react'
import { View } from 'react-native'
import DashboardConfiguration from './DashboardConfiguration'
/**
 * Main function for Dashboards visualization
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditing: false
        }
    }

    setIsEditing = (data) => {
        this.setState(state=> {
            return {
                ...state,
                isEditing: data
            }
        })
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <button onClick={e=> {this.setIsEditing(true)}}>Configurações</button>
                {this.state.isEditing ? (
                    <DashboardConfiguration/>
                ): null}
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default Dashboard