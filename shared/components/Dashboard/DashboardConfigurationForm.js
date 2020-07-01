import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Select } from '../Utils'
import Chart from './Chart'
import { types, errors } from '../../utils/constants'
import { 
    DashboardConfigurationFormSelectContainer,
    DashboardConfigurationFormContainer,
    DashboardConfigurationFormFieldContainer,
    DashboardConfigurationFormFieldLabel,
    DashboardConfigurationFormFieldRequiredLabel,
    DashboardConfigurationFormFieldInput,
    DashboardConfigurationChartContainer,
    DashboardConfigurationPreviewTitleLabel,
    DashboardConfigurationSaveButton,
} from '../../styles/Dashboard'


/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const DashboardConfigurationForm = (props) => {
    const [formErrors, setFormErrors] = useState({})
    const [dashboardConfigurationData, setDashboardConfigurationData] = useState({})
    const [isOpenNumberFormatTypeSelect, setIsOpenNumberFormatTypeSelect] = useState(false)
    const [isOpenValueFieldSelect, setIsOpenValueFieldSelect] = useState(false)
    const [isOpenLabelFieldSelect, setIsOpenLabelFieldSelect] = useState(false)
    const [isOpenAggregationTypeSelect, setIsOpenAggregationTypeSelect] = useState(false)
    const [isOpenChartTypeSelect, setIsOpenChartTypeSelect] = useState(false)
    const [chartTypeOptions, setChartTypeOptions] = useState([])
    const [aggregationTypeOptions, setAggregationTypeOptions] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const [numberFormatTypeOptions, setNumberFormatTypeOptions] = useState([])
    const formattedAggregationTypeOtions = aggregationTypeByFieldValueType()

    const onChangeDashboardName = (data) => {
        dashboardConfigurationData.name = data
        setDashboardConfigurationData({...dashboardConfigurationData})
    }

    const onChangeChartType = (data) => {
        dashboardConfigurationData.chart_type = data && data.length > 0 ? data[0] : null
        setDashboardConfigurationData({...dashboardConfigurationData})
    }

    const onChangeLabelField = (data) => {
        const fieldId = data.length > 0 ? data[0] : null
        dashboardConfigurationData.label_field = fieldId
        setDashboardConfigurationData({...dashboardConfigurationData})
    }

    const onChangeValueField = (data) => {
        const fieldId = data.length > 0 ? data[0] : null
        dashboardConfigurationData.value_field = fieldId

        // if the aggregation type selected does not comply with the new aggregation type 
        // options we set the selected aggregation type to null
        const aggregationIds = aggregationTypeByFieldValueType().map(formattedAggregationTypeOtion => formattedAggregationTypeOtion.value)
        if (dashboardConfigurationData.aggregation_type && !aggregationIds.includes(dashboardConfigurationData.aggregation_type)) {
            dashboardConfigurationData.aggregation_type = null
        }
        setDashboardConfigurationData({...dashboardConfigurationData})
    }

    const onChangeForCompany = (data) => {
        dashboardConfigurationData.for_company = data
        setDashboardConfigurationData({...dashboardConfigurationData})
    }

    const onChangeAggregationType = (data) => {
        dashboardConfigurationData.aggregation_type = data && data.length > 0 ? data[0] : null
        setDashboardConfigurationData({...dashboardConfigurationData})
    }

    const onChangeNumberFormatType = (data) => {
        dashboardConfigurationData.number_format_type = data && data.length > 0 ? data[0] : null
        setDashboardConfigurationData({...dashboardConfigurationData})
    }

    const onSubmit = () => {
        props.onUpdateDashboardSettings(dashboardConfigurationData).then(response=> {
            if (response && response.status === 400) {
                if (Object.keys(response.data.error).every(error=> Object.keys(dashboardConfigurationData).includes(error))) {
                    // its a error with one of the fields
                    const error = JSON.parse(JSON.stringify(response.data.error))
                    Object.keys(response.data.error).forEach(errorKey => {
                        // might need to add new cases in the future, this only chacks blank fields
                        error[errorKey] = (error[errorKey][0] === 'blank') ? errors('pt-br', 'blank_field') : errors('pt-br', 'unknown_field')
                    })
                    setFormErrors(error)
                }
            } else {
                setFormErrors({})
                props.setFormIsOpen(false)
            }
        })
    }

    // this is used to set specific aggregations depending on field types
    function aggregationTypeByFieldValueType() {
        const selectedFieldValue = props.fieldOptions.filter(fieldOption => fieldOption.id === dashboardConfigurationData.value_field)
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

    // sets the dashboard configuration data to be used in the forms
    // we use it this way because we only update on the list when we click `save`
    useEffect(() => {
        setDashboardConfigurationData({...props.dashboardConfigurationData})
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <div style={{width: '100%'}}>
                    <button onClick={e=> {props.setFormIsOpen(false)}}>{'< Voltar'}</button>
                </div>
                <DashboardConfigurationFormContainer>
                    <DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldLabel>
                            <input type="checkbox" checked={dashboardConfigurationData.for_company ? dashboardConfigurationData.for_company : false} onChange={e => {onChangeForCompany(e.target.checked)}}/> Para Toda a companhia
                        </DashboardConfigurationFormFieldLabel>
                    </DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldLabel>
                            Nome
                            <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                        </DashboardConfigurationFormFieldLabel>
                        <DashboardConfigurationFormFieldInput
                        onChange={e=> {onChangeDashboardName(e.target.value)}}
                        value={dashboardConfigurationData.name}
                        errors={formErrors.name}
                        />
                    </DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldLabel>
                            Tipo de gráfico
                            <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                        </DashboardConfigurationFormFieldLabel>
                        <DashboardConfigurationFormSelectContainer isOpen={isOpenChartTypeSelect} errors={formErrors.chart_type}>
                            <Select
                            options={chartTypeOptions}
                            initialValues={chartTypeOptions.filter(chartTypeOption => chartTypeOption.value === dashboardConfigurationData.chart_type)}
                            onChange={onChangeChartType}
                            setIsOpen={setIsOpenChartTypeSelect}
                            isOpen={isOpenChartTypeSelect}
                            />
                        </DashboardConfigurationFormSelectContainer>
                    </DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldLabel>
                            Campo de legenda
                            <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                        </DashboardConfigurationFormFieldLabel>
                        <DashboardConfigurationFormSelectContainer isOpen={isOpenLabelFieldSelect} errors={formErrors.label_field}>
                            <Select
                            options={fieldOptions}
                            initialValues={fieldOptions.filter(fieldOption => fieldOption.value === dashboardConfigurationData.label_field)}
                            onChange={onChangeLabelField}
                            setIsOpen={setIsOpenLabelFieldSelect}
                            isOpen={isOpenLabelFieldSelect}
                            />
                        </DashboardConfigurationFormSelectContainer>
                    </DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldLabel>
                            Campo de valor
                            <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                        </DashboardConfigurationFormFieldLabel>
                        <DashboardConfigurationFormSelectContainer isOpen={isOpenValueFieldSelect} errors={formErrors.value_field}>
                            <Select

                            options={fieldOptions}
                            initialValues={fieldOptions.filter(fieldOption => fieldOption.value === dashboardConfigurationData.value_field)}
                            onChange={onChangeValueField}
                            setIsOpen={setIsOpenValueFieldSelect}
                            isOpen={isOpenValueFieldSelect}
                            />
                        </DashboardConfigurationFormSelectContainer>
                    </DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldLabel>
                            Tipo de agregação
                            <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                        </DashboardConfigurationFormFieldLabel>
                        <DashboardConfigurationFormSelectContainer isOpen={isOpenAggregationTypeSelect} errors={formErrors.aggregation_type}>
                            <Select
                            options={formattedAggregationTypeOtions}
                            initialValues={aggregationTypeOptions.filter(aggregationTypeOption => aggregationTypeOption.value === dashboardConfigurationData.aggregation_type)}
                            onChange={onChangeAggregationType}
                            setIsOpen={setIsOpenAggregationTypeSelect}
                            isOpen={isOpenAggregationTypeSelect}
                            />
                        </DashboardConfigurationFormSelectContainer>
                    </DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldLabel>
                            Formatação de número
                            <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                        </DashboardConfigurationFormFieldLabel>
                        <DashboardConfigurationFormSelectContainer isOpen={isOpenNumberFormatTypeSelect}>
                            <Select
                            options={numberFormatTypeOptions}
                            initialValues={numberFormatTypeOptions.filter(numberFormatTypeOption => numberFormatTypeOption.value === dashboardConfigurationData.number_format_type)}
                            onChange={onChangeNumberFormatType}
                            setIsOpen={setIsOpenNumberFormatTypeSelect}
                            isOpen={isOpenNumberFormatTypeSelect}
                            />
                        </DashboardConfigurationFormSelectContainer>
                    </DashboardConfigurationFormFieldContainer>
                    <DashboardConfigurationSaveButton onClick={e=> onSubmit()}>
                        Salvar
                    </DashboardConfigurationSaveButton>
                </DashboardConfigurationFormContainer>
                <DashboardConfigurationChartContainer>
                    <DashboardConfigurationPreviewTitleLabel>Preview</DashboardConfigurationPreviewTitleLabel>
                    <Chart
                    chartType={props.getChartTypeNameById(dashboardConfigurationData.chart_type)}
                    labels={['Jan', 'Fev', 'Mar']}
                    values={[10, 20, 30]}
                    numberFormat={props.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === dashboardConfigurationData.number_format_type)[0]}
                    />
                </DashboardConfigurationChartContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationForm