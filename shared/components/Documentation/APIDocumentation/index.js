import React, { useEffect } from 'react'
import { View } from 'react-native'
import actions from '../../../redux/actions'
import { types } from '../../../utils/constants'
import dynamicImport from '../../../utils/dynamicImport'
import Styled from './styles'
import initializeCodeEditor from '../../../utils/codeEditor'
import { javascript } from "@codemirror/lang-javascript"

const connect = dynamicImport('reduxConnect', 'default')


const Code = (props) => {
    const editorRef = React.useRef()
    const textEditorRef = React.useRef()

    useEffect(() => {
        editorRef.current = initializeCodeEditor({
            languagePack: javascript({jsx: true}), 
            parent:textEditorRef.current, 
            code:`
import React from "react"
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import Header from '../../../components/Header'
import actions from '@shared/redux/actions'
import { Layout, APIDocumentation } from '@shared/components'

// COmentario
/**
 * @param {String} teste - asdadasd
 */
class APIDocumentationPage extends React.Component {
    render() {
        return (
            <Layout 
            showSideBar={false} 
            header={<Header title={'API Documentation'}/>}
            >
                <APIDocumentation
                formName={this.props.router.query.form} 
                />
            </Layout>
        )
    }
}


export default withRouter(APIDocumentationPage)
        `})

        return () => {
            editorRef.current.destroy()
        }
    }, [])

    return(
        <div 
        ref={textEditorRef}
        style={{
            padding: '5px',
            borderRadius: '10px',
            backgroundColor: '#17242D',
            width: '100%'
        }}
        />
    )
}

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

    componentDidMount() {
        this.props.onGetBuildFormulary(this.source, this.props.formName).then(formularyBuildData => {
            if (formularyBuildData) {
                this.setFormularyData(formularyBuildData)
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
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
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
                                        <React.Fragment
                                        key={field.id}
                                        >
                                            <Styled.APIDocumentationSectionAndFieldsTableRow>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <p>
                                                        {field.label_name}
                                                    </p>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <p>
                                                        {types('pt-br', 'field_type', this.getFieldTypeNameByFieldTypeId(field.type))}
                                                    </p>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                                    <p>
                                                        {'String'}
                                                    </p>
                                                </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                            </Styled.APIDocumentationSectionAndFieldsTableRow>
                                            <Styled.APIDocumentationSectionAndFieldsTableRow>
                                                <Code/>
                                            </Styled.APIDocumentationSectionAndFieldsTableRow>
                                        </React.Fragment>
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