import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import actions from '../../redux/actions'
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

class Templates extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            selectedGroupType: null,
            selectedTemplate: -1,
        }
    }

    setSelectedTemplate = (data) => {
        data = (this.state.selectedTemplate === data) ? -1 : data
        this.setState(state=> state.selectedTemplate = data)
    }

    setSelectedGroupType = (data) => {
        if (this.state.selectedGroupType !== data) {
            this.props.onGetTemplates(this.source, data, 1, 'reflow')
            this.setState(state=> state.selectedGroupType = data)
        }
    }

    isInitialDefined = () => {
        return this.props.groups.length > 0 
    }

    isGroupTypesDefined = () => {
        return this.props.types && this.props.types.default && this.props.types.default.group_type
    }

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        if (this.isGroupTypesDefined() && this.props.types.default.group_type.length > 0) {
            const selected = this.props.types.default.group_type[0].name
            this.setSelectedGroupType(selected)
        }
        if (!this.isInitialDefined()) {
            this.props.onGetForms(this.source)
        }
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View>

            </View>
        )
    }

    renderWeb = () => {
        return (
            <TemplatesContainer>
                <TemplatePreview 
                groups={this.props.groups}
                data={this.props.loadedTemplate}
                cancelToken={this.CancelToken}
                onGetTemplate={this.props.onGetTemplate}
                selectedTemplateId={this.state.selectedTemplate} 
                onSelectTemplate={this.props.onSelectTemplate}
                setAddTemplates={this.props.setAddTemplates}
                setSelectedTemplate={this.setSelectedTemplate}
                onGetTemplateFormulary={this.props.onGetTemplateFormulary}
                />
                <TemplatesHeader>
                    {this.props.groups.length > 0 ? (
                        <TemplatesGoBackButton onClick={e=>this.props.setAddTemplates(false)}>
                            <FontAwesomeIcon icon={'chevron-left'} /> Voltar
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
                            {this.isGroupTypesDefined() ? 
                            this.props.types.default.group_type.map((groupType, index) => (
                                <TemplatesTypeSelectionButtons key={index} isSelected={groupType.name === this.state.selectedGroupType} onClick={e=> this.setSelectedGroupType(groupType.name)}>
                                    <TemplatesTypeSelectionButtonsText isSelected={groupType.name === this.state.selectedGroupType}>
                                        {types('pt-br', 'group_type', groupType.name)}
                                    </TemplatesTypeSelectionButtonsText>
                                </TemplatesTypeSelectionButtons>
                            )) : null}
                        </TemplatesTypeSelectionButtonsContainer>
                    </TemplatesTemplateTypeSelectionContainer>
                    <TemplatesSelectionContainer>
                        {this.props.templates['reflow'].data.map((template, index) => (
                            <TemplatesSelectionCard key={index} 
                            onClick={e=> this.setSelectedTemplate(template.id)}>
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

    render = () => process.env['APP'] === 'web' ?  this.renderWeb() : this.renderMobile()
}

export default connect(state=> ({ groups: state.home.sidebar.initial, templates: state.templates.templates.data, loadedTemplate: state.templates.templates.loadedTemplate, types: state.login.types }), actions)(Templates)