import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import DashboardConfiguration from './DashboardConfiguration'
import actions from '../../redux/actions'
import Chart from './Chart'
import { 
    DashboardChartsContainer,
    DashboardChartContainer
 } from '../../styles/Dashboard'


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
    /*addDashboard = () => {
        this.setState(state => {
            return {
                ...state,
                dashboards: [...state.dashboards, {
                    chart: null,
                    reference: React.createRef()
                }]
            }
        })
    }*/

    getChartTypeNameById = (id) => {
        const chartType =  this.props.login.types.defaults.chart_type.filter(chartType => chartType.id === id)
        return (chartType.length > 0) ? chartType[0].name : null
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
        this.props.onGetDashboardCharts(this.source, this.props.formName)
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        console.log(this.props.dashboard.charts)
        return (
            <div>
                <button onClick={e=> {this.setIsEditing()}}>Configurações</button>
                {this.state.isEditing ? (
                    <DashboardConfiguration
                    onRemoveDashboardSettings={this.props.onRemoveDashboardSettings}
                    onUpdateDashboardSettings={this.props.onUpdateDashboardSettings}
                    onCreateDashboardSettings={this.props.onCreateDashboardSettings}
                    getChartTypeNameById={this.getChartTypeNameById}
                    cancelToken={this.CancelToken}
                    types={this.props.login.types}
                    formName={this.props.formName}
                    onGetFieldOptions={this.props.onGetFieldOptions}
                    onGetDashboardSettings={this.props.onGetDashboardSettings}
                    />
                ): (
                    <DashboardChartsContainer>
                        {this.props.dashboard.charts.map((chart, index) => (
                            <DashboardChartContainer key={index}>
                                <h2 style={{textAlign: 'center'}}>{chart.name}</h2>
                                <Chart
                                maintainAspectRatio={false}
                                chartType={this.getChartTypeNameById(chart.chart_type)}
                                labels={chart.data.labels}
                                values={chart.data.values}
                                /> 
                            </DashboardChartContainer>
                        ))}
                    </DashboardChartsContainer>
                )}
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ dashboard: state.home.dashboard, login: state.login }), actions)(Dashboard);
