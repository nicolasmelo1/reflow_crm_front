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
import FormularyEditInputField from './FormularyEditInputField'
import FormularySectionEditFieldFormLabel from './FormularySectionEditFieldFormLabel'
import FormularySectionEditFieldFormCheckboxLabel from './FormularySectionEditFieldFormCheckboxLabel'
import FormularySectionEditFieldFormFieldContainer from './FormularySectionEditFieldFormFieldContainer'
import FormularySectionEditFieldAddNewButton from './FormularySectionEditFieldAddNewButton'
import FormularySectionEditAddNewButton from './FormularySectionEditAddNewButton'

export default {
    AddNewSectionButton: FormularySectionEditAddNewButton,
    AddNewFieldButton: FormularySectionEditFieldAddNewButton,
    InputField: FormularyEditInputField,
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
    FieldFormFieldContainer: FormularySectionEditFieldFormFieldContainer,
    FieldFormCheckboxLabel: FormularySectionEditFieldFormCheckboxLabel,
    FieldFormLabel: FormularySectionEditFieldFormLabel,
    FieldContainer: FormularySectionEditFieldsContainer,
}