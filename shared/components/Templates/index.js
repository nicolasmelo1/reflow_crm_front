import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Modal, Text } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import actions from '../../redux/actions'
import TemplateSelect from './TemplateSelect'
import TemplateConfiguration from './TemplateConfiguration'


/**
 * This component is responsible for showing a list of templates to the user. The user NEVER creates templates from 0, he does not create groups.
 * He needs to select from one of the already existing templates. Because of this this component appears on the hole page. Since this component as 
 * default is used for the user to select from a list of templates we treat it as a model that opens in front of whatever content or component that
 * is already showing.
 * 
 * On the other hand this component can also be used for creation of templates. Creation of templates are not a modal, they are open in a specific
 * space of a page. Because of this you cannot treat everything as modal
 * 
 * So this component is used to show the options of the templates the user can select.
 * 
 * @param {Function} setAddTemplates - Function responsible for closing the template page for choosing the template. When the user
 */
class Templates extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
    }

    componentDidMount = () => {
        this.source = this.CancelToken.source()
        this.props.onGetTemplatesSettings(this.source)
       
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <TemplateSelect
            types={this.props.types}
            groups={this.props.groups}
            templates={this.props.templates}
            loadedTemplate={this.props.loadedTemplate}
            source={this.source}
            cancelToken={this.CancelToken}
            onGetForms={this.props.onGetForms}
            onGetTemplate={this.props.onGetTemplate}
            onGetTemplateFormulary={this.props.onGetTemplateFormulary}
            onGetTemplates={this.props.onGetTemplates}
            onSelectTemplate={this.props.onSelectTemplate}
            setAddTemplates={this.props.setAddTemplates}
            />

        )
    }

    renderWeb = () => {
        return (
            <div>
                {this.props.isEditing ? (
                    <TemplateConfiguration
                    source={this.source}
                    types={this.props.types}
                    onGetTemplatesSettings={this.props.onGetTemplatesSettings}
                    onGetTemplatesFormulariesOptionsSettings={this.props.onGetTemplatesFormulariesOptionsSettings}
                    onGetTempalatesDependsOnSettings={this.props.onGetTempalatesDependsOnSettings}
                    templatesConfiguration={this.props.templatesConfiguration}
                    onChangeTemplateSettingsStateData={this.props.onChangeTemplateSettingsStateData}
                    />
                ) : (
                    <TemplateSelect
                    types={this.props.types}
                    groups={this.props.groups}
                    templates={this.props.templates}
                    loadedTemplate={this.props.loadedTemplate}
                    source={this.source}
                    cancelToken={this.CancelToken}
                    onGetForms={this.props.onGetForms}
                    onGetTemplate={this.props.onGetTemplate}
                    onGetTemplateFormulary={this.props.onGetTemplateFormulary}
                    onGetTemplates={this.props.onGetTemplates}
                    onSelectTemplate={this.props.onSelectTemplate}
                    setAddTemplates={this.props.setAddTemplates}
                    />
                )}
            </div>
        )
    }

    render = () => process.env['APP'] === 'web' ?  this.renderWeb() : this.renderMobile()
}

export default connect(state=> ({ 
    groups: state.home.sidebar.initial, 
    templates: state.templates.templates.data, 
    loadedTemplate: state.templates.templates.loadedTemplate, 
    types: state.login.types,
    templatesConfiguration: state.templates.templates.update.data,
}), actions)(Templates)