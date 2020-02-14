import FieldTextInput from './FieldTextInput'
import FieldAttachmentImage from './FieldAttachmentImage'
import FieldAttachmentInput from './FieldAttachmentInput'
import FieldAttachmentContainer from './FieldAttachmentContainer'
import FieldAttachmentText from './FieldAttachmentText'
import FieldAttachmentLabel from './FieldAttachmentLabel'
import FieldLabel from './FieldLabel'
import FieldRequiredLabel from './FieldRequiredLabel'
import FieldContainer from './FieldContainer'
import FieldErrorLabel from './FieldErrorLabel'
import FieldFormLabelButton from './FieldFormLabelButton'

export default {
    FieldTitle: {
        Label: FieldLabel,
        FormButton: FieldFormLabelButton,   
        Required: FieldRequiredLabel
    },
    Container: FieldContainer,
    Text: FieldTextInput,
    Attachment: {
        Image: FieldAttachmentImage,
        Input: FieldAttachmentInput,
        Label: FieldAttachmentLabel,
        Text: FieldAttachmentText,
        Container: FieldAttachmentContainer
    },
    Errors: FieldErrorLabel
}