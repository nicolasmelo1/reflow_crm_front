import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Chart from './Chart'
import DashboardConfigurationForm from './DashboardConfigurationForm'
import { 
    DashboardConfigurationCardContainer,
    DashboardConfigurationCardButtonsContainer,
    DashboardConfigurationCardChartAndTitleContainer,
    DashboardConfigurationCardTitle, 
    DashboardConfigurationCardIcon,
    DashboardConfigurationFullFormContainer
} from '../../styles/Dashboard'
import { strings } from '../../utils/constants'

/**
 * This component is actully just a single card of the dashboard configuration.
 * When you click on the dashboard configuration, every chart that the user has becomes a `card`
 * in the system. So this is actually each of those cards.
 * 
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} user - The user object so we can render specific stuff for admins.
 * @param {Function} getChartTypeNameById - Handy function that is used to retrieve the chart name label (so `pie`, `card` and others) 
 * using the chart id as parameter.
 * @param {Array<Object>} fieldOptions - To build charts we actually need 2 fields: 1 is the label field, the other
 * is the value field. fieldOptions is just an array with objects, with each object being a field the user can select. 
 * @param {Function} onSubmitDashboardSettings - Generally only used when we hit `save` in the DashboardFormulary, 
 * this calls a Redux action from the parent component to update the data. The parent component function actually holds the functions to make
 * API calls when updating or when creating a new chart.
 * @param {Function} onRemoveDashboardSettings - Same as onUpdateDashboardSettings except it is only used insied of this
 * component and is used for removing a chart.
 * @param {Object} dashboardConfigurationData - The data of this dashboard chart setting.
 * @param {Function} onGetDashboardSettingsData - this function is from the DashboardConfiguration component and is used
 * to load the data of the dashboardSettings configuration again when we save a new chart or edit a chart.
 */
const DashboardConfigurationCard = (props) => {
    const [formIsOpen, setFormIsOpen] = useState(false)

    const renderMobile = () => {
        return (
            <DashboardConfigurationCardContainer>
                <DashboardConfigurationCardButtonsContainer>
                    <TouchableOpacity onPress={e => {setFormIsOpen(true)}}>
                        <DashboardConfigurationCardIcon icon={'pencil-alt'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={e => {props.onRemoveDashboardSettings()}}>
                        <DashboardConfigurationCardIcon icon={'trash'}/>
                    </TouchableOpacity>
                </DashboardConfigurationCardButtonsContainer>
                <DashboardConfigurationCardChartAndTitleContainer chartType={props.getChartTypeNameById(props.dashboardConfigurationData.chart_type)}>
                    <DashboardConfigurationCardTitle>
                        {(props.dashboardConfigurationData.name === '') ? strings['pt-br']['dashboardConfigurationCardEmptyTitleLabel'] : props.dashboardConfigurationData.name}
                    </DashboardConfigurationCardTitle>
                    <Chart
                    chartType={props.getChartTypeNameById(props.dashboardConfigurationData.chart_type)}
                    labels={['Jan', 'Fev', 'Mar']}
                    values={[10, 20, 30]}
                    />
                </DashboardConfigurationCardChartAndTitleContainer>
                {formIsOpen ? (
                    <DashboardConfigurationFullFormContainer>
                        <DashboardConfigurationForm
                        onGetDashboardSettingsData={props.onGetDashboardSettingsData}
                        setFormIsOpen={setFormIsOpen}
                        types={props.types}
                        user={props.user}
                        getChartTypeNameById={props.getChartTypeNameById}
                        fieldOptions={props.fieldOptions}
                        dashboardConfigurationData={props.dashboardConfigurationData}
                        onSubmitDashboardSettings={props.onSubmitDashboardSettings}
                        />
                    </DashboardConfigurationFullFormContainer>
                ) : null}
            </DashboardConfigurationCardContainer>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <DashboardConfigurationCardContainer isOpen={formIsOpen}>
                    <DashboardConfigurationCardButtonsContainer>
                        <DashboardConfigurationCardIcon icon={'pencil-alt'} onClick={e=>{setFormIsOpen(true)}}/>
                        <DashboardConfigurationCardIcon icon={'trash'} onClick={e=>{props.onRemoveDashboardSettings()}}/>
                    </DashboardConfigurationCardButtonsContainer>
                    <DashboardConfigurationCardChartAndTitleContainer>
                        <DashboardConfigurationCardTitle isOpen={formIsOpen}>
                            {(props.dashboardConfigurationData.name === '') ? strings['pt-br']['dashboardConfigurationCardEmptyTitleLabel'] : props.dashboardConfigurationData.name}
                        </DashboardConfigurationCardTitle>
                        <Chart
                        chartType={props.getChartTypeNameById(props.dashboardConfigurationData.chart_type)}
                        labels={['Jan', 'Fev', 'Mar']}
                        values={[10, 20, 30]}
                        />
                    </DashboardConfigurationCardChartAndTitleContainer>
                </DashboardConfigurationCardContainer>
                <DashboardConfigurationFullFormContainer isOpen={formIsOpen}>
                    {formIsOpen ? (
                        <DashboardConfigurationForm
                        onGetDashboardSettingsData={props.onGetDashboardSettingsData}
                        setFormIsOpen={setFormIsOpen}
                        types={props.types}
                        user={props.user}
                        getChartTypeNameById={props.getChartTypeNameById}
                        fieldOptions={props.fieldOptions}
                        dashboardConfigurationData={props.dashboardConfigurationData}
                        onSubmitDashboardSettings={props.onSubmitDashboardSettings}
                        />
                    ) : null}
                </DashboardConfigurationFullFormContainer>

            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationCard