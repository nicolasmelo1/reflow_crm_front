import React, { useState, useEffect } from 'react'
import { FormularySectionEditContainer, FormularySectionEditNameInput, FormularySectionEditIcon, FormularySectionEditIconContainer } from 'styles/Formulary'
const FormularySectionEdit = (props) => {
    const [openedSections, setOpenedSections] = useState([])


    const onChangeSectionName = (value) => {

    }

    const onDisableSection = (e, section, index) => {
        e.preventDefault()
        e.stopPropagation()

    }

    const onRemoveSection = (e, section, index) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onMoveSection = (e, section, index) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const onDragEnd = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    useEffect(() => {
        if (props.sections.length !== openedSections.length) {
            setOpenedSections(props.sections.map(_=> false))
        }
    }, [props.sections])

    return (
        <div>
            {props.sections.map((section, index)=> (
                <div key={index}>
                    <FormularySectionEditContainer>
                        <FormularySectionEditIconContainer>
                            <FormularySectionEditIcon size="sm" type="form" icon="eye" onClick={e=>{onDisableSection(e, section, index)}}/>
                            <FormularySectionEditIcon size="sm" type="form" icon="trash" onClick={e=>{onRemoveSection(e, section, index)}}/>
                            <div draggable="true" onDrag={e=>{onDrag(e)}} onDragStart={e=>{onMoveSection(e, section, index)}} onDragEnd={e=>{onDragEnd(e)}}  >
                                <FormularySectionEditIcon size="sm" type="form" icon="arrows-alt" />
                            </div>
                        </FormularySectionEditIconContainer>
                        <FormularySectionEditNameInput value={section.label_name} onChange={e=> {onChangeSectionName(e.target.value)}} />
                    </FormularySectionEditContainer>
                    <div></div>
                    <div></div>
                </div>
            ))}
        </div>
    )
}

export default FormularySectionEdit