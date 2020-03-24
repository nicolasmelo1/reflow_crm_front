import React, { useState, useEffect } from 'react'
import Utils from 'styles/Utils'

/**
 * This __MUST NOT__ be called from outside the file, this is only used to build the select options
 * @param {Array<Object>} options - contains all of the options you want to display
 * @param {Function} setSelectedOptions - Function to change the selected options by the user
 * @param {Function} updateOptions - function used to update the options displayed for the user that he can select
 * @param {Function} onChange - the onChange function recieved by Select component
 * @param {Array<Object>} selectedOptions - Containing all of the options the user selected. The objects here have the keys: 
 * - `label`: the value to display to the user
 * - `value`: the internal value, usually unique
 * - `selected`: usually `false` to tell if the user has selected this so we can delete
 * @param {String} optionDividerColor - (optional) - default to #fff
 * @param {String} optionOnHoverColor - (optional) - default to #444
 * @param {String} optionOnHoverBackgroundColor - (optional) - default to #bfbfbf
 * @param {Boolean} multiple - Explained in Select component
 */
const Option = (props) => {
    const filteredOptions = props.options.filter(option=> props.selectedOptions.find(selectedOption=> selectedOption.value === option.value) === undefined);

    return (
        <Utils.Select.OptionsListContainer>
            {filteredOptions.map((option, index)=> (
                <Utils.Select.OptionItem 
                hasBorder={index < filteredOptions.length-1}
                key={option.value} 
                optionDividerColor={props.optionDividerColor}
                optionOnHoverColor={props.optionOnHoverColor}
                optionOnHoverBackgroundColor={props.optionOnHoverBackgroundColor}
                onClick={e=>{ props.onSelectOption(e, option) }}
                >
                    {props.renderLabel(option.label, index)}
                </Utils.Select.OptionItem> 
            ))}
        </Utils.Select.OptionsListContainer>
    )
}

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
 * @param {string} searchValueColor - (optional) - set color to search value, that the user types to search
 * @param {String} optionColor - (optional) - default to #f2f2f2
 * @param {String} optionBackgroundColor - (optional) - default to #444
 * @param {String} optionDividerColor - (optional) - default to #fff
 * @param {String} optionOnHoverColor - (optional) - default to #444
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

    if (props.isOpen === undefined && props.setIsOpen === undefined) {
        [isOpen, _setIsOpen] = useState(false)
    }
    const [searchValue, setSearchValue] = useState('')
    const [options, setOptions] = useState(props.options)
    const inputRef = React.useRef(null)
    const selectRef = React.useRef()
    const selectedItemColors = ['#0dbf7e', '#0BAB71', '#0A9864', '#098558', '#07724B']
    
    // creating a ref to the state is the only way we can get the state changes in the eventHandler function,
    // so we can use it for the mousedown eventListenet function
    // NOTE: THIS IS ONLY FOR CLASS BASED COMPONENTS THAT USE HOOKS, class based might
    // work normally
    const setIsOpenRef = React.useRef(isOpen);
    const setIsOpen = data => {
        setIsOpenRef.current = data;
        _setIsOpen(data);
    };

    const updateOptions = (value, selectedOptions) => {
        let filteredOptions = props.options.filter(option=> selectedOptions.find(selectedOption=> selectedOption.value === option.value) === undefined);
        if (value !== '') {
            if (props.onFilter) {
                filteredOptions = props.onFilter(value)
            } else {
                filteredOptions = filteredOptions.filter(option=> option.label.includes(value))
            }
        }
        //
        setSearchValue(value)
        setOptions(filteredOptions)
    }

    const onSelectClick = (e) => {
        e.stopPropagation();
        if (selectRef.current && selectRef.current.contains(e.target)) {
            setIsOpen(true)
        } else if (setIsOpenRef.current) {
            setIsOpen(false)
            onClickSelectedOption()
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

    const onRemoveSelectedOption = (e) => {
        if ([46, 8].includes(e.keyCode)){
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
        document.addEventListener("mousedown", onSelectClick); 
        return () => {
            document.removeEventListener("mousedown", onSelectClick);
        };
    }, [onSelectClick]);
    
    useEffect(() => {
        const selectedInitialValues = props.initialValues.map(initialValue=> {return{ ...initialValue, selected:false, color: selectedItemColors[Math.floor(Math.random() * selectedItemColors.length)] }})
        let filteredOptions = props.options.filter(option=> selectedInitialValues.find(selectedOption=> selectedOption.value === option.value) === undefined);
        
        try {
            if (JSON.stringify(props.initialValues) !== JSON.stringify(selectedOptions.map(selectedOption => { return { value: selectedOption.value, label: selectedOption.label} }))) {
                setSelectedOptions(selectedInitialValues)
                setOptions(filteredOptions)
            }
        } catch {
            setSelectedOptions(selectedInitialValues)
            setOptions(filteredOptions)
        }

    }, [props.initialValues])

    return(
        <Utils.Select.Select isOpen={isOpen} ref={selectRef} onClick={e=>{inputRef.current.focus()}}>
            <Utils.Select.SelectedOptionsContainer>
                {selectedOptions.map((selectedOption, index)=> (
                    <Utils.Select.SelectedOption 
                    key={selectedOption.value} 
                    color={selectedOption.color} 
                    selected={selectedOption.selected} 
                    onClick={e=>{onClickSelectedOption(e, index)}}
                    >
                        {renderLabel(selectedOption.label, index)}
                    </Utils.Select.SelectedOption>
                ))}
                <Utils.Select.Input 
                ref={inputRef} 
                type="text" 
                value={searchValue} 
                searchValueColor={props.searchValueColor}
                onChange={e => {updateOptions(e.target.value, [...selectedOptions])}} 
                onKeyUp={e=>onRemoveSelectedOption(e)}
                />
            </Utils.Select.SelectedOptionsContainer>
            <Utils.Select.OptionsHolder>
                {(isOpen) ? (
                    <Utils.Select.OptionsContainer 
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

export default Select