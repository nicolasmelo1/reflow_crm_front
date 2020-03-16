import react from 'react'
import GestaoListing from 'components/Listing'
import GestaoKanban from './Kanban/GestaoKanban'


const DataContainer = (props) => {

    if (props.visualization == 'listing') {
        return (<GestaoListing />)
    } else {
        return (<GestaoKanban />)
    }

}
export default DataContainer;