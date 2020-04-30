
/**
 * I think it's kinda obvious but this object holds all of the strings in the system, this way it becomes
 * easier for us to internationalize.
 */
const strings = {
    'pt-br': {
        indexPageTitle: 'Reflow',
        loginPageTitle: 'Login - Reflow',
        emailLoginLabel: 'E-mail',
        passLoginLabel: 'Senha',
        submitButtonLabel: 'Entrar',
        incorrectPassOrUserError: 'Login e/ou senha incorretos',
        managementPageTitle: 'Gestão / {} / Reflow',
        disabledGroupLabel: 'O Grupo está desativado',
        disabledFormLabel: 'O Formulário está desativado',
        addNewFormButtonLabel: 'Adicionar novo formulário',
        sidebarEditTemplateButtonLabel: 'Editar templates',
        sidebarAddNewTemplateButtonLabel: 'Adicionar novo',
        goBack: 'Voltar',
        calendarMonthReferenceJanuary: 'Janeiro',
        calendarMonthReferenceFebruary: 'Fevereiro',
        calendarMonthReferenceMarch: 'Março',
        calendarMonthReferenceApril: 'Abril',
        calendarMonthReferenceMay: 'May',
        calendarMonthReferenceJune: 'Junho',
        calendarMonthReferenceJuly: 'Julho',
        calendarMonthReferenceAugust: 'Agosto',
        calendarMonthReferenceSeptember: 'Setembro',
        calendarMonthReferenceOctober: 'Outubro',
        calendarMonthReferenceNovember: 'Novembro',
        calendarMonthReferenceDecember: 'Dezembro',
        calendardayOfTheWeekReferenceSunday: 'Dom',
        calendardayOfTheWeekReferenceMonday: 'Seg',
        calendardayOfTheWeekReferenceTuesday: 'Ter',
        calendardayOfTheWeekReferenceWednesday: 'Qua',
        calendardayOfTheWeekReferenceThursday: 'Qui',
        calendardayOfTheWeekReferenceFriday: 'Sex',
        calendardayOfTheWeekReferenceSaturday: 'Sáb',
        headerGestaoLabel: 'Gestão',
        headerDashboardLabel: 'Dashboard',
        headerSettingsLabel: 'Configurações',
        headerRefferalLabel: 'Indicar usuários',
        headerCompanyLabel: 'Empresa',
        headerChangeDataLabel: 'Alterar Dados',
        headerBillingLabel: 'Pagamento',
        headerNotificationLabel: 'Notificações',
        headerHelpLabel: 'Ajuda',
        headerLogoutLabel: 'Logout',
        formularySaveButtonLabel: 'Salvar',
        formularyEditButtonLabel: 'Editar campos',
        formularyEditButtonDescription: 'Clique aqui para editar o formulário',
        formularyFinishEditButtonLabel: 'Salvar e voltar',
        formularyFinishEditButtonDescription: 'Clique aqui para finalizar a edição do formulário',
        formularyOpenButtonLabel: 'Adicionar',
        formularyLoadingButtonLabel: 'Carregando...',
        formularyMultiFormAddButtonLabel: 'Adicionar',
        formularyFieldAttachmentDefaultLabel: 'Clique ou arraste arquivos aqui',
        formularyRequiredFieldError: 'Este campo é obrigatório',
        formularyInvalidFileError: 'O tipo de arquivo não é suportado, aceitamos apenas .doc, .docx, .jpeg, .jpg, .pdf, .png, .wav, .xls, .xlsx, .zip',
        formularyUniqueFieldError: 'Os valores deste campo são unicos, tente inserir outro valor',
        formularyFormFieldAddNewButtonLabel: 'Adicionar novo',
        formularyFormFieldEditButtonLabel: 'Editar',
        formularyEditSectionSelectionLabel: 'Qual o tipo de seção?',
        formularyEditMultipleSectionDescription: 'Os campos deste tipo de seção PODEM ser duplicados.',
        formularyEditSingleSectionDescription: 'Os campos deste tipo de seção NÃO PODEM ser duplicados.',
        formularyEditIsConditionalButtonLabel: 'Seção é condicional?',
        formularyEditConditionalFieldSelectorLabel: 'Quando o campo',
        formularyEditConditionalConditionalTypeSelectorLabel: 'For',
        formularyEditConditionalValueInputLabel: 'Valor',
        formularyEditFieldTypeSelectorLabel: 'Tipo do Campo',
        formularyEditFieldNameInputLabel: 'Nome do Campo',
        formularyEditFieldIsRequiredCheckboxLabel: 'Campo Obrigatório',
        formularyEditFieldLabelIsVisibleCheckboxLabel: 'Titulo não visível',
        formularyEditFieldIsVisibleCheckboxLabel: 'Campo não visível',
        formularyEditFieldIsUniqueCheckboxLabel: 'Os valores inseridos nesse campo são únicos',
        formularyEditFieldDatetimeAutoCreateCheckboxLabel: 'Data automatica ao criar',
        formularyEditFieldDatetimeAutoUpdateCheckboxLabel: 'Data automatica ao editar',
        formularyEditFieldNumberTypeSelectorLabel: 'Formatação do número',
        formularyEditFieldNumberFormulaLabel: 'Formula',
        formularyEditFieldOptionLabel: 'Opções',
        formularyEditFieldConnectionTemplateSelectorLabel: 'Qual o template?',
        formularyEditFieldConnectionFormularySelectorLabel: 'Com qual formulário você deseja conectar?',
        formularyEditFieldConnectionFieldSelectorLabel: 'Qual campo será usado como opção?',
        formularyEditFieldNoFieldTypeLabel: 'Selecione um tipo de campo',
        formularyEditFieldDisabledLabel: 'O campo está desativado',
        formularyEditSectionPlaceholderLabel: 'Insira o nome da seção',
        formularyEditSectionDisabledLabel: 'A seção está desativada',
        formularyEditAddNewSectionButtonLabel: 'Adicionar nova seção',
        formularyEditAddNewFieldButtonLabel: 'Adicionar novo campo',
        formularyEditFieldTrashIconPopover: 'Excluir',
        formularyEditFieldEyeIconPopover: 'Desativar',
        formularyEditFieldMoveIconPopover: 'Mover',
        formularyEditFieldIsEditingIconPopover: 'Editar',
        formularyEditFieldIsNotEditingIconPopover: 'Visualizar',
        listingHeaderEditLabel: 'Editar',
        listingHeaderDeleteLabel: 'Deletar',
        listingExtractButtonLabel: 'Extrair',
        listingExtractUpdateDateLabel: 'Data de atualização',
        listingExtractCSVButtonLabel: '.csv',
        listingExtractXLSXButtonLabel: '.xlsx',
        listingColumnSelectButtonLabel: 'Selecionar colunas exibidas',
        listingTotalTitleLabel:'Totais',
        listingTotalFormTitleLabel:'Construir card de totais',
        listingTotalFormFieldSelectLabel: 'Campo',
        listingTotalFormNumberFormatSelectLabel: 'Formatação',
        listingTotalFormCancelButtonLabel: 'Cancelar',
        listingTotalFormSaveButtonLabel: 'Salvar',
        kanbanCannotBuildMessage: 'Não é possivel visualizar os dados desse formulário em formato de kanban.',
        kanbanObligatorySettingIsClosedButtonLabel: 'Configurações obrigatórias',
        kanbanObligatorySettingIsOpenButtonLabel: 'Fechar configurações obrigatórias',
        kanbanConfigurationFormDimensionTitleLabel: 'Dimensão',
        kanbanConfigurationFormCardsIsOpenTitleLabel: 'Construir card',
        kanbanConfigurationFormCardsIsClosedTitleLabel: 'Cards',
        kanbanCardConfigurationFormCancelButtonLabel: 'Cancelar',
        kanbanCardConfigurationFormSaveButtonLabel: 'Salvar',
        kanbanConfigurationFormDimensionSelectPlaceholder: 'Selecione uma dimensão',
        kanbanConfigurationFormCardFieldSelectPlaceholderTitle: 'Selecione um titúlo',
        kanbanConfigurationFormCardFieldSelectPlaceholderField: 'Selecine um campo',
        kanbanLoadMoreButtonLabel: 'Carregar Mais',
        notificationButtonToConfigurationLabel: 'Configurações',
        notificationRecievedTitleLabel: 'Suas notificações',
        notificationConfigurationGoBackButtonLabel: '< Voltar',
        notificationConfigurationAddNewCardLabel: 'Adicione uma nova notificação',
        notificationConfigurationEmptyNameCardLabel: 'Insira um nome para a notificação',
        notificationConfigurationFormForCompanyLabel: 'Para toda a companhia',
        notificationConfigurationFormNotificationNameLabel: 'Nome da notificação',
        notificationConfigurationFormNotificationNameInputPlaceholder: 'Dê um nome à notificação',
        notificationConfigurationFormFormularySelectorLabel: 'Formulário',
        notificationConfigurationFormFieldSelectorLabel: 'O campo de data a ser considerado',
        notificationConfigurationFormTextLabel: 'Texto',
        notificationConfigurationFormTextPlaceholder: '',
        notificationConfigurationFormVariableSelectorLabel: 'Variável',
        notificationConfigurationFormDaysDiffLabel: 'Notificar',
        notificationConfigurationFormDaysDiffSameDaySelectOptionLabel: 'No mesmo dia',
        notificationConfigurationFormDaysDiffBeforeDaySelectOptionLabel: '{} dia antes',
        notificationConfigurationFormDaysDiffBeforeDaysSelectOptionLabel: '{} dias antes',
        notificationConfigurationFormDaysDiffAfterDaySelectOptionLabel: '{} dia depois',
        notificationConfigurationFormDaysDiffAfterDaysSelectOptionLabel: '{} dias depois',
        notificationConfigurationFormSaveButtonLabel: 'Salvar',
        notificationConfigurationFormInvalidVariableError: 'Certifique-se que a variável é um campo válido',
        notificationConfigurationFormFieldBlankError: 'O campo não pode ser vazio',
        notificationConfigurationFormFieldUnknownError: 'Aconteceu algum erro com esse campo',
        filterButtonLabel: 'Filtrar',
        filterFieldsDropdownButttonLabel: 'Filtrar por...',
        filterInputPlaceholder: 'Palavra-chave',
        filterSearchButtonLabel: 'Pesquisar',
        filterAddNewFilterButtonLabel: 'Adicionar outro filtro',
        formTypeSingle: 'Único',
        formTypeMultiple: 'Múltiplo',
        conditionalTypeEqual: 'Igual ao',
        fieldTypeNumber: 'Número',
        fieldTypeText: 'Texto',
        fieldTypeDate: 'Data',
        fieldTypeOption: 'Opção',
        fieldTypeForm: 'Conexão',
        fieldTypeAttachment: 'Anexo',
        fieldTypeLongText: 'Texto Longo',
        fieldTypeEmail: 'E-mail',
        fieldTypeMultiOption: 'Múltiplas Opções',
        fieldTypeId: 'Id',
        fieldTypeUser: 'Usuário',
        fieldTypePeriod: 'Período',
        numberFormatTypeNumber: 'Número',
        numberFormatTypeCurrency: 'Monetário',
        numberFormatTypePercentage: 'Porcentagem',
        dataTypeKanban: 'Kanban',
        dataTypeListing: 'Listagem'
    }
}

export default strings