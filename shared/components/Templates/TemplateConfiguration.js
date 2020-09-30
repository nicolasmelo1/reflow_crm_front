import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import TemplateConfigurationCard from './TemplateConfigurationCard'
import {
    TemplatesConfigurationContainer,
    TemplatesConfigurationAddNewCardContainer
} from '../../styles/Templates'
/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplateConfiguration = (props) => {
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

    }

    useEffect(() => {
        props.onGetTemplatesSettings(props.source)
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        console.log(props.templatesConfiguration.data)
        return (
            <TemplatesConfigurationContainer>
                <TemplatesConfigurationAddNewCardContainer onClick={e=> onAddTemplateConfigurationData()}>
                    <h2>
                        Adicionar novo
                    </h2>
                </TemplatesConfigurationAddNewCardContainer>
                {props.templatesConfiguration.data.map((templateConfiguration, index) => (
                    <TemplateConfigurationCard
                    key={index}
                    templateConfiguration={templateConfiguration}
                    onChangeTemplateConfigurationData={(data) => onChangeTemplateConfigurationData(index, data)}
                    />
                ))}
            </TemplatesConfigurationContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfiguration