import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Text, ImageBackground, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { app } from '../../firebaseConnection';
import { getDatabase, ref, child, onValue } from "firebase/database";
import CardOcorrencia from "../../CardOcorrencia";

export default function Home({ navigation, route }) {

  const [tasks, setTasks] = useState([]);

  useEffect(()=> {

    //Recupera todas as ocorrências registradas pelo usuário
    async function loadTasks(){
      const db = getDatabase(app);
      const ocorrenciasRef = child(ref(db, 'Ocorrencias'), route.params.idUser);
      await onValue(ocorrenciasRef, (snapshot)=>{
        setTasks([]);

        snapshot.forEach((childItem)=>{
          let data = {
            key: childItem.key,
            tipo: childItem.val().tipo,
            latitude: childItem.val().latitude,
            longitude: childItem.val().longitude,
            endereco: childItem.val().endereco,
            imageUri: childItem.val().imageUri,
            descricao: childItem.val().descricao,
            status: childItem.val().status, 
            abertoDtHr: childItem.val().abertoDtHr, 
            andamentoDtHr: childItem.val().andamentoDtHr, 
            resolvidoDtHr: childItem.val().resolvidoDtHr
          };

          setTasks(oldArray => [...oldArray, data]);
        })


      });
    }

    loadTasks();
    
  }, []);

  //Navega para a tela de detalhes
  function irDetalhes(key) {
    navigation.navigate('Detalhes', {idUser: route.params.idUser, key: key});
  }

  return (
    <ImageBackground source={require('../../images/imagebk.jpg')} style={styles.image}>
      {tasks == 0 &&
        <View style={styles.Container}>
          <Text style={styles.textDefault}>Você ainda não registrou nenhuma ocorrência!</Text>
        </View>
      }
      
      <FlatList
        data={tasks}
        keyExtractor={item => item.key}
        renderItem={ ({ item }) => (
          <CardOcorrencia data={item} irDetalhes={irDetalhes}/>          
        )}
      />

      <TouchableOpacity style={styles.db}
        onPress={() => navigation.navigate('DashBoard', {screen: 'Geral',params: {idUser: route.params.idUser}})}>
        <Text style={styles.newText}><Icon name="bar-chart" size={25} color="#000000"/></Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.new}
        onPress={() => navigation.navigate('NovaOcorrencia', {idUser: route.params.idUser})}>
        <Text style={styles.newText}>+</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  new: {
    backgroundColor: "#ff9400",
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  db: {
    backgroundColor: "#c7c7c7",
    width: 55,
    height: 55,
    position: 'absolute',
    bottom: 110,
    right: 23,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  newText: {
    fontSize: 35,
    fontWeight: "bold",
    color: 'white',
  },
  Container: {
    backgroundColor: "#c9c9c9",
    borderColor: "#808080",
    borderWidth: 5,
    margin: 20,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems:'center',
  },
  textDefault: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
  },
});