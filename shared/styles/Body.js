import styled from 'styled-components'
import { SafeAreaView } from 'react-native'


const Body = (process.env['APP'] === 'web') ? styled.div`
    height: 100%;
    font-family: Montserrat !important;
    font-weight: 500;
    font-size: 15px;
` : styled(SafeAreaView)`
    height: 100%;
    font-family: Montserrat-Regular;
    top: 0;
    flex-direction: column;
`

export default Body