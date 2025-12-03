import React,{useState} from 'react';
import {StatusBar, Button, SectionList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {datasource} from './Data';
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 15,
        margin: 10,
        textAlign: 'left',
    },
    opacityStyle: {
        borderWidth: 1,
    },
    headerText: {
        fontSize: 20,
        margin: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'impact'
    },
});

const Home = ({navigation}) => {
    const [mydata,setMydata] = useState([]);

    const getData = async() => {
        let datastr = await AsyncStorage.getItem('alphadata');
        if(datastr!=null){
            const jsondata = JSON.parse(datastr);
            setMydata(jsondata);
        }
        else{
            setMydata(datasource);
        }
    };
    getData();

    const renderItem = ({item, index, section}) => {
        // Find the index of the current section (Vowels or Consonants) within the mydata state array
        const sectionIndex = mydata.findIndex(s => s.title === section.title);

        return (
            <TouchableOpacity
                style={styles.opacityStyle}
                onPress={() => {
                    // Pass all necessary indices and key to the Edit screen
                    navigation.navigate("Edit", {
                        sectionIndex: sectionIndex,
                        itemIndex: index, // This is route.params.index in Edit.js
                        key: item.key,
                        type: section.title // Used for helper functions
                    })
                }
                }
            >
                <Text style={styles.textStyle}>{item.key}</Text>
            </TouchableOpacity>
        );
    };

    const sectionHeader = ({section: {title, bgcolor}}) => {
        return (
            <Text style={[styles.headerText, {backgroundColor: bgcolor}]}>
                {title}
            </Text>
        );
    };
    return (
        <View>
            <StatusBar/>
            <Button title='Add Letter' onPress={() => {
                let datastr = JSON.stringify(mydata);
                navigation.navigate("Add", {datastring: datastr});
            }}/>
            <SectionList sections={mydata}
                         renderItem={renderItem}
                         renderSectionHeader={sectionHeader}
            />
        </View>
    );
};

export default Home;