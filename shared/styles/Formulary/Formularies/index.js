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

export default {
    PublicEdit: {
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