import React from 'react'
import { View, Text, FlatList, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import DashboardConfiguration from './DashboardConfiguration'
import actions from '../../redux/actions'
import Filter from '../Filter'
import DateRangePicker from '../Utils/DateRangePicker'
import Chart from './Chart'
import { strings } from '../../utils/constants'
import { stringToJsDateFormat } from '../../utils/dates'
import { 
    DashboardChartsContainer,
    DashboardChartContainer,
    DashboardChartTitle,
    DashboardTopButtonsContainer,
    DashboardConfigurationButton,
    DashboardConfigurationButtonHolder,
    DashboardFilterButtonLabel,
    DashboardFilterButton,
    DashboardFilterContainer,
    DashboardFilterHolder,
    DashboardFilterIcon,
    DashboardTotalContainer,
    DashboardUpdateDateHolder,
    DashboardUpdateDateLabel,
    DashboardUpdateDateInput,
    DashboardUpdateDateDateRangeContainer
 } from '../../styles/Dashboard'


/**
 * Main component for Dashboards. This component is responsible for loading charts and displaying the values to the user
 * and also for creating each chart individually.
 */
class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.chartContainerRef = React.createRef()
        this.updateDateRangeInputRef = React.createRef()
        this.state = {
            hideTopButtons: false,
            fieldOptions: [],
            isEditing: false,
            isLoadingData: false
        }
    }

    /**
     * This is to setFieldOptions, usually fieldOptions are used by the Filter component to know which fields from the formulary 
     * can be filtered.
     * 
     * @param {Array<Object>} data - The field option data that you recieve from the backend
     */
    setFieldOptions = (data) => {
        this.setState(state => {
            return {
                ...state,
                fieldOptions: data
            }
        })
    }

    /**
     * This is used so we prevent the user from clicking when we make a new filter.
     * 
     * @param {Boolean} isLoading - Defines if the data is being loaded or not.
     */
    setIsLoadingData = (isLoading) => {
        this.setState(state => {
            return {
                ...state,
                isLoadingData: isLoading
            }
        })
    }

    onChangeUpdateDates = (dates) => {
        if (this.source) {
            this.source.cancel()
        }
        this.source = this.CancelToken.source()
        const response = this.props.setDashboardUpdateDate(dates)
        const params = {
            ...this.getParams(),
            to_date: response.endDate,
            from_date: response.startDate
        }
        this.props.onGetDashboardCharts(this.source, this.props.formName, params)
    }

    onFilter = (searchInstances) => {
        this.setIsLoadingData(true)
        if (this.source) {
            this.source.cancel()
        }
        this.source = this.CancelToken.source()

        const searchParams = this.props.onSetSearch(searchInstances.map(
            searchInstance => ({
                searchField: searchInstance.field_name,
                searchValue: searchInstance.value,
            })
        ))

        this.props.onGetDashboardCharts(this.source, this.props.formName, {...searchParams}).then(__ => {
            this.setIsLoadingData(false)
        })
    }

    getParams = () => {
        return {
            to_date: this.props.dashboard.updateDates.endDate,
            from_date: this.props.dashboard.updateDates.startDate,
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
        this.onChangeUpdateDates([moment().subtract(59, 'days').toDate(), moment().toDate()])
        this.props.onGetFieldOptions(this.source, this.props.formName).then(response => {
            if (response && response.status === 200) {
                this.setFieldOptions(response.data.data)
            }
        })
    }

    getChartTypeNameById = (id) => {
        const chartType = this.props.login?.types?.defaults?.chart_type ? this.props.login.types.defaults.chart_type.filter(chartType => chartType.id === id) : []
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

    hideMenuOnScroll = () => {
        if (!this.state.isEditing) {
            const currentScrollPos = this.chartContainerRef.current.scrollTop
            const maxScrollTop = this.chartContainerRef.current.scrollHeight - this.chartContainerRef.current.clientHeight;
            if (this.prevScrollpos > currentScrollPos) {
                this.setState(state=> ({
                    ...state,
                    hideTopButtons: false
                }))
            } else if (this.prevScrollpos > 0) {
                this.setState(state=> ({
                    ...state,
                    hideTopButtons: true
                }))        
            }
            if (currentScrollPos < maxScrollTop) {
                this.prevScrollpos = currentScrollPos
            }
        }
    }

    componentDidMount = () => {
        this.onLoadDashboard()
        if (process.env['APP'] === 'web') {
            this.prevScrollpos = this.chartContainerRef.current.scrollTop
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.formName !== this.props.formName) {
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.onLoadDashboard()
        }
    }
    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <ScrollView 
            style={{ width:'100%', height: '79%'}}
            keyboardShouldPersistTaps={'handled'}
            >
                <DashboardTopButtonsContainer>
                    <DashboardConfigurationButton onPress={e=> {this.setIsEditing()}} isEditing={this.state.isEditing}>
                        <Text style={{ color:'#fff' }}>
                            {this.state.isEditing ?  strings['pt-br']['dashboardConfigurationButtonLabelOpen'] : strings['pt-br']['dashboardConfigurationButtonLabelClosed']}
                        </Text>
                    </DashboardConfigurationButton>
                    {!this.state.isEditing ? (
                        <Filter
                        fields={this.state.fieldOptions.map(fieldOption => ({ name: fieldOption.name, label: fieldOption.label_name, type: fieldOption.type }))}
                        params={this.getParams()} 
                        onFilter={this.onFilter}
                        types={this.props.login.types}
                        filterButton={DashboardFilterButton}
                        filterButtonLabel={DashboardFilterButtonLabel}
                        filterButtonIcon={<DashboardFilterIcon icon="filter"/>}
                        />
                    ) : null}
                </DashboardTopButtonsContainer>
                {this.state.isEditing ? (
                    <DashboardConfiguration
                    onRemoveDashboardSettings={this.props.onRemoveDashboardSettings}
                    onUpdateDashboardSettings={this.props.onUpdateDashboardSettings}
                    onCreateDashboardSettings={this.props.onCreateDashboardSettings}
                    getChartTypeNameById={this.getChartTypeNameById}
                    cancelToken={this.CancelToken}
                    user={this.props.login.user}
                    types={this.props.login.types}
                    formName={this.props.formName}
                    onGetFieldOptions={this.props.onGetFieldOptions}
                    onGetDashboardSettings={this.props.onGetDashboardSettings}
                    />
                ) : (
                    <DashboardChartsContainer>
                        {this.props.dashboard.charts.length === 0 ? (
                            <Text>{strings['pt-br']['dashboardNoChartsMessageLabel']}</Text>
                        ) : (
                            <View>
                                {this.props.dashboard.charts.filter(chart => this.getChartTypeNameById(chart.chart_type) === 'card').length !== 0 ? (
                                    <DashboardTotalContainer>
                                        <FlatList
                                        horizontal={true}
                                        keyboardShouldPersistTaps={'handled'}
                                        data={this.props.dashboard.charts.filter(chart => this.getChartTypeNameById(chart.chart_type) === 'card')}
                                        keyExtractor={(__, index) => index.toString()}
                                        renderItem={({ item, index, __ }) => {
                                            return (
                                                <Chart
                                                maintainAspectRatio={false}
                                                numberFormat={this.props.login.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === item.number_format_type)[0]}
                                                chartType={this.getChartTypeNameById(item.chart_type)}
                                                labels={item.data.labels}
                                                values={item.data.values}
                                                chartName={item.name}
                                                /> 
                                            )
                                        }}
                                        />
                                    </DashboardTotalContainer>
                                ) : null }
                                {this.props.dashboard.charts.filter(chart => this.getChartTypeNameById(chart.chart_type) !== 'card').map((chart, index) => (
                                    <DashboardChartContainer key={index}>
                                        <DashboardChartTitle>
                                            {chart.name}
                                        </DashboardChartTitle>
                                        <Chart
                                        maintainAspectRatio={false}
                                        numberFormat={this.props.login.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === chart.number_format_type)[0]}
                                        chartType={this.getChartTypeNameById(chart.chart_type)}
                                        labels={chart.data.labels}
                                        values={chart.data.values}
                                        /> 
                                    </DashboardChartContainer>
                                ))}
                            </View>
                        )}
                    </DashboardChartsContainer>
                )}
            </ScrollView>
        )
    }

    renderWeb = () => {
        return (
            <div>
                <DashboardTopButtonsContainer hideTopButtons={this.state.hideTopButtons}>
                    <DashboardConfigurationButtonHolder>
                        <DashboardConfigurationButton onClick={e=> {this.setIsEditing()}}>
                            {this.state.isEditing ?  strings['pt-br']['dashboardConfigurationButtonLabelOpen'] : strings['pt-br']['dashboardConfigurationButtonLabelClosed']}
                        </DashboardConfigurationButton>
                    </DashboardConfigurationButtonHolder>
                    {this.state.isEditing ? '' : (
                        <DashboardUpdateDateHolder>
                            <DashboardUpdateDateLabel>{strings['pt-br']['dashboardUpdateDatesLabel']}</DashboardUpdateDateLabel>
                            <DashboardUpdateDateInput value={`${this.props.dashboard.updateDates.startDate} - ${this.props.dashboard.updateDates.endDate}`} ref={this.updateDateRangeInputRef} readOnly={true}/>
                            <DashboardUpdateDateDateRangeContainer>
                                <DateRangePicker input={this.updateDateRangeInputRef} 
                                closeWhenSelected={true}
                                onChange={this.onChangeUpdateDates} 
                                initialDays={[
                                    this.props.dashboard.updateDates.startDate !== '' ? stringToJsDateFormat(this.props.dashboard.updateDates.startDate, this.props.login.dateFormat.split(' ')[0]) : '', 
                                    this.props.dashboard.updateDates.endDate !== '' ? stringToJsDateFormat(this.props.dashboard.updateDates.endDate, this.props.login.dateFormat.split(' ')[0]) : ''
                                ]}
                                />
                            </DashboardUpdateDateDateRangeContainer>
                        </DashboardUpdateDateHolder>
                    )}
                    {this.state.isEditing ? '' : (
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
                    )}
                </DashboardTopButtonsContainer>
                {this.state.isEditing ? (
                    <DashboardConfiguration
                    onRemoveDashboardSettings={this.props.onRemoveDashboardSettings}
                    onUpdateDashboardSettings={this.props.onUpdateDashboardSettings}
                    onCreateDashboardSettings={this.props.onCreateDashboardSettings}
                    getChartTypeNameById={this.getChartTypeNameById}
                    cancelToken={this.CancelToken}
                    types={this.props.login.types}
                    user={this.props.login.user}
                    formName={this.props.formName}
                    onGetFieldOptions={this.props.onGetFieldOptions}
                    onGetDashboardSettings={this.props.onGetDashboardSettings}
                    />
                ): (
                    <DashboardChartsContainer ref={this.chartContainerRef} onScroll={e=> this.hideMenuOnScroll}>
                        {this.props.dashboard.charts.length === 0 ? (
                            <p>{strings['pt-br']['dashboardNoChartsMessageLabel']}</p>
                        ) : (
                            <div>
                                {this.props.dashboard.charts.filter(chart => this.getChartTypeNameById(chart.chart_type) === 'card').length !== 0 ? (
                                    <DashboardTotalContainer>
                                        {this.props.dashboard.charts.filter(chart => this.getChartTypeNameById(chart.chart_type) === 'card').map((chart, index) => (
                                            <Chart
                                            key={index}
                                            chartName={chart.name}
                                            maintainAspectRatio={true}
                                            numberFormat={this.props.login.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === chart.number_format_type)[0]}
                                            chartType={this.getChartTypeNameById(chart.chart_type)}
                                            labels={chart.data.labels}
                                            values={chart.data.values}
                                            />
                                        ))}
                                    </DashboardTotalContainer>
                                ) : ''}
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
                            </div>
                        )}
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
