import FieldTextInput from './FieldTextInput'
import FieldAttachmentImage from './FieldAttachmentImage'
import FieldAttachmentPreviewContainer from './FieldAttachmentPreviewContainer'
import FieldAttachmentPreviewImageContainer from './FieldAttachmentPreviewImageContainer'
import FieldAttachmentPreviewTopButtonsContainer from './FieldAttachmentPreviewTopButtonsContainer'
import FieldAttachmentPreviewCloseButton from './FieldAttachmentPreviewCloseButton'
import FieldAttachmentAddNewFileButtonContainer from './FieldAttachmentAddNewFileButtonContainer'
import FieldAttachmentInput from './FieldAttachmentInput'
import FieldAttachmentLoadingContainer from './FieldAttachmentLoadingContainer'
import FieldAttachmentContainer from './FieldAttachmentContainer'
import FieldAttachmentsContainer from './FieldAttachmentsContainer'
import FieldAttachmentScrollContainer from './FieldAttachmentScrollContainer'
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
import FieldIdDescription from './FieldIdDescription'
import FieldIdValue from './FieldIdValue'

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
    Id: {
        Description: FieldIdDescription,
        Value: FieldIdValue
    },
    Attachment: {
        PreviewImageContainer: FieldAttachmentPreviewImageContainer,
        PreviewCloseButton: FieldAttachmentPreviewCloseButton,
        PreviewTopButtonsContainer: FieldAttachmentPreviewTopButtonsContainer,
        PreviewContainer: FieldAttachmentPreviewContainer,
        AddNewFileButtonContainer: FieldAttachmentAddNewFileButtonContainer,
        Container: FieldAttachmentsContainer,
        LoadingContainer: FieldAttachmentLoadingContainer,
        ScrollContainer: FieldAttachmentScrollContainer,
        Button: FieldAttachmentButton,
        Image: FieldAttachmentImage,
        Input: FieldAttachmentInput,
        Label: FieldAttachmentLabel,
        Text: FieldAttachmentText,
        ItemContainer: FieldAttachmentContainer
    },
    Errors: FieldErrorLabel
}