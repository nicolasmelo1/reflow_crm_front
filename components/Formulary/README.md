# EXPLANATION ON HOW IT WORKS

Okay, so formulary is kinda hard to explain, i'll try:

## SIMPLE EXPLANATION
(This part you can actually use to exlain to an operations guy or a sales guy)

Let's imagine the following situation: 
We have a formulary with the sections `informações gerais`, `detalhe da perda`, `anexo`, `historico`. Where `historico` is a multi-section.

This front-end actually recieves TWO types of data: one says __HOW__ you should render stuff, the other says __WHAT__ you should render. 
This is actually IMPORTANT, so keep this in mind.

### The HOW
This is the first data we recieve, and it is HOW to render the formulary. So we revieve a JSON containing each section and within each section, each field from the section.
This data contains stuff like, how to format numbers and dates, what is the label_name to display to the user, is it required or not?, and many of
other stuff. This json, obviously, return just one section even if it's a multi-section. So in our example, we would have a 
object about the `historico` section only once, it looks like a regular object.

### The WHAT
The __WHAT__ is basically an array containing all the sections which each of them contains an array that with each field value.

Now let's go for the data we POST/PUT and GET from the backend, this is the WHAT.
When we POST, and when we load the DATA the JSON becomes something like this:
- `Informações gerais` with all of the values from N number of fields
- `Detalhe da Perda`  with all of the values from N number of fields
- `Anexo`  with all of the values from N number of fields
- `Historico_1`  with all of the values from N number of fields
- `Historico_2`  with all of the values from N number of fields
- `Historico_3`  with all of the values from N number of fields


So what we end up with is that, the data that we use to build the formulary is not the same of the data that we send. But the main problem is: 
WE NEED THE DATA WE SEND TO BUILD THE FORMULARY

Okay, i think it's okay until now in formal language so let's try to explain in a programmers language

## HARDER EXPLANATION

THIS IS THE data recieved from the __HOW__ to build the formulary. Looking at this JSON you quickly realize you have stuff like placeholder,
is_required that defines if the field is required, conditionals from the sections, and all of that.

```json
{
  "id": 95,
  "form_name": "negocios",
  "label_name": "Neg\u00f3cios",
  "depends_on_form": [
      {
          "id": 96,
          "label_name": "Informa\u00e7\u00f5es Gerais",
          "form_type": "form",
          "conditional_value": null,
          "form_fields": [
              {
                  "id": 413,
                  "field_type": "number",
                  "form_field_as_option": null,
                  "field_option": [],
                  "user_option": null,
                  "date_configuration_date_format_type": "%d/%m/%Y",
                  "period_configuration_period_interval_type": "Dias",
                  "number_configuration_number_format_type": {
                      "type": "number",
                      "label_name": "Numero",
                      "precision": 1,
                      "prefix": null,
                      "suffix": null,
                      "thousand_separator": null,
                      "decimal_separator": null,
                      "order": 1
                  },
                  "number_configuration_mask": null,
                  "formula_configuration": "{{261}}+100",
                  "name": "calculo",
                  "label_name": "Calculo",
                  "placeholder": null,
                  "required": false,
                  "order": 0,
                  "is_unique": false,
                  "field_is_hidden": false,
                  "label_is_hidden": false,
                  "date_configuration_auto_create": false,
                  "date_configuration_auto_update": false,
                  "number_configuration_allow_negative": true,
                  "number_configuration_allow_zero": true,
                  "enabled": true,
                  "type": 1,
                  "form": 96
              }
          ]
      }
  ]
}
```

Okay, so it looks simple right now, but here comes the hard part: This json explains me HOW to render but not WHAT to render. If we have conditional sections,
we don't have to show them. If we have multi-sections we have to render the title but not the fields. How we do this you might asK:
WITH THE WHAT DATA PART, THAT TELLS US WHAT SHOULD WE RENDER

```json
[
    {
        "id": "1230", 
        "form_id": "98", 
        "dynamic_form_value": []
    }, {
        "id": "1229", 
        "form_id": "96", 
        "dynamic_form_value": [
            {
                "id": "4157", 
                "value": "1199", 
                "field_name": "corretor"
            }, {
                "id": "4158", 
                "value": "Garantia", 
                "field_name": "produto"
            }, {
                "id": "4159", 
                "value": "25/12/2019", 
                "field_name": "previsaodefechamento"
            }, {
                "id": "4160", 
                "value": "2.000,00",
                "field_name": "valor_1"
            }, {
                "id": "4161", 
                "value": "Negocia\u00e7\u00e3o", 
                "field_name": "status_1"
            }, {
                "id": "4208", 
                "value": "2100", 
                "field_name": "calculo"
            }
        ]
    },
    {
        "id": "1250", 
        "form_id": "99", 
        "dynamic_form_value": [
            {
                "id": "123123123123", 
                "value": "valor1",
                "field_name": "historico"
            }
        ]
    },
    {
        "id": "1251", 
        "form_id": "99", 
        "dynamic_form_value": [
            {
                "id": "5357", 
                "value": "valor2",
                "field_name": "historico"
            }
        ]
    }
]
```

Notice that this is the object we recieve and the one we POST to the backend. Remember our example? Let's go with the objects from the array with form_id `99`.
Looking at this simple JSON we notice right away this is a multi-section. There are 2 sections with data from just ONE section. Section number `96` and `98` appears 
just once.

Okay, everything seems fine, but remember that i said we actually need this data to build the form? 
When the user opens the form the first time, without any data being loaded, 
we actually build this object in the state while building the form, so we can know what to build from the formulary.