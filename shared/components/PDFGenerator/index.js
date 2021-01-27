import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { View } from 'react-native'
import actions from '../../redux/actions'
import PDFGeneratorCreator from './PDFGeneratorCreator'
import PDFGeneratorReader from './PDFGeneratorReader'


/**
 * This view is responsible for rendering pdf templates. We have two possible states here:
 * 
 * - We are creating a pdf template, so the variables displayed to the user are the field names.
 * - We are reading a pdf template and are prior from downloading, so the variables displayed to the user are
 * field values.
 * 
 * @param {Boolean} isReader - Set if the PDF template is in reader state (look at the explanation above). Defaults to false
 * @param {BigInteger} formId - if the pdf template is in reader state, we need the formId so we can retrieve the formValue options
 */
class PDFGenerator extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
    }

    /**
     * Retrives all of the text block_type ids allowed for pdf templates.
     */
    getPermittedRichTextBlockIds = () => {
        return this.props.pdf_generator.allowedBlocks.map(allowedBlock=> 
            allowedBlock.block
        )
    }

    componentDidMount = () => {
        this.source = this.cancelToken.source()
        this.props.onGetAllowedBlocks(this.source)
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View>
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
                    allowedRichTextBlockIds={this.getPermittedRichTextBlockIds()}

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
                    allowedRichTextBlockIds={this.getPermittedRichTextBlockIds()}
                    />
                )}
            </View>
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
                    allowedRichTextBlockIds={this.getPermittedRichTextBlockIds()}
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
                    allowedRichTextBlockIds={this.getPermittedRichTextBlockIds()}
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