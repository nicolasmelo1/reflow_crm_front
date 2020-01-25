import DatepickerContainer from './DatepickerContainer'
import DatepickerTable from './DatepickerTable'
import DatapickerDate from './DatapickerDate'
import DatepickerYearContainer from './DatepickerYearContainer'
import DatepickerYearItemsContainer from './DatepickerYearItemsContainer'
import DatepickerMonthContainer from './DatepickerMonthContainer'
import DatepickerWeekdays from './DatepickerWeekdays'
import DatepickerMain from './DatepickerMain'
import DatepickerMonthItemsContainer from './DatepickerMonthItemsContainer'

export default {
    Container: DatepickerMain,
    WeekdaysContainer: DatepickerWeekdays,
    PickerContainer: DatepickerContainer,
    Table: DatepickerTable,
    YearContainerItems: DatepickerYearItemsContainer,
    MonthContainerItems: DatepickerMonthItemsContainer,
    DateContainer: DatapickerDate,
    YearContainer: DatepickerYearContainer,
    MonthContainer: DatepickerMonthContainer
}