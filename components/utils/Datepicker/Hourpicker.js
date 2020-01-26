import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Field } from 'styles/Formulary'

const Hourpicker = (props) => {
    const updateHour = (hour, minute) => {
        hour = (hour>23) ? 0: hour
        hour = (hour<0) ? 23: hour
        minute = (minute>59) ? 0: minute
        minute = (minute<0) ? 59: minute
        const day = props.selectedDay.getDate()
        const month = props.selectedDay.getMonth()
        const year = props.selectedDay.getFullYear()
        const newDate = new Date(year, month, day, hour, minute)
        props.setSelectedDay(newDate)
    }
    return (
        <Field.Datepicker.HourpickerTable>
            <tbody>
                <tr>
                    <Field.Datepicker.HourpickerItem>
                        <Field.Datepicker.HourpickerArrow icon="chevron-up" onClick={e=>{updateHour(props.selectedDay.getHours()+1, props.selectedDay.getMinutes())}}/>
                    </Field.Datepicker.HourpickerItem>
                    <Field.Datepicker.HourpickerItem/>
                    <Field.Datepicker.HourpickerItem>
                        <Field.Datepicker.HourpickerArrow icon="chevron-up" onClick={e=>{updateHour(props.selectedDay.getHours(), props.selectedDay.getMinutes()+1)}}/> 
                    </Field.Datepicker.HourpickerItem>
                </tr>
                <tr>
                    <Field.Datepicker.HourpickerItem>
                        {props.selectedDay.getHours() < 10 ? '0'+props.selectedDay.getHours().toString() :props.selectedDay.getHours()}
                    </Field.Datepicker.HourpickerItem>
                    <Field.Datepicker.HourpickerItem>
                        :
                    </Field.Datepicker.HourpickerItem>
                    <Field.Datepicker.HourpickerItem>
                        {props.selectedDay.getMinutes() < 10 ? '0'+props.selectedDay.getMinutes().toString() :props.selectedDay.getMinutes()}
                    </Field.Datepicker.HourpickerItem>
                </tr>
                <tr>
                    <Field.Datepicker.HourpickerItem>
                        <Field.Datepicker.HourpickerArrow icon="chevron-down" onClick={e=>{updateHour(props.selectedDay.getHours()-1, props.selectedDay.getMinutes())}}/>
                    </Field.Datepicker.HourpickerItem>
                    <Field.Datepicker.HourpickerItem/>
                    <Field.Datepicker.HourpickerItem>
                        <Field.Datepicker.HourpickerArrow icon="chevron-down" onClick={e=>{updateHour(props.selectedDay.getHours(), props.selectedDay.getMinutes()-1)}}/> 
                    </Field.Datepicker.HourpickerItem>
                </tr>
            </tbody>
        </Field.Datepicker.HourpickerTable>
    )
}

export default Hourpicker