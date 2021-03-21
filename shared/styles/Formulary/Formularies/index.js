import FormularyContainer from './FormularyContainer'
import FormularyButton from './FormularyButton'
import FormularyContentContainer from './FormularyContentContainer'
import FormularySectionTitle from './FormularySectionTitle'
import FormularyMultiFormAddNewButton from './FormularyMultiFormAddNewButton'
import FormularyFieldContainer from './FormularyFieldContainer'
import FormularyFieldsContainer from './FormularyFieldsContainer'
import FormularySectionContainer from './FormularySectionContainer'
import FormularyRemoveMultiFormButton from './FormularyRemoveMultiFormButton'
import FormularyNavigatorButton from './FormularyNavigatorButton'
import FormularySaveButton from './FormularySaveButton'
import FormularyEditButton from './FormularyEditButton'
import FormularyToolbarContainer from './FormularyToolbarContainer'
import FormularyToolbarButton from './FormularyToolbarButton'
import FormularyToolbarSeparator from './FormularyToolbarSeparator'
import FormularyPublicEditLinkContainer from './FormularyPublicEditLinkContainer'
import FormularyPublicEditFormTitle from './FormularyPublicEditFormTitle'
import FormularyPublicEditFieldSelectorContainer from './FormularyPublicEditFieldSelectorContainer'
import FormularyPublicEditFieldSelectorButton from './FormularyPublicEditFieldSelectorButton'
import FormularyPublicEditFieldSelectorLabel from './FormularyPublicEditFieldSelectorLabel'
import FormularyPublicEditFieldSelectorIcon from './FormularyPublicEditFieldSelectorIcon'
import FormularyPublicEditLinkAnchorContainer from './FormularyPublicEditLinkAnchorContainer'
import FormularyPublicEditLinkCopyButton from './FormularyPublicEditLinkCopyButton'
import FormularyPublicEditLinkAnchor from './FormularyPublicEditLinkAnchor'
import FormularyPublicEditInput from './FormularyPublicEditInput'
import FormularyPublicEditContainer from './FormularyPublicEditContainer'
import FormularyPublicSubmitAnotherResponseButton from './FormularyPublicSubmitAnotherResponseButton'
import FormularyPublicTitle from './FormularyPublicTitle'
import FormularyPublicDescription from './FormularyPublicDescription'
import FormularyPublicGreetingsContainer from './FormularyPublicGreetingsContainer'
import FormularyPublicContainer from './FormularyPublicContainer'

export default {
    Public: {
        Container: FormularyPublicContainer,
        GreetingsContainer: FormularyPublicGreetingsContainer,
        Description: FormularyPublicDescription,
        Title: FormularyPublicTitle,
        SubmitAnotherResponseButton: FormularyPublicSubmitAnotherResponseButton,
    },
    PublicEdit: {
        FieldSelector: {
            Container: FormularyPublicEditFieldSelectorContainer,
            Icon: FormularyPublicEditFieldSelectorIcon,
            Button: FormularyPublicEditFieldSelectorButton,
            Label: FormularyPublicEditFieldSelectorLabel
        },
        Container: FormularyPublicEditContainer,
        Input: FormularyPublicEditInput,
        LinkCopyButton: FormularyPublicEditLinkCopyButton,
        LinkAnchor: FormularyPublicEditLinkAnchor,
        LinkAnchorContainer: FormularyPublicEditLinkAnchorContainer,
        LinkContainer: FormularyPublicEditLinkContainer,
        FormTitle: FormularyPublicEditFormTitle
    },
    Container: FormularyContainer,
    Button: FormularyButton,
    Navigator: FormularyNavigatorButton,
    ContentContainer: FormularyContentContainer,
    TitleLabel: FormularySectionTitle,
    Toolbar: {
        Button: FormularyToolbarButton,
        Separator: FormularyToolbarSeparator,
        Container: FormularyToolbarContainer
    },
    MultiForm: {
        AddButton: FormularyMultiFormAddNewButton,
        RemoveButton: FormularyRemoveMultiFormButton,
    },
    EditButton: FormularyEditButton,
    SaveButton: FormularySaveButton,
    FieldContainer: FormularyFieldContainer,
    FieldsContainer: FormularyFieldsContainer,
    SectionContainer: FormularySectionContainer
}