import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { app } from '../../firebaseConnection';
import { getDatabase, ref, child, onValue, remove } from "firebase/database";
import MapView, { Marker } from 'react-native-maps';

export default function Detalhes({ navigation, route }) {

    const [dados, setDados] = useState([]);

    useEffect(()=> {
        loadDados();
    }, []);
    
    //Recupera os dados da ocorrência no Firebase
    async function loadDados(){    
        const db = getDatabase(app);
        const ocorrenciaRef = child(child(ref(db, 'Ocorrencias'), route.params.idUser), route.params.key);
        await onValue(ocorrenciaRef, (snapshot)=>{

            setDados(snapshot.val());
        });
    }

    //Deleta a ocorrência no Firebase
    async function handleDelete(){
        if(dados.status == "Aberto"){
            const db = getDatabase(app);
            navigation.navigate('Home', {idUser: route.params.idUser});

            await remove(child(child(ref(db, 'Ocorrencias'), route.params.idUser), route.params.key));
            Alert.alert("Exclusão realizada","Ocorrência excluida com sucesso.")
        }else{
            Alert.alert("Exclusão negada","Ocorrência já está sendo tratada.")
        }
    }

    //Verifica qual ícone será exibido 
    switch (dados.tipo) {
        case 'Buraco':
            var icone = '🕳️';
            break;
        case 'Desnível':
            var icone = '〰️';
            break;
        case 'Bloqueio':
            var icone = '🚧';
            break;
        case 'Falta de Sinalização':
            var icone = '🚸';
            break;
        default:
            var icone = '❓';
        };

    return (
        <ScrollView style={styles.Container}>
            <View style={styles.Titulo}>
                <Text style={styles.Icone}>{icone}</Text>
                <Text style={styles.TextTitulo}>{dados.tipo}</Text>
            </View>

            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextStatus}>Status: {dados.status}</Text>
                <Text style={styles.TextDescricao}>Data/Hora abertura:{"\n"}{dados.abertoDtHr}</Text>
                <Text style={styles.TextDescricao}>Data/Hora em andamento:{"\n"}{dados.andamentoDtHr}</Text>
                <Text style={styles.TextDescricao}>Data/Hora resolvido:{"\n"}{dados.resolvidoDtHr}</Text>
            </View>

            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextContainer}>Local:</Text>
                    <MapView 
                        initialRegion={dados.latitude ?{
                            latitude: dados.latitude,
                            longitude: dados.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        } : {
                            latitude: -13.4659,
                            longitude: -51.3240,
                            latitudeDelta: 40.5000,
                            longitudeDelta: 40.5000,
                        }}
                        style={styles.ContainerMapa}
                        zoomEnabled={false}
                        zoomTapEnabled={false}
                        zoomControlEnabled={false}
                        rotateEnabled={false}
                        scrollEnabled={false}
                        loadingEnabled={true}
                    >
                        <Marker 
                            coordinate={dados.latitude ? {latitude: dados.latitude, longitude: dados.longitude,} : {latitude: -13.4659, longitude: -51.3240,}}
                            pinColor= 'red'
                        >  
                        </Marker>
                    </MapView>
                <Text style={styles.TextEndereco}>{dados.endereco}</Text>
            </View>

            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextContainer}>Imagem:</Text>
                <View style={styles.ContainerImagem}>
                    <Image style={styles.Imagem} source={dados.imageUri ? {uri: dados.imageUri} : require('../../images/imagemDefault.png')}/>
                </View>
            </View>

            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextContainer}>Descrição:</Text>
                <Text style={styles.TextDescricao}>{dados.descricao}</Text>
            </View>

            <View style={styles.ButtomContainer}>
                <TouchableOpacity style={styles.Buttom} onPress={() => handleDelete()}>
                    <Text style={styles.TextButtom}>Excluir ocorrência</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        fontSize: 20,
    },
    Titulo: {
        alignItems: 'center',
        height: 110,
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 20
    },
    Icone:{
        fontSize: 50,
    },
    TextTitulo:{
        fontSize: 30,
        fontWeight: 'bold'
    },
    TextContainer:{
        fontSize: 20,
        marginBottom: 15
    },
    TextStatus:{
        fontSize: 20,
        marginBottom: 15,
        textAlign:'center',
        fontWeight: 'bold',
    },
    ContainerMapa: {
        height: 230,
        marginBottom: 20,
    },
    TextEndereco:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign:'center'
    },
    ContainerImagem: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
    },
    Imagem:{
        flex: 1,
        height: 300,
        width: 300,
    },
    TextDescricao:{
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        textAlign:'justify'
    },
    ButtomContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30
    },
    Buttom: {
        backgroundColor: 'red',
        width: 200,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    TextButtom: {
        color: "#FFF",
        fontSize: 17,
        fontWeight: "bold",
    },
    ContainerDetalhes:{
        padding: 10,
        backgroundColor:'#e3e3e3',
        borderRadius: 15,
        elevation: 10,
        margin: 18
    }
});