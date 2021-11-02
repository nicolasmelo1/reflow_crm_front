import React, { useEffect } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import {StreamLanguage} from "@codemirror/stream-parser"
import {shell} from "@codemirror/legacy-modes/mode/shell"
import actions from '../../../redux/actions'
import agent from '../../../utils/agent'
import dynamicImport from '../../../utils/dynamicImport'
import isAdmin from '../../../utils/isAdmin'
import { strings, types } from '../../../utils/constants'
import Code from '../Code'
import CreateRecords from './CreateRecords'
import Fields from './Fields'
import Styled from './styles'

const connect = dynamicImport('reduxConnect', 'default')


/**
 * This component is the documentation for the api. We wanted to go to a more simple approach like
 * Redoc and so on but next had a really hard time working with it. And also React Native does not support redoc.
 * So we went to a more obscure approach
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class APIDocumentation extends React.Component {
    constructor(props) {
        super(props)
        this.variableRegex = /\{(\w+)\}/
        this.linkRegex = /\((\w+)\)\[(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\]/
        this.fieldTypeNameByFieldTypeId = {}
        this.introductionRef = React.createRef()
        this.rateLimitingRef = React.createRef()
        this.authenticationRef = React.createRef()
        this.templatesRefs = {}
        this.pagesRefs = {}
        this.sectionAndFieldsRefs = {}
        this.createRecordRefs = {}
        this.state = {
            openPageIds: [],
            openTemplateIds: [],
            firstPageNameToUseAsExample: '',
            templates: {}
        }
    }
    
    /**
     * Sets the open template ids state, it only adds the id, it doesn't remove because if we did so it'd be a problem in the
     * navigation.
     * 
     * @param {number} templateId - The id of the template you are opening.
     */
    setOpenTemplateIds = (templateId) => {
        let openTemplateIds = [...this.state.openTemplateIds]
        if (!this.state.openTemplateIds.includes(templateId)) {
            openTemplateIds.push(templateId)
        }
        this.setState(state => ({
            ...state,
            openTemplateIds: openTemplateIds
        }))
    }

    /**
     * Sets the open template ids state, it only adds the id, it doesn't remove because if we did so it'd be a problem in the
     * navigation.
     * 
     * @param {number} pageId - The id of the template you are opening.
     */
    setOpenPageIds = (pageId) => {
        let openPageIds = [...this.state.openPageIds]
        if (!this.state.openPageIds.includes(pageId)) {
            openPageIds.push(pageId)
        }
        this.setState(state => ({
            ...state,
            openPageIds: openPageIds
        }))
    }

    /**
     * Sets the all of the data of all of the templates to use in reflow.
     * 
     * @param {Object} templatesData - All of the templates that the user has access to of the company to use in the documentation.
     */
    setTemplates = (templatesData) => {
        this.setState(state => ({
            ...state,
            templates: templatesData
        }))
    }

    /**
     * Sets the first page name to use as example in the api documentation.
     * 
     * @param {Object} firstPageNameToUseAsExample - The first page name to use as example in the api documentation. 
     */
    setFirstPageNameToUseAsExample = (firstPageNameToUseAsExample) => {
        this.setState(state => ({
            ...state,
            firstPageNameToUseAsExample: firstPageNameToUseAsExample
        }))
    }

    /**
     * Scrolls into the template when the user clicks the template in the sidebar menu.
     * 
     * @param {number} templateId - The id of the template to scroll to.
     */
    scrollIntoTemplateView = (templateId) => {
        this.templatesRefs[templateId].scrollIntoView(true)
    }


    /**
     * Scrolls into the page when the user clicks the template in the sidebar menu.
     * 
     * @param {number} pageId - The id of the page to scroll to.
     */
     scrollIntoPageView = (pageId) => {
        this.pagesRefs[pageId].scrollIntoView(true)
    }


    /** 
     * Creates the refs dynamically when the page loads so we can scroll to view automatically.
     * 
     * @param {number} - The id of the template to create the ref for.
     * 
     * @returns {React.RefObject} - The ref of the template.
     */
    createAndRetrieveTemplateRef = (templateId) => {
        this.templatesRefs[templateId] = React.createRef()
        return this.templatesRefs[templateId]
    }

    /** 
     * Creates refs dynamically when the page loads so we can scroll to view automatically.
     * This is for the pages and not for the templates so we need to create the same function again
     * 
     * @param {number} - The id of the page to create the ref for.
     * 
     * @returns {React.RefObject} - The ref of the page.
     */
    createAndRetrievePageRef = (pageId) => {
        this.pagesRefs[pageId] = React.createRef()
        return this.pagesRefs[pageId]
    }

    /** 
     * Creates refs dynamically when the page loads so we can scroll to view automatically.
     * This is for the pages and not for the templates so we need to create the same function again. This is only
     * for the `sectionAndFields` section inside of the page.
     * 
     * @param {number} - The id of the page to create the ref for.
     * 
     * @returns {React.RefObject} - The ref of the section and field section inside of the page section.
     */
    createAndRetrieveSectionsAndFieldsRef = (pageId) => {
        this.sectionAndFieldsRefs[pageId] = React.createRef()
        return this.sectionAndFieldsRefs[pageId]
    }

    /** 
     * Creates refs dynamically when the page loads so we can scroll to view automatically.
     * This is for the pages and not for the templates so we need to create the same function again. This is only
     * for the `createRecords` section inside of the page.
     * 
     * @param {number} - The id of the page to create the ref for.
     * 
     * @returns {React.RefObject} - The ref of the create record section inside of the page section.
     */
    createAndRetrieveCreateRecordsRef = (pageId) => {
        this.createRecordRefs[pageId] = React.createRef()
        return this.createRecordRefs[pageId]
    }

    /** 
     * Creates the refs dynamically when the page loads so we can scroll to view automatically.
     * 
     * @param {number} - The id of the template to create the ref for.
     * 
     * @returns {React.RefObject} - The ref of the template.
     */
     createAndRetrieveTemplateRef = (templateId) => {
        this.templatesRefs[templateId] = React.createRef()
        return this.templatesRefs[templateId]
    }

    /**
     * Retrives a field type name by it's given id.
     * 
     * @param {number} fieldTypeId - The fieldTypeId of the field type you want to get the name of.
     * 
     * @returns {string} - The name of the field type. Can return a empty string if nothing is found.
     */
    getFieldTypeNameByFieldTypeId = (fieldTypeId) => {
        if (this.fieldTypeNameByFieldTypeId[fieldTypeId]) {
            return this.fieldTypeNameByFieldTypeId[fieldTypeId]
        } else {
            const fieldType = this.props.types.data.field_type.filter(fieldType => fieldType.id === fieldTypeId)
            if (fieldType.length > 0) {
                this.fieldTypeNameByFieldTypeId[fieldTypeId] = fieldType[0].type
                return this.fieldTypeNameByFieldTypeId[fieldTypeId]
            } else {
                return ''
            }
        }
    }

    /**
     * Checks if the field is automatically generated or not, if it is then we return true, false if not.
     * 
     * @param {object} field - The field object to check.
     * 
     * @returns {boolean} - True if the field is automatically generated, false if not.
     */
    isFieldAutomaticGenerated = (field) => {
        if (field !== undefined) {
            console.log(field)
            const fieldTypeName = this.getFieldTypeNameByFieldTypeId(field.type)
            console.log(fieldTypeName)
            if (fieldTypeName === 'date' && (field.date_configuration_auto_create || field.date_configuration_auto_update)) {
                return true
            } else if (fieldTypeName === 'formula') {
                return true
            } else if (fieldTypeName === 'id') {
                return true
            }
        }
        return false
    }

    getLastValuesOfFieldId = (templateId, formularyId, fieldId) => {
        const filteredFormularies = this.state.templates[templateId].formularies.filter(formulary => formulary.formularyData.id === formularyId)
        if (filteredFormularies !== undefined && filteredFormularies.length > 0) {
            for (const formularyValue of filteredFormularies[0].formularyValues) {
                if (formularyValue.field_id === fieldId) {
                    return formularyValue.last_values
                }
            }
        }
        return []
    }

    onRenewAccessKey() {
        console.log('pass')
    }

    /**
     * Renders the paragraphs formatted with the text for so it display colors, links and so on.
     */
    getTextFormatted = (text) => {
        const emptyUrlRegex = /\(([A-zÀ-ú]+)\)\[\]/
        return text.split(' ').map((word, index) => {
            if (this.linkRegex.test(word)) {
                const matched = word.match(this.linkRegex)
                const otherWords = word.replace(this.linkRegex, '')
                return (
                    <span key={index} >
                        <a href={matched[2]}>{matched[1].replaceAll('_', ' ')}</a> 
                        {otherWords}
                    </span>
                )
            } else if (emptyUrlRegex.test(word)) {
                const matched = word.match(emptyUrlRegex)
                const otherWords = word.replace(emptyUrlRegex, '')
                return (
                    <span key={index}>
                        <a href={'/'}>{matched[1].replaceAll('_', ' ')}</a> 
                        {otherWords}
                    </span>
                )
            } else if (this.variableRegex.test(word)) {
                const matched = word.match(this.variableRegex)
                return (
                    <Styled.APIDocumentationReflowVariableText 
                    key={index}
                    >
                        {matched[1]}
                    </Styled.APIDocumentationReflowVariableText>
                )
            } else if (word.charAt(0) === '_' && word.charAt(word.length-1) === '_') {
                return (
                    <Styled.APIDocumentationStatusCodeText 
                    key={index}
                    >
                        {word.replaceAll('_', ' ')}
                    </Styled.APIDocumentationStatusCodeText>
                )
            } else {
                return(
                    <span key={index}>
                        {` ${word} `}
                    </span>
                )            
            }
        })
    }

    /**
     * Renders the second paragraph of the introduction section.
     */
    getTextForEmptyUrls() {
        const graphicalInterfaceRegex = /\(([A-zÀ-ú]+)\)\[\]/
        return strings['pt-br']['apiDocumentationIntroductionDescription2'].split(' ').map((word, index) => {
            if (graphicalInterfaceRegex.test(word)) {
                const matched = word.match(graphicalInterfaceRegex)
                const otherWords = word.replace(graphicalInterfaceRegex, '')
                return (
                    <span key={index}>
                        <a href={'/'}>{matched[1].replaceAll('_', ' ')}</a> 
                        {otherWords}
                    </span>
                )
            } else if (this.variableRegex.test(word)) {
                const matched = word.match(this.variableRegex)
                return (
                    <Styled.APIDocumentationReflowVariableText 
                    key={index}
                    >
                        {matched[1]}
                    </Styled.APIDocumentationReflowVariableText>
                )
            } else {
                return(
                    <span key={index}>
                        {` ${word} `}
                    </span>
                )
            }
        })
    }

    componentDidMount() {
        this.source = axios.CancelToken.source()

        let templateData = {}

        this.props.onGetForms(this.source).then(async response => {
            if (response && response?.status === 200 && response?.data?.data !== undefined) {
                for (const template of response.data.data) {
                    templateData[template.id] = {
                        name: template.name,
                        formularies: []
                    }
                    for (const formulary of template.form_group) {
                        const lastValuesOfFormularyResponse = await agent.http.DOCUMENTATION.getlastValuesOfFormulary(this.source, formulary.form_name)
                        const formularyBuildData = await this.props.onGetBuildFormulary(this.source, formulary.form_name)
                        if (formularyBuildData) {
                            if (this.state.firstPageNameToUseAsExample === '') this.setFirstPageNameToUseAsExample(formularyBuildData.form_name)
                            templateData[template.id].formularies.push({
                                formularyData: formularyBuildData,
                                formularyValues: lastValuesOfFormularyResponse.data.data
                            })
                        }
                    }
                }
                this.setState(state => ({
                    ...state,
                    templates: templateData
                }))
            }
        })
    }

    componentWillUnmount() {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <Styled.APIDocumentationContainer>
                <Styled.APIDocumentationNavigationSidebar>
                    <Styled.APIDocumentationNavigationButton
                    onClick={(e) => {this.introductionRef.current.scrollIntoView(true)}}
                    >
                        {strings['pt-br']['apiDocumentationIntroductionTitle']}
                    </Styled.APIDocumentationNavigationButton>
                    <Styled.APIDocumentationNavigationButton
                    onClick={(e) => {this.rateLimitingRef.current.scrollIntoView(true)}}
                    >
                        {strings['pt-br']['apiDocumentationRateLimitingTitle']}
                    </Styled.APIDocumentationNavigationButton>
                    <Styled.APIDocumentationNavigationButton
                    onClick={(e) => {this.authenticationRef.current.scrollIntoView(true)}}
                    >
                        {strings['pt-br']['apiDocumentationAuthenticationTitle']}
                    </Styled.APIDocumentationNavigationButton>
                    <Styled.APIDocumentationTemplatesLabel>
                        <small>
                            {strings['pt-br']['apiDocumentationTemplatesPartTitle']}
                        </small>
                    </Styled.APIDocumentationTemplatesLabel>
                    {Object.entries(this.state.templates).map(([templateId, template]) => (
                        <div
                        key={templateId}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        >
                            <Styled.APIDocumentationNavigationButton
                            key={templateId}
                            onClick={(e) => {
                                this.setOpenTemplateIds(templateId)
                                this.templatesRefs[templateId].current.scrollIntoView(true)
                            }}
                            >
                                {template.name}
                            </Styled.APIDocumentationNavigationButton>
                            {this.state.openTemplateIds.includes(templateId) ? 
                                template.formularies.map(formulary => (
                                    <React.Fragment
                                    key={formulary.formularyData.id}
                                    >
                                        <Styled.APIDocumentationSubmenuNavigationButton
                                        onClick={(e) => {
                                            this.setOpenPageIds(formulary.formularyData.id)
                                            this.pagesRefs[formulary.formularyData.id].current.scrollIntoView(true)
                                        }}
                                        >
                                            <small style={{color: '#172424D', fontWeight: 'bold'}}>
                                                {'> ' + formulary.formularyData.label_name}
                                            </small>
                                        </Styled.APIDocumentationSubmenuNavigationButton>
                                        {this.state.openPageIds.includes(formulary.formularyData.id) ? (
                                            <Styled.APIDocumentationSubSubmenuNavigationContainer>
                                                <Styled.APIDocumentationSubmenuNavigationButton
                                                onClick={(e) => {this.sectionAndFieldsRefs[formulary.formularyData.id].current.scrollIntoView(true)}}
                                                >
                                                    <small style={{color: '#6a7074'}}>
                                                        {strings['pt-br']['apiDocumentationSectionsAndFieldsTitle']}
                                                    </small>
                                                </Styled.APIDocumentationSubmenuNavigationButton>
                                                <Styled.APIDocumentationSubmenuNavigationButton
                                                onClick={(e) => {this.createRecordRefs[formulary.formularyData.id].current.scrollIntoView(true)}}
                                                >
                                                    <small style={{color: '#6a7074'}}>
                                                        {strings['pt-br']['apiDocumentationCreateRecordsTitle']}
                                                    </small>
                                                </Styled.APIDocumentationSubmenuNavigationButton>
                                            </Styled.APIDocumentationSubSubmenuNavigationContainer>
                                        ) : null}
                                    </React.Fragment>
                                ))
                            : ''}
                        </div>
                    ))}
                </Styled.APIDocumentationNavigationSidebar>
                <Styled.APIDocumentationSectionsContainer>   
                    <Styled.APIDocumentationSection>
                        <Styled.APIDocumentationHeader
                        ref={this.introductionRef}
                        >
                            {strings['pt-br']['apiDocumentationIntroductionTitle']}
                        </Styled.APIDocumentationHeader>
                        <p>
                            {this.getTextFormatted(strings['pt-br']['apiDocumentationIntroductionDescription1'])}
                        </p>
                        <p>
                            {this.getTextFormatted(strings['pt-br']['apiDocumentationIntroductionDescription2'])}
                        </p>
                        <p>
                            {strings['pt-br']['apiDocumentationIntroductionDescription3']}
                        </p>
                        <ul>
                            <li>
                                {strings['pt-br']['apiDocumentationIntroductionCompanyIdLabel']}
                                <Styled.APIDocumentationCompanyIdVaraible>
                                    {this.props.companyId}
                                </Styled.APIDocumentationCompanyIdVaraible>
                            </li>
                            <li>
                                {strings['pt-br']['apiDocumentationIntroductionAccessTokenLabel']}
                                <Styled.APIDocumentationAccessKeyVaraible>
                                    {this.props.apiAccessKey}
                                </Styled.APIDocumentationAccessKeyVaraible>
                                <Styled.APIDocumentationRenewAccessKeyButton
                                onClick={(e) => this.onRenewAccessKey()}
                                >
                                    {strings['pt-br']['apiDocumentationIntroductionGenerateNewAccessTokenLabel']}
                                </Styled.APIDocumentationRenewAccessKeyButton>
                            </li>
                        </ul>
                        <p>
                            <Styled.APIDocumentationImportatInformationLabel>
                                {strings['pt-br']['apiDocumentationIntroductionImportantInformation']}
                            </Styled.APIDocumentationImportatInformationLabel>
                            {strings['pt-br']['apiDocumentationIntroductionImportantInformation1']}
                        </p>
                    </Styled.APIDocumentationSection>
                    <Styled.APIDocumentationSection>
                        <Styled.APIDocumentationHeader
                        ref={this.rateLimitingRef}
                        >
                            {strings['pt-br']['apiDocumentationRateLimitingTitle']}
                        </Styled.APIDocumentationHeader>
                        <p>
                            {this.getTextFormatted(
                                strings['pt-br']['apiDocumentationRateLimitingDescription1']
                            )}
                        </p>
                        <p>
                            {strings['pt-br']['apiDocumentationRateLimitingDescription2']}
                        </p>
                    </Styled.APIDocumentationSection>
                    <Styled.APIDocumentationSection>
                        <Styled.APIDocumentationHeader
                        ref={this.authenticationRef}
                        >
                            {strings['pt-br']['apiDocumentationAuthenticationTitle']}
                        </Styled.APIDocumentationHeader>
                        <p>
                            {this.getTextFormatted(strings['pt-br']['apiDocumentationAuthenticationDescription1'])}
                            <span></span>
                            {isAdmin(this.props.types?.defaults?.profile_type, this.props?.user) ? 
                            strings['pt-br']['apiDocumentationAuthenticationDescriptionIsAdmin']
                            : strings['pt-br']['apiDocumentationAuthenticationDescriptionIsNotAdmin']}
                        </p>
                        <p style={{fontWeight: 'bold', color: '#17242D'}}>
                            {strings['pt-br']['apiDocumentationAuthenticationImportantInformation']}
                        </p>
                        <p
                        style={{
                            whiteSpace: 'pre-wrap'
                        }}
                        >
                            {this.getTextFormatted(strings['pt-br']['apiDocumentationAuthenticationDescription2'].replace('{}', this.props.apiAccessKey))}
                        </p>
                        <Styled.APIDocumentationCodeContainer>
                            <p style={{color: '#bfbfbf', padding: '0 10px', marginBottom: '0'}}>
                                {strings['pt-br']['apiDocumentationAuthenticationExampleHeaderParams']}
                            </p>
                            <Code
                            code={`$ curl ${window.location.origin}/api/v0/${this.props.companyId}/${this.state.firstPageNameToUseAsExample} \\\n` +
                            `-H "Authorization: Bearer ${this.props.apiAccessKey}"`}
                            languagePack={StreamLanguage.define(shell)}
                            />
                            <p style={{color: '#bfbfbf', padding: '0 10px', marginTop: '20px', marginBottom: '0'}}>
                                {strings['pt-br']['apiDocumentationAuthenticationExampleQueryStringParams']}
                            </p>
                            <Code
                            code={`$ curl ${window.location.origin}/api/v0/${this.props.companyId}/${this.state.firstPageNameToUseAsExample}?api_key=${this.props.apiAccessKey}`}
                            languagePack={StreamLanguage.define(shell)}
                            />
                        </Styled.APIDocumentationCodeContainer>
                    </Styled.APIDocumentationSection>
                    {Object.entries(this.state.templates).map(([templateId, template]) => (
                        <div
                        key={templateId}>
                            <Styled.APIDocumentationHeader
                            ref={this.createAndRetrieveTemplateRef(templateId)}
                            >
                                {template.name}
                            </Styled.APIDocumentationHeader>
                            {template.formularies.map(formulary => (
                                <Styled.APIDocumentationSection 
                                key={formulary.formularyData.id}
                                >
                                    <h2
                                    ref={this.createAndRetrievePageRef(formulary.formularyData.id)}
                                    >
                                        {strings['pt-br']['apiDocumentationPagesTitle'].replace('{}', formulary.formularyData.label_name)}
                                    </h2>
                                    <br/>
                                    <h4
                                    ref={this.createAndRetrieveSectionsAndFieldsRef(formulary.formularyData.id)}
                                    >
                                        {strings['pt-br']['apiDocumentationSectionsAndFieldsTitle']}
                                    </h4>
                                    {formulary.formularyData.depends_on_form.map(section=> (
                                        <Styled.APIDocumentationSectionAndFieldsContainer
                                        key={section.id}
                                        >
                                            <Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                        {strings['pt-br']['apiDocumentationSectionsAndFieldsSectionName']}
                                                    </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                        {strings['pt-br']['apiDocumentationSectionsAndFieldsSectionType']}
                                                    </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                        {strings['pt-br']['apiDocumentationSectionsAndFieldsSectionDescription']}
                                                    </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                            </Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                            <Styled.APIDocumentationSectionAndFieldsTableRow>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <div>
                                                        <p>
                                                            {section.label_name}
                                                        </p>
                                                    </div>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <div>
                                                        <p>
                                                            {types('pt-br', 'form_type', (section.form_type ==='multi-form') ? 'multi_form': section.form_type)}
                                                        </p>
                                                    </div>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <div>
                                                        <p>
                                                            {section.form_type === 'form' ? 
                                                            strings['pt-br']['apiDocumentationSectionsAndFieldsSectionUniqueTypeLabel']: 
                                                            strings['pt-br']['apiDocumentationSectionsAndFieldsSectionMultiTypeLabel']}
                                                        </p>
                                                        <p>
                                                            {section.form_type === 'form' ? 
                                                            strings['pt-br']['apiDocumentationSectionsAndFieldsSectionUniqueTypeDescription']: 
                                                            strings['pt-br']['apiDocumentationSectionsAndFieldsSectionMultiTypeDescription']}
                                                        </p>
                                                    </div>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                            </Styled.APIDocumentationSectionAndFieldsTableRow>
                                            <Styled.APIDocumentationFieldsContainer>
                                                <Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                        <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                            {strings['pt-br']['apiDocumentationSectionsAndFieldsFieldName']}
                                                        </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                        <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                            {strings['pt-br']['apiDocumentationSectionsAndFieldsFieldType']}
                                                        </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                        <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                            {strings['pt-br']['apiDocumentationSectionsAndFieldsFieldDescription']}
                                                        </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                </Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                                {section.form_fields.map(field => (
                                                    <Fields
                                                    key={field.id}
                                                    field={field}
                                                    types={this.props.types}
                                                    formName={formulary.formularyData.form_name}
                                                    lastValues={this.getLastValuesOfFieldId(templateId, formulary.formularyData.id, field.id)}
                                                    fieldTypeName={this.getFieldTypeNameByFieldTypeId(field.type)}
                                                    />
                                                ))}
                                            </Styled.APIDocumentationFieldsContainer>
                                        </Styled.APIDocumentationSectionAndFieldsContainer>
                                    ))}
                                    <br/>
                                    <h4
                                    ref={this.createAndRetrieveCreateRecordsRef(formulary.formularyData.id)}
                                    >
                                        {strings['pt-br']['apiDocumentationCreateRecordsTitle']}
                                    </h4>
                                    <CreateRecords
                                    formularyId={formulary.formularyData.id}
                                    templateId={templateId}
                                    sections={formulary.formularyData.depends_on_form}
                                    types={this.props.types}
                                    formName={formulary.formularyData.form_name}
                                    getLastValuesOfFieldId={this.getLastValuesOfFieldId}
                                    getFieldTypeNameByFieldTypeId={this.getFieldTypeNameByFieldTypeId}
                                    isFieldAutomaticGenerated={this.isFieldAutomaticGenerated}
                                    />
                                </Styled.APIDocumentationSection>
                            ))}
                        </div>
                    ))}
                </Styled.APIDocumentationSectionsContainer>
            </Styled.APIDocumentationContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ 
    sidebar: state.home.sidebar,
    types: state.login.types, 
    companyId: state.login.companyId,
    apiAccessKey: state.login?.user?.api_access_key,
    user: state.login?.user
 }), actions)(APIDocumentation)