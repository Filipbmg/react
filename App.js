import { useState } from 'react';
import { StyleSheet, Text, FlatList, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { app, database } from './firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from "@react-navigation/native-stack";
import * as ImagePicker from 'expo-image-picker';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function App() {
    const Stack = createNativeStackNavigator();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='FrontPage'>
                <Stack.Screen
                    name='FrontPage'
                    component={FrontPage}
                />

                <Stack.Screen
                    name='DetailPage'
                    component={DetailPage}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const FrontPage = ({navigation, route}) => {
    const [text, setText] = useState('');
    const [values, loading, error] = useCollection(collection(database, "notes"));
    const data = values?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    async function buttonHandler() {
        try {
            await addDoc(collection(database, "notes"), {
                text: text
            });
        } catch (err) {
            console.log("Fejl i DB " + err);
        }
    }

    async function deleteDocument(id) {
        await deleteDoc(doc(database, "notes", id));
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} onChangeText={(txt) => setText(txt)} />
            <Button title='Ny Note' onPress={buttonHandler} />
            <FlatList
                data={data}
                renderItem={({ item: note }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('DetailPage', { note: note });
                        }}
                        style={styles.noteContainer}
                    >
                        <View>
                            <Text>{note.text}</Text>
                        </View>

                        <TouchableOpacity onPress={() => deleteDocument(note.id)}>
                            <Text style={styles.deleteButton}>Delete</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const DetailPage = ({ navigation, route }) => {
    const note = route.params?.note;
    const [imagePath, setImagePath] = useState(null);

    async function launchImagePicker(){
        let result = await ImagePicker.launchImageLibraryAsync({
            allowEditing: true
        })
        if(!result.canceled) {
            setImagePath(result.assets[0].uri)
        }
    }

    async function downloadImage() {
        getDownloadURL(ref(storage, `${note.id}.jpg`))
            .then((url) => {
                setImagePath(url)
        }).catch((error) => {
          alert("Fejl i image download " + error)
        })
    }

    async function uploadImage() {
        const res = await fetch(imagePath)
        const blob = await res.blob()
        const storageRef = ref(storage, `${note.id}.jpg`)
        uploadBytes(storageRef, blob).then((snapshot) => {
            alert("Saved")
        })
    }

    async function launchCamera() {
        const result = await ImagePicker.requestCameraPermissionsAsync()
        if(result.granted === false) {
            alert("Kamera tilladelse afvist")
        } else {
            ImagePicker.launchCameraAsync()
                .then((response) => {
                    if(!response.canceled) {
                        setImagePath(response.assets[0].uri)
                    }
                    }).catch((error) => {
                        alert("Fejl i kamera " + error)
            })
        }
    }

    return (
        <View style={styles.container}>
            <Image style={{width: 200, height: 200}} source={{uri:imagePath}}/>
            <Text>
                {note.text}
            </Text>
            <Button title='Download Image' onPress={downloadImage}/>
            <Button title='Pick Image' onPress={launchImagePicker}/>
            <Button title='Camera' onPress={launchCamera}/>
            <Button title='Save' onPress={uploadImage}/>
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200
  },
  textInput: {
    backgroundColor: 'lightblue',
    minWidth: 200
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  deleteButton: {
    marginLeft: 10,
    color: 'red'
  }
});
