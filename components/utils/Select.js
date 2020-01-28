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
 * @param {Boolean} multiple - Explained in Select component
 */
const Option = (props) => {
    const filteredOptions = props.options.filter(option=> props.selectedOptions.find(selectedOption=> selectedOption.value === option.value) === undefined);

    return (
        <Utils.Select.OptionsListContainer>
            {filteredOptions.map((option, index)=>(
                <Utils.Select.OptionItem key={index} onClick={e=>{ props.onSelectOption(e, option) }}>{props.renderLabel(option.label, index)}</Utils.Select.OptionItem> 
            ))}
        </Utils.Select.OptionsListContainer>
    )
}

/**
 * Custom select component used in our formulary, if you need to change something in the select, change this component.
 * You can send labels as components on this element, if you do this, please send a onFilter function that returns the options filtered
 * @param {Array<Object>} data - Array of objects. The objects must contain: `label` and `value` keys.
 * - `value`: must be a string
 * - `label`: can be a string or a react component, if you send a custom component, send don't forget to add the component as the `label` 
 * props and a `onFilter` function
 * @param {Function} onChange - a onChange function to be called when the user changes the value
 * @param {React.Component} label - (optional) - Instead of a simple text, display a custom label, if you do this, please define a onFilter
 * function
 * @param {Function} onFilter - (optional) - Defines a custom on filter function that recieves a string, and MUST return the Array of 
 * objects filtered
 * @param {Boolean} multiple - (optional) use this to inform if you want multiple objects to be selected.
 */
const Select = (props) => {
    const [selectedOptions, setSelectedOptions] = useState([])
    const [isOpen, _setIsOpen] = useState(false)
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
            selectedOptions.push({value: option.value, label: option.label, selected: false})
        } else {
            selectedOptions[0] = {value: option.value, label: option.label, selected: false}
        }
        //props.onChange(selectedOptions.map(selectedOption=> selectedOption.value))
        setSelectedOptions([...selectedOptions])
        updateOptions('', [...selectedOptions])
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
        } else {
            const CustomLabelComponent = props.label
            return (<CustomLabelComponent key={index} {...label.props}/>)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onSelectClick); 
        return () => {
            document.removeEventListener("mousedown", onSelectClick);
        };
    }, [onSelectClick]);
    
    return(
        <Utils.Select.Select isOpen={isOpen} ref={selectRef} onClick={e=>{inputRef.current.focus()}}>
            <Utils.Select.SelectedOptionsContainer>
                {selectedOptions.map((selectedOption, index)=> (
                    <Utils.Select.SelectedOption 
                    key={index} 
                    color={selectedItemColors[index - Math.floor(index/selectedItemColors.length)*selectedItemColors.length]} 
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
                onChange={e => {updateOptions(e.target.value, [...selectedOptions])}} 
                onKeyUp={e=>onRemoveSelectedOption(e)}
                />
            </Utils.Select.SelectedOptionsContainer>
            <div style={{position: 'relative'}}>
                {(isOpen) ? (
                    <Utils.Select.OptionsContainer>
                        <Option 
                        options={options}
                        onSelectOption={onSelectOption}
                        selectedOptions={selectedOptions}
                        renderLabel={renderLabel}
                        />
                    </Utils.Select.OptionsContainer>
                ): ''}
            </div>
        </Utils.Select.Select>
    )
}

export default Select