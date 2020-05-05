import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import actions from '../../redux/actions'
import { types, strings } from '../../utils/constants'
import { 
    TemplatesContainer, 
    TemplatesGoBackButton, 
    TemplatesHeader, 
    TemplatesSelectionContainer,
    TemplatesSelectionCard,
    TemplatesContentContainer,
    TemplatesTemplateTypeSelectionContainer,
    TemplatesTemplateTypeSelectionTitle,
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
            selectedTemplate: null,
        }
    }

    setSelectedTemplate = (data) => {
        data = (this.state.selectedTemplate === data) ? null : data
        this.setState(state=> state.selectedTemplate = data)
    }

    setSelectedGroupType = (data) => {
        if (this.state.selectedGroupType !== data) {
            this.props.onGetTemplates(this.source, data, 1, 'reflow')
            this.setState(state=> state.selectedGroupType = data)
        }
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
                <TemplatesHeader>
                    <TemplatesGoBackButton onClick={e=>this.props.setAddTemplates(false)}>
                        <FontAwesomeIcon icon={'chevron-left'} /> Voltar
                    </TemplatesGoBackButton>
                </TemplatesHeader>
                <TemplatesContentContainer>
                    <TemplatesTemplateTypeSelectionContainer>
                        <TemplatesTemplateTypeSelectionTitle>
                            {strings['pt-br']['templateTypeSelectionTitleLabel']}
                        </TemplatesTemplateTypeSelectionTitle>
                        <TemplatesTemplateFilterTypeButtonsContainer>
                            {['reflow', 'community', 'company'].map(templateFilterType => (
                                <TemplatesTemplateFilterTypeButtons>
                                    <TemplatesTemplateFilterTypeButtonsText>
                                        {templateFilterType}
                                    </TemplatesTemplateFilterTypeButtonsText>
                                </TemplatesTemplateFilterTypeButtons>
                            ))}
                        </TemplatesTemplateFilterTypeButtonsContainer>
                        {this.isGroupTypesDefined() ? 
                        this.props.types.default.group_type.map((groupType, index) => (
                            <TemplatesTypeSelectionButtons key={index} isSelected={groupType.name === this.state.selectedGroupType} onClick={e=> this.setSelectedGroupType(groupType.name)}>
                                <TemplatesTypeSelectionButtonsText isSelected={groupType.name === this.state.selectedGroupType}>
                                    {types('pt-br', 'group_type', groupType.name)}
                                </TemplatesTypeSelectionButtonsText>
                            </TemplatesTypeSelectionButtons>
                        )) : null}
                    </TemplatesTemplateTypeSelectionContainer>
                    <TemplatesSelectionContainer>
                        {this.props.templates['reflow'].data.map((template, index) => (
                            <TemplatesSelectionCard key={index} 
                            isSelected={this.state.selectedTemplate === template.display_name} 
                            onClick={e=> this.setSelectedTemplate(template.display_name)}>
                                <p>{template.display_name}</p>
                            </TemplatesSelectionCard>
                        ))}
                    </TemplatesSelectionContainer>
                </TemplatesContentContainer>
            </TemplatesContainer>
        )
    }

    render = () => process.env['APP'] === 'web' ?  this.renderWeb() : this.renderMobile()
}

export default connect(state=> ({ templates: state.templates.templates.data, types: state.login.types }), actions)(Templates)