import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native'
import TemplateConfigurationCard from './TemplateConfigurationCard'
import { strings } from '../../utils/constants'
import {
    TemplatesConfigurationContainer,
    TemplatesConfigurationAddNewCard,
    TemplatesConfigurationAddNewText,
    TemplatesConfigurationAddNewIcon,
    TemplatesConfigurationCardsContainer,
    TemplatesConfigurationLoadMoreText,
    TemplatesConfigurationLoadMoreCard
} from '../../styles/Templates'

/**
 * This component render the template configuration page. It's important to notice that differently from most components
 * of this project, the TemplateSelect and the TemplateConfiguration are not rendered on the same page. The first
 * is a 'floating' component, that renders above the layout. The second one, the TemplateConfiguration is rendered
 * in the edit template page.
 * 
 * So this component is used for creating templates/themes. Themes can be public or private for each company, and they
 * are bound to a specific user only.
 * 
 * Themes are like a ctrl+c/ctrl+v of data from one table to another so most of the work occurs in the backend that copies
 * the user data and bounds it to a theme.
 * 
 * @param {Object} source - This is actually an axios source that holds a token, every request we make will have this source.
 * this way we can cancel a request if the user unmounts a company or on other ocasions.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff.
 * @param {Function} onGetTemplatesSettings - A redux action used for retrieving template settings data.
 * @param {Function} onGetTemplatesFormulariesOptionsSettings - A redux action for retrieving the formularies the user can select 
 * on the template creation.
 * @param {Function} onGetTempalatesDependsOnSettings - A redux action used for retriving the dependens on data. This data is an 
 * object that has the dependent formularies ids as keys (the formulary id that have `form` field_type) and the formularies ids
 * it depends on in an array.
 * @param {Object} templatesConfiguration - The template configuration data, it's important to understand that this object also holds
 * the pagination data. This way we can know the page the user currently is on and the maximum number of pages.
 * @param {Function} onChangeTemplateSettingsStateData - A redux action used for changing the redux state data only, we don't do any 
 * i/o operation here.
 * @param {Function} onCreateTemplateSettings - Redux action used for posting a new template configuration data to the backend.
 * @param {Function} onUpdateTemplateSettings - Redux action used for editing a new template configuration data on the backend.
 * @param {Function} onRemoveTemplateSettings - Redux action used for removing a template from the backend if it has an id and also
 * removing it from the templatesConfiguration data array from its index.
 */
const TemplateConfiguration = (props) => {
    const sourceRef = React.useRef(null)
    const templatesContainerRef = React.useRef()
    const [isContainerOverflown, setIsContainerOverflown] = useState(false)
    const [dependentForms,  setDependentForms] = useState({})
    const [formulariesOptions, setFormulariesOptions] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(false)

    /**
     * This function is a handy one for adding template configuration data to the templates array.
     * Since this is used to add new template data to the redux state. It mostly need to define the structure of each
     * object in the array.
     */
    const getNewTempalteConfigurationData = () => {
        return {
            id: null,
            display_name: '',
            theme_type: null,
            description: '',
            form_ids: [],
            is_public: false
        }
    }

    /** 
     * Really similar to `getNewTempalteConfigurationData` but this actually effectively adds new templates
     * to the redux state. We always add new templates in the first index of the array. This way even if 
     * we have a long list of templates the user can know he clicked the 'add new' template button because 
     * the new template appears right on the side of the button.
     */
    const onAddTemplateConfigurationData = () => {
        props.templatesConfiguration.data.splice(0, 0, getNewTempalteConfigurationData())
        props.onChangeTemplateSettingsStateData({...props.templatesConfiguration})
    }

    /**
     * This function is responsible for using two redux actions: `onCreateTemplateSettings` and `onUpdateTemplateSettings`
     * Those redux actions creates or updates the template settings in the backend, they effectively send the data.
     * 
     * What we do here is separate, if the data has an id defined, it needs to be updated, otherwise we need to create
     * the template configuration in the backend.
     * 
     * It's important to understand that this only make requests, we do not update the redux state on both of this functions.
     * 
     * @param {Object} data - The templateConfiguration data that needs to be created or updated.
     */
    const onCreateOrUpdateTemplateConfiguration = async (data) => {
        let response = null
        if (data.id === null) {
            response = await props.onCreateTemplateSettings(data)
        } else {
            response = await props.onUpdateTemplateSettings(data, data.id)
        }
        if (response && response.status === 200) {
            props.onGetTemplatesSettings(sourceRef.current)
        }
        return response
    }

    /**
     * Responsible for calling the redux action: `onRemoveTemplateSettings`.
     * This redux action does two things: if an id is defined on the object in the index you want to remove
     * then we send a delete request to the backend.
     * 
     * Otherwise we just remove the object from the redux array.
     * 
     * @param {BigInteger} index - The index of the element you want to delete in the templatesConfiguration.data array.
     */
    const onRemoveTemplateConfiguration = (index) => {
        return props.onRemoveTemplateSettings(index)
    }

    /**
     * This is just a simple function that changes a object at a given index in the templatesConfiguration.data array.
     * 
     * @param {BigInteger} index - index of the object you want to change
     * @param {Object} data - The new object to insert in the index.
     */
    const onChangeTemplateConfigurationData = (index, data) => {
        props.templatesConfiguration.data[index] = data
        props.onChangeTemplateSettingsStateData({...props.templatesConfiguration})
    }
    
    /**
     * This is used to get more data, data is appended to the existing data.
     * Since we can run this function on event handlers, using the state will not give us the latest updated state.
     * Because of this we need to use references to get the correct values. 
     */
    const onGetMoreData = () => {
        const page = props.templatesConfiguration.pagination.current + 1
        setIsLoadingData(true)
        props.onGetTemplatesSettings(sourceRef.current, page).then(_ => {
            setIsLoadingData(false)
        })
    }

    /**
     * Handles when the user scrolls to the bottom of the container. It retrieves new data when it reaches the bottom of the container.
     * Since on web, we use this inside an event handler, we will not get the updated states here. Because of this we need to use references.
     */
    const onScroll = (e) => {
        if (!isLoadingData && props.templatesConfiguration.pagination.current < props.templatesConfiguration.pagination.total) {
            let hasReachedBottom = false
            if (process.env['APP'] === 'web') {
                hasReachedBottom = templatesContainerRef.current.scrollTop >= (templatesContainerRef.current.scrollHeight - templatesContainerRef.current.offsetHeight)
            } else {
                hasReachedBottom = e.layoutMeasurement.height + e.contentOffset.y >= e.contentSize.height - 20
            }
            if (hasReachedBottom) {
                onGetMoreData()
            }
        }
    }

    useEffect(() => {
        // This is called when the component is mounted.
        // First we get the template settings, then we get the dependent formularies data
        // And lastly we get the formularies options, that the user can select in the template.
        sourceRef.current = props.cancelToken.source()
        setIsLoadingData(true)
        props.onGetTemplatesSettings(sourceRef.current).then(_ => {
            setIsLoadingData(false)
        })
        props.onGetTempalatesDependsOnSettings(sourceRef.current).then(response => {
            if (response && response.status === 200) {
                setDependentForms(response.data.data)
            }
        })
        props.onGetTemplatesFormulariesOptionsSettings(sourceRef.current).then(response=> {
            if (response && response.status === 200) {
                setFormulariesOptions(response.data.data.map(formularyOption => ({ value: formularyOption.id, label: formularyOption.label_name})))
            }
        })
        
        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        // This listens for the data, when it changes we run here. 
        // We define if the template container is overflown or not. We do this because on really large screens the scroll might not
        // appear to the user, because of this we show a button for him to load more data if needed. So is overflown just checks
        // wheater or not the scroll bar has been show to the user or not. The second part ONLY WORKS ON BROWSERS.
        if (process.env['APP'] === 'web') {
            // if the page is to big for the pagination and the scroll is not active we add a 'load more' button in the bottom of the kanban dimension column
            if (props.templatesConfiguration.data.length > 0 && props.templatesConfiguration.pagination.current < props.templatesConfiguration.pagination.total) {
                if (templatesContainerRef.current.scrollHeight > templatesContainerRef.current.clientHeight) {
                    setIsContainerOverflown(true)
                } else {
                    setIsContainerOverflown(false)
                }
            }
        }
    }, [props.templatesConfiguration.data])

    const renderMobile = () => {
        return (
            <TemplatesConfigurationContainer ref={templatesContainerRef}>
                <TemplatesConfigurationCardsContainer>
                    <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    data={[null].concat(props.templatesConfiguration.data)}
                    keyExtractor={(__, index) => index.toString()}
                    onScroll={(e) => onScroll(e.nativeEvent)}
                    renderItem={({ item, index, __ }) => {
                        return (item === null) ? (
                            <TemplatesConfigurationAddNewCard onPress={e=> onAddTemplateConfigurationData()}>
                                <TemplatesConfigurationAddNewIcon icon="plus-circle"/>
                                <TemplatesConfigurationAddNewText>
                                    {strings['pt-br']['templateConfigurationAddNewCardLabel']}
                                </TemplatesConfigurationAddNewText>
                            </TemplatesConfigurationAddNewCard>
                        ) : (
                            <TemplateConfigurationCard
                            types={props.types}
                            templateConfiguration={item}
                            dependentForms={dependentForms}
                            formulariesOptions={formulariesOptions}
                            onCreateOrUpdateTemplateConfiguration={onCreateOrUpdateTemplateConfiguration}
                            onRemoveTemplateConfiguration={() => onRemoveTemplateConfiguration(index-1)}
                            onChangeTemplateConfigurationData={(data) => onChangeTemplateConfigurationData(index-1, data)}
                            />
                        )
                    }}
                    />
                </TemplatesConfigurationCardsContainer>
            </TemplatesConfigurationContainer>
        )
    }

    const renderWeb = () => {
        return (
            <TemplatesConfigurationContainer ref={templatesContainerRef} onScroll={e=> onScroll(e)}>
                <TemplatesConfigurationCardsContainer>
                    <TemplatesConfigurationAddNewCard onClick={e=> onAddTemplateConfigurationData()}>
                        <TemplatesConfigurationAddNewIcon icon="plus-circle"/>
                        <TemplatesConfigurationAddNewText>
                            {strings['pt-br']['templateConfigurationAddNewCardLabel']}
                        </TemplatesConfigurationAddNewText>
                    </TemplatesConfigurationAddNewCard>
                    {props.templatesConfiguration.data.map((templateConfiguration, index) => (
                        <TemplateConfigurationCard
                        key={index}
                        types={props.types}
                        templateConfiguration={templateConfiguration}
                        dependentForms={dependentForms}
                        formulariesOptions={formulariesOptions}
                        onCreateOrUpdateTemplateConfiguration={onCreateOrUpdateTemplateConfiguration}
                        onRemoveTemplateConfiguration={() => onRemoveTemplateConfiguration(index)}
                        onChangeTemplateConfigurationData={(data) => onChangeTemplateConfigurationData(index, data)}
                        />
                    ))}
                    {props.templatesConfiguration.pagination && props.templatesConfiguration.pagination.current < props.templatesConfiguration.pagination.total && !isContainerOverflown ? (
                        <TemplatesConfigurationLoadMoreCard onClick={e=> {onGetMoreData()}}>
                            <TemplatesConfigurationLoadMoreText>
                                {strings['pt-br']['templateConfigurationLoadMoreCardLabel']}
                            </TemplatesConfigurationLoadMoreText>
                        </TemplatesConfigurationLoadMoreCard>
                    ): ''}
                </TemplatesConfigurationCardsContainer>
            </TemplatesConfigurationContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default TemplateConfiguration