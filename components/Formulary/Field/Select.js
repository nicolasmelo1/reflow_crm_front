import React, { useState, useEffect, useCallback } from 'react'
import { Field } from 'styles/Formulary'

const Option = (props) => {
    const filteredOptions = props.options.filter(option=> props.selectedOptions.find(selectedOption=> selectedOption.value === option.value) === undefined);

    const onSelectValue = (e, option) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.multiple || props.selectedOptions.length===0) {
            props.selectedOptions.push({value:option, selected: false})
        } else {
            props.selectedOptions[0] = {value:option, selected: false}
        }
        props.onChange(props.selectedOptions.map(selectedOption=> selectedOption.value))
        props.setSelectedOptions([...props.selectedOptions])
        props.updateOptions('')
        
    }
    return (
        <Field.Select.OptionsListContainer>
            {filteredOptions.map((option, index)=>(
                <Field.Select.OptionItem key={index} onClick={e=>{ onSelectValue(e, option.value) }}>{option.label}</Field.Select.OptionItem> 
            ))}
        </Field.Select.OptionsListContainer>
    )
}

const Select = (props) => {
    const [selectedOptions, setSelectedOptions] = useState([])
    const [isOpen, _setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [options, setOptions] = useState(props.options)
    const inputRef = React.useRef(null)
    const selectRef = React.useRef()
    const selectedItemColors = ['#0dbf7e', '#0BAB71', '#0A9864', '#098558', '#07724B']
    
    // creating a ref to the state is the only way we can get the state changes,
    // so we need to use it for the mousedown eventListenet function
    // NOTE: THIS IS ONLY FOR CLASS BASED COMPONENTS THAT USE HOOKS, class based might
    // work normally
    const setIsOpenRef = React.useRef(isOpen);
    const setIsOpen = data => {
        setIsOpenRef.current = data;
        _setIsOpen(data);
    };

    const updateOptions = (value) => {
        let filteredOptions = props.options.filter(option=> selectedOptions.find(selectedOption=> selectedOption.value === option.value) === undefined);
        if (value !== '') {
            filteredOptions = filteredOptions.filter(option=> option.label.includes(value))
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
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onSelectClick); 
        return () => {
            document.removeEventListener("mousedown", onSelectClick);
        };
    }, [onSelectClick]);
    
    return(
        <Field.Select.Select isOpen={isOpen} ref={selectRef} onClick={e=>{inputRef.current.focus()}}>
            <Field.Select.SelectedOptionsContainer>
                {selectedOptions.map((selectedOption, index)=> (
                    <Field.Select.SelectedOption 
                    key={index} 
                    color={selectedItemColors[index - Math.floor(index/selectedItemColors.length)*selectedItemColors.length]} 
                    selected={selectedOption.selected} 
                    onClick={e=>{onClickSelectedOption(e, index)}}
                    >
                        {selectedOption.value}
                    </Field.Select.SelectedOption>
                ))}
                <Field.Select.Input 
                ref={inputRef} 
                type="text" 
                value={searchValue} 
                onChange={e => {updateOptions(e.target.value)}} 
                onKeyUp={e=>onRemoveSelectedOption(e)}
                />
            </Field.Select.SelectedOptionsContainer>
            <div style={{position: 'relative'}}>
                {(isOpen) ? (
                    <Field.Select.OptionsContainer>
                        <Option 
                        options={options}
                        setSelectedOptions={setSelectedOptions} 
                        updateOptions={updateOptions}
                        onChange={props.onChange} 
                        selectedOptions={selectedOptions}
                        multiple={props.multiple}/>
                    </Field.Select.OptionsContainer>
                ): ''}
            </div>
        </Field.Select.Select>
    )
}

export default Select