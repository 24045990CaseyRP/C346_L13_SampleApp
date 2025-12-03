import React, {useState} from 'react';
import {Alert, View, Button, Text, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {datasource} from './Data'; // Not strictly needed here

const Edit = ({navigation, route}) => {
    // State for the letter being edited
    const [letter, setLetter] = useState(route.params.key);

    // Get params passed from Home
    // Assuming Home passes sectionIndex and itemIndex (instead of route.params.index)
    // If Home uses 'index', then replace 'itemIndex' with 'index' in the destructuring
    const { sectionIndex, itemIndex, type, index } = route.params;

    // --- Helper function to save the data back to AsyncStorage and navigate ---
    const saveDataToStorage = async(value) => {
        try {
            // Note: Your original code used asyncStorage.setItem, I corrected the casing to AsyncStorage
            await AsyncStorage.setItem("alphadata", value);
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error saving data to AsyncStorage:", error);
            Alert.alert("Save Error", "Failed to save data.");
        }
    }

    // --- SAVE LOGIC ---
    const handleSave = async () => {
        if (!letter || letter.trim().length === 0) {
            Alert.alert("Input Required", "Please enter a letter before saving.");
            return;
        }

        try {
            // 1. Read the LATEST data from storage
            let datastr = await AsyncStorage.getItem('alphadata');
            if (datastr === null) return;

            // 2. Parse and create a mutable copy
            const mydata = JSON.parse(datastr);

            // Determine section index (using your original logic based on 'type' if 'sectionIndex' is not passed)
            const indexnum = type === "Vowels" ? 0 : 1;

            // Determine item index (using 'itemIndex' if passed, or 'index' if Home uses original param name)
            const itemPos = itemIndex ?? index;

            // 3. Apply the change to the specific item using the correct indices
            mydata[indexnum].data[itemPos].key = letter.toUpperCase();

            // 4. Save the entire updated array back
            const stringdata = JSON.stringify(mydata);
            await saveDataToStorage(stringdata);

        } catch (error) {
            console.error("Error in handleSave:", error);
            Alert.alert("Save Error", "Failed to process data.");
        }
    };

    // --- DELETE LOGIC ---
    const handleDelete = () => {
        Alert.alert("Are you sure?", '',
            [{
                text: 'Yes',
                onPress: async () => {
                    try {
                        // 1. Read the LATEST data from storage
                        let datastr = await AsyncStorage.getItem('alphadata');
                        if (datastr === null) return;

                        // 2. Parse and create a mutable copy
                        const mydata = JSON.parse(datastr);

                        // Determine section index
                        const indexnum = type === "Vowels" ? 0 : 1;

                        // Determine item index
                        const itemPos = itemIndex ?? index;

                        // 3. Perform the deletion (Splice the item out)
                        mydata[indexnum].data.splice(itemPos, 1);

                        // 4. Save the entire modified array back
                        const stringdata = JSON.stringify(mydata);
                        await saveDataToStorage(stringdata);

                    } catch (error) {
                        console.error("Error in handleDelete:", error);
                        Alert.alert("Delete Error", "Failed to delete item from storage.");
                    }
                }
            },
                {text: 'No', style: 'cancel'}])
    };

    return (
        <View>
            <Text>Letter:</Text>
            {/* Your original inline style */}
            <TextInput
                value={letter}
                maxLength={1}
                style={{borderWidth: 1}}
                onChangeText={(text) => setLetter(text)}
                autoCapitalize='characters'
            />
            {/* Your original inline style */}
            <View style={{flexDirection: "row"}}>
                <View style={{margin: 10, flex: 1}}>
                    <Button title='Save'
                            onPress={handleSave}
                    />
                </View>
                <View style={{margin: 10, flex: 1}}>
                    <Button title='Delete'
                            onPress={handleDelete}
                            color='red' // Added color for visual distinction of delete button
                    />
                </View>
            </View>
        </View>
    );
};

export default Edit;