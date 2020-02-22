import FormularySectionEditContainer from './FormularySectionEditContainer'
import FormularySectionEditNameInput from './FormularySectionEditNameInput'
import FormularySectionEditButton from './FormularySectionEditButton'
import FormularySectionEditIcon from './FormularySectionEditIcon'
import FormularySectionEditSettingsContainer from './FormularySectionEditSettingsContainer'
import FormularySectionEditFieldsContainer from './FormularySectionEditFieldsContainer'
import FormularySectionEditIconsButtonsContainer from  './FormularySectionEditIconsButtonsContainer'
import FormularySectionFieldsEditFieldIcon from './FormularySectionFieldsEditFieldIcon'
import FormularySectionEditSectionTypeButton from './FormularySectionEditSectionTypeButton'
import FormularySectionEditToggleConditionalInput from './FormularySectionEditToggleConditionalInput'


export default {
    SectionContainer: FormularySectionEditContainer,
    SectionLabelInput: FormularySectionEditNameInput,
    Button: FormularySectionEditButton,
    ButtonsContainer: FormularySectionEditIconsButtonsContainer,
    Icon: {
        FieldIcon: FormularySectionFieldsEditFieldIcon,
        SectionIcon: FormularySectionEditIcon
    },
    ToggleConditional: {
        Input: FormularySectionEditToggleConditionalInput
    },
    SectionEditionFormularyContainer: FormularySectionEditSettingsContainer,
    SectionTypeButton: FormularySectionEditSectionTypeButton,
    FieldContainer: FormularySectionEditFieldsContainer,
}