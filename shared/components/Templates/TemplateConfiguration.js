import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import TemplateConfigurationCard from './TemplateConfigurationCard'
import {
    TemplatesConfigurationContainer,
    TemplatesConfigurationCardContainer,
    TemplatesConfigurationCardLabel
} from '../../styles/Templates'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplateConfiguration = (props) => {
    const [dependentForms,  setDependentForms] = useState({})
    const [formulariesOptions, setFormulariesOptions] = useState([])

    const getNewTempalteConfigurationData = () => {
        return {
            id: null,
            display_name: '',
            theme_type: null,
            description: '',
            form_ids: [],
            is_public: false
        }
    }

    const onAddTemplateConfigurationData = () => {
        props.templatesConfiguration.data.splice(0, 0, getNewTempalteConfigurationData())
        props.onChangeTemplateSettingsStateData({...props.templatesConfiguration})
    }

    const onChangeTemplateConfigurationData = (index, data) => {
        props.templatesConfiguration.data[index] = data
        props.onChangeTemplateSettingsStateData({...props.templatesConfiguration})
    }

    useEffect(() => {
        props.onGetTemplatesSettings(props.source)
        props.onGetTempalatesDependsOnSettings(props.source).then(response => {
            if (response && response.status === 200) {
                setDependentForms(response.data.data)
            }
        })
        props.onGetTemplatesFormulariesOptionsSettings(props.source).then(response=> {
            if (response && response.status === 200) {
                setFormulariesOptions(response.data.data.map(formularyOption => ({ value: formularyOption.id, label: formularyOption.label_name})))
            }
        })
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesConfigurationContainer>
                <TemplatesConfigurationCardContainer onClick={e=> onAddTemplateConfigurationData()}>
                    <TemplatesConfigurationCardLabel>
                        {'Adicionar novo'}
                    </TemplatesConfigurationCardLabel>
                </TemplatesConfigurationCardContainer>
                {props.templatesConfiguration.data.map((templateConfiguration, index) => (
                    <TemplateConfigurationCard
                    key={index}
                    types={props.types}
                    templateConfiguration={templateConfiguration}
                    dependentForms={dependentForms}
                    formulariesOptions={formulariesOptions}
                    onChangeTemplateConfigurationData={(data) => onChangeTemplateConfigurationData(index, data)}
                    />
                ))}
            </TemplatesConfigurationContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfiguration