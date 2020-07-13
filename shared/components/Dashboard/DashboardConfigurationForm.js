import React, { useState, useEffect } from 'react'
import { Modal, Switch, Text, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Select } from '../Utils'
import Chart from './Chart'
import { strings, types, errors } from '../../utils/constants'
import { 
    DashboardConfigurationChartAndFormContainer,
    DashboardConfigurationFormGoBackButton,
    DashboardConfigurationFormHeader,
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
 * This component is the form of the chart configuration, this holds only the form and it's data
 * it is important to understand one thing: the data used here must be from this component
 * that's because the data comes from a list, but the data from this list is just updated when we hit 
 * `save`. That means the data that you modify here must be contained inside of this component only
 * and when this component is unmounted we loose all of the data of the form because we didn't hit save.breadcrumb
 * 
 * Besides that it's just a simple formulary actually, nothing much. The only difference is that we render
 * the chart while the user is editing the chart configuration.
 * 
 * @param {Function} onUpdateDashboardSettings - Generally only used when we hit `save`, this calls a function
 * from the parent component to update the data. The parent component function actually holds the functions to make
 * API calls when updating or when creatind a new chart. After saving we close this form and unmounts this component
 * @param {Function} setFormIsOpen - could recieve either true or false, when recieving false, unmounts this component
 * and closes the formulary. 
 * @param {Array<Object>} fieldOptions - To build charts we actually need 2 fields: 1 is the label field, the other
 * is the value field. fieldOptions is just an array with objects, with each object being a field the user can select.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff
 * @param {Object} dashboardConfigurationData - Remember when we said that this contains the data of the chart? This data
 * actually come from this prop. So the contents of this prop is actually copied to a state inside of this component.
 * @param {Function} getChartTypeNameById - Function for retrieving the chartName by the id of the chart, that's because Chart.js
 * component recieves only the name of the type of the chart and not the id.
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
            <Modal animationType={'slide'}>
                <DashboardConfigurationFormHeader>
                    <DashboardConfigurationFormGoBackButton onPress={e=> {props.setFormIsOpen(false)}}>
                        <FontAwesomeIcon icon={'times'} />
                    </DashboardConfigurationFormGoBackButton>
                </DashboardConfigurationFormHeader>
                <DashboardConfigurationChartAndFormContainer keyboardShouldPersistTaps={'handled'}>
                    <DashboardConfigurationFormContainer>
                        <DashboardConfigurationFormFieldContainer>
                            <View style={{ flexDirection: 'row'}}>
                                <Switch value={dashboardConfigurationData.for_company ? dashboardConfigurationData.for_company : false} onValueChange={value => {onChangeForCompany(value)}}/> 
                                <Text style={{ alignSelf: 'center' }}>&nbsp;{strings['pt-br']['dashboardConfigurationFormForCompanyLabel']}</Text>
                            </View>
                        </DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldContainer>
                            <DashboardConfigurationFormFieldLabel>
                                {strings['pt-br']['dashboardConfigurationFormChartNameLabel']}
                                <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                            </DashboardConfigurationFormFieldLabel>
                            <DashboardConfigurationFormFieldInput
                            type={'text'}
                            onChange={e => {onChangeDashboardName(e.nativeEvent.text)}}
                            value={(dashboardConfigurationData.name) ? dashboardConfigurationData.name : ''}
                            errors={formErrors.name}
                            />
                        </DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldContainer>
                            <DashboardConfigurationFormFieldLabel>
                                {strings['pt-br']['dashboardConfigurationFormChartTypeSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormFieldLabelSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormFieldValueSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormAggregationTypeSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormNumberFormatSelectorLabel']}
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
                        <DashboardConfigurationSaveButton onPress={e=> onSubmit()}>
                            <Text>
                                {strings['pt-br']['dashboardConfigurationFormSaveButtonLabel']}
                            </Text>
                        </DashboardConfigurationSaveButton>
                    </DashboardConfigurationFormContainer>
                    <DashboardConfigurationChartContainer chartType={props.getChartTypeNameById(dashboardConfigurationData.chart_type)}>
                        <DashboardConfigurationPreviewTitleLabel>{strings['pt-br']['dashboardConfigurationFormPreviewTitleLabel']}</DashboardConfigurationPreviewTitleLabel>
                        <Chart
                        chartType={props.getChartTypeNameById(dashboardConfigurationData.chart_type)}
                        labels={['Jan', 'Fev', 'Mar']}
                        values={[10, 20, 30]}
                        numberFormat={props.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === dashboardConfigurationData.number_format_type)[0]}
                        />
                    </DashboardConfigurationChartContainer>
                </DashboardConfigurationChartAndFormContainer>
            </Modal>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <DashboardConfigurationFormHeader>
                    <DashboardConfigurationFormGoBackButton onClick={e=> {props.setFormIsOpen(false)}}>
                        <FontAwesomeIcon icon={'chevron-left'} />&nbsp;{strings['pt-br']['dashboardConfigurationFormGoBackButtonLabel']}
                    </DashboardConfigurationFormGoBackButton>
                </DashboardConfigurationFormHeader>
                <DashboardConfigurationChartAndFormContainer>
                    <DashboardConfigurationFormContainer>
                        <DashboardConfigurationFormFieldContainer>
                            <DashboardConfigurationFormFieldLabel>
                                <input type="checkbox" checked={dashboardConfigurationData.for_company ? dashboardConfigurationData.for_company : false} onChange={e => {onChangeForCompany(e.target.checked)}}/> 
                                &nbsp;{strings['pt-br']['dashboardConfigurationFormForCompanyLabel']}
                            </DashboardConfigurationFormFieldLabel>
                        </DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldContainer>
                            <DashboardConfigurationFormFieldLabel>
                                {strings['pt-br']['dashboardConfigurationFormChartNameLabel']}
                                <DashboardConfigurationFormFieldRequiredLabel>*</DashboardConfigurationFormFieldRequiredLabel>
                            </DashboardConfigurationFormFieldLabel>
                            <DashboardConfigurationFormFieldInput
                            type={'text'}
                            onChange={e => {onChangeDashboardName(e.target.value)}}
                            value={(dashboardConfigurationData.name) ? dashboardConfigurationData.name : ''}
                            errors={formErrors.name}
                            />
                        </DashboardConfigurationFormFieldContainer>
                        <DashboardConfigurationFormFieldContainer>
                            <DashboardConfigurationFormFieldLabel>
                                {strings['pt-br']['dashboardConfigurationFormChartTypeSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormFieldLabelSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormFieldValueSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormAggregationTypeSelectorLabel']}
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
                                {strings['pt-br']['dashboardConfigurationFormNumberFormatSelectorLabel']}
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
                            {strings['pt-br']['dashboardConfigurationFormSaveButtonLabel']}
                        </DashboardConfigurationSaveButton>
                    </DashboardConfigurationFormContainer>
                    <DashboardConfigurationChartContainer>
                        <DashboardConfigurationPreviewTitleLabel>{strings['pt-br']['dashboardConfigurationFormPreviewTitleLabel']}</DashboardConfigurationPreviewTitleLabel>
                        <Chart
                        chartType={props.getChartTypeNameById(dashboardConfigurationData.chart_type)}
                        labels={['Jan', 'Fev', 'Mar']}
                        values={[10, 20, 30]}
                        numberFormat={props.types?.data?.field_number_format_type.filter(numberFormatType => numberFormatType.id === dashboardConfigurationData.number_format_type)[0]}
                        />
                    </DashboardConfigurationChartContainer>
                </DashboardConfigurationChartAndFormContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationForm