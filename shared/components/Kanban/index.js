import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import { connect } from 'react-redux'
import KanbanConfigurationForm from './KanbanConfigurationForm'
import KanbanTable from './KanbanTable'
import Filter from '../Filter'
import actions from '../../redux/actions'
import { strings } from '../../utils/constants'
import dynamicImport from '../../utils/dynamicImport'
import { 
    KanbanFilterIcon, 
    KanbanFilterHolder, 
    KanbanFilterContainer, 
    KanbanFilterButton, 
    KanbanConfigurationButton 
} from '../../styles/Kanban'

const Col = dynamicImport('react-bootstrap', 'Col')
const Row = dynamicImport('react-bootstrap', 'Row')

/**
 * This controls everything from the Kanban component, this component holds the Kanban table (with it's dimension and cards),
 * the kanban configuration form and also the filter, that is shared with other visualization types.
 * 
 * @param {Function} setFormularyId - the function to define the id of the form to render.
 * @param {Object} query - The object containing all of the parameters of the current url, you may find it
 * with the Router object in next.js
 * @param {Function} setFormularyDefaultData - the function to define a default data when the user changes 
 * the kanban card to a status with required field data. When the formulary data is loaded we change with this 
 * default data.
 * @param {Function} setSearch - this function is to set search data, the search data is shared between visualization
 * types, that's why we use this.
 * @param {Object} search - object that is used to share between search data between search data.
 */
class Kanban extends React.Component {
    constructor(props) {
        super(props)
        this.CancelToken = axios.CancelToken
        this.source = null
        this.state = {
            configurationIsOpen: false,
            isLoadingData: true
        }
    }
    
    setConfigurationIsOpen = (configurationIsOpen) => {
        this.setState(state=> {
            return {
                ...state,
                configurationIsOpen: configurationIsOpen
            }
        })
    }
    
    // If the data is being loaded by the visualization
    setIsLoadingData = (isLoading) => {
        this.setState(state => {
            return {
                ...state,
                isLoadingData: isLoading
            }
        })
    }

    getParams = () => {
        return {
            search_value: this.props.filter.search_value,
            search_field: this.props.filter.search_field,
            search_exact: this.props.filter.search_exact
        }
    }

    getNewDataFromUpdatedParams = async (params) => {
        if (this.props.kanban.initial.defaultDimensionField.id && this.props.kanban.initial.defaultKanbanCard.id) {
            return this.props.onGetKanbanData(this.source, params ,this.props.router.form)
        }
        return Promise.resolve(null)
    }

    onFilter = (searchInstances) => {
        this.setIsLoadingData(true)
        const searchParams = this.props.onSetSearch(searchInstances.map(
            searchInstance => ({
                searchField: searchInstance.field_name,
                searchValue: searchInstance.value,
            })
        ))

        this.getNewDataFromUpdatedParams({...searchParams}).then(__ => {
            this.setIsLoadingData(false)
        })
    }

    /**
     * Used when the user opens or closes the configuration of the kanban. notice that when we open the configuration formulary
     * we get the fields, and after getting the fields we set isLoading state to false so it means we are not retrieving data anymore. If you
     * don't do this we will never show to the user that the formulary he's in DOES NOT support building a kanban since it does not have and 
     * field of `option` type
     * 
     * @param {Boolaen} isOpen - true if the configuration formulary is open or false if not
     */
    onOpenOrCloseConfiguration = (isOpen) => {
        if (isOpen) {
            this.props.onGetCards(this.source, this.props.router.form)
            this.props.onGetKanbanFields(this.source, this.props.router.form).then(_ => {
                this.setIsLoadingData(false)
            })
        }
        this.setConfigurationIsOpen(isOpen)
    }
    
    /**
     * Loads the data needed for rendering the kanban.
     * Those are:
     *  - The defaults, the fields (used for filtering and to check if the kanban can be built or not),
     * and only this, the rest is handled by the children components. Mostly kanbanTable and KanbanDimension components.
     * for loading more data.
     * 
     * @param {Boolean} isChangingFormName - If the formname was changed we force to rerender the hole kanban again.
     */
    onGetKanbanInitialData = (isChangingFormName=false) => {
        if (isChangingFormName) {
            this.setConfigurationIsOpen(false)
            this.setIsLoadingData(true)
        }
        this.props.onGetKanbanDefaults(this.source, this.props.router.form).then(response => {

            const areDefaultsNotSet = (data) => {
                return data.kanban_card === null || data.kanban_dimension === null || data.kanban_card.id === null || data.kanban_dimension.id === null 
            } 
            if (response && response.status === 200 && areDefaultsNotSet(response.data.data)) {
                this.onOpenOrCloseConfiguration(true)
            } else {
                this.props.onGetKanbanFields(this.source, this.props.router.form)
                this.setIsLoadingData(false)
            }
        })
    }

    /**
     * Make checks if the kanban can be built for this formulary or not, if not we display a message for
     * the user, if it can but no default is defined we open directly in the KanbanConfigurationForm so the user
     * can quickly configure his kanban
     */
    doesKanbanCantBeBuilt = () => {
        return !this.state.isLoadingData &&
        this.props.kanban.initial.defaultKanbanCard.id === null && 
        this.props.kanban.initial.defaultDimensionField.id === null &&
        this.props.kanban.updateSettings.fieldsForDimension.length === 0
    }

    /**
     * Retrieves initial data and sets a cancel token so we can cancel requests on the fly
     */
    componentDidMount() {
        this.source = this.CancelToken.source()
        this.onGetKanbanInitialData()
    }

    /**
     * Handles if the user has changed a from a form to another or not.
     * 
     * @param {Object} prevProps - This is all of the previous props before the update.
     */
    componentDidUpdate(prevProps) {
        if (prevProps.router.form !== this.props.router.form) { 
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.props.onChangeDimensionPhases([])
            this.onGetKanbanInitialData(true)
        }
    }

    componentWillUnmount() {
        if (this.source) {
            this.source.cancel()
        }
    }
    
    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        const areDefaultsNotDefined = this.props.kanban.initial.defaultKanbanCard.id === null || this.props.kanban.initial.defaultDimensionField.id === null
        const isKanbanConfigurationFormOpen = (this.state.configurationIsOpen || areDefaultsNotDefined) && !this.state.isLoadingData
        
        return (
            <div>
                <div>
                    {this.doesKanbanCantBeBuilt() ? (
                        <p>
                            {strings['pt-br']['kanbanCannotBuildMessage']}
                        </p>
                    ) : (
                        <div>
                            <Row>
                                <Col>
                                    {!areDefaultsNotDefined ? (
                                        <KanbanConfigurationButton onClick={(e) => this.onOpenOrCloseConfiguration(!this.state.configurationIsOpen)}>
                                        {isKanbanConfigurationFormOpen ? strings['pt-br']['kanbanObligatorySettingIsOpenButtonLabel'] :  strings['pt-br']['kanbanObligatorySettingIsClosedButtonLabel']}
                                        </KanbanConfigurationButton>
                                    ) : ''}
                                    {isKanbanConfigurationFormOpen ? '' : (
                                        <Filter
                                        isLoading={this.state.isLoadingData}
                                        fields={(this.props.kanban.updateSettings.fieldsForCard) ? this.props.kanban.updateSettings.fieldsForCard.map(field=> ({ name: field.name, label: field.label_name, type: field.type_id })) : []}
                                        params={this.getParams()} 
                                        onFilter={this.onFilter}
                                        types={this.props.types}
                                        container={KanbanFilterHolder}
                                        filterButton={KanbanFilterButton}
                                        filterContainer={KanbanFilterContainer}
                                        filterButtonIcon={<KanbanFilterIcon icon="filter"/>}
                                        />
                                    )}
                                </Col>
                            </Row>
                            <Row style={{ margin: '10px -15px 0 -15px' }}>
                                <Col>
                                    {isKanbanConfigurationFormOpen ? (
                                        <KanbanConfigurationForm 
                                        source={this.source}
                                        onGetCards={this.props.onGetCards}
                                        formName={this.props.router.form}
                                        onRemoveCard={this.props.onRemoveCard}
                                        onChangeDefault={this.props.onChangeDefault}
                                        onCreateKanbanCard={this.props.onCreateKanbanCard}
                                        onUpdateKanbanCard={this.props.onUpdateKanbanCard}
                                        fields={this.props.kanban.updateSettings.fieldsForCard}
                                        dimensionFields={this.props.kanban.updateSettings.fieldsForDimension}
                                        defaultKanbanCard={this.props.kanban.initial.defaultKanbanCard}
                                        defaultDimension={this.props.kanban.initial.defaultDimensionField}
                                        cards={this.props.kanban.cards}
                                        />
                                    ): (
                                        <KanbanTable
                                        types={this.props.types}
                                        user={this.props.user}
                                        formName={this.props.router.form}
                                        formularySettingsHasBeenUpdated={this.props.formularySettingsHasBeenUpdated}
                                        cancelToken={this.CancelToken}
                                        params={this.getParams()}
                                        dimensionPhases={this.props.kanban.dimension.phases}
                                        dimensionsToShow={this.props.kanban.dimension.inScreenDimensions}
                                        onGetCollapsedDimensionPhases={this.props.onGetCollapsedDimensionPhases}
                                        onChangeDimensionsToShow={this.props.onChangeDimensionsToShow}
                                        defaultKanbanCard={this.props.kanban.initial.defaultKanbanCard}
                                        defaultDimension={this.props.kanban.initial.defaultDimensionField}                                        onGetDimensionPhases={this.props.onGetDimensionPhases}
                                        data={this.props.kanban.data}
                                        onGetKanbanData={this.props.onGetKanbanData}
                                        collapsedDimensions={this.props.kanban.dimension.collapsed}
                                        onCollapseDimension={this.props.onCollapseDimension}
                                        onMoveKanbanCardBetweenDimensions={this.props.onMoveKanbanCardBetweenDimensions}
                                        setFormularyDefaultData={this.props.setFormularyDefaultData}
                                        setFormularyId={this.props.setFormularyId}
                                        onChangeDimensionPhases={this.props.onChangeDimensionPhases}
                                        />
                                    )}
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    render() {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ filter: state.home.filter, kanban: state.home.kanban, types: state.login.types, user: state.login.user }), actions)(Kanban)