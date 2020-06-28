import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Select } from '../Utils'
import { types } from '../../utils/constants'
import { 
    DashboardConfigurationFormFieldContainer,
    DashboardConfigurationFormFieldLabel,
    DashboardConfigurationFormFieldRequiredLabel,
    DashboardConfigurationFormFieldInput
} from '../../styles/Dashboard'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const DashboardConfigurationForm = (props) => {
    const [chartTypeOptions, setChartTypeOptions] = useState([])
    const [aggregationTypeOptions, setAggregationTypeOptions] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const [numberFormatTypeOptions, setNumberFormatTypeOptions] = useState([])
    const formattedAggregationTypeOtions = aggregationTypeByFieldValueType()

    const onChangeDashboardName = (data) => {
        props.dashboardConfigurationData.name = data
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    const onChangeChartType = (data) => {
        props.dashboardConfigurationData.chart_type = data && data.length > 0 ? data[0] : null
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    const onChangeLabelField = (data) => {
        const fieldId = data.length > 0 ? data[0] : null
        props.dashboardConfigurationData.label_field = fieldId
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    const onChangeValueField = (data) => {
        const fieldId = data.length > 0 ? data[0] : null
        props.dashboardConfigurationData.value_field = fieldId

        // if the aggregation type selected does not comply with the new aggregation type 
        // options we set the selected aggregation type to null
        const aggregationIds = aggregationTypeByFieldValueType().map(formattedAggregationTypeOtion => formattedAggregationTypeOtion.value)
        if (props.dashboardConfigurationData.aggregation_type && !aggregationIds.includes(props.dashboardConfigurationData.aggregation_type)) {
            props.dashboardConfigurationData.aggregation_type = null
        }
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    const onChangeForCompany = (data) => {
        props.dashboardConfigurationData.for_company = data
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    const onChangeAggregationType = (data) => {
        props.dashboardConfigurationData.aggregation_type = data && data.length > 0 ? data[0] : null
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    const onChangeNumberFormatType = (data) => {
        props.dashboardConfigurationData.number_format_type = data && data.length > 0 ? data[0] : null
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    // this is used to set specific aggregations depending on field types
    function aggregationTypeByFieldValueType() {
        const selectedFieldValue = props.fieldOptions.filter(fieldOption => fieldOption.id === props.dashboardConfigurationData.value_field)
        if (selectedFieldValue.length > 0) {
            if (selectedFieldValue[0].field_type !== 'number') {
                return aggregationTypeOptions.filter(aggregationTypeOption => ['count'].includes(aggregationTypeOption.name))
            }
        }
        return aggregationTypeOptions
    }

    // set select options
    useEffect(() => {
        setChartTypeOptions(props.types?.defaults?.chart_type.map(
            chartType => ({
                value: chartType.id, 
                label: types('pt-br', 'chart_type', chartType.name)
            })
        ))
        setAggregationTypeOptions(props.types?.defaults?.aggregation_type.map(
            aggregationType => ({
                value: aggregationType.id,
                label: types('pt-br', 'aggregation_type', aggregationType.name),
                name: aggregationType.name
            })
        ))
        setNumberFormatTypeOptions(props.types?.data?.field_number_format_type.map(
            numberFormatType => ({
                value: numberFormatType.id,
                label: types('pt-br', 'number_configuration_number_format_type', numberFormatType.type)
            })
        ))
    }, [])

    useEffect(() => {
        const options = props.fieldOptions.map(
            fieldOption => ({
                value: fieldOption.id, 
                label: fieldOption.label_name
            })
        )    
        setFieldOptions(options)
    }, [props.fieldOptions])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <button onClick={e=> {props.setFormIsOpen(false)}}>{'< Voltar'}</button>
                <DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldLabel>
                        <input type="checkbox" checked={props.dashboardConfigurationData.for_company} onChange={e => {onChangeForCompany(e.target.checked)}}/> Para Toda a companhia
                    </DashboardConfigurationFormFieldLabel>
                </DashboardConfigurationFormFieldContainer>
                <DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldLabel>
                        Nome
                        <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                    </DashboardConfigurationFormFieldLabel>
                    <DashboardConfigurationFormFieldInput
                    onChange={e=> {onChangeDashboardName(e.target.value)}}
                    value={props.dashboardConfigurationData.name}
                    />
                </DashboardConfigurationFormFieldContainer>
                <DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldLabel>
                        Tipo de gráfico
                        <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                    </DashboardConfigurationFormFieldLabel>
                    <Select
                    options={chartTypeOptions}
                    initialValues={chartTypeOptions.filter(chartTypeOption => chartTypeOption.value === props.dashboardConfigurationData.chart_type)}
                    onChange={onChangeChartType}
                    />
                </DashboardConfigurationFormFieldContainer>
                <DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldLabel>
                        Campo de legenda
                        <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                    </DashboardConfigurationFormFieldLabel>
                    <Select
                    options={fieldOptions}
                    initialValues={fieldOptions.filter(fieldOption => fieldOption.value === props.dashboardConfigurationData.label_field)}
                    onChange={onChangeLabelField}
                    />
                </DashboardConfigurationFormFieldContainer>
                <DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldLabel>
                        Campo de valor
                        <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                    </DashboardConfigurationFormFieldLabel>
                    <Select
                    options={fieldOptions}
                    initialValues={fieldOptions.filter(fieldOption => fieldOption.value === props.dashboardConfigurationData.value_field)}
                    onChange={onChangeValueField}
                    />
                </DashboardConfigurationFormFieldContainer>
                <DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldLabel>
                        Tipo de agregação
                        <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                    </DashboardConfigurationFormFieldLabel>
                    <Select
                    options={formattedAggregationTypeOtions}
                    initialValues={aggregationTypeOptions.filter(aggregationTypeOption => aggregationTypeOption.value === props.dashboardConfigurationData.aggregation_type)}
                    onChange={onChangeAggregationType}
                    />
                </DashboardConfigurationFormFieldContainer>
                <DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldLabel>
                        Formatação de número
                        <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                    </DashboardConfigurationFormFieldLabel>
                    <Select
                    options={numberFormatTypeOptions}
                    initialValues={numberFormatTypeOptions.filter(numberFormatTypeOption => numberFormatTypeOption.value === props.dashboardConfigurationData.number_format_type)}
                    onChange={onChangeNumberFormatType}
                    />
                </DashboardConfigurationFormFieldContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationForm