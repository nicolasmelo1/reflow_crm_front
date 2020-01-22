import Text from './Text'
import Number from './Number'
import Date from './Date'
import Email from './Email'
import Select from './Select'

const Field = (props) => {
    const getFieldType = () => {
        switch (props.field.field_type) {
            case "text":
                return (<Text data={props.field}/>)
            case "number":
                return (<Number data={props.field}/>)
            case "date":
                return (<Date data={props.field}/>)
            case "email": 
                return (<Email data={props.field}/>)
            case "option":
                return (<Select data={props.field}/>)
        }
    }
    return (
        <div>
            {getFieldType()}
        </div>
    )
}

export default Field