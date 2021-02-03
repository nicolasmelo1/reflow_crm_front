import React from 'react'
import { View } from 'react-native'
import { withAuthenticationContext } from '../contexts'
import { Layout, Company } from '@shared/components'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class CompanyPage extends React.Component {
    constructor(props) {
        super(props)
    }

    /**
     * Ask permission to access the camera roll
     * You can see it here: https://docs.expo.io/versions/latest/sdk/imagepicker/
     */
    getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!')
            }
        }
    }
    
    pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            if (!result.cancelled) {
                return result.uri
            }
            return null
        } catch (E) {
            return null
        }
    }

    componentDidMount = () => {
        this.getPermissionAsync()
    }

    render = () => {
        return (
            <Layout setIsAuthenticated={this.props.authenticationContext.setIsAuthenticated}>
                <Company pickImage={this.pickImage}/>
            </Layout>
        )
    }
}

export default withAuthenticationContext(CompanyPage)