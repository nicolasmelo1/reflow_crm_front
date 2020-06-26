import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { DashboardConfigurationAddNewCard, DashboardConfigurationAddNewIcon, DashboardConfigurationAddNewText } from '../../styles/Dashboard'
import charts from '../../utils/charts'
import DashboardConfigurationForm from './DashboardConfigurationForm'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const DashboardConfiguration = (props) => {
    const [dashboardSettingsData, setDashboardSettingsData] = useState([])
    const sourceRef = React.useRef(null)
    //const buildChart = React.useRef(null)
    //const chart = React.useRef(null)
    
    //const [chartType, setChartType] = useState('bar')

    /*const changeChargeType = () => {
        if (chart.current) {
            chart.current.destroy()
        }
        chart.current = charts(buildChart.current, chartType, ['Jan', 'Fev', 'Mar'], [10, 20, 30])
    }*/

    const onUpdateDashboardSettings = (index, newData) => {
        dashboardSettingsData[index] = newData
        setDashboardSettingsData([...dashboardSettingsData])
    }

    const onRemoveDashboardSettings = (index) => {
        dashboardSettingsData.splice(index, 1)
        setDashboardSettingsData([...dashboardSettingsData])
    }

    const addDashboardSettings = () => {
        dashboardSettingsData.push({
            id: null,
            name: '',
            for_company: false,
            value_field: null,
            label_field: null,
            number_format_type: null,
            chart_type: null,
            aggregation_type: null
        })
        setDashboardSettingsData([...dashboardSettingsData])
    }

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        // Load dashboard settings data directly in the component
        props.onGetDashboardSettings(sourceRef.current, props.formName).then(response=> {
            if (response && response.status === 200 && response.data.data) {
                setDashboardSettingsData(response.data.data)
            }
        })
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <DashboardConfigurationAddNewCard onClick={e=>{addDashboardSettings()}}>
                    <DashboardConfigurationAddNewIcon icon="plus-circle"/>
                    <DashboardConfigurationAddNewText>Adicionar um novo dash</DashboardConfigurationAddNewText>
                </DashboardConfigurationAddNewCard>
                {dashboardSettingsData.map((dashboardSetting, index) => (
                    <DashboardConfigurationForm
                    key={index}
                    dashboardConfigurationIndex={index}
                    onUpdateDashboardSettings={onUpdateDashboardSettings}
                    onRemoveDashboardSettings={onRemoveDashboardSettings}
                    dashboardConfigurationData={dashboardSetting}
                    />
                ))}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfiguration