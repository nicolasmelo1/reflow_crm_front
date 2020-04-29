import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Utils from '../../../styles/Utils'

/** 
 * Renders the HourPicker component.
 * @param {function} setHourPickerIsOpen - function to call to set the state of the hourPickerIsOpen
 * @param {function} updateDate - Main fuction to call to update the selected date.
 * @param {Date} selectedDay - The current selected day by the user
*/
const HourPicker = (props) => {
    const updateHour = (hour, minute) => {
        hour = (hour>23) ? 0: hour
        hour = (hour<0) ? 23: hour
        minute = (minute>59) ? 0: minute
        minute = (minute<0) ? 59: minute
        const day = props.selectedDay.getDate()
        const month = props.selectedDay.getMonth()
        const year = props.selectedDay.getFullYear()
        const newDate = new Date(year, month, day, hour, minute)
        props.updateDate(newDate)
    }
    
    return (
        <Utils.Datepicker.HourpickerContainer>
            <Utils.Datepicker.HourpickerDatepickerToggle onClick={e=>{props.setHourPickerIsOpen(false)}}>
                <FontAwesomeIcon icon="calendar-alt" />
            </Utils.Datepicker.HourpickerDatepickerToggle>
            <Utils.Datepicker.HourpickerTable>
                <tbody>
                    <tr>
                        <Utils.Datepicker.HourpickerItem>
                            <Utils.Datepicker.HourpickerArrow icon="chevron-up" onClick={e=>{updateHour(props.selectedDay.getHours()+1, props.selectedDay.getMinutes())}}/>
                        </Utils.Datepicker.HourpickerItem>
                        <Utils.Datepicker.HourpickerItem/>
                        <Utils.Datepicker.HourpickerItem>
                            <Utils.Datepicker.HourpickerArrow icon="chevron-up" onClick={e=>{updateHour(props.selectedDay.getHours(), props.selectedDay.getMinutes()+1)}}/> 
                        </Utils.Datepicker.HourpickerItem>
                    </tr>
                    <tr>
                        <Utils.Datepicker.HourpickerItem>
                            {props.selectedDay.getHours() < 10 ? '0'+props.selectedDay.getHours().toString() :props.selectedDay.getHours()}
                        </Utils.Datepicker.HourpickerItem>
                        <Utils.Datepicker.HourpickerItem>
                            :
                        </Utils.Datepicker.HourpickerItem>
                        <Utils.Datepicker.HourpickerItem>
                            {props.selectedDay.getMinutes() < 10 ? '0'+props.selectedDay.getMinutes().toString() :props.selectedDay.getMinutes()}
                        </Utils.Datepicker.HourpickerItem>
                    </tr>
                    <tr>
                        <Utils.Datepicker.HourpickerItem>
                            <Utils.Datepicker.HourpickerArrow icon="chevron-down" onClick={e=>{updateHour(props.selectedDay.getHours()-1, props.selectedDay.getMinutes())}}/>
                        </Utils.Datepicker.HourpickerItem>
                        <Utils.Datepicker.HourpickerItem/>
                        <Utils.Datepicker.HourpickerItem>
                            <Utils.Datepicker.HourpickerArrow icon="chevron-down" onClick={e=>{updateHour(props.selectedDay.getHours(), props.selectedDay.getMinutes()-1)}}/> 
                        </Utils.Datepicker.HourpickerItem>
                    </tr>
                </tbody>
            </Utils.Datepicker.HourpickerTable>
        </Utils.Datepicker.HourpickerContainer>
    )
}

export default HourPicker