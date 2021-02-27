
/**
 * I think it's kinda obvious but this object holds all of the strings in the system, this way it becomes
 * easier for us to internationalize.
 */
const strings = {
    'pt-br': {
        notificationBrowserPermissionAlertTitle: 'Alerta',
        notificationBrowserPermissionAlertMessage: 'Deseja receber notificações da plataforma Reflow?',
        notificationBrowserPermissionAlertOkButton: 'Aceito!',
        indexPageTitle: 'Reflow',
        permissionNotPermittedError: 'EI! Você não deveria ter acesso a isso! Se quiser acessar esse conteúdo peça para o administrador da sua empresa.',
        permissionInvalidBillingError: 'Parece que você não tem permissão para realizar essa ação, peça ao administrador para alterar as configurações de pagamento.',
        permissionFreeTrialEndedError: 'Como tudo na vida, seu período de testes chegou ao fim. Contate o administrador para alterar as informações de pagamento e continuar usando a Reflow.',
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
        onboardingPhoneLabel: 'Seu telefone ou celular',
        onboardingPhoneError: 'Digite um telefone valido',
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
        disabledFormLabel: 'A pagina está desativada',
        addNewFormButtonLabel: 'Adicionar nova página',
        sidebarEditTemplateButtonLabel: 'Editar templates',
        sidebarAddNewTemplateButtonLabel: 'Adicionar novo',
        sidebarDeleteFormularyAlertTitle: 'Atenção!',
        sidebarDeleteFormularyAlertContent: 'Você sabia que você pode simplesmente desativar a página clicando no icone de olho? Ao desativar, essa página fica impossível de ser acessada, porém seus dados permanecem intactos e você pode reativá-la a qualquer momento.',
        sidebarDeleteFormularyAlertAcceptButtonLabel: 'Excluir',
        sidebarDeleteGroupAlertTitle: 'Atenção!',
        sidebarDeleteGroupAlertContent: 'Você sabia que você pode simplesmente desativar o template clicando no icone de olho? Ao desativar, esse template fica impossível de ser acessado, porém seus dados permanecem intactos e você pode reativá-lo a qualquer momento.',
        sidebarDeleteGroupAlertAcceptButtonLabel: 'Excluir',
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
        headerFreeTrialAlertDaysLabel: ' dias restantes de avaliação gratuita. ',
        headerFreeTrialUpdateNowLabel: 'Atualize agora',
        headerRefferalLabel: 'Indicar usuários',
        headerTemplateLabel: 'Templates',
        headerCompanyLabel: 'Empresa',
        headerChangeDataLabel: 'Alterar Dados',
        headerBillingLabel: 'Pagamento',
        headerUsersLabel: 'Usuários',
        headerNotificationLabel: 'Notificações',
        headerHelpLabel: 'Ajuda',
        headerLogoutLabel: 'Logout',
        headerHomePdfGeneratorTools: 'Gerador de PDF',
        formularySaveButtonLabel: 'Salvar',
        formularyDuplicateButtonLabel: 'Duplicar',
        formularyEditButtonLabel: 'Editar campos',
        formularyEditButtonDescription: 'Clique aqui para editar o formulário dessa página',
        formularyFinishEditButtonLabel: 'Salvar e voltar',
        formularyFinishEditButtonDescription: 'Clique aqui para finalizar a edição do formulário dessa página',
        formularyOpenButtonLabel: 'Adicionar',
        formularyLoadingButtonLabel: 'Carregando...',
        formularyMultiFormAddButtonLabel: 'Adicionar',
        formularyFieldIdEmptyLabel: 'Esse valor é gerado automaticamente',
        formularyFieldAttachmentDefaultLabel: 'Clique para buscar ou arraste arquivos aqui',
        formularyFieldAttachmentDropTheFilesLabel: 'Solte os arquivos aqui',
        formularyFieldAttachmentAlertTitle: 'Alerta',
        formularyFieldAttachmentAlertContent: 'Você já adicionou esse arquivo.',
        formularyRequiredFieldError: 'Este campo é obrigatório',
        formularyCouldNotUploadFieldError: 'Não conseguimos fazer o upload de um dos arquivos, tente novamente mais tarde',
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
        formularyEditFieldConnectionFormularySelectorLabel: 'Com qual página você deseja conectar?',
        formularyEditFieldConnectionFieldSelectorLabel: 'Qual campo será usado como opção?',
        formularyEditFieldNoFieldTypeLabel: 'Selecione um tipo de campo',
        formularyEditFieldHiddenFieldLabel: 'O campo está escondido',
        formularyEditFieldDisabledLabel: 'O campo está desativado',
        formularyEditSectionPlaceholderLabel: 'Insira o nome da seção',
        formularyEditSectionDisabledLabel: 'A seção está desativada',
        formularyEditAddNewSectionButtonLabel: 'Adicionar nova seção',
        formularyEditAddNewFieldButtonLabel: 'Adicionar novo campo',
        formularyEditSectionTrashIconPopover: 'Excluir',
        formularyEditRemoveSectionAlertTitle: 'Atenção!',
        formularuEditRemoveSectionAlertContent: 'Você sabia que você pode simplesmente desativar a seção clicando no icone de olho? Ao desativar, essa seção não aparece no formulário ao editá-lo, porém seus dados permanecem visiveis nas telas de gestão como Listagem, Kanban, entre outros. E você pode reativá-la a qualquer momento.',
        formularuEditRemoveSectionAlertAcceptButtonLabel: 'Excluir',
        formularyEditSectionEyeIconPopover: 'Desativar',
        formularyEditSectionMoveIconPopover: 'Mover',
        formularyEditSectionIsEditingIconPopover: 'Editar',
        formularyEditFieldTrashIconPopover: 'Excluir',
        formularyEditRemoveFieldAlertTitle: 'Atenção!',
        formularuEditRemoveFieldAlertContent: 'Você sabia que você pode simplesmente desativar o campo clicando no icone de olho? Ao desativar, esse campo não aparece no formulário ao editá-lo, porém seus dados permanecem visiveis nas telas de gestão como Listagem, Kanban, entre outros. E você pode reativá-lo a qualquer momento.',
        formularuEditRemoveFieldAlertAcceptButtonLabel: 'Excluir',
        formularyEditFieldEyeIconPopover: 'Desativar',
        formularyEditFieldMoveIconPopover: 'Mover',
        formularyEditFieldIsEditingIconPopover: 'Editar',
        formularyEditFieldIsNotEditingIconPopover: 'Visualizar',
        listingHeaderEditLabel: 'Editar',
        listingHeaderDeleteLabel: 'Deletar',
        listingDeleteAlertTitle: 'Alerta',
        listingDeleteAlertContent: 'Você tem certeza que deseja apagar esse dado? Você não pode voltar atrás.',
        listingDeleteAlertAcceptButtonLabel: 'Apagar',
        listingExtractButtonLabel: 'Extrair',
        listingExtractUpdateDateLabel: 'Data de atualização',
        listingExtractCSVButtonLabel: '.csv',
        listingExtractXLSXButtonLabel: '.xlsx',
        listingExtractTimeoutError: 'Não foi possível extrair os dados selecionados. Tente colocar um período menor na Data de Atualização',
        listingColumnSelectButtonLabel: 'Selecionar colunas exibidas',
        listingTotalTitleLabel:'Totais',
        listingTotalFormTitleLabel:'Construir card de totais',
        listingTotalFormFieldSelectLabel: 'Campo',
        listingTotalFormNumberFormatSelectLabel: 'Formatação',
        listingTotalFormCancelButtonLabel: 'Cancelar',
        listingTotalFormSaveButtonLabel: 'Salvar',
        kanbanRemoveDimensionAlertTitle: 'Atenção',
        kanbanRemoveDimensionAlertContent: 'Se houver cards nesta coluna é preciso movê-los para outra, caso isso não seja feito, os dados desta coluna aparecerão apenas na visualização de Listagem.',
        kanbanRemoveDimensionAlertAcceptButton: 'Entendi',
        kanbanEditPhaseNameInputPlaceholder: 'Nome da fase',
        kanbanNewPhaseDefaultText: 'Nova fase',
        kanbanOverlayCollapseDimensionShowColumnText: 'Mostrar coluna',
        kanbanOverlayCollapseDimensionHideColumnText: 'Ocultar coluna',
        kanbanOverlayDimensionPhaseEditButtonText: 'Editar coluna',
        kanbanOverlayDimensionPhaseConfirmEditionButtonText: 'Confirmar alterações',
        kanbanOverlayDimensionPhaseMoveButtonText: 'Mover coluna',

        kanbanCannotBuildMessage: 'Não é possivel visualizar os dados dessa página em formato de kanban. O formulário da página deve conter campos de opção.',
        kanbanObligatorySettingIsClosedButtonLabel: 'Configurações obrigatórias',
        kanbanObligatorySettingIsOpenButtonLabel: 'Fechar configurações obrigatórias',
        kanbanConfigurationFormDimensionTitleLabel: 'Dimensão',
        kanbanConfigurationFormCardsIsOpenTitleLabel: 'Construir card',
        kanbanConfigurationFormCardsIsClosedTitleLabel: 'Cards',
        kanbanConfigurationFormDeleteCardAlertTitle: 'Cuidado',
        kanbanConfigurationFormDeleteCardAlertContent: 'Ao realizar essa ação você não poderá desfazê-la. Deseja continuar?',
        kanbanConfigurationFormDeleteCardAlertAcceptButton: 'Continuar',
        kanbanCardConfigurationFormCancelButtonLabel: 'Cancelar',
        kanbanCardConfigurationFormSaveButtonLabel: 'Salvar',
        kanbanConfigurationFormDimensionSelectPlaceholder: 'Selecione uma dimensão',
        kanbanConfigurationFormCardFieldSelectPlaceholderTitle: 'Selecione um titúlo',
        kanbanConfigurationFormCardFieldSelectPlaceholderField: 'Selecine um campo',
        kanbanWaitingForDataInKanbanDimensionPhase: 'Aguarde enquanto seus dados são carregados.',
        kanbanLoadMoreButtonLabel: 'Carregar Mais',
        notificationButtonToConfigurationLabel: 'Configurações',
        notificationPullToRefreshLabel: 'Puxe para baixo carregar as notificações',
        notificationRecievedTitleLabel: 'Suas notificações',
        notificationConfigurationGoBackButtonLabel: '< Voltar',
        notificationConfigurationAddNewCardLabel: 'Adicione uma nova notificação',
        notificationConfigurationRemoveAlertTitle: 'Alerta',
        notificationConfigurationRemoveAlertContent: 'Você tem certeza que deseja remover essa notificação?',
        notificationConfigurationRemoveAlertAcceptButtonLabel: 'Sim',
        notificationConfigurationEmptyNameCardLabel: 'Insira um nome para a notificação',
        notificationConfigurationFormForCompanyLabel: 'Para toda companhia',
        notificationConfigurationFormForCompanyExplanation: 'Ao selecionar essa opção, as notificações serão geradas não só para você, mas também para cada usuário da empresa. Só você poderá editá-la.',
        notificationConfigurationFormNotificationNameLabel: 'Nome da notificação',
        notificationConfigurationFormNotificationNameInputPlaceholder: 'Dê um nome à notificação',
        notificationConfigurationFormFormularySelectorLabel: 'Página',
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
        dashboardConfigurationDeleteChartAlertTitle: 'Cuidado',
        dashboardConfigurationDeleteChartAlertContent: 'Ao apagar esse gráfico, você não poderá recuperá-lo. Deseja continuar?',
        dashboardConfigurationDeleteChartAlertAcceptButton: 'Continuar',
        dashboardConfigurationFormGoBackButtonLabel: 'Voltar',
        dashboardConfigurationFormForCompanyLabel: 'Para toda companhia',
        dashboardConfigurationFormForCompanyExplanation: 'Ao selecionar essa opção, todos os usuários com acesso a essa página, verão esse gráfico. Só você poderá editá-lo.',
        dashboardConfigurationFormChartNameLabel: 'Nome',
        dashboardConfigurationFormChartTypeSelectorLabel: 'Tipo de gráfico',
        dashboardConfigurationFormFieldLabelSelectorLabel: 'Campo de legenda',
        dashboardConfigurationFormFieldValueSelectorLabel: 'Campo de valor',
        dashboardConfigurationFormAggregationTypeSelectorLabel: 'Tipo de agregação',
        dashboardConfigurationFormNumberFormatSelectorLabel: 'Formatação de número',
        dashboardConfigurationFormPreviewTitleLabel: 'Preview',
        dashboardConfigurationFormSaveButtonLabel: 'Salvar',
        companyConfigurationFormularyLogoFieldLabel: 'Logo da Empresa',
        companyConfigurationFormularyLogoHelperFieldLabel: 'Clique para inserir uma imagem',
        companyConfigurationFormularyNameFieldLabel: 'Nome da empresa',
        companyConfigurationFormularyInvalidNameError: 'O nome da companhia não é válido',
        companyConfigurationFormularySaveButtonLabel: 'Salvar',
        userConfigurationTableNameColumnHeaderLabel: 'Nome',
        userConfigurationTableEmailColumnHeaderLabel: 'E-mail',
        userConfigurationTableProfileColumnHeaderLabel: 'Perfil',
        userConfigurationTableEditColumnHeaderLabel: 'Editar',
        userConfigurationTableDeleteColumnHeaderLabel: 'Deletar',
        userConfigurationDeleteUserAlertTitle: 'Atenção',
        userConfigurationDeleteUserAlertContent: 'Esse usuário será excluido, as informações que ele adicionou no sistema serão preservadas porém Notificações e Gráficos no Dashboard serão excluidos.',
        userConfigurationDeleteUserAlertAcceptButton: 'Continuar',
        userConfigurationAddNewUserButtonLabel: 'Adicionar novo usuário',
        userConfigurationFormularyGoBackButton: 'Voltar',
        userConfigurationFormularyInvalidEmailError: 'Verifique se esse e-mail é um e-mail válido',
        userConfigurationFormularyUniqueEmailError: 'O e-mail precisa ser único no nosso sistema. Parece que algum usuário ja está utilizando esse e-mail.',
        userConfigurationFormularyInvalidNameError: 'O nome precisa ser completo',
        userConfigurationFormularyInvalidProfileError: 'O perfil selecionado não é válido',
        userConfigurationCannotEditItselfError: 'Você não pode editar si mesmo',
        userConfigurationPaymentGatewayError: 'Parece que suas informações de pagamento estão inconsistentes. Verifique as seguintes informações de pagamento antes de continuar: Endereço e Dados de pagamento',
        userConfigurationFormularyNameLabel: 'Nome',
        userConfigurationFormularyEmailLabel: 'Email',
        userConfigurationFormularyProfileLabel: 'Perfil',
        userConfigurationFormularyPermissionTemplateSelectLabel: 'Quais templates esse usuário deve ter acesso?',
        userConfigurationFormularyPermissionPageSelectLabel: 'Quais páginas o usuário deve ter acesso?',
        userConfigurationFormularyPermissionOptionSelectLabel: 'Selecione as opções que o usuário pode acessar',
        userConfigurationFormularySaveButtonLabel: 'Salvar',
        userConfigurationFormularyDuplicateButtonLabel: 'Duplicar',
        billingExpandableCardCompanyConfigurationLabel: 'Endereço de cobrança',
        billingExpandableCardChargeConfigurationLabel: 'Detalhes da compra',
        billingExpandableCardPaymentConfigurationLabel: 'Configurações de Pagamento',
        billingExpandableCardErrorMessage: 'Ops! Tem um errinho aqui. ',
        billingExpandableCardErrorMessageIfFormClosed: 'Clique para editar.',
        billingSaveButtonLabel: 'Salvar',
        billingChargeTableHeaderQuantityLabel: 'Quantidade',
        billingChargeTableHeaderDescriptionLabel: 'Descrição',
        billingChargeTableHeaderValueLabel: 'Valor',
        billingChargeDiscountLabel: 'Você tem {} em cupons de desconto',
        billingChargeTotalHeaderLabel: 'Total',
        billingChargePerGbAdditionalInformation: 'Esse valor é relativo a toda a companhia. Portanto independente do número de usuários ou páginas.',
        billingChargePerChartUserAdditionalInformation: `Essa é a quantidade de gráficos que cada usuário da sua companhia pode criar por página.\n\nEsse valor não inclui gráficos com a opção PARA TODA A COMPANHIA setada.\n\nEsse valor varia em relação à quantidade de usuários.`,
        billingChargePerPDFDownloadAdditionalInformation: `Esse número é o tanto de templates PDF que sua empresa inteira pode baixar. \n\nTodos usuários podem criar quantos templates forem necessários, porém só podem realizar o download de um certo numero de templates.`,
        billingChargePerChartCompanyAdditionalInformation: `Esse valor inclui APENAS gráficos COMPARTILHADOS entre todos os usuários do sistema.\n\nEsse valor inclui APENAS gráficos com a opção PARA TODA A COMPANHIA setada.\n\nEsse valor varia em relação à quantidade de usuários.`,
        billingPaymentFormBillingDateTitleLabel: 'Data de cobrança',
        billingPaymentFormInvoiceEmailsTitleLabel: 'E-mail de cobrança',
        billingPaymentFormAddAnotherEmailButtonLabel: 'Adicionar outro e-mail',
        billingPaymentFormPaymentDataTitleLabel: 'Dados de pagamento',
        billingPaymentFormCreditCardNumberFieldLabel: 'Número do cartão',
        billingPaymentFormCreditCardValidDateFieldLabel: 'Validade',
        billingPaymentFormCreditCardCVVFieldLabel: 'CVV',
        billingPaymentFormCreditCardHolderNameFieldLabel: 'Nome do titular',
        billingPaymentFormCreditCardErrorMessageLabel: 'Valor inválido',
        billingPaymentFormMaximumOrNoneInvoiceEmailNumberErrorMessageLabel: 'Aceitamos no máximo 3 e-mails e no mínimo 1 e-mail de cobrança',
        billingPaymentFormInvoiceMessage: 'A Reflow realiza uma cobrança mensal pelo uso da plataforma. \n A cobrança será contabilizada no dia selecinado. O prazo de pagamento é 3 dias após o envio de boleto. O boleto será enviado nos e-mails de cobrança definidos, todo mês.',
        billingCompanyFormularyCNPJAndCPFFieldLabel: 'CNPJ/CPF',
        billingCompanyFormularyAddressSectionTitleLabel: 'Endereço',
        billingCompanyFormularyStreetFieldLabel: 'Nome da rua',
        billingCompanyFormularyNeighborhoodFieldLabel: 'Bairro',
        billingCompanyFormularyNumberFieldLabel: 'Número',
        billingCompanyFormularyAdditionalInformationFieldLabel: 'Complemento',
        billingCompanyFormularyZipCodeFieldLabel: 'CEP',
        billingCompanyFormularyStateFieldLabel: 'Estado',
        billingCompanyFormularyCityFieldLabel: 'Cidade',
        richTextImageBlockButtonLabel: 'Clique para inserir uma imagem',
        richTextImageBlockSelectImagesButtonLabel: 'Selecionar arquivo',
        richTextImageBlockSelectFileTypeButtonLabel: 'Arquivo',
        richTextImageBlockSelectLinkTypeButtonLabel: 'Link',
        richTextImageBlockSelectLinkTypePlaceholder: 'Exemplo: https://i.imgur.com/4AiXzf8.jpeg',
        richTextTableVerticalEdgeOverlayExplanationLabel: 'Clique para adicionar uma coluna ou remover a linha',
        richTextTableHorizontalEdgeOverlayExplanationLabel: 'Clique para adicionar uma linha ou remover a coluna',
        richTextTableToolbarAddRowButtonLabel: 'Adicionar Linha',
        richTextTableToolbarRemoveRowButtonLabel: 'Remover Linha',
        richTextTableToolbarAddColumnButtonLabel: 'Adicionar Coluna',
        richTextTableToolbarRemoveColumnButtonLabel: 'Remover Coluna',
        richTextTextBlockPlaceholder: "Digite '/' para acessar lista de blocos",
        richTextToolbarDuplicateBlockButtonOverlay: 'Duplicar',
        richTextToolbarDeleteBlockButtonOverlay: 'Excluir',
        pdfGeneratorOnRemoveTemplateAlertTitle: 'Atenção!',
        pdfGeneratorOnRemoveTemplateAlertMessage: 'Ao continuar a ação não poderá ser desfeita. Tem certeza que deseja continuar?',
        pdfGeneratorOnRemoveTemplateAlertAcceptButtonLabel: 'Continuar',
        pdfGeneratorOnSubmitErrorMessage: 'Aconteceu um problema inesperado, entre em contato com nosso suporte', 
        pdfGeneratorCreatorGoBackButtonLabel: 'Voltar para gestão',
        pdfGeneratorLoadMoreButtonLabel: 'Carregar mais',
        pdfGeneratorCreatorCreateNewButtonLabel: 'Criar Novo',
        pdfGeneratorEditorSaveButtonLabel: 'Salvar',
        pdfGeneratorEditorRichTextInitialText: 'Escreva aqui',
        pdfGeneratorEditorCancelButtonLabel: 'Cancelar',
        pdfGeneratorEditorNewTemplateTitle: 'Novo Template',
        pdfGeneratorReaderGoBackButtonLabel: 'Voltar para gestão',
        pdfGeneratorReaderDownloaderMultipleFieldsSeparatorTitleLabel: 'Esse campo contém multiplos valores, como você deseja separá-los?',
        pdfGeneratorReaderDownloaderMultipleFieldsSeparatorPlaceholder: 'Ex: Separe por " - "',
        pdfGeneratorReaderDownloaderMultipleFieldsSeparatorButtonLabel: 'Ok',
        pdfGeneratorReaderDownloaderGoBackButtonLabel: 'Voltar',
        pdfGeneratorReaderDownloaderDownloadButtonLabel: 'Baixar',
        pdfGeneratorDownloaderErrorMessage: 'A empresa chegou no limite de downloads de PDFs, fale com o administrador',
        templateConfigurationAddNewCardLabel: 'Adicionar Novo',
        templateConfigurationLoadMoreCardLabel: 'Carregar mais',
        templateConfigurationCardEmptyCardTitleLabel: 'Clique no lápis para editar',
        templateConfigurationCardRemoveTemplateAlertTitle: 'Tem certeza?',
        templateConfigurationCardRemoveTemplateAlertMessage: 'Ao excluir esse template, você não poderá recuperá-lo. Deseja continuar?',
        templateConfigurationCardRemoveTemplateAlertAcceptButton: 'Sim',
        templateConfigurationFormularyIsPublicTemplateExplanation: 'Templates públicos são templates compartilhados com a "comunidade", ou seja, todos os clientes e novos clientes da Reflow poderão visualizar o template.',
        templateConfigurationFormularyIsPublicFieldLabel: 'Esse template é publico?',
        templateConfigurationFormularyNameFieldLabel: 'Nome',
        templateConfigurationFormularyDescriptionFieldLabel: 'Descrição',
        templateConfigurationFormularyThemeTypeSelectorFieldLabel: 'A qual grupo esse template se refere?',
        templateConfigurationFormularyFormularySelectorFieldLabel: 'Quais páginas esse template irá conter?',
        templateConfigurationFormularyDependencyFromAlert: 'É dependência de: ',
        templateConfigurationFormularyAddFormulariesButtonLabel: 'Adicionar páginas',
        templateConfigurationFormularyFormulariesWrittenInStoneAlert: 'Você não pode editar as páginas do template, se você quiser editar ou adicionar alguma página você deve adicionar todas elas novamente.',
        templateConfigurationFormularyFormIdsShouldBeDefinedWhenCreatingError: 'Quando você está criando um template, ao menos uma página deve ser adicionada',
        templateConfigurationFormularySaveButtonLabel: 'Salvar',
        templateTypeSelectionTitleLabel: 'Seleção de templates',
        templateGoBackButtonLabel: 'Voltar',
        templateDescriptionTitleLabel: 'Descrição',
        templateUseButtonLabel: 'Usar',
        templateFormularyTitleLabel: 'Formulário da página',
        templatePreviewTitleLabel: 'Preview',
        filterButtonLabel: 'Filtrar',
        filterButtonLabelOneFilter: '1 filtro ativo',
        filterButtonLabelNFilters: '{} filtros ativos',
        filterFieldsDropdownButttonLabel: 'Filtrar por...',
        filterInputPlaceholder: 'Palavra-chave',
        filterSearchButtonLabel: 'Pesquisar',
        filterAddNewFilterButtonLabel: 'Adicionar outro filtro',
        alertCancelButtonLabel: 'Cancelar',
        alertOkButtonLabel: 'Ok',
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
        individualChargeValueTypePerUser: 'Usuários',
        individualChargeValueTypePerPDFDownload: 'Nº de downloads de templates PDF',
        individualChargeValueTypePerChartCompany: 'Gráficos no Dashboard para toda a empresa por página',
        individualChargeValueTypePerChartUser: 'Gráficos no Dashboard para cada usuário por página',
        profileTypeAdmin: 'Administrador',
        profileTypeCoordinator: 'Coordenador',
        profileTypeSimpleUser: 'Analista',
        blockTypeImage: 'Imagem',
        blockTypeText: 'Texto',
        blockTypeTable: 'Tabela',
        blockTypeList: 'Lista'
    }
}

export default strings