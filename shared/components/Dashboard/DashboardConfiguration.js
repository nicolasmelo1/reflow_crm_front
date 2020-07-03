import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import DashboardConfigurationCard from './DashboardConfigurationCard'
import { 
    DashboardConfigurationAddNewCard, 
    DashboardConfigurationCardsContainer, 
    DashboardConfigurationAddNewIcon, 
    DashboardConfigurationAddNewText 
} from '../../styles/Dashboard'
import { strings } from '../../utils/constants'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const DashboardConfiguration = (props) => {
    const [dashboardSettingsData, setDashboardSettingsData] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const sourceRef = React.useRef(null)

    const onUpdateDashboardSettings = async (index, newData) => {
        let response = null
        if (newData.id) {
            response = await props.onUpdateDashboardSettings(newData, props.formName, newData.id)
        } else {
            response = await props.onCreateDashboardSettings(newData, props.formName)
        }
        if (response && response.status === 200) {
            dashboardSettingsData[index] = newData
            setDashboardSettingsData([...dashboardSettingsData])
        }
        return response
    }

    const onRemoveDashboardSettings = (index) => {
        if (dashboardSettingsData[index]) {
            if (dashboardSettingsData[index].id) {
                props.onRemoveDashboardSettings(props.formName, dashboardSettingsData[index].id)
            }
            dashboardSettingsData.splice(index, 1)
            setDashboardSettingsData([...dashboardSettingsData])
        }
    }

    const addDashboardSettings = () => {
        let chartTypeId = null
        let aggregationTypeId = null
        if (props.types?.defaults?.chart_type && props.types.defaults.chart_type.length > 0) {
            chartTypeId = props.types.defaults.chart_type[Math.floor(Math.random() * props.types.defaults.chart_type.length)].id
        }
        if (props.types?.defaults?.aggregation_type && props.types.defaults.aggregation_type.length > 0) {
            aggregationTypeId = props.types.defaults.aggregation_type[Math.floor(Math.random() * props.types.defaults.aggregation_type.length)].id
        }
        dashboardSettingsData.push({
            id: null,
            name: '',
            for_company: false,
            value_field: null,
            label_field: null,
            number_format_type: null,
            chart_type: chartTypeId,
            aggregation_type: aggregationTypeId
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
        props.onGetFieldOptions(sourceRef.current, props.formName).then(response => {
            if (response && response.status === 200) {
                setFieldOptions(response.data.data)
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
            <DashboardConfigurationCardsContainer>
                <DashboardConfigurationAddNewCard onClick={e=>{addDashboardSettings()}}>
                    <DashboardConfigurationAddNewIcon icon="plus-circle"/>
                    <DashboardConfigurationAddNewText>{strings['pt-br']['dashboardConfigurationAddNewCardLabel']}</DashboardConfigurationAddNewText>
                </DashboardConfigurationAddNewCard>
                {dashboardSettingsData.map((dashboardSetting, index) => (
                    <DashboardConfigurationCard
                    key={index}
                    types={props.types}
                    getChartTypeNameById={props.getChartTypeNameById}
                    fieldOptions={fieldOptions}
                    onUpdateDashboardSettings={(data) => (onUpdateDashboardSettings(index, data))}
                    onRemoveDashboardSettings={() => (onRemoveDashboardSettings(index))}
                    dashboardConfigurationData={dashboardSetting}
                    />
                ))}
            </DashboardConfigurationCardsContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfiguration