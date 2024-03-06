import { useState } from 'react';
import { StyleSheet, Text, FlatList, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { app, database } from './firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function App() {
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
            renderItem={(note) => (
                <View style={styles.noteContainer}>
                  <Text>{note.item.text}</Text>
                  <TouchableOpacity onPress={() => deleteDocument(note.item.id)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
            )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
