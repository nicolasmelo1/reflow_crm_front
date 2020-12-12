import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import actions from '../../redux/actions'
import PDFGeneratorCreator from './PDFGeneratorCreator'
import PDFGeneratorReader from './PDFGeneratorReader'


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
                {this.props.isReader ? (
                    <PDFGeneratorReader
                    cancelToken={this.cancelToken}
                    formName={this.props.login.primaryForm}
                    formId={this.props.formId}
                    templates={this.props.pdf_generator.reader.templates}
                    onGetPDFGeneratorValuesReader={this.props.onGetPDFGeneratorValuesReader}
                    onGetPDFGeneratorTempalatesReader={this.props.onGetPDFGeneratorTempalatesReader}
                    onCheckIfCanDownloadPDF={this.props.onCheckIfCanDownloadPDF}
                    onAddNotification={this.props.onAddNotification}
                    />
                ) : (
                    <PDFGeneratorCreator
                    formName={this.props.login.primaryForm}
                    cancelToken={this.cancelToken}
                    templates={this.props.pdf_generator.creator.templates}
                    onGetPDFGeneratorTemplatesConfiguration={this.props.onGetPDFGeneratorTemplatesConfiguration}
                    onCreatePDFGeneratorTemplateConfiguration={this.props.onCreatePDFGeneratorTemplateConfiguration}
                    onUpdatePDFGeneratorTemplateConfiguration={this.props.onUpdatePDFGeneratorTemplateConfiguration}
                    onRemovePDFGeneratorTemplateConfiguration={this.props.onRemovePDFGeneratorTemplateConfiguration}
                    onChangePDFGeneratorTemplateConfigurationDataState={this.props.onChangePDFGeneratorTemplateConfigurationDataState}
                    onGetPDFGeneratorTempalatesConfigurationFieldOptions={this.props.onGetPDFGeneratorTempalatesConfigurationFieldOptions}
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