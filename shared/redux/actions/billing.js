import agent from '../../utils/agent'

const onGetAddressOptions = (source) => {
    return (_) => {
        return agent.http.BILLING.getAddressOptions(source)
    }
}

export default {
    onGetAddressOptions
}