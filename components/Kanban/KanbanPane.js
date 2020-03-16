import React from 'react'




const KanbanPane = (props) => {
    const allColumns = props.headers.data

    let columns = allColumns.map((content, index) => {
        return <KanbanCard body={content} key={index} />
    })

    return (
        <KanbanColumns bordered hover size="sm" />

    )
}

export default KanbanPane;