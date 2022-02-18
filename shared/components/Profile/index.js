import React, { createRef } from 'react'
import axios from 'axios'
import { View } from 'react-native'
import { strings } from '../../utils/constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import dynamicImport from '../../utils/dynamicImport'
import agent from '../../utils/agent'
import actions from '../../redux/actions'
import Styled from './styles'

const connect = dynamicImport('reduxConnect', 'default')
const Spinner = dynamicImport('react-bootstrap', 'Spinner')

/**
 * This will render the profile page for the user to edit himself. At the current time the user can
 * only edit his photo. In the long run we want to keep more control in the hands of the user than
 * in the hands of the admin.
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.source = null
        this.profileImageRef = React.createRef()
        this.state = {
            isSubmitting: false,
            showAllGoodIcon: false,
            profileImageFile: null,
            data: {
                id: null,
                profile_image_url: ''
            }
        }
    }

    setShowAllGoodIcon = (showAllGoodIcon) => this.setState(state => ({...state, showAllGoodIcon}))
    setIsSubmitting = (isSubmitting) => this.setState(state => ({...state, isSubmitting}))
    setProfileImageFile = (fileName, file) => this.setState(state => ({...state, profileImageFile: { name: fileName, file: file }}))
    setData = (id, profileImageUrl) => this.setState(state => ({...state, data: {id, profile_image_url: profileImageUrl}}))

    wasImageDefined = () => this.state.profileImageFile !== null || !['', null, undefined].includes(this.state.data.profile_image_url)

    /**
     * Gets what image to render in the image field for the user. If he has selected a image, needs to show the preview.
     * If he has a image saved, renders the url recieved, otherwise render a default image.
     * 
     * @returns {string} - The url for the image to render.
     */
    getImageToRender = () => {
        const isProfileImageSelectedFromComputer = this.state.profileImageFile !== null
        const isProfileImageRetrievedFromServer = !['', null, undefined].includes(this.state.data.profile_image_url)

        if (isProfileImageSelectedFromComputer) {
            return process.env['APP'] === 'web' ? this.state.profileImageFile.file : { uri: this.state.profileImageFile.file.uri }
        } if (isProfileImageRetrievedFromServer) {
            return process.env['APP'] === 'web' ?  this.state.data.profile_image_url : { uri: this.state.data.profile_image_url }
        } else {
            return process.env['APP'] === 'web' ? '/no_company_logo.png' : require('../../../mobile/assets/no_company_logo.png')
        }
    }

     // ------------------------------------------------------------------------------------------
    /** 
     * Changes the file of the logo so we can send it to the backend.
     * 
     * @param {Array<Blob>} files - Array of files recieved from the input
     */
    onChangeProfileLogo = async (files) => {
        const wasFilesSelected = files.length > 0 && files[0] !== null

        if (process.env['APP'] === 'web' && wasFilesSelected) {
            const reader = new FileReader()
            const file = files[0]
            reader.onload = (e) => {
                this.profileImageRef.current.src = e.target.result
            }
            
            reader.readAsDataURL(file)
            
            this.setProfileImageFile(files[0].name, files[0])
        } else if (wasFilesSelected) {
            const filename = files[0].split('/').pop()
          
            // Infer the type of the image
            const match = /\.(\w+)$/.exec(filename)
            const type = match ? `image/${match[1]}` : `image`
            const file = { uri: files[0], name: filename, type }
            
            this.setProfileImageFile(filename, file)
        }
    }

    onSubmit = () => {
        const data = {
            id: this.props.login.user.id,
            profile_image_url: this.state.data.profile_image_url
        }
        this.setIsSubmitting(true)
        agent.http.PROFILE.updateProfile(data, this.state.profileImageFile).then(response => {
            if (response && response.status === 200) {
                this.setShowAllGoodIcon(true)
                setTimeout(() => {
                    if (this._ismounted) {
                        this.setShowAllGoodIcon(false)
                    }
                }, 1000)
            }
            this.setIsSubmitting(false)
        })
    }

    componentDidMount() {
        this.source = axios.CancelToken.source()
        agent.http.PROFILE.getProfile(this.source).then(response => {
            if (response && response.status === 200) {
                this.setData(response.data.data.id, response.data.data.profile_image_url)
            }
        })
    }

    componentWillUnmount() {
        if (this.source) this.source.cancel()
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <Styled.FormularyContainer>
                <Styled.FormularyFieldContainer>
                    <Styled.FormularyFieldLabel>
                        {strings['pt-br']['profileConfigurationFormularyProfilePictureFieldLabel']}
                    </Styled.FormularyFieldLabel>
                    <Styled.FormularyLogoContainer>
                        {this.wasImageDefined() === false ? (
                            <Styled.FormularyLogoHelperLabel>
                                {strings['pt-br']['profileConfigurationFormularyProfilePictureHelperFieldLabel']}
                            </Styled.FormularyLogoHelperLabel>
                        ) : ''}
                        <Styled.FormularyLogo 
                        ref={this.profileImageRef} 
                        src={this.getImageToRender()}
                        />
                        <input 
                        type="file" 
                        style={{display: 'none'}} 
                        onChange={e=> this.onChangeProfileLogo(e.target.files)}
                        />
                    </Styled.FormularyLogoContainer>
                </Styled.FormularyFieldContainer>
                <Styled.FormularySaveButton 
                onClick={e=> this.state.isSubmitting ? null: this.onSubmit()}
                >
                    {this.state.isSubmitting ? (
                        <Spinner 
                        animation="border" 
                        size="sm"
                        />
                    ) : this.state.showAllGoodIcon ? (
                        <FontAwesomeIcon 
                        icon="check"
                        />
                    ) : (
                        <Styled.FormularySaveButtonText>
                            {strings['pt-br']['profileConfigurationFormularySaveButtonLabel']}
                        </Styled.FormularySaveButtonText>
                    )}
                </Styled.FormularySaveButton>
            </Styled.FormularyContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login }), actions)(Profile)