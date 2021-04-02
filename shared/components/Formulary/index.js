import React from 'react'
import axios from 'axios'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FormularyPublicEdit from './FormularyPublicEdit'
import FormularyToolbar from './FormularyToolbar'
import FormularySections from './FormularySections'
import FormularySectionsEdit from './FormularySectionsEdit'
import agent from '../../utils/agent'
import actions from '../../redux/actions'
import delay from '../../utils/delay'
import { strings, paths } from '../../utils/constants' 
import dynamicImport from '../../utils/dynamicImport'
import isAdmin from '../../utils/isAdmin'
import { Formularies } from '../../styles/Formulary'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')
const Router = dynamicImport('next/router')

const makeDelay = delay(10000)
/**
 * IMPORTANT: You might want to read the README to understand how this and all of it's components work.
 * 
 * This component renders the formulary. The formulary is actually one of the main components of our application
 * and usually the one that contains most logic. This happens because EVERYTHING is powered by formularies in our system.
 * For the kanban to be created you actually need to insert data, for listing data to be shown, data has to be inserted.
 * For dashboard to show numbers the formulary have to be used. This is why it is one of the main components of
 * our application. 
 * 
 * Because of this we might need to think of every edge case when we want to display a form to a user, and the usually are:
 * - in the bottom of the screen 
 * - as a standalone component in the screen
 * - as a preview (on templates)
 * - embbed in an external website or custom url (similar as a standalone component, but without some functionalites)
 * 
 * @param {('bottom'|'standalone')} display - how you want to display the formulary:
 * - standalone - display the form relative to the page layout
 * - bottom - adds a widget on the bottom of the page to open or close the formulary
 * @param {('full'|'preview'|'embbed')} type - this have some differeces on what is shown to the user,
 * - embbed - is the formulary that is used to embed in external websites and urls, so, for the external world. 
 * it deactivates funcionalities like: add new or edit connection field is not available, cannot edit.
 * - preview - the formulary is fully functional, except it doesn't have a save button
 * - full - usually the formulary that is used in the home page.
 * @param {Function} onSaveFormulary - (optional) - This function is fired whenever the user saves the formulary, this way, on the parent component
 * we can display something, or do some sideeffect.
 * @param {String} formName - the current formName, you can get this by the url or it is the primaryForm in login's react redux
 * @param {Object} buildData - (optional) - usually used in themes, sometimes you want to display a formulary, but you don`t want to load it
 * inside of this component, you can use this props to send the build data for the form to be rendered.
 * @param {BigInteger} formularyId - (optional) - the Id of the form you want to load, if you save the form it automatically saves an id
 * you can use this id to load the formulary, usually used when the user clicks a listing row or a kanban card
 * @param {Function} setFormularyId - (optional) - REQUIRED IF `formularyId` set. Sets the formulary id to null when the user closes
 * the 'open and close' type of formulary. It is used to reset the form to a default state.
 * @param {Function} setFormularySettingsHasBeenUpdated - (optional) - works like a signal, if the settings of the formulary have been
 * updated we notify using this function, usually used to update the kanban dimension order or the fields headers in the listing.
 * @param {Function} setFormularyDefaultData - (optional) - REQUIRED IF `formularyDefaultData` is set. Sets the `formularyDefaultData` to 
 * null when the user closes the 'open and close' type of formulary. It is used to reset the form to a default state.
 * @param {Array<Object>} formularyDefaultData - (optional) - check components/Kanban/KanbanDimension.js to check how this data is defined. The default
 * data is used to override the data that is loaded in the formulary.
 * @param {Function} onOpenOrCloseFormulary - (optional) - function to set the formulary to open or close states
 * */
