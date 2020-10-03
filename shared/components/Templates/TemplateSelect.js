import React, { useEffect, useState, } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Modal } from 'react-native'
import { types, strings } from '../../utils/constants'
import TemplatePreview from './TemplatePreview'
import { 
    TemplatesContainer, 
    TemplatesGoBackButton, 
    TemplatesHeader, 
    TemplatesSelectionContainer,
    TemplatesSelectionCard,
    TemplatesSelectionText,
    TemplatesContentContainer,
    TemplatesTemplateTypeSelectionContainer,
    TemplatesTemplateTypeSelectionTitle,
    TemplatesTypeSelectionButtonsContainer,
    TemplatesTypeSelectionButtons,
    TemplatesTypeSelectionButtonsText,
    TemplatesTemplateFilterTypeButtonsContainer,
    TemplatesTemplateFilterTypeButtonsText,
    TemplatesTemplateFilterTypeButtons
} from '../../styles/Templates'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const TemplateSelect = (props) => {
    const [selectedGroupType, setSelectedGroupType] = useState(null)
    const [selectedTemplate, setSelectedTemplate] = useState(-1)

    const onChangeSelectedTemplate = (data) => {
        data = (selectedTemplate === data) ? -1 : data
        setSelectedTemplate(data)
    }

    const onChangeSelectedGroupType = (data) => {
        if (selectedGroupType !== data) {
            props.onGetTemplates(props.source, data, 1, 'reflow')
            setSelectedGroupType(data)
        }
    }

    const isInitialDefined = () => {
        return props.groups.length > 0 
    }

    const isGroupTypesDefined = () => {
        return props.types && props.types.defaults && props.types.defaults.theme_type
    }

    useEffect(() => {
        if (isGroupTypesDefined() && props.types.defaults.theme_type.length > 0) {
            const selected = props.types.defaults.theme_type[0].name
            onChangeSelectedGroupType(selected)
        }
        if (!isInitialDefined()) {
            props.onGetForms(props.source)
        }
    }, [])

    const renderMobile = () => {
        return (
            <Modal
            animationType="slide"
            >
                <TemplatesContainer>
                    {selectedTemplate !== -1 ? (
                        <TemplatePreview 
                        groups={props.groups}
                        data={props.loadedTemplate}
                        cancelToken={props.cancelToken}
                        onGetTemplate={props.onGetTemplate}
                        selectedTemplateId={selectedTemplate} 
                        onSelectTemplate={props.onSelectTemplate}
                        setAddTemplates={props.setAddTemplates}
                        onChangeSelectedTemplate={onChangeSelectedTemplate}
                        onGetTemplateFormulary={props.onGetTemplateFormulary}
                        />
                    ) : null}
                    <TemplatesHeader>
                        {props.groups.length > 0 ? (
                            <TemplatesGoBackButton onPress={e=>props.setAddTemplates(false)}>
                                <FontAwesomeIcon icon={'times'} />
                            </TemplatesGoBackButton>
                        ) : null}
                    </TemplatesHeader>
                    <TemplatesContentContainer>
                        <TemplatesTemplateTypeSelectionContainer>
                            <TemplatesTemplateTypeSelectionTitle>
                                {strings['pt-br']['templateTypeSelectionTitleLabel']}
                            </TemplatesTemplateTypeSelectionTitle>
                            {/*
                            <TemplatesTemplateFilterTypeButtonsContainer>
                                {['reflow', 'community', 'company'].map((templateFilterType, index)=> (
                                    <TemplatesTemplateFilterTypeButtons key={index}>
                                        <TemplatesTemplateFilterTypeButtonsText>
                                            {templateFilterType}
                                        </TemplatesTemplateFilterTypeButtonsText>
                                    </TemplatesTemplateFilterTypeButtons>
                                ))}
                            </TemplatesTemplateFilterTypeButtonsContainer>
                            */}
                            <TemplatesTypeSelectionButtonsContainer horizontal={true}>
                                {isGroupTypesDefined() ? props.types.defaults.theme_type.map((groupType, index) => (
                                    <TemplatesTypeSelectionButtons key={index} isSelected={groupType.name === selectedGroupType} onPress={e=> onChangeSelectedGroupType(groupType.name)}>
                                        <TemplatesTypeSelectionButtonsText isSelected={groupType.name === selectedGroupType}>
                                            {types('pt-br', 'theme_type', groupType.name)}
                                        </TemplatesTypeSelectionButtonsText>
                                    </TemplatesTypeSelectionButtons>
                                )) : null}
                            </TemplatesTypeSelectionButtonsContainer>
                        </TemplatesTemplateTypeSelectionContainer>
                        <TemplatesSelectionContainer
                            data={props.templates['reflow'].data}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            renderItem={({ item }) => (
                                <TemplatesSelectionCard
                                onPress={e=> onChangeSelectedTemplate(item.id)}
                                >
                                    <TemplatesSelectionText>
                                        {item.display_name}
                                    </TemplatesSelectionText>
                                </TemplatesSelectionCard>
                            )}
                        />
                    </TemplatesContentContainer>
                </TemplatesContainer>
            </Modal>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesContainer>
                <TemplatePreview 
                groups={props.groups}
                data={props.loadedTemplate}
                cancelToken={props.cancelToken}
                onGetTemplate={props.onGetTemplate}
                selectedTemplateId={selectedTemplate} 
                onSelectTemplate={props.onSelectTemplate}
                setAddTemplates={props.setAddTemplates}
                onChangeSelectedTemplate={onChangeSelectedTemplate}
                onGetTemplateFormulary={props.onGetTemplateFormulary}
                />
                <TemplatesHeader>
                    {props.groups.length > 0 ? (
                        <TemplatesGoBackButton onClick={e=>props.setAddTemplates(false)}>
                            <FontAwesomeIcon icon={'chevron-left'} />&nbsp;{strings['pt-br']['templateGoBackButtonLabel']}
                        </TemplatesGoBackButton>
                    ) : ''}
                </TemplatesHeader>
                <TemplatesContentContainer>
                    <TemplatesTemplateTypeSelectionContainer>
                        <TemplatesTemplateTypeSelectionTitle>
                            {strings['pt-br']['templateTypeSelectionTitleLabel']}
                        </TemplatesTemplateTypeSelectionTitle>
                        {/*
                        <TemplatesTemplateFilterTypeButtonsContainer>
                            {['reflow', 'community', 'company'].map((templateFilterType, index)=> (
                                <TemplatesTemplateFilterTypeButtons key={index}>
                                    <TemplatesTemplateFilterTypeButtonsText>
                                        {templateFilterType}
                                    </TemplatesTemplateFilterTypeButtonsText>
                                </TemplatesTemplateFilterTypeButtons>
                            ))}
                        </TemplatesTemplateFilterTypeButtonsContainer>
                        */}
                        <TemplatesTypeSelectionButtonsContainer>
                            {isGroupTypesDefined() ?  props.types.defaults.theme_type.map((groupType, index) => (
                                <TemplatesTypeSelectionButtons key={index} isSelected={groupType.name === selectedGroupType} onClick={e=> onChangeSelectedGroupType(groupType.name)}>
                                    <TemplatesTypeSelectionButtonsText isSelected={groupType.name === selectedGroupType}>
                                        {types('pt-br', 'theme_type', groupType.name)}
                                    </TemplatesTypeSelectionButtonsText>
                                </TemplatesTypeSelectionButtons>
                            )) : null}
                        </TemplatesTypeSelectionButtonsContainer>
                    </TemplatesTemplateTypeSelectionContainer>
                    <TemplatesSelectionContainer>
                        {props.templates['reflow'].data.map((template, index) => (
                            <TemplatesSelectionCard key={index} 
                            onClick={e=> onChangeSelectedTemplate(template.id)}>
                                <TemplatesSelectionText>
                                    {template.display_name}
                                </TemplatesSelectionText>
                            </TemplatesSelectionCard>
                        ))}
                    </TemplatesSelectionContainer>
                </TemplatesContentContainer>
            </TemplatesContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateSelect