import FieldTextInput from './FieldTextInput'
import FieldAttachmentImage from './FieldAttachmentImage'
import FieldAttachmentInput from './FieldAttachmentInput'
import FieldAttachmentContainer from './FieldAttachmentContainer'

export default {
    Text: FieldTextInput,
    Attachment: {
        Image: FieldAttachmentImage,
        Input: FieldAttachmentInput,
        Container: FieldAttachmentContainer
    }
}