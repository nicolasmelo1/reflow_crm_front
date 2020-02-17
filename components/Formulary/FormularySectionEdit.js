import React from 'react'


const FormularySectionEdit = (props) => {
    console.log(props.sections)
    return (
        <div>
            {props.sections.map((section, index)=> (
                <div key={index} style={{ height: '80px', width: '80px', backgroundColor: 'red'}}/>
            ))}
        </div>
    )
}

export default FormularySectionEdit