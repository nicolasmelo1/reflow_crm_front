import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Chart from './Chart'
import DashboardConfigurationForm from './DashboardConfigurationForm'
import { 
    DashboardConfigurationCardContainer, 
    DashboardConfigurationCardTitle, 
    DashboardConfigurationCardIcon,
    DashboardConfigurationFormContainer
} from '../../styles/Dashboard'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const DashboardConfigurationCard = (props) => {
    const [formIsOpen, setFormIsOpen] = useState(false)

    const getChartTypeNameById = (id) => {
        const chartType =  props.types.defaults.chart_type.filter(chartType => chartType.id === id)
        return (chartType.length > 0) ? chartType[0].name : null
    }

    /*useEffect(() => {
        if (previewCanvas.current && props.dashboardConfigurationData.chart_type) {
            previewChart.current = charts(previewCanvas.current, getChartTypeNameById(props.dashboardConfigurationData.chart_type), ['Jan', 'Fev', 'Mar'], [10, 20, 30])
        }
    })*/

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <DashboardConfigurationCardContainer isOpen={formIsOpen} onClick={e => {setFormIsOpen(true)}}>
                    <DashboardConfigurationCardTitle isOpen={formIsOpen}>
                        {props.dashboardConfigurationData.name}
                    </DashboardConfigurationCardTitle>
                    <Chart
                    chartType={getChartTypeNameById(props.dashboardConfigurationData.chart_type)}
                    labels={['Jan', 'Fev', 'Mar']}
                    values={[10, 20, 30]}
                    />
                    <DashboardConfigurationCardIcon icon={'trash'} onClick={e=>{props.onRemoveDashboardSettings(props.dashboardConfigurationIndex)}}/>
                </DashboardConfigurationCardContainer>
                <DashboardConfigurationFormContainer isOpen={formIsOpen}>
                    <DashboardConfigurationForm
                    setFormIsOpen={setFormIsOpen}
                    dashboardConfigurationData={props.dashboardConfigurationData}
                    onUpdateDashboardSettings={props.onUpdateDashboardSettings}
                    />
                </DashboardConfigurationFormContainer>

            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationCard