import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { strings } from '../../utils/constants'
import Styled from './styles'

/**
 * This component contains the user selected columns button login, the button can be found
 * on the top right of the table in the Listing page.
 * This component renders the button and the options it display, it also contains the logic when the user
 * selects or unselect a column.
 * 
 * @param {Array} fieldHeaders - list containing primarly all of the fields in the header. we use this array
 * to construct all of the field options he can select or unselect to show or don't show on the table.
 * @param {Function} onUpdateHeader - function to update Header data in the redux, this function does not fire
 * any request to the backend, it just updates the header state in the redux.
 * @param {Function} onUpdateSelected - function to make a request to the backend to save its state, this doesn't update
 * the state on the redux store. 
 */
const ListingColumnSelect = (props) => {
    const columnSelectButtonContainerRef = React.useRef()
    const [isOpen, setIsOpen] = useState(false)

    const onToggleSelect = (index) => {
        props.fieldHeaders[index].is_selected = !props.fieldHeaders[index].is_selected
        props.onUpdateHeader(props.fieldHeaders)
        props.onUpdateSelected(props.fieldHeaders, props.formName)
    }

    const onClickOutside = (e) => {
        if (process.env['APP'] === 'web') {
            if (columnSelectButtonContainerRef.current && !columnSelectButtonContainerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
    }

    useEffect(() => {
        if (process.env['APP'] === 'web') {
            document.addEventListener('mousedown', onClickOutside)
        }

        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener('mousedown', onClickOutside)
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <Styled.ListingColumnSelectContainer ref={columnSelectButtonContainerRef}>
                <Styled.ListingColumnSelectButton
                onClick={(e) => setIsOpen(!isOpen)}
                >
                    {strings['pt-br']['listingColumnSelectButtonLabel']}
                </Styled.ListingColumnSelectButton>
                <div style={{position: 'relative'}}>
                    {isOpen ? (
                        <Styled.ListingColumnSelectItemsContainer>
                            {props.fieldHeaders.map((fieldHeader, index) => (
                                <Styled.ListingColumnSelectItems
                                    onClick={e => onToggleSelect(index)}
                                    isSelected={fieldHeader.is_selected}
                                    key={index}
                                >
                                    {fieldHeader.field.label_name}
                                </Styled.ListingColumnSelectItems>
                            ))}
                        </Styled.ListingColumnSelectItemsContainer>
                    ) : ''}
                </div>
            </Styled.ListingColumnSelectContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default ListingColumnSelect;