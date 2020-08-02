import React, { useState, useEffect } from 'react'
import Utils from '../../../styles/Utils'
import Option from './Option'
import { SafeAreaView, Text, Keyboard, TouchableOpacity } from 'react-native';

/**
 * Custom select component used in our formulary, if you need to change something in the select, change this component.
 * You can send labels as components on this element, if you do this, please send a onFilter function that returns the options filtered
 * @param {Array<String>} initialValues - as the name of the variable says, the values already selected following the object format of the `data``
 * props
 * @param {Array<Object>} data - Array of objects. The objects must contain: `label` and `value` keys.
 * - `value`: must be a string
 * - `label`: can be a string or a react component, if you send a custom component, send don't forget to add the component as the `label` 
 * props and a `onFilter` function
 * @param {Function} onChange - a onChange function to be called when the user changes the value
 * @param {Boolean} isOpen - (optional) - state to show if the options are opened or closed, this way you can style this outside of the component.
 * @param {Function} setIsOpen = (optional) - set isOpenState to true so you know outside of this component that this is on an open state
 * @param {Boolean} fixedHeight - (optional) - As default the height of the items never pass the bottom of the page, this means that
 * when you open the select, the height of the select automatically adjusts itself so it never pass the bottom of the viewport. Setting this
 * to true stick the size of the options container to a default maximum height. This is usually useful if the select is inside an overflow 
 * container.
 * @param {string} searchValueColor - (optional) - set color to search value, that the user types to search
 * @param {String} optionColor - (optional) - default to #f2f2f2
 * @param {String} optionBackgroundColor - (optional) - default to #17242D
 * @param {String} optionDividerColor - (optional) - default to #fff
 * @param {String} optionOnHoverColor - (optional) - default to #17242D
 * @param {String} optionOnHoverBackgroundColor - (optional) - default to #bfbfbf
 * @param {React.Component} label - (optional) - Instead of a simple text, display a custom label, if you do this, please define a onFilter
 * function
 * @param {Function} onFilter - (optional) - Defines a custom on filter function that recieves a string, and MUST return the Array of 
 * objects filtered
 * @param {Boolean} multiple - (optional) use this to inform if you want multiple objects to be selected.
 */

const Select = (props) => {
    let isOpen = props.isOpen
    let _setIsOpen = props.setIsOpen
    const [selectedOptions, setSelectedOptions] = useState([])
    const [maximumHeight, _setMaximumHeight] = useState(null)

    if (props.isOpen === undefined && props.setIsOpen === undefined) {
        [isOpen, _setIsOpen] = useState(false)
    }
    const [searchValue, setSearchValue] = useState('')
    const [options, setOptions] = useState(props.options)
    const inputRef = React.useRef(null)
    const selectOptionsContainerRef = React.useRef(null)
    const selectRef = React.useRef()
    const selectedItemColors = ['#98A0A6']
    //const selectedItemColors = ['#0dbf7e', '#0BAB71', '#0A9864', '#098558', '#07724B']
    
    // this is for always be inside the container height and not overflow
    // with this the content overflow and we have a scrollbar.
    const maximumHeightRef = React.useRef(maximumHeight)
    const setMaximumHeight = () => {
        if (process.env['APP'] === 'web' && selectOptionsContainerRef.current && !props.fixedHeight) {
            const selectHeightIsBiggerThanViewport = selectOptionsContainerRef.current.getBoundingClientRect().bottom > (window.innerHeight || document.documentElement.clientHeight)
            const selectHeightToFitViewport = selectOptionsContainerRef.current.getBoundingClientRect().height - selectOptionsContainerRef.current.getBoundingClientRect().bottom + (window.innerHeight || selectOptionsContainerRef.current.clientHeight)
            if (selectHeightIsBiggerThanViewport) {
                maximumHeightRef.current = selectHeightToFitViewport
                _setMaximumHeight(maximumHeightRef.current)
            } else if (maximumHeightRef.current !== null && maximumHeightRef.current !== selectHeightToFitViewport) {
                maximumHeightRef.current = null
                _setMaximumHeight(maximumHeightRef.current)
            }
        }
    }


    // creating a ref to the state is the only way we can get the state changes in the eventHandler function,
    // so we can use it for the mousedown eventListenet function
    // NOTE: THIS IS ONLY FOR CLASS BASED COMPONENTS THAT USE HOOKS, class based might
    // work normally
    const setIsOpenRef = React.useRef(isOpen)
    const setIsOpen = data => {
        setIsOpenRef.current = data
        _setIsOpen(data)
        defineHeight()
    }

    const updateOptions = (value, selectedOptions) => {
        let filteredOptions = props.options.filter(option=> selectedOptions.find(selectedOption=> selectedOption.value === option.value) === undefined);
        if (value !== '') {
            if (props.onFilter) {
                filteredOptions = props.onFilter(value)
            } else {
                filteredOptions = filteredOptions.filter(option=> option.label.toLowerCase().includes(value.toLowerCase()))
            }
        }
        setSearchValue(value)
        setOptions(filteredOptions)
    }

    const onSelectClick = (e) => {
        if (e) e.stopPropagation()
        if (process.env['APP'] === 'web') {
            if (selectRef.current && selectRef.current.contains(e.target)) {
                setIsOpen(true)
            } else if (setIsOpenRef.current) {
                setIsOpen(false)
                onClickSelectedOption()
            }
        } else {
            setIsOpen(true)
        }
    }

    const onSelectOption = (e, option) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.multiple || selectedOptions.length===0) {
            selectedOptions.push({value: option.value, label: option.label, selected: false, color: selectedItemColors[Math.floor(Math.random() * selectedItemColors.length)]})
        } else {
            selectedOptions[0] = {value: option.value, label: option.label, selected: false, color: selectedItemColors[Math.floor(Math.random() * selectedItemColors.length)]}
        }
        setSelectedOptions([...selectedOptions])
        props.onChange(selectedOptions.map(selectedOption=> selectedOption.value))
        updateOptions('', [...selectedOptions])
        setIsOpen(false)
    }

    const onClickSelectedOption = (e, index) => {
        inputRef.current.focus()
        if (e !== undefined){
            e.preventDefault();
            e.stopPropagation();
        }
        const newSelectedOptions = selectedOptions.map((selectedOption, selectedOptionIndex)=>{
            selectedOption.selected = (index === selectedOptionIndex) ? true : false
            return selectedOption
        })
        setSelectedOptions(newSelectedOptions)
    }

    const onClickToRemove = (index) => {
        let newSelectedOptions = JSON.parse(JSON.stringify(selectedOptions))
        newSelectedOptions.splice(index, 1)
        props.onChange(newSelectedOptions.map(selectedOption=> selectedOption.value))
        setSelectedOptions([...newSelectedOptions])
        updateOptions('', [...newSelectedOptions])
    }

    const onRemoveSelectedOption = (e) => {
        const keyCode = process.env['APP'] === 'web' ? e.keyCode : e.nativeEvent.key
        if ([46, 8, 'Backspace'].includes(keyCode) && searchValue === ''){
            let newSelectedOptions = selectedOptions
            if (selectedOptions.find(selectedOption=> selectedOption.selected === true)) {
                newSelectedOptions = selectedOptions.filter(selectedOption=>{
                    return selectedOption.selected === false
                })
                props.onChange(newSelectedOptions.map(selectedOption=> selectedOption.value))
            } else {
                if(newSelectedOptions[newSelectedOptions.length-1]) newSelectedOptions[newSelectedOptions.length-1].selected = true
            }
            setSelectedOptions([...newSelectedOptions])
            updateOptions('', [...newSelectedOptions])
        }
    }

    const renderLabel = (label, index) => {
        if (typeof label === 'string') {
            return label
        } else if (props.label) {
            const CustomLabelComponent = props.label
            return (<CustomLabelComponent key={index} {...label.props}/>)
        } else {
            const CustomLabelComponent = label
            return (<CustomLabelComponent key={index} {...CustomLabelComponent.props}/>)
        }
    }

    const defineHeight = () => {
        setMaximumHeight()
    }

    useEffect(() => {
        if (isOpen) {
            inputRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        try {
            if (JSON.stringify(props.options) !== JSON.stringify(options)) {
                setOptions(props.options)
            }
        } catch {
            setOptions(props.options)
        }
    }, [props.options])

    useEffect(() => {
        if (process.env['APP'] === 'web') {
            document.addEventListener("mousedown", onSelectClick)
            window.addEventListener('resize', defineHeight)
        }
        return () => {
            if (process.env['APP'] === 'web') {
                document.removeEventListener("mousedown", onSelectClick);
                window.removeEventListener('resize', defineHeight)
            }
        };
    }, [onSelectClick]);
    
    useEffect(() => {
        const selectedInitialValues = props.initialValues.map(initialValue=> {return{ ...initialValue, selected:false, color: selectedItemColors[Math.floor(Math.random() * selectedItemColors.length)] }})
        let filteredOptions = props.options.filter(option=> selectedInitialValues.find(selectedOption=> selectedOption.value === option.value) === undefined);
        
        try {   
            if (JSON.stringify(props.initialValues.map(initialValue =>({ value: initialValue.value, label: initialValue.label }))) !== JSON.stringify(selectedOptions.map(selectedOption => { return { value: selectedOption.value, label: selectedOption.label} }))) {
                setSelectedOptions(selectedInitialValues)
                setOptions(filteredOptions)
            }
        } catch {
            setSelectedOptions(selectedInitialValues)
            setOptions(filteredOptions)
        }

    }, [props.initialValues])

    const renderMobile = () => {
        return (
            <Utils.Select.Select isOpen={isOpen} ref={selectRef} onPress={e=> {onSelectClick()}} animationType={'slide'}>
                <SafeAreaView>
                    <Utils.Select.SelectedOptionsContainer isOpen={isOpen}>
                        {(isOpen) ? (
                        <TouchableOpacity style={{ padding: 15 }} onPress={e=> {
                            setIsOpen(false)
                        }}>
                            <Utils.Select.GoBackArrow icon="arrow-left"/>
                        </TouchableOpacity>
                        ) : null}
                        {selectedOptions.map((selectedOption, index)=> (
                        <Utils.Select.SelectedOption 
                        key={selectedOption.value} 
                        color={selectedOption.color} 
                        selected={selectedOption.selected} 
                        onPress={e=>{
                            e.preventDefault()
                            e.stopPropagation()
                            onClickSelectedOption(e, index)}}
                        >
                            <Text style={{color: '#fff'}}>
                                {renderLabel(selectedOption.label, index)}
                            </Text>
                        </Utils.Select.SelectedOption>
                        ))}
                        <Utils.Select.Input 
                            ref={inputRef} 
                            placeholder={selectedOptions.length === 0 ? props.placeholder: ''}
                            value={searchValue} 
                            searchValueColor={props.searchValueColor}
                            onChange={e => {updateOptions(e.nativeEvent.text, [...selectedOptions])}} 
                            onKeyPress={e=> {onRemoveSelectedOption(e)}}
                            onFocus={e=> onSelectClick()}
                        />
                    </Utils.Select.SelectedOptionsContainer>
                    <Utils.Select.OptionsHolder>
                        {(isOpen) ? (
                            <Utils.Select.OptionsContainer 
                            //keyboardDismissMode={'on-drag'}
                            onScroll={e=> {Keyboard.dismiss()}}
                            scrollEventThrottle={32}
                            keyboardShouldPersistTaps={'handled'}
                            optionBackgroundColor={props.optionBackgroundColor}
                            optionColor={props.optionColor}
                            >
                                <Option 
                                optionDividerColor={props.optionDividerColor}
                                optionOnHoverColor={props.optionOnHoverColor}
                                optionOnHoverBackgroundColor={props.optionOnHoverBackgroundColor}
                                options={options}
                                onSelectOption={onSelectOption}
                                selectedOptions={selectedOptions}
                                renderLabel={renderLabel}
                                />
                            </Utils.Select.OptionsContainer>
                        ): null}
                    </Utils.Select.OptionsHolder>
                </SafeAreaView>
            </Utils.Select.Select>
        )
    }

    const renderWeb = () => {
        return(
            <Utils.Select.Select isOpen={isOpen} ref={selectRef} onClick={e=>{inputRef.current.focus()}}>
                <Utils.Select.SelectedOptionsContainer isOpen={isOpen}>
                    {(isOpen) ? (<Utils.Select.GoBackArrow icon="arrow-left" onClick={e=> {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsOpen(false)
                    }}/>) : ''}
                    {selectedOptions.map((selectedOption, index)=> (
                        <Utils.Select.SelectedOption 
                        key={selectedOption.value} 
                        color={selectedOption.color} 
                        >
                            <div>
                                <Utils.Select.SelectedOptionsContentContainer 
                                selected={selectedOption.selected} 
                                onClick={e=>{
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onClickSelectedOption(e, index)}
                                }
                                >
                                    {renderLabel(selectedOption.label, index)}
                                </Utils.Select.SelectedOptionsContentContainer>
                                <Utils.Select.ExcludeContainer
                                onClick={e=>{
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onClickToRemove(index)}
                                }
                                >
                                    <Utils.Select.ExcludeIcon icon="times"/>
                                </Utils.Select.ExcludeContainer>
                            </div>
                        </Utils.Select.SelectedOption>
                    ))}
                    <Utils.Select.Input 
                    ref={inputRef} 
                    type="text" 
                    placeholder={selectedOptions.length === 0 ? props.placeholder: ''}
                    value={searchValue} 
                    searchValueColor={props.searchValueColor}
                    onChange={e => {updateOptions(e.target.value, [...selectedOptions])}} 
                    onClick={e=> {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    onKeyUp={e=>onRemoveSelectedOption(e)}
                    />
                </Utils.Select.SelectedOptionsContainer>
                <Utils.Select.OptionsHolder>
                    {(isOpen) ? (
                        <Utils.Select.OptionsContainer 
                        ref={selectOptionsContainerRef}
                        maximumHeight={maximumHeight}
                        optionBackgroundColor={props.optionBackgroundColor}
                        optionColor={props.optionColor}
                        >
                            <Option 
                            optionDividerColor={props.optionDividerColor}
                            optionOnHoverColor={props.optionOnHoverColor}
                            optionOnHoverBackgroundColor={props.optionOnHoverBackgroundColor}
                            options={options}
                            onSelectOption={onSelectOption}
                            selectedOptions={selectedOptions}
                            renderLabel={renderLabel}
                            />
                        </Utils.Select.OptionsContainer>
                    ): ''}
                </Utils.Select.OptionsHolder>
            </Utils.Select.Select>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Select