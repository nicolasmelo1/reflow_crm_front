import strings from './strings'

/** 
 * Our system has some types, Types are particular kind of data in our system that is critical to
 * for it to work, since most of them must be displayed for the user to select we need to be able to
 * translate it to a certain language.
 * 
 * @param {String} lang - the language to translate to
 * @param {String} type - must follow the types object from the backend, 
 * you can check all of the types on the response of `/types/` path
 * @param {String} key - the types usually have a slug, or a simple name
 * you can use it to find the translation for it.
 */
const types = (lang, type, key) => {
    return {
        form_type: {
            multi_form: strings[lang]['formTypeMultiple'],
            form: strings[lang]['formTypeSingle'],
        },
        conditional_type: {
            equal: strings[lang]['conditionalTypeEqual']
        },
        field_type: {
            number: strings[lang]['fieldTypeNumber'],
            text: strings[lang]['fieldTypeText'],
            date: strings[lang]['fieldTypeDate'],
            option: strings[lang]['fieldTypeOption'],
            form: strings[lang]['fieldTypeForm'],
            attachment: strings[lang]['fieldTypeAttachment'],
            long_text: strings[lang]['fieldTypeLongText'],
            email: strings[lang]['fieldTypeEmail'],
            multi_option: strings[lang]['fieldTypeMultiOption'],
            id: strings[lang]['fieldTypeId'],
            user: strings[lang]['fieldTypeUser'],
            period: strings[lang]['fieldTypePeriod']
        },
        date_configuration_date_format_type: {
            date: strings[lang]['dateFormatTypeDate'],
            datetime: strings[lang]['dateFormatTypeDatetime']
        },
        period_configuration_period_format_type: {
            seconds: strings[lang]['periodFormatTypeSecond'],
            minutes: strings[lang]['periodFormatTypeMinute'],
            hours: strings[lang]['periodFormatTypeHour'],
            days: strings[lang]['periodFormatTypeDay'],
            weeks: strings[lang]['periodFormatTypeWeek'],
            month: strings[lang]['periodFormatTypeMonth']
        },
        period_configuration_periods_format_type: {
            seconds: strings[lang]['periodFormatTypeSeconds'],
            minutes: strings[lang]['periodFormatTypeMinutes'],
            hours: strings[lang]['periodFormatTypeHours'],
            days: strings[lang]['periodFormatTypeDays'],
            weeks: strings[lang]['periodFormatTypeWeeks'],
            month: strings[lang]['periodFormatTypeMonths']
        },
        number_configuration_number_format_type: {
            number: strings[lang]['numberFormatTypeNumber'],
            currency: strings[lang]['numberFormatTypeCurrency'],
            percentage: strings[lang]['numberFormatTypePercentage'],
        },
        data_type: {
            kanban: strings[lang]['dataTypeKanban'],
            listing: strings[lang]['dataTypeListing'],
            dashboard: strings[lang]['dataTypeDashboard']
        },
        aggregation_type: {
            sum: strings[lang]['aggregationTypeSum'],
            avg: strings[lang]['aggregationTypeAvg'],
            percent: strings[lang]['aggregationTypePercent'],
            max: strings[lang]['aggregationTypeMax'],
            min: strings[lang]['aggregationTypeMin'],
            count: strings[lang]['aggregationTypeCount']
        },
        chart_type: {
            pie: strings[lang]['chartTypePie'],
            line: strings[lang]['chartTypeLine'],
            bar: strings[lang]['chartTypeBar'],
            card: strings[lang]['chartTypeCard']
        },
        theme_type: {
            empty: strings[lang]['groupTypeEmpty'],
            sales: strings[lang]['groupTypeSales'],
            development: strings[lang]['groupTypeDevelopment'],
            rh: strings[lang]['groupTypeHumanResources'],
            design: strings[lang]['groupTypeDesign'],
            marketing: strings[lang]['groupTypeMarketing'],
            operations: strings[lang]['groupTypeOperations'],
            projects: strings[lang]['groupTypeProjects'],
            finance: strings[lang]['groupTypeFinance']
        },
        payment_method_type: {
            credit_card: strings[lang]['paymentMethodTypeCreditCard'],
            invoice: strings[lang]['paymentMethodTypeInvoice']
        },
        individual_charge_value_type: {
            per_gb: strings[lang]['individualChargeValueTypePerGB'],
            per_user: strings[lang]['individualChargeValueTypePerUser'],
            per_chart_company: strings[lang]['individualChargeValueTypePerChartCompany'],
            per_chart_user: strings[lang]['individualChargeValueTypePerChartUser']
        },
        profile_type: {
            admin: strings[lang]['profileTypeAdmin'],
            coordinator: strings[lang]['profileTypeCoordinator'],
            simple_user: strings[lang]['profileTypeSimpleUser']
        }
    }[type][key]
}

export default types