import React from 'react'
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
            isLoadingData: false
        }
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
        if (this.props.kanban.initial.default_dimension_field_id && this.props.kanban.initial.default_kanban_card_id) {
            if (this.source){
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
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

    setConfigurationIsOpen = (configurationIsOpen) => {
        this.setState(state=> {
            return {
                ...state,
                configurationIsOpen: configurationIsOpen
            }
        })
    }
    
    componentDidMount() {
        this.source = this.CancelToken.source()
        this.props.onRenderKanban(this.source, this.props.router.form)
        this.props.onGetCards(this.source, this.props.router.form).then()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.router.form !== this.props.router.form) { 
            if (this.source) {
                this.source.cancel()
            }
            this.source = this.CancelToken.source()
            this.props.onChangeDimensionOrdersState([])
            this.props.onRenderKanban(this.source, this.props.router.form)
            this.props.onGetCards(this.source, this.props.router.form)
        }
        if (this.props.formularySettingsHasBeenUpdated !== prevProps.formularySettingsHasBeenUpdated) {
            this.props.onRenderKanban(this.source, this.props.router.form)
        }
    }

    componentWillUnmount() {
        if (this.source) {
            this.source.cancel()
        }
    }
    
    render() {
        const selectedCard = (this.props.kanban.initial && this.props.kanban.cards) ? this.props.kanban.cards.filter(card => card.id === this.props.kanban.initial.default_kanban_card_id) : []

        return (
            <div>
                {this.props.kanban.initial.formName !== this.props.router.form ? '' : (
                    <div>
                        {!this.props.kanban.initial || !this.props.kanban.initial.dimension_fields || this.props.kanban.initial.dimension_fields.length === 0 ? (
                            <p>
                                {strings['pt-br']['kanbanCannotBuildMessage']}
                            </p>
                        ) : (
                            <div>
                                <Row>
                                    <Col>
                                        <KanbanConfigurationButton onClick={e=> {this.setConfigurationIsOpen(!this.state.configurationIsOpen)}}>
                                            {this.state.configurationIsOpen ? strings['pt-br']['kanbanObligatorySettingIsOpenButtonLabel'] :  strings['pt-br']['kanbanObligatorySettingIsClosedButtonLabel']}
                                        </KanbanConfigurationButton>
                                        {this.state.configurationIsOpen ? '' : (
                                            <Filter
                                            isLoading={this.state.isLoadingData}
                                            fields={(this.props.kanban.initial.fields) ? this.props.kanban.initial.fields.map(field=> ({ name: field.name, label: field.label_name, type: field.type })) : []}
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
                                        {this.state.configurationIsOpen ? (
                                            <KanbanConfigurationForm 
                                            formName={this.props.router.form}
                                            onRemoveCard={this.props.onRemoveCard}
                                            onChangeDefaultState={this.props.onChangeDefaultState}
                                            onCreateOrUpdateCard={this.props.onCreateOrUpdateCard}
                                            onChangeCardsState={this.props.onChangeCardsState}
                                            fields={this.props.kanban.initial.fields}
                                            dimensionFields={this.props.kanban.initial.dimension_fields}
                                            defaultKanbanCardId={this.props.kanban.initial.default_kanban_card_id}
                                            defaultDimensionId={this.props.kanban.initial.default_dimension_field_id}
                                            cards={this.props.kanban.cards}
                                            />
                                        ): (
                                            <KanbanTable
                                            formName={this.props.router.form}
                                            formularySettingsHasBeenUpdated={this.props.formularySettingsHasBeenUpdated}
                                            cancelToken={this.CancelToken}
                                            params={this.getParams()}
                                            dimensionOrders={this.props.kanban.dimension.order}
                                            dimensionsToShow={this.props.kanban.dimension.inScreenDimensions}
                                            onChangeDimensionsToShow={this.props.onChangeDimensionsToShow}
                                            defaultFormName={this.props.kanban.initial.formName}
                                            defaultDimensionId={this.props.kanban.initial.default_dimension_field_id}
                                            defaultKanbanCardId={this.props.kanban.initial.default_kanban_card_id}
                                            onGetDimensionOrders={this.props.onGetDimensionOrders}
                                            card={(selectedCard.length > 0) ? selectedCard[0] : null}
                                            data={this.props.kanban.data}
                                            onGetKanbanData={this.props.onGetKanbanData}
                                            onChangeKanbanData={this.props.onChangeKanbanData}
                                            setFormularyDefaultData={this.props.setFormularyDefaultData}
                                            setFormularyId={this.props.setFormularyId}
                                            onChangeDimensionOrdersState={this.props.onChangeDimensionOrdersState}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )

    }
}

export default connect(state => ({ filter: state.home.filter, kanban: state.home.kanban, types: state.login.types }), actions)(Kanban)