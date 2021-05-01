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
import FormularySectionEditSectionDisabledLabelTitle from './FormularySectionEditSectionDisabledLabelTitle'
import FormularySectionEditSettingsFormTypeLabel from './FormularySectionEditSettingsFormTypeLabel'
import FormularySectionEditSettingsIsConditionalButtonContainer from './FormularySectionEditSettingsIsConditionalButtonContainer'
import FormularySectionEditSettingsCheckboxButton from './FormularySectionEditSettingsCheckboxButton'
import FormularySectionEditSettingsIsConditionalButton from './FormularySectionEditSettingsIsConditionalButton'
import FormularySectionEditSettingIsConditionalFormularyContainer from './FormularySectionEditSettingIsConditionalFormularyContainer'
import FormularyEditSelectorContainer from './FormularyEditSelectorContainer'
import FormularySectionEditConditionalFormLabel from './FormularySectionEditConditionalFormLabel'
import FormularyEditInputField from './FormularyEditInputField'
import FormularySectionEditSectionSeparator from './FormularySectionEditSectionSeparator'
import FormularySectionEditSectionLoaderContainer from './FormularySectionEditSectionLoaderContainer'
import FormularySectionEditFieldFormLabel from './FormularySectionEditFieldFormLabel'
import FormularySectionEditFieldFormFieldContainer from './FormularySectionEditFieldFormFieldContainer'
import FormularySectionEditFieldAddNewButton from './FormularySectionEditFieldAddNewButton'
import FormularySectionEditAddNewButton from './FormularySectionEditAddNewButton'
import FormularyEditInputCheckboxBox from './FormularyEditInputCheckboxBox'
import FormularyEditInputCheckboxDivider from './FormularyEditInputCheckboxDivider'
import FormularySectionEditFieldContainer from './FormularySectionEditFieldContainer'
import FormularySectionEditFieldFormularyContainer from './FormularySectionEditFieldFormularyContainer'
import FormularySectionEditFieldFormFieldNumberExplanationContainer from './FormularySectionEditFieldFormFieldNumberExplanationContainer'
import FormularySectionEditFieldFormFieldNumberExplanationDescription from './FormularySectionEditFieldFormFieldNumberExplanationDescription'
import FormularySectionEditFieldFormFieldNumberExplanationLabel from './FormularySectionEditFieldFormFieldNumberExplanationLabel'
import FormularySectionEditFieldAddDefaultValueButton from './FormularySectionEditFieldAddDefaultValueButton'
import FormularySectionEditFieldFieldOptionIconContainer from './FormularySectionEditFieldFieldOptionIconContainer'
import FormularySectionEditFieldFieldOptionTypeButton from './FormularySectionEditFieldFieldOptionTypeButton'
import FormularySectionEditFieldFieldTypeButton from './FormularySectionEditFieldFieldTypeButton'

export default {
    AddNewSectionButton: FormularySectionEditAddNewButton,
    AddNewFieldButton: FormularySectionEditFieldAddNewButton,
    InputField: FormularyEditInputField,
    SelectorContainer: FormularyEditSelectorContainer,
    Section: {
        TitleAndIconsContainer: FormularySectionEditTitleAndIconsContainer,
        Container: FormularySectionEditSectionContainer,
        LabelInput: FormularySectionEditNameInput,
        DisabledLabel: FormularySectionEditSectionDisabledLabelTitle,
        SectionSeparator: FormularySectionEditSectionSeparator,
        LoaderContainer: FormularySectionEditSectionLoaderContainer,
        Formulary: {
            Container: FormularySectionEditSettingsContainer,
            FormTypeLabel: FormularySectionEditSettingsFormTypeLabel,
            CheckboxButton: FormularySectionEditSettingsCheckboxButton,
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
    FieldTypeButton: FormularySectionEditFieldFieldTypeButton,
    FieldTypeOptionButton: FormularySectionEditFieldFieldOptionTypeButton,
    FieldTypeOptionIconContainer: FormularySectionEditFieldFieldOptionIconContainer,
    FieldFormAddDefaultValueButton: FormularySectionEditFieldAddDefaultValueButton,
    FieldFormularyContainer: FormularySectionEditFieldFormularyContainer,
    FieldFormFieldContainer: FormularySectionEditFieldFormFieldContainer,
    FieldFormCheckbox: FormularyEditInputCheckboxBox,
    FieldFormCheckboxDivider: FormularyEditInputCheckboxDivider,
    FieldFormLabel: FormularySectionEditFieldFormLabel,
    FieldsContainer: FormularySectionEditFieldsContainer,
    FieldContainer: FormularySectionEditFieldContainer,
    FormulaExplanationContainer: FormularySectionEditFieldFormFieldNumberExplanationContainer,
    FormulaExplanationDescription: FormularySectionEditFieldFormFieldNumberExplanationDescription,
    FormulaExplanationLabel: FormularySectionEditFieldFormFieldNumberExplanationLabel
}