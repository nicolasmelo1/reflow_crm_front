import {connect as reduxConnect } from 'react-redux'

// Explanation: https://stackoverflow.com/questions/66646440/how-to-use-react-redux-connect-in-a-monorepo
// I don't know why this happens either
export default function connect(...args){
    return reduxConnect(...args)
}