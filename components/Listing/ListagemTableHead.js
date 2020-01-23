import React from 'react'

import TblPopover from './TblPopover'

const ListagemTableHead = (props) => {
    console.log(props)
    return (
        <thead>
            <tr>
                {props.things.map((data, index) => (
                    <TblPopover element={data} key={index} />
                ))}
            </tr>
        </thead>
    )

}

export default ListagemTableHead;