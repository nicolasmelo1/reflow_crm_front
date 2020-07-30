
/**
 * I think it's kinda obvious but this object holds all of the strings in the system, this way it becomes
 * easier for us to internationalize.
 */
const strings = {
    'pt-br': {
        indexPageTitle: 'Reflow',
        loginPageTitle: 'Login - Reflow',
        loginEmailLabel: 'E-mail',
        loginPassLabel: 'Senha',
        loginSubmitButtonLabel: 'Entrar',
        loginNoFormLoginError: 'Parece que a companhia não tem nenhum formulário cadastrado, contate o administrador para começar a usar a Reflow',
        loginUnknownLoginError: 'Parece que aconteceu um erro inesperado',
        loginIncorrectPassOrUserError: 'E-mail e/ou senha incorretos',
        loginRedefinePasswordButtonLabel: 'Esqueci minha senha',
        loginRedefinePasswordEmailSentSuccess: 'Enviamos um e-mail para {}',
        loginRedefinePasswordInvalidEmailFieldError: 'Insira um e-mail válido',
        loginOboardingButtonLabel: 'Cadastre-se',
        changePasswordPageTitle: 'Mudança de senha - Reflow',
        changePasswordTemporaryPasswordLabel: 'Senha temporária',
        changePasswordTemporaryPasswordError: 'Esse campo não pode ficar em branco',
        changePasswordNewPasswordLabel: 'Nova senha',
        changePasswordNewPasswordError: 'Esse campo não pode ficar em branco',
        changePasswordConfirmNewPasswordLabel: 'Confirmar nova senha',
        changePasswordConfirmNewPasswordError: 'As senhas não são iguais',
        changePasswordUnknownError: 'Solicite a redefinição de senha novamente no login',
        changePasswordIsNotVisiblePassword: 'Mostrar senhas',
        changePasswordIsVisiblePassword: 'Esconder senhas',
        changePasswordSubmitNewPasswordLabel: 'Salvar',
        onboardingPageTitle: 'Quero ser Reflow',
        onboardingNameAndLastNameLabel: 'Seu nome e sobrenome',
        onboardingNameAndLastNameError: 'Digite o nome completo',
        onboardingEmailLabel: 'Seu e-mail',
        onboardingEmailError: 'Digite um e-mail valido',
        onboardingConfirmEmailLabel: 'Confirme seu e-mail',
        onboardingConfirmEmailError: 'Os e-mails devem ser iguais',
        onboardingCompanyNameLabel: 'Qual o nome da sua empresa?',
        onboardingNoCompanyNameMessage: 'Se você não tiver uma empresa, pode deixar esse campo em branco.',
        onboardingFirstPartDeclarationLabel: 'Eu declaro que estou de acordo com os ',
        onboardingTermsOfUsageDeclarationLabel: 'Termos de uso',
        onboardingSecondPartDeclarationLabel: ' e ',
        onboardingPrivacyDeclarationLabel: 'Privacidade',
        onboardingThirdPartDeclarationLabel: ' da Reflow',
        onboardingLoginButtonLabel: 'Login',
        onboardingCOntinueButtonLabel: 'Continuar',
        onboardingPasswordLabel: 'Senha',
        onboardingConfirmPasswordLabel: 'Confirme sua senha',
        onboardingConfirmPasswordError: 'As senhas devem ser iguais',
        onboardingShowPasswordLabel: 'Visualizar senha',
        onboardingHidePasswordLabel: 'Esconder senha',
        onboardingGobackButtonLabel: 'Voltar',
        onboardingSubmitButtonLabel: 'Acessar a Reflow',
        onboardingExistingUserError: 'Parece que o usuário {} já existe, mude o e-mail e tente novamente.',
        onboardingUnknownError: 'Aconteceu um erro inesperado, recarregue a pagina, se o problema persistir chame o suporte.',
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
        headerUsersLabel: 'Usuários',
        headerNotificationLabel: 'Notificações',
        headerHelpLabel: 'Ajuda',
        headerLogoutLabel: 'Logout',
        formularySaveButtonLabel: 'Salvar',
        formularyDuplicateButtonLabel: 'Duplicar',
        formularyEditButtonLabel: 'Editar campos',
        formularyEditButtonDescription: 'Clique aqui para editar o formulário',
        formularyFinishEditButtonLabel: 'Salvar e voltar',
        formularyFinishEditButtonDescription: 'Clique aqui para finalizar a edição do formulário',
        formularyOpenButtonLabel: 'Adicionar',
        formularyLoadingButtonLabel: 'Carregando...',
        formularyMultiFormAddButtonLabel: 'Adicionar',
        formularyFieldAttachmentDefaultLabel: 'Clique para buscar',
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
        formularyEditFieldDatetimeTypeSelectorLabel: 'Data ou Data e hora?',
        formularyEditFieldDatetimeAutoCreateCheckboxLabel: 'Data automatica ao criar',
        formularyEditFieldDatetimeAutoUpdateCheckboxLabel: 'Data automatica ao editar',
        formularyEditFieldPeriodTypeSelectorLabel: 'Formatação de periodo',
        formularyEditFieldNumberTypeSelectorLabel: 'Formatação do número',
        formularyEditFieldNumberFormulaLabel: 'Formula',
        formularyEditFieldFormulaExplanationLabel: 'Referência',
        formularyEditFieldFormulaExplanationDescription1: ' - Utilize variáveis DESTE formulario usando a tag {{}}',
        formularyEditFieldFormulaExplanationDescription2: ' - Textos são representados entre ""',
        formularyEditFieldFormulaExplanationDescription3Initial: ' - Quando o campo fica com a borda ',
        formularyEditFieldFormulaExplanationDescription3Red: 'vermelha',
        formularyEditFieldFormulaExplanationDescription3End: ' significa que a formula não é válida',
        formularyEditFieldFormulaExplanationDescription4: '- Operações válidas: ^, +, *, %, /, -, <, <=, >=, >, =',
        formularyEditFieldOptionLabel: 'Opções',
        formularyEditFieldConnectionTemplateSelectorLabel: 'Qual o template?',
        formularyEditFieldConnectionFormularySelectorLabel: 'Com qual formulário você deseja conectar?',
        formularyEditFieldConnectionFieldSelectorLabel: 'Qual campo será usado como opção?',
        formularyEditFieldNoFieldTypeLabel: 'Selecione um tipo de campo',
        formularyEditFieldHiddenFieldLabel: 'O campo está escondido',
        formularyEditFieldDisabledLabel: 'O campo está desativado',
        formularyEditSectionPlaceholderLabel: 'Insira o nome da seção',
        formularyEditSectionDisabledLabel: 'A seção está desativada',
        formularyEditAddNewSectionButtonLabel: 'Adicionar nova seção',
        formularyEditAddNewFieldButtonLabel: 'Adicionar novo campo',
        formularyEditSectionTrashIconPopover: 'Excluir',
        formularyEditSectionEyeIconPopover: 'Desativar',
        formularyEditSectionMoveIconPopover: 'Mover',
        formularyEditSectionIsEditingIconPopover: 'Editar',
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
        notificationConfigurationFormForCompanyLabel: 'Para toda companhia',
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
        dashboardConfigurationAddNewCardLabel: 'Adicionar um novo gráfico',
        dashboardNoChartsMessageLabel: `Essa página ainda não possui nenhum gráfico. Crie clicando no botão de 'Configurações'.`,
        dashboardUpdateDatesLabel: 'Data de atualização',
        dashboardConfigurationButtonLabelClosed: 'Configurações',
        dashboardConfigurationButtonLabelOpen: 'Fechar Configurações',
        dashboardConfigurationCardEmptyTitleLabel: 'Clique no lápis para editar',
        dashboardConfigurationFormGoBackButtonLabel: 'Voltar',
        dashboardConfigurationFormForCompanyLabel: 'Para toda companhia',
        dashboardConfigurationFormChartNameLabel: 'Nome',
        dashboardConfigurationFormChartTypeSelectorLabel: 'Tipo de gráfico',
        dashboardConfigurationFormFieldLabelSelectorLabel: 'Campo de legenda',
        dashboardConfigurationFormFieldValueSelectorLabel: 'Campo de valor',
        dashboardConfigurationFormAggregationTypeSelectorLabel: 'Tipo de agregação',
        dashboardConfigurationFormNumberFormatSelectorLabel: 'Formatação de número',
        dashboardConfigurationFormPreviewTitleLabel: 'Preview',
        dashboardConfigurationFormSaveButtonLabel: 'Salvar',
        billingExpandableCardCompanyConfigurationLabel: 'Configuração de companhia',
        billingExpandableCardChargeConfigurationLabel: 'Detalhes da compra',
        billingExpandableCardPaymentConfigurationLabel: 'Configurações de Pagamento',
        billingSaveButtonLabel: 'Salvar',
        billingChargeTableHeaderQuantityLabel: 'Quantidade',
        billingChargeTableHeaderDescriptionLabel: 'Descrição',
        billingChargeTableHeaderValueLabel: 'Valor',
        billingPaymentFormBillingDateTitleLabel: 'Data de cobrança',
        billingPaymentFormInvoiceEmailsTitleLabel: 'E-mail de cobrança',
        billingPaymentFormAddAnotherEmailButtonLabel: 'Adicionar outro e-mail',
        billingPaymentFormPaymentDataTitleLabel: 'Dados de pagamento',
        billingPaymentFormCreditCardNumberFieldLabel: 'Número do cartão',
        billingPaymentFormCreditCardValidDateFieldLabel: 'Validade',
        billingPaymentFormCreditCardCVVFieldLabel: 'CVV',
        billingPaymentFormCreditCardHolderNameFieldLabel: 'Nome do titular',
        billingPaymentFormCreditCardErrorMessageLabel: 'Valor inválido',
        billingCompanyFormularyCNPJAndCPFFieldLabel: 'CNPJ/CPF',
        billingCompanyFormularyAddressSectionTitleLabel: 'Endereço',
        billingCompanyFormularyStreetFieldLabel: 'Nome da rua',
        billingCompanyFormularyNeighborhoodFieldLabel: 'Bairro',
        billingCompanyFormularyNumberFieldLabel: 'Número',
        billingCompanyFormularyAdditionalInformationFieldLabel: 'Complemento',
        billingCompanyFormularyZipCodeFieldLabel: 'CEP',
        billingCompanyFormularyStateFieldLabel: 'Estado',
        billingCompanyFormularyCityFieldLabel: 'Cidade',
        templateTypeSelectionTitleLabel: 'Seleção de templates',
        templateGoBackButtonLabel: 'Voltar',
        templateDescriptionTitleLabel: 'Descrição',
        templateUseButtonLabel: 'Usar',
        templateFormularyTitleLabel: 'Formulário',
        templatePreviewTitleLabel: 'Preview',
        filterButtonLabel: 'Filtrar',
        filterButtonLabelOneFilter: '1 filtro ativo',
        filterButtonLabelNFilters: '{} filtros ativos',
        filterFieldsDropdownButttonLabel: 'Filtrar por...',
        filterInputPlaceholder: 'Palavra-chave',
        filterSearchButtonLabel: 'Pesquisar',
        filterAddNewFilterButtonLabel: 'Adicionar outro filtro',
        groupTypeEmpty: 'Outros',
        groupTypeSales: 'Vendas',
        groupTypeDevelopment: 'T.I.',
        groupTypeHumanResources: 'Recursos Humanos',
        groupTypeDesign: 'Design',
        groupTypeMarketing: 'Marketing',
        groupTypeOperations: 'Operações',
        groupTypeProjects: 'Projetos',
        groupTypeFinance: 'Financeiro',
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
        periodFormatTypeSecond: 'Segundo',
        periodFormatTypeMinute: 'Minuto',
        periodFormatTypeHour: 'Hora',
        periodFormatTypeDay: 'Dia',
        periodFormatTypeWeek: 'Semana',
        periodFormatTypeMonth: 'Mês',
        periodFormatTypeSeconds: 'Segundos',
        periodFormatTypeMinutes: 'Minutos',
        periodFormatTypeHours: 'Horas',
        periodFormatTypeDays: 'Dias',
        periodFormatTypeWeeks: 'Semanas',
        periodFormatTypeMonths: 'Meses',
        dateFormatTypeDate: 'Data',
        dateFormatTypeDatetime: 'Data e Hora',
        numberFormatTypeNumber: 'Número',
        numberFormatTypeCurrency: 'Monetário',
        numberFormatTypePercentage: 'Porcentagem',
        dataTypeKanban: 'Kanban',
        dataTypeListing: 'Listagem',
        dataTypeDashboard: 'Dashboard',
        chartTypePie: 'Pizza',
        chartTypeLine: 'Linha',
        chartTypeBar: 'Barra',
        chartTypeCard: 'Card de Totais',
        aggregationTypeSum: 'Soma',
        aggregationTypeAvg: 'Média',
        aggregationTypePercent: 'Porcentagem',
        aggregationTypeMax: 'Máximo',
        aggregationTypeMin: 'Mínimo',
        aggregationTypeCount: 'Contagem',
        paymentMethodTypeCreditCard: 'Cartão de Crédito',
        paymentMethodTypeInvoice: 'Boleto',
        individualChargeValueTypePerGB: 'GBs de Armazenamento',
        individualChargeValueTypePerUser: 'Por usuário'
    }
}

export default strings