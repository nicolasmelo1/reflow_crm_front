import FieldTextInput from './FieldTextInput'
import FieldAttachmentImage from './FieldAttachmentImage'
import FieldAttachmentInput from './FieldAttachmentInput'
import FieldAttachmentContainer from './FieldAttachmentContainer'
import FieldAttachmentText from './FieldAttachmentText'
import FieldAttachmentLabel from './FieldAttachmentLabel'
import FieldAttachmentButton from './FieldAttachmentButton'
import FieldLabel from './FieldLabel'
import FieldRequiredLabel from './FieldRequiredLabel'
import FieldContainer from './FieldContainer'
import FieldErrorLabel from './FieldErrorLabel'
import FieldFormLabelButton from './FieldFormLabelButton'
import FieldSelect from './FieldSelect'
import FieldLongText from './FieldLongText'

export default {
    FieldTitle: {
        Label: FieldLabel,
        FormButton: FieldFormLabelButton,   
        Required: FieldRequiredLabel
    },
    Container: FieldContainer,
    Text: FieldTextInput,
    Select: FieldSelect,
    LongText: FieldLongText,
    Attachment: {
        Button: FieldAttachmentButton,
        Image: FieldAttachmentImage,
        Input: FieldAttachmentInput,
        Label: FieldAttachmentLabel,
        Text: FieldAttachmentText,
        Container: FieldAttachmentContainer
    },
    Errors: FieldErrorLabel
}