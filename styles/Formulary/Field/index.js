import FieldTextInput from './FieldTextInput'
import FieldAttachmentImage from './FieldAttachmentImage'
import FieldAttachmentInput from './FieldAttachmentInput'
import FieldAttachmentContainer from './FieldAttachmentContainer'
import FieldAttachmentText from './FieldAttachmentText'
import FieldAttachmentLabel from './FieldAttachmentLabel'
import FieldLabel from './FieldLabel'
import FieldRequiredLabel from './FieldRequiredLabel'
import FieldContainer from './FieldContainer'

export default {
    FieldTitle: {
        Label: FieldLabel,
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
    }
}