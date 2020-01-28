import FieldTextInput from './FieldTextInput'
import FieldAttachmentImage from './FieldAttachmentImage'
import FieldAttachmentInput from './FieldAttachmentInput'
import FieldAttachmentContainer from './FieldAttachmentContainer'
import FieldAttachmentText from './FieldAttachmentText'
import FieldAttachmentLabel from './FieldAttachmentLabel'

export default {
    Text: FieldTextInput,
    Attachment: {
        Image: FieldAttachmentImage,
        Input: FieldAttachmentInput,
        Label: FieldAttachmentLabel,
        Text: FieldAttachmentText,
        Container: FieldAttachmentContainer
    }
}