import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import actions from '../../redux/actions'
import PDFGeneratorCreator from './PDFGeneratorCreator'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class PDFGenerator extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                {this.props.isReader ? '': (
                    <PDFGeneratorCreator
                    formName={this.props.login.primaryForm}
                    cancelToken={this.cancelToken}
                    templates={this.props.pdf_generator.creator.templates}
                    pdfGeneratorData={this.props.pdf_generator.creator.data}
                    onGetPDFGeneratorTemplatesConfiguration={this.props.onGetPDFGeneratorTemplatesConfiguration}
                    onCreatePDFGeneratorTemplateConfiguration={this.props.onCreatePDFGeneratorTemplateConfiguration}
                    onUpdatePDFGeneratorTemplateConfiguration={this.props.onUpdatePDFGeneratorTemplateConfiguration}
                    onChangePDFGeneratorTemplateConfigurationDataState={this.props.onChangePDFGeneratorTemplateConfigurationDataState}
                    onGetPDFGeneratorTempalatesConfigurationFieldOptions={this.props.onGetPDFGeneratorTempalatesConfigurationFieldOptions}
                    onGetRichTextDataById={this.props.onGetRichTextDataById}
                    />
                )}
            </div>
        )
    }
    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login, pdf_generator: state.pdf_generator }), actions)(PDFGenerator)