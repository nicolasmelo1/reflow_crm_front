import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import actions from '../../../redux/actions'
import Styled from './styles'

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

    setFormularyData = (formularyData) => {
        this.setState(state => ({
            ...state,
            formularyData: formularyData
        }))
    }

    componentDidMount() {
        this.props.onGetBuildFormulary(this.source, this.props.formName).then(formularyBuildData => {
            this.setFormularyData(formularyBuildData)
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
                        Authenticação
                    </Styled.APIDocumentationNavigationButton>
                </Styled.APIDocumentationNavigationSidebar>
                <div
                style={{
                    overflow: 'auto',
                    padding: '10px'
                }}
                >
                    <h1
                    ref={this.introductionRef}
                    >
                        Introdução
                    </h1>
                    <section>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus rutrum felis ac congue. Quisque egestas pulvinar augue, eu mollis nisl faucibus non. Ut gravida mi at enim finibus, posuere vulputate eros hendrerit. Integer vulputate lacus at tincidunt volutpat. Etiam vel diam lacinia, condimentum purus cursus, lobortis elit. Mauris ut libero blandit nulla porta dapibus. Nulla at consequat erat. Maecenas quis massa et lacus lacinia ullamcorper quis non nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tristique venenatis ligula, nec efficitur urna blandit viverra. Aenean ultrices dui turpis, a semper arcu congue nec. Donec placerat molestie ipsum. Donec ex nisl, convallis vel ipsum at, cursus ultrices velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed purus tellus, viverra quis nisl eget, auctor porttitor lectus. Quisque leo massa, porta nec feugiat eget, bibendum id ex.
                    </section>
                    <h1
                    ref={this.rateLimitingRef}
                    >
                        Rate limiting
                    </h1>
                    <section>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus rutrum felis ac congue. Quisque egestas pulvinar augue, eu mollis nisl faucibus non. Ut gravida mi at enim finibus, posuere vulputate eros hendrerit. Integer vulputate lacus at tincidunt volutpat. Etiam vel diam lacinia, condimentum purus cursus, lobortis elit. Mauris ut libero blandit nulla porta dapibus. Nulla at consequat erat. Maecenas quis massa et lacus lacinia ullamcorper quis non nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tristique venenatis ligula, nec efficitur urna blandit viverra. Aenean ultrices dui turpis, a semper arcu congue nec. Donec placerat molestie ipsum. Donec ex nisl, convallis vel ipsum at, cursus ultrices velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed purus tellus, viverra quis nisl eget, auctor porttitor lectus. Quisque leo massa, porta nec feugiat eget, bibendum id ex.
                    </section>
                    <h1
                    ref={this.authenticationRef}
                    >
                        Authenticação
                    </h1>
                    <section>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus rutrum felis ac congue. Quisque egestas pulvinar augue, eu mollis nisl faucibus non. Ut gravida mi at enim finibus, posuere vulputate eros hendrerit. Integer vulputate lacus at tincidunt volutpat. Etiam vel diam lacinia, condimentum purus cursus, lobortis elit. Mauris ut libero blandit nulla porta dapibus. Nulla at consequat erat. Maecenas quis massa et lacus lacinia ullamcorper quis non nisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tristique venenatis ligula, nec efficitur urna blandit viverra. Aenean ultrices dui turpis, a semper arcu congue nec. Donec placerat molestie ipsum. Donec ex nisl, convallis vel ipsum at, cursus ultrices velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed purus tellus, viverra quis nisl eget, auctor porttitor lectus. Quisque leo massa, porta nec feugiat eget, bibendum id ex.
                    </section>
                    <h1
                    ref={this.tableRef}
                    >
                        Tabela
                    </h1>
                    <h2>
                        Seções e campos
                    </h2>
                    <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #bfbfbf'
                    }}
                    >
                        <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                            <p>
                                Nome da seção
                            </p>
                        </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                        <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                            <p>
                                Tipo da seção
                            </p>
                        </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                        <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                            <p>
                                Descrição
                            </p>
                        </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                    </div>
                    {this.state.formularyData.depends_on_form.map(section=> (
                        <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between'
                        }}
                        >
                            <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                                <p>
                                    {section.label_name}
                                </p>
                            </Styled.APIDocumentationSectionAndFieldsTableRowCell>
                            <Styled.APIDocumentationSectionAndFieldsTableRowCell>
                            <p>
                                {section.form_type === 'form' ? 'Unico': 'Múltiplo'}
                            </p>
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
                        </div>
                    ))}
                    <pre>
                        {JSON.stringify(this.state.formularyData, null, 4)}
                    </pre>
                </div>
            </Styled.APIDocumentationContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ types: state.login.types }), actions)(APIDocumentation)