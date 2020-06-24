import React from 'react'
import { View } from 'react-native'

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
                <button>Configurações</button>
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default index