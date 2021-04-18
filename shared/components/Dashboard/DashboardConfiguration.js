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
 * This component is responsible for holding all of the dashboard configuration cards and with it, 
 * all of the dashboardConfigurationForms.
 * 
 * @param {String} formName - This is a unique identifier for each form of each company. 
 * This props is the form name that the user is currently in. So that means a user cannot create
 * charts from data of another form. The user can create charts using data from the form he
 * is currently in.
 * @param {Function} onGetDashboardSettings - This is a redux action function used to retrieve
 * the dashboard data so we can edit it. Since we don't need this data for anything but for this component we keep 
 * the data inside of this component. To maintain the code style we retrieve the data using redux actions.
 * The data is an array of each dashboard charts.
 * @param {Function} onGetDashboardFieldOptions - Same as the function `onGetDashboardSettings` above, this is a redux action
 * to retrive fieldOptions it retrives an array of objects with each object being each field of the formulary. 
 * This is used to populate two selects: the one to select the field to be used as label and the one to 
 * select the field to be used as value
 * @param {Function} getChartTypeNameById - Handy function that is used to retrieve the chart name label (so `pie`, `card` and others) 
 * using the chart id as parameter.
 * @param {Function} onUpdateDashboardSettings - This is a redux action used to update a single chart setting, for this
 * you actually need the id of the chart defined (it is default to null).
 * @param {Function} onCreateDashboardSettings - If the chart has an id = null or not defined we then create the chart when
 * the user hit 'save' in dhe DashboardConfigurationForm component. We then update the id component with the new id supplied.
 * @param {Function} onRemoveDashboardSettings - Removes a chart
 * @param {Object} cancelToken - A axios cancel token, we use this so we can cancel a request when a user unmounts a component before 
 * the data be retrieved.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff 
 * @param {Object} user - The user object so we can render specific stuff for admins.
 */
const DashboardConfiguration = (props) => {
    const [dashboardSettingsData, setDashboardSettingsData] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const sourceRef = React.useRef(null)

    const onGetDashboardSettingsData = () => {
        // Load dashboard settings data directly in the component
        props.onGetDashboardSettings(sourceRef.current, props.formName).then(response=> {
            if (response && response.status === 200 && response.data.data) {
                setDashboardSettingsData(response.data.data)
            }
        })
    }

    const onSubmitDashboardSettings = async (index, newData) => {
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
        dashboardSettingsData.splice(0, 0, {
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
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        if (sourceRef.current) {
            sourceRef.current.cancel()
        }

        onGetDashboardSettingsData()
        props.onGetDashboardFieldOptions(sourceRef.current, props.formName).then(response => {
            if (response && response.status === 200) {
                setFieldOptions(response.data.data)
            }
        })

    }, [props.formName])

    const renderMobile = () => {
        const newDashboardSettingsData = JSON.parse(JSON.stringify(dashboardSettingsData))
        newDashboardSettingsData.splice(0, 0, {})
        return (
            <DashboardConfigurationCardsContainer>
                <DashboardConfigurationAddNewCard onPress={e=>{addDashboardSettings()}}>
                    <DashboardConfigurationAddNewIcon icon="plus-circle"/>
                    <DashboardConfigurationAddNewText>{strings['pt-br']['dashboardConfigurationAddNewCardLabel']}</DashboardConfigurationAddNewText>
                </DashboardConfigurationAddNewCard>
                {dashboardSettingsData.map((dashboardSetting, index) => (
                    <DashboardConfigurationCard
                    key={index}
                    user={props.user}
                    types={props.types}
                    onGetDashboardSettingsData={onGetDashboardSettingsData}
                    getChartTypeNameById={props.getChartTypeNameById}
                    fieldOptions={fieldOptions}
                    onSubmitDashboardSettings={(data) => (onSubmitDashboardSettings(index, data))}
                    onRemoveDashboardSettings={() => (onRemoveDashboardSettings(index))}
                    dashboardConfigurationData={dashboardSetting}
                    />
                ))}
            </DashboardConfigurationCardsContainer>
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
                    user={props.user}
                    types={props.types}
                    onGetDashboardSettingsData={onGetDashboardSettingsData}
                    getChartTypeNameById={props.getChartTypeNameById}
                    fieldOptions={fieldOptions}
                    onSubmitDashboardSettings={(data) => (onSubmitDashboardSettings(index, data))}
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