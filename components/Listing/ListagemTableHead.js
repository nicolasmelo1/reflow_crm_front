import React from 'react'

import TblPopover from './TblPopover'

const ListagemTableHead = (props) => {
    const headers = (props.headers && props.headers.field_headers) ? props.headers.field_headers: []

    return (
        <thead>
            <tr>
                {headers.map(function (data, index) {
                    if (data.user_selected) {
                        return (
                            <TblPopover element={data.label_name} key={index}/>
                        )
                    }
                })}
                <TblPopover element="Editar" />
                <TblPopover element="Deletar" />
            </tr>

        </thead>
    )
}

export default ListagemTableHead;