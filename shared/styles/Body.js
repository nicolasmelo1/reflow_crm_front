import styled from 'styled-components'
import { View } from 'react-native'


const Body = (process.env['APP'] === 'web') ? styled.div`
    height: 100%
` : styled(View)`
    color: blue;
    background-color: pink;
    height: 100%;
    top: 80px;
    flex-direction: row;
`

export default Body