class Formulary extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.formularyId = null
        this.updateFormularyWhenClose = false
        this.draftFilesOrDefaultAttachments = {}
        this.state = {
            draftToFileReference: {},
            buildData: {},
            filled: {
                hasBuiltInitial: false,
                isAuxOriginalInitial: false,
                data: {
                    id: null,
                    depends_on_dynamic_form: []
                }
            },
            isEditingShare: false,
            isEditing: false,
            errors: {},
            isLoading: false,
            isLoadingEditing: false,
            isSubmitting: false,
            auxOriginalInitialIndex: -1,
            auxOriginalInitial: []
        }
    }
    // ------------------------------------------------------------------------------------------
    setIsOpen = () => (this._ismounted && this.props.display === 'bottom') ? this.props.onOpenOrCloseFormulary(!this.props.formulary.isOpen) : null
    // ------------------------------------------------------------------------------------------
    setAuxOriginalInitialIndex = (data) => (this._ismounted) ? this.setState(state => state.auxOriginalInitialIndex = data) : null
    // ------------------------------------------------------------------------------------------
    setIsSubmitting = (data) => (this._ismounted) ? this.setState(state => state.isSubmitting = data) : null
    // ------------------------------------------------------------------------------------------
    setIsLoading = (data) => (this._ismounted) ? this.setState(state => state.isLoading = data): null
    // ------------------------------------------------------------------------------------------
    setIsEditingShare = (data) => (this._ismounted) ? this.setState(state => state.isEditingShare = data) : null
    // ------------------------------------------------------------------------------------------
    setErrors = (errors) => (this._ismounted) ? this.setState(state => state.errors = errors) : null
    // ------------------------------------------------------------------------------------------
    setBuildData = (data) => (this._ismounted) ? this.setState(state => state.buildData = data) : null
    // ------------------------------------------------------------------------------------------
    setFilledHasBuiltInitial = (data) => (this._ismounted) ? this.setState(state => state.filled.hasBuiltInitial = data) : null
    // ------------------------------------------------------------------------------------------
    setFilledIsAuxOriginalInitial = (data) => (this._ismounted) ? this.setState(state => state.filled.isAuxOriginalInitial = data) : null
    // ------------------------------------------------------------------------------------------
    setDraftToFileReference = (draftId, fileName) => (this._ismounted) ? this.setState(state => {
        const draftToFileReference = {...state.draftToFileReference}
        draftToFileReference[draftId] = fileName
        return {
            ...state,
            draftToFileReference: draftToFileReference
        }
    }) : null
    // ------------------------------------------------------------------------------------------
    setFilledData = (id, sectionsData) => (this._ismounted) ? this.setState(state => 
        state.filled.data = {
            id: id,
            depends_on_dynamic_form: [...sectionsData]
        }) : null
    // ------------------------------------------------------------------------------------------     
    setFilledDataAndBuildData = (id, hasBuiltInitial, isAuxOriginalInitial, filledSectionsData, buildData) => (this._ismounted) ? this.setState(state=> ({
            ...state,
            filled: {
                hasBuiltInitial: hasBuiltInitial,
                isAuxOriginalInitial: isAuxOriginalInitial,
                data: {
                    id: id,
                    depends_on_dynamic_form: [...filledSectionsData]
                }
            }, 
            buildData: buildData
        })) : null
    
    // ------------------------------------------------------------------------------------------
    resetAuxOriginalInitial = (newAuxOriginalInitial, newAuxOriginalInitialIndex) => (this._ismounted) ? this.setState(state => ({
        ...state, 
        auxOriginalInitial: newAuxOriginalInitial, 
        auxOriginalInitialIndex: newAuxOriginalInitialIndex
    })) : null
    // ------------------------------------------------------------------------------------------
    /**
     * Set index and updates the array of `auxOriginalInitial`. The index holds an interger 
     * that representes to what index we want to go back to when we leave this conected form.
     * 
     * `auxOriginalInitial` is just a list with the content of each formulary we have passed.
     */
    setAuxOriginalInitial = () => (this._ismounted) ? this.setState(state => ({
        ...state,
        auxOriginalInitialIndex: state.auxOriginalInitialIndex + 1,
        auxOriginalInitial: state.auxOriginalInitial.concat(this.deepCopyFormularyData(this.state.buildData, this.state.filled, true, true))
    })) : null
    // ------------------------------------------------------------------------------------------
    /**
     * Goes to editing mode only, nothing much. When we go back from the editing mode we load the formulary again.
     */
    setIsEditing = () => {
        if (!this.state.isEditing) {
            this.source = this.CancelToken.source()
            this.props.onGetFormularySettings(this.source, this.state.buildData.id)
        } else {
            this.props.setFormularySettingsHasBeenUpdated()
            this.setFilledDataAndBuildData(null, false, false, [], {})
            this.onLoadFormulary(this.props.formName, this.props.formularyId)
        }
        this.setState(state => {
            return {
                ...state,
                isEditing: !state.isEditing
            }
        })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user saves an attachment we automatically upload it to the drafts and send the recieved draft string id back to the 
     * attachment field component.
     * 
     * @param {File} file - The file you are uploading to the draft
     */
    onAddFile = async (fileName, fieldId, file=null) => {
        let draftStringId = ''
        let response = null
        if (file !== null) {
            response = await this.props.onCreateDraftFile(file)
        } else {
            response = await agent.http.FORMULARY.getDraftStringIdFromDefaultAttachment(
                this.source,
                this.props.formName,
                fieldId,
                fileName
            )
        }
        if (response && response.status === 200) {
            draftStringId = response.data.data.draft_string_id
            this.draftFilesOrDefaultAttachments[draftStringId] = {
                fileName: fileName,
                fieldId: fieldId,
                file: file
            }
            this.setDraftToFileReference(draftStringId, fileName)

            agent.websocket.DRAFT.recieveFileRemoved({
                blockId: '',
                callback: (data) => {
                    if (this._ismounted && [...Object.keys(this.draftFilesOrDefaultAttachments)].includes(data.data.draft_string_id)) {
                        const draft = this.draftFilesOrDefaultAttachments[data.data.draft_string_id]
                        const fileName = draft.fileName
                        const fieldId = draft.fieldId
                        const file = draft.file

                        this.onAddFile(fileName, fieldId, file)
                    }
                }
            })
        }
       
        return draftStringId
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Handy function to make a deepCopy of the formulary data, we use this for going forward and going back
     * the list of connected formularies.
     * 
     * @param {Object} buildData - The data to build the formulary
     * @param {Object} filled - The filled data of formularies.
     * @param {Boolean} isAuxOriginalInitial - Set to true if it is an `auxOriginalInitial`, so if this formulary is from the list of connected formularies.
     * @param {Boolean} hasBuiltInitial - Set to false if you want to build the formulary again with all it's conditions and so on.
     */
    deepCopyFormularyData = (buildData, filled, isAuxOriginalInitial, hasBuiltInitial) => {
        return {
            buildData: JSON.parse(JSON.stringify(buildData)),
            filled: {
                hasBuiltInitial: hasBuiltInitial,
                isAuxOriginalInitial: isAuxOriginalInitial, 
                data: JSON.parse(JSON.stringify(filled.data))
            }
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user clicks to create a pdf template.
     */
    onClickPDFTemplates = () => {
        Router.push(paths.pdfTemplates().asUrl, paths.pdfTemplates(this.props.formName, this.props.formularyId).asUrl, { shallow: true })
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user clicks to share the formulary.
     */
    onClickShare = () => {
        if (this.state.isEditingShare) {
            this.setFilledDataAndBuildData(
                this.state.filled.data.id, 
                false, 
                false, 
                this.state.filled.data.depends_on_dynamic_form, 
                this.state.buildData
            )
        }
        this.setIsEditingShare(!this.state.isEditingShare)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Submits the formulary, might be really straight forward. It's only important to understand that
     * when we save and have any `auxOriginalInitial` we go back to the previous formulary.
     * 
     * @param {Boolean} duplicate - 
     */
    onSubmit = (duplicate=null) => {
        this.setIsSubmitting(true)
        let request = null
        if (this.state.filled.data.id) {
            request = this.props.onUpdateFormularyData(this.state.filled.data, this.state.buildData.form_name, this.state.filled.data.id, duplicate)
        } else {
            request = this.props.onCreateFormularyData(this.state.filled.data,this.state.buildData.form_name)
        }
        
        if (request) {
            request.then(response=> {
                this.setIsSubmitting(false)
                if (response && response.status !== 200) {
                    this.setErrors(response.data.error)
                } else if (this.isInConnectedFormulary()) {
                    this.onGoBackFromConnectedForm()
                } else if (this.props.onSaveFormulary) {
                    this.removeDrafts()
                    this.props.onSaveFormulary()
                } else {
                    this.removeDrafts()
                    this.setIsOpen()
                }
            })
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Resets the hole formulary, it's build data and the form data, usually used while closing the formulary.
     */
    resetFormulary = () => {
        const buildData = (this.state.auxOriginalInitial[0] && 
            this.state.auxOriginalInitial[0].filled && 
            this.state.auxOriginalInitial[0].buildData) ? this.state.auxOriginalInitial[0].buildData : this.state.buildData

        if (this.updateFormularyWhenClose) {
            this.updateFormularyWhenClose = false
            this.getBuildFormulary(this.props.formName, true).then(_ => {
                this.onFullResetFormulary(buildData)
                this.resetAuxOriginalInitial([], -1)
                this.props.setFormularyId(null)
                this.props.setFormularyDefaultData([])
                this.removeDrafts()
        })
        } else {
            this.onFullResetFormulary(buildData)
            this.resetAuxOriginalInitial([], -1)
            this.props.setFormularyId(null)
            this.props.setFormularyDefaultData([])
            this.removeDrafts()
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Full reset of the formulary is reset the errors and set `buildData` and `filled` with new data. 
     * That's it. super simple, but we do this all in one go.
     * 
     * @param {Object} buildData - The data to build the formulary
     * @param {Object} filled - The filled data of formularies.
     */
    onFullResetFormulary = (buildData, filled=null) => {
        if (typeof(filled) === 'undefined' || filled === null){
            filled = {
                hasBuiltInitial: false,
                data: {
                    id: null,
                    depends_on_dynamic_form: []
                }
            }
        }
        // reset the errors of the formulary, obviously
        this.setErrors({})
        this.setFilledDataAndBuildData(
            filled.data.id, 
            filled.hasBuiltInitial,
            filled.isAuxOriginalInitial,
            filled.data.depends_on_dynamic_form, 
            buildData
        )
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When we are in a connected formulary we load it directly on the form we are working on. On the exact same component.
     * Because of this we actually need to save the reference from the data we are working on. We save it in a list so the user can walk
     * through many conected pages.
     * 
     * When we go back we actually do many state changes, one is a full reset of the formulary, the other is to `resetAuxOriginalInitial,` 
     * the last is used so we change the index and the array from `auxOriginalInitial`.
     */
    onGoBackFromConnectedForm = () => {
        const auxOriginalInitialCopy = this.state.auxOriginalInitial.map(originalInitial =>
            this.deepCopyFormularyData(originalInitial.buildData, originalInitial.filled, originalInitial.filled.isAuxOriginalInitial, originalInitial.filled.hasBuiltInitial)
        )
        auxOriginalInitialCopy.splice(auxOriginalInitialCopy.length-1, 1)
        const indexToGoBackTo = JSON.parse(JSON.stringify(this.state.auxOriginalInitialIndex))
        this.onFullResetFormulary(
            this.state.auxOriginalInitial[indexToGoBackTo].buildData, 
            this.state.auxOriginalInitial[indexToGoBackTo].filled
        )
        
        this.resetAuxOriginalInitial(auxOriginalInitialCopy, this.state.auxOriginalInitialIndex-1)
    }
    // ------------------------------------------------------------------------------------------
    /** 
     * Retrieves the data to build the formulary and adds a websocket so we can subscribe to changes in the formulary and retrive the changes.
     * 
     * It's important to notice that we only change the formulary when it's on closed state, NEVER while it is open. This way we prevent to update the formulary
     * as a user is adding new information.
     * 
     * IMPORTANT: if the formulary is open we don't make changes as said before. What we do is postpone the update for when the formulary is being closed
     */
    getBuildFormulary = async (formName, forceUpdateState=false) => {
        const formularyBuildData = await this.props.onGetBuildFormulary(this.source, formName)
        const subscribeToChangesOfFormularyId = this.state.auxOriginalInitial.length > 0 ? this.state.auxOriginalInitial[0].buildData.id : formularyBuildData.id
        
        agent.websocket.FORMULARY.recieveFormularyUpdated({
            formId: subscribeToChangesOfFormularyId,
            callback: (data) => {
                makeDelay(() => {
                    if (data.data.form_id === subscribeToChangesOfFormularyId && !this.state.isEditing && !this.props.formulary.isOpen) {
                        this.getBuildFormulary(formName, true)
                    } else if (this.props.formulary.isOpen) {
                        this.updateFormularyWhenClose = true
                    }
                })
            }
        })
        if (forceUpdateState && this._ismounted) {
            this.setFilledDataAndBuildData(
                this.state.filled.data.id, 
                false,
                this.state.filled.isAuxOriginalInitial,
                this.state.filled.data.depends_on_dynamic_form, 
                formularyBuildData
            )
        }
        return formularyBuildData
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function is responsible to load the formulary data inside of the formulary, sometimes you can load the data externally, usually when displaying
     * as a preview or some sort.
     * 
     * @param {String} formName - The name of the form to load
     * @param {Interger} formId - If you are loading from an already existing data and not a new. Set this argument.
     */
    onLoadFormulary = async (formName, formId=null) => {
        // This is needed to set the formId first so the default fields are NOT loaded when the
        // form id is defined, if we don't do this, the default data will be loaded in the formulary
        this.setFilledDataAndBuildData(
            formId, 
            this.state.filled.hasBuiltInitial,
            this.state.filled.isAuxOriginalInitial,
            this.state.filled.data.depends_on_dynamic_form,
            this.state.buildData
        )
        // you can build the data outside of the formulary, so you can use this to render other formularies (like themes for example)
        if (this.props.buildData) {
            this.onFullResetFormulary(this.props.buildData)
        // this part is used when loading from the home page for example
        } else {
            this.setIsLoading(true)
            this.getBuildFormulary(formName).then(formularyBuildData => {
                this.setIsLoading(false)
                if (formId) {
                    this.props.onGetFormularyData(this.source, formName, formId, this.props.formularyDefaultData).then(data=> {
                        const id = data.id ? data.id : null
                        const sectionsData = data.depends_on_dynamic_form ? data.depends_on_dynamic_form : []
                        this.setFilledDataAndBuildData(id, false, false, sectionsData, formularyBuildData)
                    })
                } else {
                    this.onFullResetFormulary(formularyBuildData)
                }
            })
        }
    }
    // ------------------------------------------------------------------------------------------
    /**
     * When the user clicks "add new" or "edit" on the connection field, a new form is loaded in this component without losing 
     * the data of the previous form component loaded. For this to work we save the current data of the form he is in a list. So 
     * when he go back he doesn't loses the data.
     */
    onChangeFormulary = (formName, formId=null) => { 
        this.setAuxOriginalInitial()
        this.onLoadFormulary(formName, formId)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Removes the drafts when we are closing or unmouting the formulary
     */
    removeDrafts = () => {
        const draftsToRemove = Object.keys(this.draftFilesOrDefaultAttachments)
        for (let i = 0; i < draftsToRemove.length; i++) {
            this.props.onRemoveDraft(draftsToRemove[i])
        }
        this.draftFilesOrDefaultAttachments = {}
    }
    // ------------------------------------------------------------------------------------------
    /**
     * Handy function just used for rendering stuff in the big green button of the page.
     */
    getFormularyButtonTitle = () => {
        if (this.state.isLoading){
            return strings['pt-br']['formularyLoadingButtonLabel']
        } else if (this.props.formulary.isOpen) {
            const formName = (this.state.buildData && this.state.buildData.label_name) ? this.state.buildData.label_name : ''
            return 'Fechar ' + formName 
        } else {
            return strings['pt-br']['formularyOpenButtonLabel']
        }
    }
    // ------------------------------------------------------------------------------------------
    isToShowToEdit = () => {
        // we can only edit the form if the form you are in is not an embbeded or in preview, 
        // and if it is not a connected formulary.
        return this.state.buildData && this.state.buildData.group_id && this.state.buildData.id &&
                this.props.type === 'full' && !this.isInConnectedFormulary() && 
                isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user)
    }
    // ------------------------------------------------------------------------------------------
    /**
     * This function is used to tell us if we are in a connected formulary.
     */
    isInConnectedFormulary = () => {
        return this.state.auxOriginalInitialIndex !== -1 && this.props.type === 'full'
    }
    // ------------------------------------------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentDidMount = () => {
        this.source = this.CancelToken.source()
        this._ismounted = true
        this.onLoadFormulary(this.props.formName, this.props.formularyId)
        if (process.env['APP'] === 'web') {
            window.addEventListener('beforeunload', this.onRemoveDraft)
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentWillUnmount = () => {
        this._ismounted = false
        if (this.source) {
            this.source.cancel()
        }

        this.removeDrafts()
        if (process.env['APP'] === 'web') {
            window.removeEventListener('beforeunload', this.onRemoveDraft)
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    componentDidUpdate = (oldProps) => {
        const formularyIsClosing = oldProps.formulary.isOpen !== this.props.formulary.isOpen && oldProps.formulary.isOpen

        // the data is reset with 2 conditions:
        // - first the formName has changed,
        // - second the props.formulary.isOpen has changed.
        //
        // if the formularyId has changed it doesn't reload the formulary, but only the data it contains
        if (oldProps.formName !== this.props.formName) {
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            if (this.state.isEditing) this.setIsEditing()
            // reset the Original initial, because we don't need it anymore since we are loading a new formulary
            // not reseting can cause a bug if the user is in a connected formulary and changes the page.
            this.resetAuxOriginalInitial([], -1)
            this.onLoadFormulary(this.props.formName, null)
        } 
        // formulary id has changed, it was null and is not null anymore
        if (oldProps.formularyId !== this.props.formularyId && this.props.formularyId && oldProps.formularyId === null) {
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.props.onGetFormularyData(this.source, this.props.formName, this.props.formularyId, this.props.formularyDefaultData).then(data=> {
                const id = data.id ? data.id : null
                const sectionsData = data.depends_on_dynamic_form ? data.depends_on_dynamic_form : []
                // need to set hasBuiltInitial to false in order to update in the sections
                this.onFullResetFormulary(this.state.buildData, {
                    hasBuiltInitial: false,
                    isAuxOriginalInitial: false,
                    data: {
                        id: id,
                        depends_on_dynamic_form: sectionsData
                    }
                })
            })
        }
        // The formulary is closing
        if (formularyIsClosing) {
            this.resetFormulary()
            if (this.state.isEditing) {
                this.setState(state => {
                    return {
                        ...state,
                        isEditing: !state.isEditing
                    }
                })
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //########################################################################################//
    renderMobile = () => {
        return (
            <View></View>
        )
    }
    //########################################################################################//
    renderWeb = () => {
        const sections = (this.state.buildData && this.state.buildData.depends_on_form) ? this.state.buildData.depends_on_form : []
        return (
            <Formularies.Container display={this.props.display}>
                {this.props.display === 'bottom' ? (
                    <Formularies.Button onClick={e=>{this.setIsOpen()}} isOpen={this.props.formulary.isOpen} disabled={this.state.isLoading}>
                        {this.getFormularyButtonTitle()}
                    </Formularies.Button>
                ) : ''}
                <Formularies.ContentContainer isOpen={this.props.formulary.isOpen} display={this.props.display}>
                    <FormularyToolbar
                    isEditing={this.state.isEditing}
                    isEditingShare={this.state.isEditingShare}
                    isLoading={this.state.isLoading}
                    isToShowToEdit={this.isToShowToEdit()}
                    isInConnectedFormulary={this.isInConnectedFormulary()}
                    formularyId={this.props.formularyId}
                    setIsEditing={this.setIsEditing}
                    onClickShare={this.onClickShare}
                    onClickPDFTemplates={this.onClickPDFTemplates}
                    formularyType={this.props.type}
                    />
                    {this.state.isEditingShare ? (
                        <FormularyPublicEdit
                        onGetPublicFormulary={this.props.onGetPublicFormulary}
                        onUpdatePublicFormulary={this.props.onUpdatePublicFormulary}
                        formularyBuildData={this.state.buildData}
                        />
                    ) : this.state.isEditing ? (
                        <div>
                            <FormularySectionsEdit
                            formName={this.props.formName}
                            onCreateDraftFile={this.props.onCreateDraftFile}
                            onRemoveFormularySettingsField={this.props.onRemoveFormularySettingsField}
                            onUpdateFormularySettingsField={this.props.onUpdateFormularySettingsField}
                            onCreateFormularySettingsField={this.props.onCreateFormularySettingsField}
                            onRemoveFormularySettingsSection={this.props.onRemoveFormularySettingsSection}
                            onUpdateFormularySettingsSection={this.props.onUpdateFormularySettingsSection}
                            onCreateFormularySettingsSection={this.props.onCreateFormularySettingsSection}
                            onChangeFormularySettingsState={this.props.onChangeFormularySettingsState}
                            onTestFormularySettingsFormulaField={this.props.onTestFormularySettingsFormulaField}
                            formId={this.state.buildData.id}
                            types={this.props.login.types}
                            setIsEditing={this.setIsEditing}
                            data={this.props.formulary.update}
                            />
                        </div>
                    ): (
                        <div>
                            {this.state.isLoading ? '' : (
                                <div>
                                    {this.isInConnectedFormulary() ? (
                                        <Formularies.Navigator 
                                        onClick={e => {
                                            this.onGoBackFromConnectedForm()
                                        }}
                                        >
                                            <FontAwesomeIcon icon={'chevron-left'}/>&nbsp;{(this.state.auxOriginalInitial[this.state.auxOriginalInitialIndex].buildData) ? 
                                                        this.state.auxOriginalInitial[this.state.auxOriginalInitialIndex].buildData.label_name : ''}
                                        </Formularies.Navigator>
                                    ) : ''}   
                                    <FormularySections 
                                    isFormOpen={this.props.display === 'bottom' ? this.props.formulary.isOpen : true}
                                    formName={this.state.buildData.form_name}
                                    type={this.props.type}
                                    types={this.props.login.types}
                                    errors={this.state.errors}
                                    onChangeFormulary={this.onChangeFormulary}
                                    data={this.state.filled.data}
                                    isAuxOriginalInitial={this.state.filled.isAuxOriginalInitial}
                                    setFilledIsAuxOriginalInitial={this.setFilledIsAuxOriginalInitial}
                                    hasBuiltInitial={this.state.filled.hasBuiltInitial}
                                    setFilledHasBuiltInitial={this.setFilledHasBuiltInitial}
                                    draftToFileReference={this.state.draftToFileReference}
                                    onAddFile={this.onAddFile}
                                    setFilledData={this.setFilledData}
                                    sections={sections}
                                    />
                                    {sections.length > 0 && this.props.type !== 'preview' ? (
                                        <div>
                                            <Formularies.SaveButton disabled={this.state.isSubmitting} onClick={e=> {this.onSubmit()}}>
                                                {this.state.isSubmitting ? (<Spinner animation="border" />) : strings['pt-br']['formularySaveButtonLabel']}
                                            </Formularies.SaveButton>
                                            {this.state.filled.data.id ? (
                                                <Formularies.SaveButton disabled={this.state.isSubmitting} onClick={e=> {this.onSubmit(true)}}>
                                                    {this.state.isSubmitting ? (<Spinner animation="border" />) : strings['pt-br']['formularyDuplicateButtonLabel']}
                                                </Formularies.SaveButton>
                                            ) : ''}
                                        </div>
                                    ) : ''}
                                    
                                </div> 
                            )}
                        </div>
                    )}
                </Formularies.ContentContainer>
            </Formularies.Container>
        )
    }
    //########################################################################################//
    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ formulary: state.home.formulary, login: state.login }), actions)(Formulary);