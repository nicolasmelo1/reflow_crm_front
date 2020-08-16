import styled from 'styled-components'
import { SafeAreaView } from 'react-native'


const Body = (process.env['APP'] === 'web') ? styled.div`
    height: 100%;
    font-family: Roboto !important;
` : styled(SafeAreaView)`
    height: 100%;
    font-family: Roboto-Regular;
    top: 0;
    flex-direction: column;
`

export default Body