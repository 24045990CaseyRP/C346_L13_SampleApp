import React, {useState} from 'react';
import {StatusBar, View, Button, Text, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import asyncStorage from '@react-native-async-storage/async-storage';


const Add = ({navigation, route}) => {
    const [letter, setLetter] = useState("");
    const [type, setType] = useState("Vowels");

    const setData = async(value) => {
        asyncStorage.setItem("alphadata", value);
        navigation.navigate('Home');
    }

    return (
        <View>
            <StatusBar/>
            <Text>Letter:</Text>
            <TextInput maxLength={1} style={{borderWidth: 1}} onChangeText={(text) => setLetter(text)}/>
            <Picker onValueChange={(value) => setType(value)}>
                <Picker.Item label='Vowels' value='Vowels'/>
                <Picker.Item label='Consonants' value='Consonants'/>
            </Picker>
            <Button title='Submit'
                    onPress={() => {
                        let mydata = JSON.parse(route.params.datastring);
                        let item = {key: letter};
                        let indexnum = 1;
                        if (type == "Vowels") {
                            indexnum = 0;
                        }
                        mydata[indexnum].data.push(item);
                        let stringdata = JSON.stringify(mydata);
                        setData(stringdata);
                    }
                    }
            />
        </View>
    );
};

export default Add;