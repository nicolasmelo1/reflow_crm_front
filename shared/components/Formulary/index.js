import React from 'react'
import axios from 'axios'
import { Row, Col, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import FormularySections from './FormularySections'
import FormularySectionsEdit from './FormularySectionsEdit'
import actions from '../../redux/actions'
import { strings } from '../../utils/constants'
import isAdmin from '../../utils/isAdmin'
import { Formularies } from '../../styles/Formulary'

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
 * @param {Enum['bottom', 'standalone']} display - how you want to display the formulary:
 * - standalone - display the form relative to the page layout
 * - bottom - adds a widget on the bottom of the page to open or close the formulary
 * @param {Enum['full', 'preview', 'embbed']} type - this have some differeces on what is shown to the user,
 * - embbed - is the formulary that is used to embed in external websites and urls, so, for the external world. 
 * it deactivates funcionalities like: add new or edit connection field is not available, cannot edit.
 * - preview - the formulary is fully functional, except it doesn't have a save button
 * - full - usually the formulary that is used in the home page.
 * @param {String} formName - the current formName, you can get this by the url or it is the primaryForm in login's react redux
 * @param {Object} buildData - (optional) - usually used in themes, sometimes you want to display a formulary, but you don`t want to load it
 * inside of this component, you can use this props to send the build data for the form to be rendered.
 * @param {BigInteger} formularyId - (optional) - the Id of the form you want to load, if you save the form it automatically saves an id
 * you can use this id to load the formulary, usually used when the user clicks a listing row or a kanban card
 * @param {Function} setFormularyId - (optional) - REQUIRED IF `formularyId` set. Sets the formulary id to null when the user closes
 * the 'open and close' type of formulary. It is used to reset the form to a default state.
 * @param {Function} setFormularySettingsHasBeenUpdated - (optional) - works like a signal, if the settings of the formulary have been
 * updated we notify using this function, usually used to update the kanban dimension order or the fields headers in the listing.
 * @param {Function} setFormularyHasBeenUpdated - (optional) - same as above, the difference is to notify a data have been inserted. 
 * A formulary have been saved.
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
        this.state = {
            buildData: {},
            userOptions: [],
            filled: {
                hasBuiltInitial: false,
                data: {
                    id: null,
                    depends_on_dynamic_form: []
                },
                files: []
            },
            isEditing: false,
            errors: {},
            isLoading: false,
            isLoadingEditing: false,
            isSubmitting: false,
            auxOriginalInitial: {}
        }
    }

    setUserOptions = (data) => (this._ismounted) ? this.setState(state => state.userOptions = data) : null

    setIsSubmitting = (data) => (this._ismounted) ? this.setState(state => state.isSubmitting = data) : null

    setIsLoading = (data) => (this._ismounted) ? this.setState(state => state.isLoading = data): null

    setErrors = (errors) => (this._ismounted) ? this.setState(state => state.errors = errors) : null

    setBuildData = (data) => (this._ismounted) ? this.setState(state => state.buildData = data) : null

    setFilledHasBuiltInitial = (data) => (this._ismounted) ? this.setState(state => state.filled.hasBuiltInitial = data) : null

    setFilledFiles = (data) => (this._ismounted) ? this.setState(state => state.filled.files = data) : null

    setFilledData = (id, sectionsData) => (this._ismounted) ? this.setState(state => 
        state.filled.data = {
            id: id,
            depends_on_dynamic_form: [...sectionsData]
        }) : null
        
    setFilledDataAndBuildData = (id, filledSectionsData, filledFilesData, buildData) => (this._ismounted) ? this.setState(state=> ({
            ...state,
            filled: {
                hasBuiltInitial: false,
                files: filledFilesData,
                data: {
                    id: id,
                    depends_on_dynamic_form: [...filledSectionsData]
                }
            }, 
            buildData: buildData 
        })) : null
    
    setAuxOriginalInitial = () => (this._ismounted) ? this.setState(state => {
        state.auxOriginalInitial = {
            buildData: JSON.parse(JSON.stringify(this.state.buildData)),
            filled: {
                hasBuiltInitial: false, 
                files: this.state.filled.files.map(file=> {
                    let newFile = new Blob([file.file], {type: originalFile.type})
                    newFile.name = file.file.name
                    return {
                        ...file,
                        file: newFile
                    }
                }),
                data: JSON.parse(JSON.stringify(this.state.filled.data))
            }
        }
    }) : null
    

    setIsOpen = () => (this._ismounted) ? this.props.onOpenOrCloseFormulary(!this.props.formulary.isOpen) : null

    setIsEditing = () => {
        if (!this.state.isEditing) {
            this.source = this.CancelToken.source()
            this.props.onGetFormularySettings(this.source, this.state.buildData.id)
        } else {
            this.props.setFormularySettingsHasBeenUpdated()
            this.onLoadFormulary(this.props.formName, this.props.formularyId)
        }
        this.setState(state => {
            return {
                ...state,
                isEditing: !state.isEditing
            }
        })
    }


    onSubmit = () => {
        this.setIsSubmitting(true)
        let request = null
        if (this.state.filled.data.id) {
            request = this.props.onUpdateFormularyData(this.state.filled.data, this.state.filled.files, this.state.buildData.form_name, this.state.filled.data.id)
        } else {
            request = this.props.onCreateFormularyData(this.state.filled.data, this.state.filled.files,this.state.buildData.form_name)
        }
        
        if (request) {
            request.then(response=> {
                this.setIsSubmitting(false)
                if (response && response.status !== 200) {
                    this.setErrors(response.data.error)
                } else if (this.state.buildData.form_name !== this.props.formName) {
                    this.onFullResetFormulary(this.state.auxOriginalInitial.filled, this.state.auxOriginalInitial.buildData)
                } else {
                    this.props.setFormularyHasBeenUpdated()
                    this.setIsOpen()
                }
            })
        }
    }

    onFullResetFormulary = (filled, buildData) => {
        this.setFilledDataAndBuildData(
            filled.data.id, 
            filled.data.depends_on_dynamic_form, 
            filled.files, 
            buildData
        )
    }

    onLoadFormulary = async (formName, formId=null) => {
        this.setFilledHasBuiltInitial(false)
        this.source = this.CancelToken.source()
        this.props.onGetFormularyUserOptions(this.source, formName).then(response=> {
            if (response && response.status === 200) {
                this.setUserOptions(response.data.data)
            }
        })
        // you can build the data outside of the formulary, so you can use this to render other formularies (like themes for example)
        if (this.props.buildData) {
            this.setBuildData(this.props.buildData)
        // this part is used when loading from the home page for example
        } else {
            this.setIsLoading(true)
            if (formId) {
                this.props.onGetFormularyData(this.source, formName, formId, this.props.formularyDefaultData).then(data=> {
                    const id = data.id ? data.id : null
                    const sectionsData = data.depends_on_dynamic_form ? data.depends_on_dynamic_form : []
                    this.props.onGetBuildFormulary(this.source, formName).then(data => {
                        this.setIsLoading(false)
                        this.setFilledDataAndBuildData(id, sectionsData, [], data)
                    })
                })
            } else {
                this.props.onGetBuildFormulary(this.source, formName).then(data => {
                    this.setIsLoading(false)
                    this.setBuildData(data)
                })
            }
        }
    }

    /**
     * When the user clicks "add new" or "edit" on the connection field, a new form is loaded in this component without losing 
     * the data of the previous form component loaded
     */
    onChangeFormulary = (formName, formId=null) => { 
        this.setAuxOriginalInitial()
        this.setBuildData({})
        this.onLoadFormulary(formName, formId)
    }

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

    showToEdit = () => {
        // we can only edit the form if the form you are in is not an embbeded or in preview, 
        // and the formName is the same you are int
        return this.state.buildData && this.state.buildData.group_id && this.state.buildData.id && 
               this.props.type === 'full' && this.state.buildData.form_name === this.props.formName &&
               isAdmin(this.props.login?.types?.defaults?.profile_type, this.props.login?.user)
    }

    showNavigator = () => {
        return this.state.buildData && this.state.buildData.form_name !== this.props.formName && this.props.type === 'full'
    }

    componentDidMount = () => {
        this._ismounted = true
        this.onLoadFormulary(this.props.formName, this.props.formularyId)
    }


    componentWillUnmount = () => {
        this._ismounted = false
        if (this.source) {
            this.source.cancel()
        }
    }


    componentDidUpdate = (oldProps) => {
        // the data is reset with 2 conditions:
        // - first the formName has changed,
        // - second the props.formulary.isOpen has changed.
        //
        // if the formularyId has changed it doesn't reload the formulary, but only the data it contains
        if (oldProps.formName !== this.props.formName) {
            if (this.source) {
                this.source.cancel()
            }
            if (this.state.isEditing) this.setIsEditing()
            this.setBuildData({})
            this.onLoadFormulary(this.props.formName, null)
        } 
        if (oldProps.formularyId !== this.props.formularyId && this.props.formularyId && oldProps.formularyId === null) {
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.props.onGetFormularyData(this.source, this.props.formName, this.props.formularyId, this.props.formularyDefaultData).then(data=> {
                const id = data.id ? data.id : null
                const sectionsData = data.depends_on_dynamic_form ? data.depends_on_dynamic_form : []
                this.setFilledData(id, sectionsData)
            })
        }

        if (oldProps.formulary.isOpen !== this.props.formulary.isOpen && oldProps.formulary.isOpen) {
            if (this.state.auxOriginalInitial.filled && this.state.auxOriginalInitial.buildData) {
                this.onFullResetFormulary(this.state.auxOriginalInitial.filled, this.state.auxOriginalInitial.buildData)
            } else {
                this.setFilledData(null, [])
                this.setFilledHasBuiltInitial(false)
            }
            this.props.setFormularyId(null)
            this.props.setFormularyDefaultData([])
        }
    }

    render() {
        const sections = (this.state.buildData && this.state.buildData.depends_on_form) ? this.state.buildData.depends_on_form : []
        return (
            <Formularies.Container display={this.props.display}>
                {this.props.display === 'bottom' ? (
                    <Formularies.Button onClick={e=>{this.setIsOpen()}} isOpen={this.props.formulary.isOpen} disabled={this.state.isLoading}>
                        {this.getFormularyButtonTitle()}
                    </Formularies.Button>
                ) : ''}
                <Formularies.ContentContainer isOpen={this.props.formulary.isOpen} display={this.props.display}>
                    {(this.state.isEditing) ? (
                        <div>
                            <FormularySectionsEdit
                            formName={this.props.formName}
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
                            userOptions={this.state.userOptions}
                            />
                        </div>
                    ): (
                        <div>
                            {this.state.isLoading ? '' : (
                                <div>
                                    {this.showToEdit() ? (
                                        <Formularies.EditButton onClick={e => this.setIsEditing()} label={strings['pt-br']['formularyEditButtonLabel']} description={strings['pt-br']['formularyEditButtonDescription']}/>
                                    ) : ''}
                                    {this.showNavigator() ? (
                                        <Formularies.Navigator 
                                        onClick={e => {this.onFullResetFormulary(this.state.auxOriginalInitial.filled, this.state.auxOriginalInitial.buildData)}}
                                        >
                                            &lt;&nbsp;{(this.state.auxOriginalInitial.buildData) ? this.state.auxOriginalInitial.buildData.label_name : ''}
                                        </Formularies.Navigator>
                                    ) : ''}   
                                    <FormularySections 
                                    type={this.props.type}
                                    types={this.props.login.types}
                                    errors={this.state.errors}
                                    onChangeFormulary={this.onChangeFormulary}
                                    data={this.state.filled.data}
                                    files={this.state.filled.files}
                                    hasBuiltInitial={this.state.filled.hasBuiltInitial}
                                    setFilledHasBuiltInitial={this.setFilledHasBuiltInitial}
                                    setFilledFiles={this.setFilledFiles}
                                    setFilledData={this.setFilledData}
                                    sections={sections}
                                    userOptions={this.state.userOptions}
                                    />
                                    {sections.length > 0 && this.props.type !== 'preview' ? (
                                        <Formularies.SaveButton disabled={this.state.isSubmitting} onClick={e=> {this.onSubmit()}}>
                                            {this.state.isSubmitting ? (<Spinner animation="border" />) : strings['pt-br']['formularySaveButtonLabel']}
                                        </Formularies.SaveButton>
                                    ) : ''}
                                    
                                </div> 
                            )}
                        </div>
                    )}
                </Formularies.ContentContainer>
            </Formularies.Container>
        )
    }
}

export default connect(state => ({ formulary: state.home.formulary, login: state.login }), actions)(Formulary);