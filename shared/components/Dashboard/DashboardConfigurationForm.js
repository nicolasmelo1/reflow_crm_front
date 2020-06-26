import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { 
    DashboardConfigurationCard, 
    DashboardConfigurationCardTitle, 
    DashboardConfigurationCardIcon,
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
    const [formIsOpen, setFormIsOpen] = useState(false)
    const chartCanvas = React.useRef(null)


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
                <DashboardConfigurationCard isOpen={formIsOpen} onClick={e => {setFormIsOpen(!formIsOpen)}}>
                    <DashboardConfigurationCardTitle isOpen={formIsOpen}>
                        {props.dashboardConfigurationData.name}
                        <DashboardConfigurationCardIcon icon={'trash'} onClick={e=>{props.onRemoveDashboardSettings(props.dashboardConfigurationIndex)}}/>
                    </DashboardConfigurationCardTitle>
                </DashboardConfigurationCard>
                {formIsOpen ? (
                    <DashboardConfigurationFormContainer>
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
                    </DashboardConfigurationFormContainer>
                ) : ''}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default DashboardConfigurationForm