import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import DashboardConfiguration from './DashboardConfiguration'
import actions from '../../redux/actions'
import Chart from './Chart'
import { 
    DashboardChartsContainer,
    DashboardChartContainer,
    DashboardChartTitle,
    DashboardConfigurationButton
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

    onLoadDashboard = () => {
        if (this.source) {
            this.source.cancel()
        }
        this.source = this.CancelToken.source()
        this.props.onGetDashboardCharts(this.source, this.props.formName)
    }

    getChartTypeNameById = (id) => {
        const chartType =  this.props.login.types.defaults.chart_type.filter(chartType => chartType.id === id)
        return (chartType.length > 0) ? chartType[0].name : null
    }

    setIsEditing = () => {
        if (this.state.isEditing) {
            this.onLoadDashboard()
        }
        this.setState(state=> {
            return {
                ...state,
                isEditing: !this.state.isEditing
            }
        })
    }

    componentDidMount = () => {
        this.onLoadDashboard()
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <DashboardConfigurationButton onClick={e=> {this.setIsEditing()}}>
                    Configurações
                </DashboardConfigurationButton>
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
                                <DashboardChartTitle>
                                    {chart.name}
                                </DashboardChartTitle>
                                <div style={{ marginTop: '40px'}}>
                                    <Chart
                                    maintainAspectRatio={false}
                                    numberFormat={this.props.login.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === chart.number_format_type)[0]}
                                    chartType={this.getChartTypeNameById(chart.chart_type)}
                                    labels={chart.data.labels}
                                    values={chart.data.values}
                                    /> 
                                </div>
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
