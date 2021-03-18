import React, { useEffect, useState} from 'react'
import axios from 'axios'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { paths } from '../../utils/constants'
import { FRONT_END_HOST } from '../../config'
import { Formularies } from '../../styles/Formulary'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const FormularyPublicEdit = (props) => {
    const sourceRef = React.useRef()
    const [greetingsText, setGreetingsText] = useState('')
    const [descriptionText, setDescriptionText] = useState('')
    const [isToShowSubmitAnotherButton, setIsToShowSubmitAnotherButton] = useState(false)
    const [publicAccessKey, setPublicAccessKey] = useState('')
    const [fields, setFields] = useState([])
    const [selectedFields, setSelectedFields] = useState([])
    
    const publicFormularyUrl = `${FRONT_END_HOST.substring(0, FRONT_END_HOST.length-1)}${paths.publicFormulary(props.formularyBuildData.form_name).asUrl}?public_access_key=${publicAccessKey}`

    const onSelectField = (fieldId) => {
        let newSelectedFields = []
        if (selectedFields.includes(fieldId)) {
            newSelectedFields = selectedFields.filter(selectedField => selectedField !== fieldId)
        } else {
            selectedFields.push(fieldId)
            newSelectedFields = selectedFields
        }
        setSelectedFields([...newSelectedFields])
        props.onUpdatePublicFormulary(props.formularyBuildData.id, newSelectedFields).then(response => {
            if (response && response.status === 200) {
                setPublicAccessKey(response.data.data.public_access_key)
            }
        })
    }

    useEffect(() => {
        sourceRef.current = axios.CancelToken.source()
        props.onGetPublicFormulary(sourceRef.current, props.formularyBuildData.id).then(response => {
            if (response && response.status === 200) {
                setPublicAccessKey(response.data.data.public_access_key)
                
                setSelectedFields(response.data.data.public_access_form_public_access_fields.map(field => field.field_id))
            }
        })
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        if (props.formularyBuildData && props.formularyBuildData.depends_on_form) {
            setFields([].concat.apply([], props.formularyBuildData.depends_on_form.map(formData => formData.form_fields)))
        }
    }, [props.formularyBuildData])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {selectedFields.length > 0 ? (
                    <Formularies.PublicEdit.LinkContainer>
                        <Formularies.PublicEdit.FormTitle>
                            {'Link para o formulário'}
                        </Formularies.PublicEdit.FormTitle>
                        <div style={{
                            backgroundColor: '#0dbf7e50',
                            border: '1px solid #0dbf7e',
                            borderRadius: '5px',
                            padding: '5px',
                            display: 'flex',
                        }}>
                            <a href={publicFormularyUrl} 
                            target="_blank"
                            style={{
                                fontWeight: 'bold',
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                wordWrap: 'normal',
                                color: '#0dbf7e'
                            }}>
                                {publicFormularyUrl}
                            </a>
                        </div>
                    </Formularies.PublicEdit.LinkContainer>
                ) : (
                    <Formularies.PublicEdit.FormTitle isNotPublicMessageTitle={true}>
                        {'Este formulário não é público'}
                    </Formularies.PublicEdit.FormTitle>
                )}
                <Formularies.PublicEdit.FormTitle>
                    {'Texto de agradecimento'}
                </Formularies.PublicEdit.FormTitle>
                <input type={'Text'}/>
                <Formularies.PublicEdit.FormTitle>
                    {'Selecionar campos que serão considerados no formulário'}
                </Formularies.PublicEdit.FormTitle>
                {fields.map(field => (
                    <div 
                    key={field.id}
                    style={{
                        border: selectedFields.includes(field.id) ? '1px solid #0dbf7e' : '1px solid #bfbfbf',
                        marginBottom: '5px',
                        backgroundColor: selectedFields.includes(field.id) ? '#0dbf7e50': 'transparent',
                        borderRadius: '5px'
                    }}
                    >
                        <label style={{
                            cursor: 'pointer',
                            width: '100%',
                            userSelect: 'none',
                            margin: '0',
                            padding: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <input 
                            onChange={(e) => onSelectField(field.id)}
                            type={'checkbox'} 
                            style={{
                                display: 'none'
                            }}/>
                            <p style={{
                                margin: '0',
                                color: '#17242D'
                            }}>
                                {field.label_name}
                            </p>
                            <FontAwesomeIcon 
                            icon={selectedFields.includes(field.id) ? 'check': 'times'} 
                            style={{
                                color: selectedFields.includes(field.id) ? '#0dbf7e': '#bfbfbf'
                            }}/>
                        </label>
                    </div>
                ))}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default FormularyPublicEdit