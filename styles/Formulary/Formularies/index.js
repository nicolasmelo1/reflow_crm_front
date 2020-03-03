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

export default {
    Container: FormularyContainer,
    Button: FormularyButton,
    Navigator: FormularyNavigatorButton,
    ContentContainer: FormularyContentContainer,
    TitleLabel: FormularySectionTitle,
    MultiForm: {
        AddButton: FormularyMultiFormAddNewButton,
        RemoveButton: FormularyRemoveMultiFormButton,
    },
    FieldContainer: FormularyFieldContainer,
    FieldsContainer: FormularyFieldsContainer,
    SectionContainer: FormularySectionContainer
}