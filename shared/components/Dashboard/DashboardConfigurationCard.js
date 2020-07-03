import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
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
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const DashboardConfigurationCard = (props) => {
    const [formIsOpen, setFormIsOpen] = useState(false)

    const renderMobile = () => {
        return (
            <View></View>
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
                        setFormIsOpen={setFormIsOpen}
                        types={props.types}
                        getChartTypeNameById={props.getChartTypeNameById}
                        fieldOptions={props.fieldOptions}
                        dashboardConfigurationData={props.dashboardConfigurationData}
                        onUpdateDashboardSettings={props.onUpdateDashboardSettings}
                        />
                    ) : null}
                </DashboardConfigurationFullFormContainer>

            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationCard