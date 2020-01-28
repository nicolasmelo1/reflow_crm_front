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

    const renderFieldType = () => {
        const Component = getFieldType()
        if (Component) {
            return (<Component data={props.field}/>)
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