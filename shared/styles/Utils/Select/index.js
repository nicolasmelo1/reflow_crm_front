import Select from './Select'
import SelectOptionsContainer from './SelectOptionsContainer'
import SelectOptionsHolder from './SelectOptionsHolder'
import SelectInput from './SelectInput'
import SelectSelectedOptionContentContainer from './SelectSelectedOptionContentContainer'
import SelectSelectedOptionsContainer from './SelectSelectedOptionsContainer'
import SelectSelectedOption from './SelectSelectedOption'
import SelectOptionsListContainer from './SelectOptionsListContainer'
import SelectOptionItem from './SelectOptionItem'
import SelectGoBackArrow from './SelectGoBackArrow'
import SelectExcludeButton from './SelectExcludeButton'
import SelectExcludeButtonContainer from './SelectExcludeButtonContainer'

export default {
    Select: Select,
    GoBackArrow: SelectGoBackArrow,
    OptionsHolder: SelectOptionsHolder,
    OptionsContainer: SelectOptionsContainer,
    OptionItem: SelectOptionItem,
    SelectedOptionsContentContainer: SelectSelectedOptionContentContainer,
    SelectedOptionsContainer: SelectSelectedOptionsContainer,
    OptionsListContainer: SelectOptionsListContainer,
    SelectedOption: SelectSelectedOption,
    Input: SelectInput,
    ExcludeContainer: SelectExcludeButtonContainer,
    ExcludeIcon: SelectExcludeButton
}