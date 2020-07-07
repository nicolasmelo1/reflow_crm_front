import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import DashboardConfiguration from './DashboardConfiguration'
import actions from '../../redux/actions'
import Filter from '../Filter'
import Chart from './Chart'
import { 
    DashboardChartsContainer,
    DashboardChartContainer,
    DashboardChartTitle,
    DashboardConfigurationButton,
    DashboardFilterButton,
    DashboardFilterContainer,
    DashboardFilterHolder,
    DashboardFilterIcon,
    DashboardTotalContainer
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
            fieldOptions: [],
            isEditing: false,
            isLoadingData: false
        }
    }

    setFieldOptions = (data) => {
        this.setState(state => {
            return {
                ...state,
                fieldOptions: data
            }
        })
    }

    // If the data is being loaded by the visualization
    setIsLoadingData = (isLoading) => {
        this.setState(state => {
            return {
                ...state,
                isLoadingData: isLoading
            }
        })
    }

    onLoadData = (source, params={}) => {
        this.props.onGetDashboardCharts(this.source, this.props.formName, params)
    }


    onFilter = (searchInstances) => {
        this.setIsLoadingData(true)
        const searchParams = this.props.onSetSearch(searchInstances.map(
            searchInstance => ({
                searchField: searchInstance.field_name,
                searchValue: searchInstance.value,
            })
        ))

        this.getNewDataFromUpdatedParams({...searchParams}).then(__ => {
            this.setIsLoadingData(false)
        })
    }

    getParams = () => {
        return {
            search_value: this.props.filter.search_value,
            search_field: this.props.filter.search_field,
            search_exact: this.props.filter.search_exact
        }
    }

    onLoadDashboard = () => {
        if (this.source) {
            this.source.cancel()
        }
        this.source = this.CancelToken.source()
        this.props.onGetFieldOptions(this.source, this.props.formName).then(response => {
            if (response && response.status === 200) {
                this.setFieldOptions(response.data.data)
            }
        })
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
                <Filter
                fields={this.state.fieldOptions.map(fieldOption => ({ name: fieldOption.name, label: fieldOption.label_name, type: fieldOption.type }))}
                params={this.getParams()} 
                onFilter={this.onFilter}
                types={this.props.login.types}
                container={DashboardFilterHolder}
                filterButton={DashboardFilterButton}
                filterContainer={DashboardFilterContainer}
                filterButtonIcon={<DashboardFilterIcon icon="filter"/>}
                />
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
                        <DashboardTotalContainer>
                            {this.props.dashboard.charts.filter(chart => this.getChartTypeNameById(chart.chart_type) === 'card').map((chart, index) => (
                                <Chart
                                key={index}
                                maintainAspectRatio={false}
                                numberFormat={this.props.login.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === chart.number_format_type)[0]}
                                chartType={this.getChartTypeNameById(chart.chart_type)}
                                labels={chart.data.labels}
                                values={chart.data.values}
                                />
                            ))}
                        </DashboardTotalContainer>
                        {this.props.dashboard.charts.filter(chart => this.getChartTypeNameById(chart.chart_type) !== 'card').map((chart, index) => (
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

export default connect(state => ({ filter: state.home.filter, dashboard: state.home.dashboard, login: state.login }), actions)(Dashboard);
