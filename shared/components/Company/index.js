import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { connect } from 'react-redux'
import actions from '../../redux/actions'
import dynamicImport from '../../utils/dynamicImport'
import { strings } from '../../utils/constants'
import {
    CompanyFormularyContainer,
    CompanyFormularyFieldContainer,
    CompanyFormularyFieldInput,
    CompanyFormularyFieldLabel,
    CompanyFormularyFieldError,
    CompanyFormularySaveButton,
    CompanyFormularySaveButtonText,
    CompanyFormularyLogoContainer,
    CompanyFormularyLogoHelperLabel,
    CompanyFormularyLogo
} from '../../styles/Company'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This component is responsible for editing companies. It's actually really simple right now since
 * we don't have many company related logic and fields.
 * 
 * @param {Function} pickImage - (MOBILE ONLY) - Opens the picker so the user can select a image from his device.
 */
class Company extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
        this.companyLogoRef = React.createRef()
        this.errorMessages = {
            name: strings['pt-br']['companyConfigurationFormularyInvalidNameError']
        }
        this.state = {
            showAllGoodIcon: false,
            isSubmitting: false,
            logoFile: null,
            errors: {}
        }
    }

    setLogoFile = (fileName, file) => this.setState(state => ({...state, logoFile: { name: fileName, file: file }}))
    setShowAllGoodIcon = (data) => this.setState(state => ({...state, showAllGoodIcon: data }))
    setErrors = (data) => {this.setState(state => ({...state, errors: data}))}
    setIsSubmitting = (data) => this.setState(state => ({...state, isSubmitting: data}))


    /**
     * This function is used for validating if the data the user inserted in a field is valid or not.
     * @param {String} name - The name is actually a key that we use to reference on what the field you are validating is.
     * If you insert more fields in the formulary, then we will probably have more keys. exept from 'name', all of the keys are
     * based on the keys from the `userData` object.
     * @param {String} value - The value the user inserted in this field to validate.
     */
    isValid = (name, value) => {
        switch (name) {
            case 'name':
                return ![null, undefined, ''].includes(value)
            default:
                return true
        }
    }

    /**
     * This does two things:
     * - Checks if a field is valid and 
     * - Sets an error key with its message if the value of the field is invalid.
     * @param {String} field - The field is actually a key that we use to reference on what the field you are validating is.
     * If you insert more fields in the formulary, then we will probably have more keys. exept from 'name', all of the keys are
     * based on the keys from the `userData` object.
     * @param {String} value - The value the user inserted in this field to validate.
     */
    onValidate = (field, value) => {
        const isValidValue = this.isValid(field, value)
        if (!isValidValue) {
            this.state.errors[field] = this.errorMessages[field]
        } else {
            delete this.state.errors[field]
        }
        this.setErrors(this.state.errors)
        return isValidValue
    }

    /**
     * Changes the company name and checks if the data being inserted in the state is valid or not. 
     * It's important to notice that this data is in the redux and not inside of this component.
     * So when we change the company name we actually change the redux reducer.
     * 
     * @param {String} name - The new company name as string.
     */
    onChangeCompanyName = (name) => {
        this.onValidate('name', name)
        this.props.company.name = name
        this.props.onChangeCompanyUpdateDataState({...this.props.company})
    }

    /** 
     * Changes the file of the logo so we can send it to the backend.
     * 
     * @param {Array<Blob>} files - Array of files recieved from the input
     */
    onChangeCompanyLogo = async (files) => {
        if (process.env['APP'] === 'web') {
            const reader = new FileReader()
        
            reader.onload = (e) => {
                this.companyLogoRef.current.src = e.target.result
            }
            
            reader.readAsDataURL(files[0])
            
            this.setLogoFile(files[0].name, files[0])
        } else if (files.length > 0 && files[0] !== null) {
            const filename = files[0].split('/').pop();
          
            // Infer the type of the image
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            const file = { uri: files[0], name: filename, type }
            this.setLogoFile(filename, file)
        }
    }

    /**
     * Gets what image to render in the image field for the user. If he has selected a image, needs to show the preview.
     * If he has a image saved, renders the url recieved, otherwise render a default image.
     */
    getImageToRender = () => {
        if (this.state.logoFile) {
            return process.env['APP'] === 'web' ? this.state.logoFile.file : { uri: this.state.logoFile.file.uri }
        } if (!['', null].includes(this.props.company.logo_image_url)) {
            return process.env['APP'] === 'web' ?  this.props.company.logo_image_url : { uri: this.props.company.logo_image_url }
        } else {
            return process.env['APP'] === 'web' ? '/no_company_logo.png' : require('../../../mobile/assets/no_company_logo.png')
        }
    }

    /**
     * This function submits the data to the backend, if everything went fine we show an Icon indicationg everything went fine
     * otherwise we update the errors state object indicating the field that had errors. This is similar on how UsersForm component
     * `onSubmit` method works also.
     */
    onSubmit = () => {
        const data = {
            name: this.props.company.name
        }
        this.setIsSubmitting(true)
        this.props.onUpdateCompanyUpdateData(data, this.state.logoFile).then(response => {
            if (response && response.status === 200) {
                this.setShowAllGoodIcon(true)
                setTimeout(() => {
                    if (this._ismounted) {
                        this.setShowAllGoodIcon(false)
                    }
                }, 1000)
            } else if(response && response.data?.error) {
                const errorKeys = Array.from(Object.keys(response.data.error))
                if (errorKeys.includes('name')) {
                    this.state.errors['name'] = this.errorMessages['name']
                }
                this.setErrors(this.state.errors)
            }
            this.setIsSubmitting(false)
        })
    }

    componentDidMount = () => {
        // When we mount gets only the data needed to update. We don't use the one already retrieved since the data to update
        // can be different of the data we use to update. This way we keep stuff separated.
        this._ismounted = true
        this.source = this.cancelToken.source()
        this.props.onGetCompanyUpdateData(this.source)
    }

    componentWillUnmount = () => {
        this._ismounted = false
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <CompanyFormularyContainer>
                <CompanyFormularyFieldContainer>
                    <CompanyFormularyFieldLabel>
                        {strings['pt-br']['companyConfigurationFormularyLogoFieldLabel']}
                    </CompanyFormularyFieldLabel>
                    <TouchableOpacity onPress={e=> this.props.pickImage().then(file=> this.onChangeCompanyLogo([file]))}>
                        <CompanyFormularyLogo source={this.getImageToRender()}/>
                    </TouchableOpacity>
                </CompanyFormularyFieldContainer>
                <CompanyFormularyFieldContainer>
                    <CompanyFormularyFieldLabel>
                        {strings['pt-br']['companyConfigurationFormularyNameFieldLabel']}
                    </CompanyFormularyFieldLabel>
                    <CompanyFormularyFieldInput 
                    type={'text'} 
                    value={this.props.company.name} 
                    errors={this.state.errors.hasOwnProperty('name')} 
                    onChange={e=> this.onChangeCompanyName(e.nativeEvent.text)}
                    />
                    {this.state.errors.hasOwnProperty('name') ? (
                        <CompanyFormularyFieldError>
                            {this.state.errors.name}
                        </CompanyFormularyFieldError>
                    ) : null}
                </CompanyFormularyFieldContainer>
                <CompanyFormularySaveButton onPress={e=> {
                    this.state.isSubmitting ? null: this.onSubmit()
                }}>
                    {this.state.isSubmitting ? (
                        <ActivityIndicator color="#17242D"/>
                    ) : this.state.showAllGoodIcon ? (
                        <FontAwesomeIcon icon="check"/>
                    ) : (
                        <CompanyFormularySaveButtonText>
                            {strings['pt-br']['companyConfigurationFormularySaveButtonLabel']}
                        </CompanyFormularySaveButtonText>
                    )}
                </CompanyFormularySaveButton>
            </CompanyFormularyContainer>
        )
    }

    renderWeb = () => {
        return (
            <CompanyFormularyContainer>
                <CompanyFormularyFieldContainer>
                    <CompanyFormularyFieldLabel>
                        {strings['pt-br']['companyConfigurationFormularyLogoFieldLabel']}
                    </CompanyFormularyFieldLabel>
                    <CompanyFormularyLogoContainer>
                        {this.state.logoFile || !['', null].includes(this.props.company.logo_image_url) ? '' : (
                            <CompanyFormularyLogoHelperLabel>
                                {strings['pt-br']['companyConfigurationFormularyLogoHelperFieldLabel']}
                            </CompanyFormularyLogoHelperLabel>
                        )}
                        <CompanyFormularyLogo ref={this.companyLogoRef} src={this.getImageToRender()}/>
                        <input type="file" style={{display: 'none'}} onChange={e=>this.onChangeCompanyLogo(e.target.files)}/>
                    </CompanyFormularyLogoContainer>
                </CompanyFormularyFieldContainer>
                <CompanyFormularyFieldContainer>
                    <CompanyFormularyFieldLabel>
                        {strings['pt-br']['companyConfigurationFormularyNameFieldLabel']}
                    </CompanyFormularyFieldLabel>
                    <CompanyFormularyFieldInput 
                    type={'text'} 
                    value={this.props.company.name} 
                    errors={this.state.errors.hasOwnProperty('name')} 
                    onChange={e=> this.onChangeCompanyName(e.target.value)}
                    />
                    {this.state.errors.hasOwnProperty('name') ? (
                        <CompanyFormularyFieldError>
                            {this.state.errors.name}
                        </CompanyFormularyFieldError>
                    ) : ''}
                </CompanyFormularyFieldContainer>
                <CompanyFormularySaveButton onClick={e=> this.state.isSubmitting ? null: this.onSubmit()}>
                    {this.state.isSubmitting ? (
                        <Spinner animation="border" size="sm"/>
                    ) : this.state.showAllGoodIcon ? (
                        <FontAwesomeIcon icon="check"/>
                    ) : (
                        <CompanyFormularySaveButtonText>
                            {strings['pt-br']['companyConfigurationFormularySaveButtonLabel']}
                        </CompanyFormularySaveButtonText>
                    )}
                </CompanyFormularySaveButton>
            </CompanyFormularyContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ company: state.company.update }), actions)(Company)