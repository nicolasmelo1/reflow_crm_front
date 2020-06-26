import React from 'react'
import { View } from 'react-native'
import { 
    DashboardConfigurationFormContainer,
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
    const onChangeDashboardName = (data) => {
        props.dashboardConfigurationData.name = data
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

    const onChangeForCompany = (data) => {
        props.dashboardConfigurationData.for_company = data
        props.onUpdateDashboardSettings(props.dashboardConfigurationData)
    }

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
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationForm