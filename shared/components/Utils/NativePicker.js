import React, { useState } from 'react'
import { SafeAreaView, View, TouchableOpacity, Text, Picker, Platform, Modal, Button } from 'react-native'

/**
 * We need this because ios is kinda dumb, the Picker component on Ios is a component 
 * you can row your finger to select the element. The problem is, on apps it works differently from the Safari Browser.breadcrumb
 * If you ever used a select element inside the browser, the options to select opens on the bottom of the screen.
 * On apps the Picker doesn't open this way, it is like the picker is always open. Because of this we created this component for ios.
 * On ios it renders as a simple input, when the user clicks the input the picker is opened in the bottom of the user`s screen
 * 
 * Usage: use the same way as you use a Picker component. But instead of using Picker you use this component. 
 * For the options you still use the Picker.Item. All the props from picker are accepted here.
 * @param {object} props - check https://reactnative.dev/docs/picker#__docusaurus for explanation
 */
const NativePicker = ({style,...props}) => {
    const [isOpen, setIsOpen] = useState(false)
    const Component = (Platform.OS === 'ios') ? TouchableOpacity : View
    

    const renderWeb = () => ''

    const renderMobile = () => {
        const selectedItem = props.children.filter(itemComponent => itemComponent.props.value === props.selectedValue)
        const label = (selectedItem.length > 0) ? selectedItem[0].props.label : ''
        return (
            <Component onPress={e=> {setIsOpen(true)}} style={style}>
                {Platform.OS === 'ios' ? (
                    <View>
                        <Text style={{ color: '#17242D'}}>{label}</Text>
                        {isOpen ? (
                            <Modal transparent={true}>
                                <SafeAreaView style={{backgroundColor: '#00000050', height: '100%'}}>
                                    <Modal transparent={true} animationType={'slide'}>
                                        <View style={{height: '100%', justifyContent: 'flex-end'}}>
                                            <View style={{backgroundColor: '#fff', alignItems: 'flex-end'}}>
                                                <Button title={'Done'} onPress={e=> {setIsOpen(false)}}/>
                                                <Picker style={{ width: '100%'}} {...props}>
                                                    {props.children}
                                                </Picker>
                                            </View>
                                        </View>
                                    </Modal>
                                </SafeAreaView>
                            </Modal>
                        ): null}
                    </View>
                ) : (
                    <Picker {...props}>
                        {props.children}
                    </Picker>
                )}
            </Component>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default NativePicker
