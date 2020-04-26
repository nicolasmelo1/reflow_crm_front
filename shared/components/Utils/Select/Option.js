import React from 'react'
import Utils from '../../../styles/Utils'
import { View, Text } from 'react-native';

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
 * @param {String} placeholder - Text to show in the placeholder of the input when no option is selected.
 */
const Option = (props) => {
    const filteredOptions = props.options.filter(option=> props.selectedOptions.find(selectedOption=> selectedOption.value === option.value) === undefined);

    const renderMobile = () => {
        return (
            <Utils.Select.OptionsListContainer>
                {filteredOptions.map((option, index)=> (
                    <View style={{
                        borderBottomColor: `${props.optionDividerColor ? props.optionDividerColor : '#bfbfbf'}`,
                        borderBottomWidth: 1
                    }}>
                        <Utils.Select.OptionItem 
                        hasBorder={index < filteredOptions.length-1}
                        key={option.value} 
                        optionDividerColor={props.optionDividerColor}
                        optionOnHoverColor={props.optionOnHoverColor}
                        optionOnHoverBackgroundColor={props.optionOnHoverBackgroundColor}
                        onPress={e=>{ 
                            e.preventDefault()
                            e.stopPropagation()
                            props.onSelectOption(e, option) 
                        }}
                        >
                            <Text style={{color: '#fff'}}>
                                {props.renderLabel(option.label, index)}
                            </Text>
                        </Utils.Select.OptionItem> 

                    </View>
                ))}
            </Utils.Select.OptionsListContainer>
        )
    }

    const renderWeb = () => {
        return (
            <Utils.Select.OptionsListContainer>
                {filteredOptions.map((option, index)=> (
                    <Utils.Select.OptionItem 
                    hasBorder={index < filteredOptions.length-1}
                    key={option.value} 
                    optionDividerColor={props.optionDividerColor}
                    optionOnHoverColor={props.optionOnHoverColor}
                    optionOnHoverBackgroundColor={props.optionOnHoverBackgroundColor}
                    onClick={e=>{ 
                        e.preventDefault()
                        e.stopPropagation()
                        props.onSelectOption(e, option) 
                    }}
                    >
                        {props.renderLabel(option.label, index)}
                    </Utils.Select.OptionItem> 
                ))}
            </Utils.Select.OptionsListContainer>
        )
    }
    
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()

}

export default Option