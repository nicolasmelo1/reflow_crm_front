import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import DashboardConfiguration from './DashboardConfiguration'
import actions from '../../redux/actions'
import charts from '../../utils/charts'

/**
 * Main function for Dashboards visualization
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            dashboards: [],
            isEditing: false
        }
    }

    // First we add the dashboard than it is rendered and then we update the chart in
    // componentdidupdate 
    addDashboard = () => {
        this.setState(state => {
            return {
                ...state,
                dashboards: [...state.dashboards, {
                    chart: null,
                    reference: React.createRef()
                }]
            }
        })
    }

    updateDashboard = (index, newData) => {
        this.setState(state => {
            state.dashboards[index] = newData
            return {
                ...state,
                dashboards: [...state.dashboards]
            }
        })
    }

    removeDashboard = () => {
        this.setState(state => {
            state.dashboards.pop()
            return {
                ...state,
                dashboards: [...state.dashboards]
            }
        })
    }

    setIsEditing = () => {
        this.setState(state=> {
            return {
                ...state,
                isEditing: !this.state.isEditing
            }
        })
    }

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        /*agent.http.DASHBOARD.getDashboardData(this.source, 'sum').then(response => 
            charts(this.canvas.current, 'bar', response.data.data.labels, response.data.data.values)
        )*/
    }

    componentDidUpdate = () => {
        /*this.state.dashboards.forEach((dashboard, index) => {
            if (dashboard.chart === null){
                agent.http.DASHBOARD.getDashboardData(this.source, 'sum').then(response => {
                    dashboard.chart = charts(dashboard.reference.current, 'bar', response.data.data.labels, response.data.data.values)
                    this.updateDashboard(index, dashboard)
                })
            }
        })*/
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <button onClick={e=> {this.removeDashboard()}}>Remover Dashboard</button>
                <button onClick={e=> {this.addDashboard()}}>Adicionar Dashboard</button>
                <button onClick={e=> {this.setIsEditing()}}>Configurações</button>
                {this.state.isEditing ? (
                    <DashboardConfiguration
                    cancelToken={this.CancelToken}
                    types={this.props.login.types}
                    formName={this.props.formName}
                    onGetFieldOptions={this.props.onGetFieldOptions}
                    onGetDashboardSettings={this.props.onGetDashboardSettings}
                    />
                ): (
                    <div>
                        {this.state.dashboards.map((dashboard, index) => (
                            <canvas key={index} ref={dashboard.reference}/>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login }), actions)(Dashboard);
