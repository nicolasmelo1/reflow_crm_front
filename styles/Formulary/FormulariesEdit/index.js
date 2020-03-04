import FormularySectionEditTitleAndIconsContainer from './FormularySectionEditTitleAndIconsContainer'
import FormularySectionEditNameInput from './FormularySectionEditNameInput'
import FormularySectionEditButton from './FormularySectionEditButton'
import FormularySectionEditIcon from './FormularySectionEditIcon'
import FormularySectionEditSettingsContainer from './FormularySectionEditSettingsContainer'
import FormularySectionEditFieldsContainer from './FormularySectionEditFieldsContainer'
import FormularySectionEditIconsButtonsContainer from  './FormularySectionEditIconsButtonsContainer'
import FormularySectionFieldsEditFieldIcon from './FormularySectionFieldsEditFieldIcon'
import FormularySectionEditSectionTypeButton from './FormularySectionEditSectionTypeButton'
import FormularySectionEditToggleConditionalInput from './FormularySectionEditToggleConditionalInput'
import FormularySectionEditSectionContainer from './FormularySectionEditSectionContainer'
import FormularySectionEditSettingsFormTypeLabel from './FormularySectionEditSettingsFormTypeLabel'
import FormularySectionEditSettingsIsConditionalButtonContainer from './FormularySectionEditSettingsIsConditionalButtonContainer'
import FormularySectionEditSettingsIsConditionalButton from './FormularySectionEditSettingsIsConditionalButton'
import FormularySectionEditSettingIsConditionalFormularyContainer from './FormularySectionEditSettingIsConditionalFormularyContainer'
import FormularyEditSelectorContainer from './FormularyEditSelectorContainer'
import FormularySectionEditConditionalFormLabel from './FormularySectionEditConditionalFormLabel'
export default {
    SelectorContainer: FormularyEditSelectorContainer,
    Section: {
        TitleAndIconsContainer: FormularySectionEditTitleAndIconsContainer,
        Container: FormularySectionEditSectionContainer,
        LabelInput: FormularySectionEditNameInput,
        Formulary: {
            Container: FormularySectionEditSettingsContainer,
            FormTypeLabel: FormularySectionEditSettingsFormTypeLabel,
            ConditionalButtonContainer: FormularySectionEditSettingsIsConditionalButtonContainer,
            ConditionalButton: FormularySectionEditSettingsIsConditionalButton,
            ConditionalFormularyContainer: FormularySectionEditSettingIsConditionalFormularyContainer,
            ConditionalFormLabel: FormularySectionEditConditionalFormLabel,
        },
        TypeButton: FormularySectionEditSectionTypeButton,
    },
    Button: FormularySectionEditButton,
    ButtonsContainer: FormularySectionEditIconsButtonsContainer,
    Icon: {
        FieldIcon: FormularySectionFieldsEditFieldIcon,
        SectionIcon: FormularySectionEditIcon
    },
    ToggleConditional: {
        Input: FormularySectionEditToggleConditionalInput
    },

    FieldContainer: FormularySectionEditFieldsContainer,
}