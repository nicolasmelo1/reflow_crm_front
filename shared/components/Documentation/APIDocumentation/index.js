import React, { useEffect } from 'react'
import { View } from 'react-native'
import actions from '../../../redux/actions'
import agent from '../../../utils/agent'
import dynamicImport from '../../../utils/dynamicImport'
import Fields from './Fields'
import Styled from './styles'


const connect = dynamicImport('reduxConnect', 'default')


/**
 * This component is the documentation for the api. We wanted to go to a more simple approach like
 * Redoc and so on but next had a really hard time working with it. And also React Native does not support redoc.
 * So we went to a more obscure approach
 * 
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class APIDocumentation extends React.Component {
    constructor(props) {
        super(props)
        this.fieldTypeNameByFieldTypeId = {}
        this.introductionRef = React.createRef()
        this.rateLimitingRef = React.createRef()
        this.authenticationRef = React.createRef()
        this.tableRef = React.createRef()
        this.state = {
            formularyValues: [],
            formularyData: {
                depends_on_form: []
            }
        }
    }

    /**
     * Sets the formulary data loaded for the documentations, this is the data on HOW to build the formulary.
     * 
     * @param {Object} formularyData - This is the data of the formulary recieved from the backend.
     */
    setFormularyData = (formularyData) => {
        this.setState(state => ({
            ...state,
            formularyData: formularyData
        }))
    }

    setFormularyValues = (formularyValues) => {
        this.setState(state => ({
            ...state,
            formularyValues: formularyValues
        }))
    }

    getFieldTypeNameByFieldTypeId(fieldTypeId) {
        if (this.fieldTypeNameByFieldTypeId[fieldTypeId]) {
            return this.fieldTypeNameByFieldTypeId[fieldTypeId]
        } else {
            const fieldType = this.props.types.data.field_type.filter(fieldType => fieldType.id === fieldTypeId)
            if (fieldType.length > 0) {
                this.fieldTypeNameByFieldTypeId[fieldTypeId] = fieldType[0].type
                return this.fieldTypeNameByFieldTypeId[fieldTypeId]
            } else {
                return ''
            }
        }
    }

    getLastValuesOfFieldId(fieldId) {
        for (const formularyValue of this.state.formularyValues) {
            if (formularyValue.field_id === fieldId) {
                return formularyValue.last_values
            }
        } 
        return []
    }

    componentDidMount() {
        this.props.onGetBuildFormulary(this.source, this.props.formName).then(formularyBuildData => {
            if (formularyBuildData) {
                this.setFormularyData(formularyBuildData)
            }
        })
        agent.http.DOCUMENTATION.getlastValuesOfFormulary(this.source, this.props.formName).then(response => {
            if (response && response.status === 200) {
                this.setFormularyValues(response.data.data)
            }
        })
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <Styled.APIDocumentationContainer>
                <Styled.APIDocumentationNavigationSidebar>
                    <Styled.APIDocumentationNavigationButton
                    onClick={(e) => {this.introductionRef.current.scrollIntoView(true)}}
                    >
                        Introdução
                    </Styled.APIDocumentationNavigationButton>
                    <Styled.APIDocumentationNavigationButton
                    onClick={(e) => {this.rateLimitingRef.current.scrollIntoView(true)}}
                    >
                        Rate limiting
                    </Styled.APIDocumentationNavigationButton>
                    <Styled.APIDocumentationNavigationButton
                    onClick={(e) => {this.authenticationRef.current.scrollIntoView(true)}}
                    >
                        Autenticação
                    </Styled.APIDocumentationNavigationButton>
                    <Styled.APIDocumentationNavigationButton
                    onClick={(e) => {this.tableRef.current.scrollIntoView(true)}}
                    >
                        Tabela
                    </Styled.APIDocumentationNavigationButton>
                </Styled.APIDocumentationNavigationSidebar>
                <div
                style={{
                    overflow: 'auto',
                    padding: '10px',
                    borderRadius: '5px',
                    boxShadow: '4px 4px 12px rgba(56, 66, 95, 0.08)',
                }}
                >   
                    <Styled.APIDocumentationSection>
                        <Styled.APIDocumentationHeader
                        ref={this.introductionRef}
                        >
                            Introdução
                        </Styled.APIDocumentationHeader>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus rutrum felis ac congue. Quisque egestas pulvinar augue, eu mollis nisl faucibus non. Ut gravida mi at enim finibus, posuere vulputate eros hendrerit. Integer vulputate lacus at tincidunt volutpat. Etiam vel diam lacinia, condimentum purus cursus, lobortis elit. Mauris ut libero blandit nulla porta dapibus. Nulla at consequat erat. Maecenas quis massa et lacus lacinia ullamcorper quis non nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tristique venenatis ligula, nec efficitur urna blandit viverra. Aenean ultrices dui turpis, a semper arcu congue nec. Donec placerat molestie ipsum. Donec ex nisl, convallis vel ipsum at, cursus ultrices velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed purus tellus, viverra quis nisl eget, auctor porttitor lectus. Quisque leo massa, porta nec feugiat eget, bibendum id ex.
                        </p>
                    </Styled.APIDocumentationSection>
                    <Styled.APIDocumentationSection>
                        <Styled.APIDocumentationHeader
                        ref={this.rateLimitingRef}
                        >
                            Rate limiting
                        </Styled.APIDocumentationHeader>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus rutrum felis ac congue. Quisque egestas pulvinar augue, eu mollis nisl faucibus non. Ut gravida mi at enim finibus, posuere vulputate eros hendrerit. Integer vulputate lacus at tincidunt volutpat. Etiam vel diam lacinia, condimentum purus cursus, lobortis elit. Mauris ut libero blandit nulla porta dapibus. Nulla at consequat erat. Maecenas quis massa et lacus lacinia ullamcorper quis non nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tristique venenatis ligula, nec efficitur urna blandit viverra. Aenean ultrices dui turpis, a semper arcu congue nec. Donec placerat molestie ipsum. Donec ex nisl, convallis vel ipsum at, cursus ultrices velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed purus tellus, viverra quis nisl eget, auctor porttitor lectus. Quisque leo massa, porta nec feugiat eget, bibendum id ex.
                        </p>
                    </Styled.APIDocumentationSection>
                    <Styled.APIDocumentationSection>
                        <Styled.APIDocumentationHeader
                        ref={this.authenticationRef}
                        >
                            Autenticação
                        </Styled.APIDocumentationHeader>
                        <section>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus rutrum felis ac congue. Quisque egestas pulvinar augue, eu mollis nisl faucibus non. Ut gravida mi at enim finibus, posuere vulputate eros hendrerit. Integer vulputate lacus at tincidunt volutpat. Etiam vel diam lacinia, condimentum purus cursus, lobortis elit. Mauris ut libero blandit nulla porta dapibus. Nulla at consequat erat. Maecenas quis massa et lacus lacinia ullamcorper quis non nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tristique venenatis ligula, nec efficitur urna blandit viverra. Aenean ultrices dui turpis, a semper arcu congue nec. Donec placerat molestie ipsum. Donec ex nisl, convallis vel ipsum at, cursus ultrices velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed purus tellus, viverra quis nisl eget, auctor porttitor lectus. Quisque leo massa, porta nec feugiat eget, bibendum id ex.
                        </section>
                    </Styled.APIDocumentationSection>
                    <Styled.APIDocumentationSection>
                        <Styled.APIDocumentationHeader
                        ref={this.tableRef}
                        >
                            Tabela
                        </Styled.APIDocumentationHeader>
                        <h2>
                            Seções e campos
                        </h2>
                        {this.state.formularyData.depends_on_form.map(section=> (
                            <div
                            key={section.id}
                            style={{
                                backgroundColor: '#f2f2f2',
                                marginBottom: '10px',
                                borderRadius: '10px',
                                padding: '10px'
                            }}
                            >
                                <Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                            Nome da seção
                                        </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                            Tipo da seção
                                        </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                            Descrição
                                        </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                </Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                <Styled.APIDocumentationSectionAndFieldsTableRow>
                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <div>
                                            <p>
                                                {section.label_name}
                                            </p>
                                        </div>
                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <div>
                                            <p>
                                                {section.form_type === 'form' ? 'Unico': 'Múltiplo'}
                                            </p>
                                        </div>
                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                    <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <div>
                                            <p>
                                                {section.form_type === 'form' ? 'Objeto': 'Array'}
                                            </p>
                                            <p>
                                                {section.form_type === 'form' ? 'Uma seção unica é um objeto e armazena os campos apenas uma vez': 'Uma seção multipla armazena o conjunto de campos abaixo multiplas vezes'}
                                            </p>
                                        </div>
                                    </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                </Styled.APIDocumentationSectionAndFieldsTableRow>
                                <div
                                style={{
                                    padding:'10px 20px',
                                    backgroundColor: '#fff',
                                    borderRadius: '10px'
                                }}
                                >
                                    <Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                        <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                            <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                Nome do campo
                                            </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                        </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                            <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                Tipo do campo
                                            </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                        </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                        <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                            <Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                                Descrição
                                            </Styled.APIDocumentationSectionAndFieldsTableHeaderText>
                                        </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                    </Styled.APIDocumentationSectionAndFieldsTableHeaderRow>
                                    {section.form_fields.map(field => (
                                        <Fields
                                        key={field.id}
                                        field={field}
                                        types={this.props.types}
                                        formName={this.props.formName}
                                        lastValues={this.getLastValuesOfFieldId(field.id)}
                                        fieldTypeName={this.getFieldTypeNameByFieldTypeId(field.type)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <pre>
                            {JSON.stringify(this.state.formularyData, null, 4)}
                        </pre>
                    </Styled.APIDocumentationSection>
                </div>
            </Styled.APIDocumentationContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ types: state.login.types }), actions)(APIDocumentation)