import Text from './Text'
import Number from './Number'
import Date from './Date'
import Email from './Email'
import Option from './Option'
import MultiOption from './MultiOption'
import Attachment from './Attachment'
import Id from './Id'
import LongText from './LongText'

const Field = (props) => {
    const getFieldType = () => {
        switch (props.field.field_type) {
            case "id":
                return Id
            case "text":
                return Text
            case "number":
                return Number
            case "date":
                return Date
            case "email": 
                return Email
            case "option":
                return Option
            case "multi_option":
                return MultiOption
            case "attachment":
                return Attachment
            case "long_text":
                return LongText
        }
    }

    // Fields that accept a single value usually have the same logic,
    // so we use this function to don't repeat code in components
    const singleValueFieldsHelper = (field_name, value) => {
        if (props.getFieldFormValues(props.field.name).length === 0) {
            props.addFieldFormValue(field_name, value)
        } else if (value === '') {
            props.removeFieldFormValue(field_name, props.getFieldFormValues(props.field.name)[0].value)
        } else {
            props.updateFieldFormValue(field_name, props.getFieldFormValues(props.field.name)[0].value, value)
        }
        return props.getFieldFormValues(props.field.name)
    }

    const renderFieldType = () => {
        const Component = getFieldType()
        if (Component) {
            return (<Component singleValueFieldsHelper={singleValueFieldsHelper} {...props}/>)
        } else {
            return ''
        }
    }

    return (
        <div>
            {renderFieldType()}
        </div>
    )
}

export default Field