import react from 'react'
import GestaoListing from 'components/Listing'


const DataContainer = (props) => {

    if (props.visualization == 'kanban') {
        return (<GestaoListing />)
    } else {
        return (<GestaoListing />)
    }

}
export default DataContainer;