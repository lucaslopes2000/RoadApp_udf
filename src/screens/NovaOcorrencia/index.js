import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, Alert } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { app } from '../../firebaseConnection';
import { getDatabase, ref, set, child, push } from "firebase/database";
import { launchCamera } from 'react-native-image-picker';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import moment from 'moment';

export default function NovaOcorrencia({navigation, route}) {

    const [tipo, setTipo] = useState("");
    const [foto, setFoto]= useState();
    const [pin, setPin]= useState();
    const [endereco, setEndereco]= useState("");
    const [uf, setUf]= useState("");
    const [regiao, setRegiao]= useState("");
    const [descricao, setDescricao] = useState("");
    const [status, setStatus]= useState("Aberto");

    const [currentLocation, setCurrentLocation]= useState();

    useEffect(() => {
        callLocation();
    }, []);

    //Chama permissão de uso da geolocalização
    async function callLocation() {
        async function requestLocationPermission() {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await getLocation();
            } else {
                Alert.alert('Erro', 'Permissão de Localização negada');
            }
        }
        await requestLocationPermission();
    }

    //Pega a geolocalização atual
    async function getLocation() {
        await Geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setPin({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true}
        );
    }

    //Chama a câmera
    async function openCamera() {
        const options = {
            saveToPhotos: false,
        };
        await launchCamera(options, (response) => {
            console.log('Response = ', response.assets);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setFoto(response.assets[0]);
                console.log(foto);
            }
        });
    }

    //Insert dos dados no firebase
    async function writeUserData() {

        if(tipo != "" && endereco != ""){
            const dateTime = moment().utcOffset('-03:00').format('DD/MM/YYYY hh:mm:ss a');

            const db = getDatabase(app);
            const key = push(child(ref(db, 'Ocorrencias'), route.params.idUser)).key;
            await set(child(child(ref(db, 'Ocorrencias'), route.params.idUser), key), {
                tipo: tipo,
                latitude: pin.latitude,
                longitude: pin.longitude,
                endereco: endereco,
                uf: uf,
                regiao: regiao,
                imageUri: foto ? foto.uri : "",
                descricao: descricao,
                status: status, 
                abertoDtHr: dateTime, 
                andamentoDtHr: 'Aguardando...', 
                resolvidoDtHr: 'Aguardando...'
            });

            Alert.alert('Ocorrência registrada', 'Ocorrência criada com sucesso!');
            setTipo("");
            setFoto();
            setPin();
            setEndereco("");
            setUf("");
            setRegiao("");
            setDescricao("");

            irHome();
    
        }else{
            Alert.alert('Dados incompletos', 'Favor mencionar tipo e local da ocorrência.');
        }
    }

    //Navega para a tela Home
    function irHome() {
        navigation.navigate('Home', {idUser: route.params.idUser});
    }

    return (
        <ScrollView>
            <View style={styles.Container}>
                <View style={styles.InputContainer}>
                    <Text style={styles.TopTextTitle}>
                        Nos ajude a melhorar as rodovias!
                    </Text>
                    <Text style={styles.TopTextDescription}>
                        Registre uma ocorrência preenchendo o formulário abaixo:
                    </Text>
                </View>

                <View style={styles.InputContainer}>
                    <Text style={styles.InputDescription}>Vamos começar selecionando o tipo de ocorrência:</Text>
                    <RadioButton.Group onValueChange={tipo => setTipo(tipo)} value={tipo}>
                        <RadioButton.Item label="🕳️  Buraco" value="Buraco"></RadioButton.Item>
                        <RadioButton.Item label="〰️  Desnível" value="Desnível"></RadioButton.Item>
                        <RadioButton.Item label="🚧  Bloqueio" value="Bloqueio"></RadioButton.Item>
                        <RadioButton.Item label="🚸  Falta de Sinalização" value="Falta de Sinalização"></RadioButton.Item>
                    </RadioButton.Group>
                </View>
                
                <View style={styles.InputContainer}>
                    <Text style={styles.InputDescription}>Nos mostre o local:</Text>
                    <Text style={styles.Helper}>*Pressione e segure o marcador para mudar sua posição.</Text>
                    <MapView 
                        initialRegion={currentLocation ? currentLocation : {
                            latitude: -15.7933,
                            longitude: -47.8842,
                            latitudeDelta: 40.5000,
                            longitudeDelta: 40.5000,
                        }}
                        style={styles.ContainerMapa}
                        showsUserLocation= {true}
                        zoomEnabled={true}
                        loadingEnabled={true}
                        cacheEnabled={false}
                    >
                        <Marker 
                            coordinate={pin ? pin : {latitude: -15.7933, longitude: -47.8842,}}
                            pinColor= 'red'
                            draggable= {true}
                            onDragStart={(e) =>{
                                console.log("Drag Start", e.nativeEvent.coordinate);
                            }}
                            onDragEnd={(e) =>{
                                console.log("Drag End", e.nativeEvent.coordinate);
                                setPin({
                                    latitude: e.nativeEvent.coordinate.latitude,
                                    longitude: e.nativeEvent.coordinate.longitude,
                                })
                                Geocoder.init("APIKEY", {language : "pt-br"});
                                Geocoder.from(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude).then(json => {
                                        setEndereco(json.results[0].formatted_address);

                                        var exit = 0;
                                        var int = 0;
                                        while(exit != 1){
                                            if(json.results[0].address_components[int].types[0] == 'administrative_area_level_1'){
                                                setUf(json.results[0].address_components[int].short_name);
                                                exit = 1;

                                                if(json.results[0].address_components[int].short_name == "AC"||
                                                   json.results[0].address_components[int].short_name == "AP"||
                                                   json.results[0].address_components[int].short_name == "AM"||
                                                   json.results[0].address_components[int].short_name == "PA"||
                                                   json.results[0].address_components[int].short_name == "RO"||
                                                   json.results[0].address_components[int].short_name == "RR"||
                                                   json.results[0].address_components[int].short_name == "TO"){
                                                    setRegiao("Norte");
                                                }else if(json.results[0].address_components[int].short_name == "AL"||
                                                         json.results[0].address_components[int].short_name == "BA"||
                                                         json.results[0].address_components[int].short_name == "CE"||
                                                         json.results[0].address_components[int].short_name == "MA"||
                                                         json.results[0].address_components[int].short_name == "PB"||
                                                         json.results[0].address_components[int].short_name == "PI"||
                                                         json.results[0].address_components[int].short_name == "PE"||
                                                         json.results[0].address_components[int].short_name == "RN"||
                                                         json.results[0].address_components[int].short_name == "SE"){
                                                    setRegiao("Nordeste");
                                                }else if(json.results[0].address_components[int].short_name == "DF"||
                                                         json.results[0].address_components[int].short_name == "GO"||
                                                         json.results[0].address_components[int].short_name == "MT"||
                                                         json.results[0].address_components[int].short_name == "MS"){
                                                    setRegiao("Centro-Oeste");
                                                }else if(json.results[0].address_components[int].short_name == "ES"||
                                                         json.results[0].address_components[int].short_name == "MG"||
                                                         json.results[0].address_components[int].short_name == "RJ"||
                                                         json.results[0].address_components[int].short_name == "SP"){
                                                    setRegiao("Sudeste");
                                                }else if(json.results[0].address_components[int].short_name == "PR"||
                                                         json.results[0].address_components[int].short_name == "RS"||
                                                         json.results[0].address_components[int].short_name == "SC"){
                                                    setRegiao("Sul");
                                                }
                                            }else{
                                                int++
                                            }
                                        };
                                    })
                                    .catch(error => console.warn(error));
                            }}
                        >
                            
                        </Marker>
                    </MapView>         
                </View>

                <View style={styles.InputContainer}>
                    <Text style={styles.InputDescription}>Nos mande uma foto desse(a) {tipo == "" ? "..." : tipo.toLowerCase()}:</Text>
                    <Text style={styles.Helper}>*Clique na imagem para abrir a câmera.</Text>
                    <TouchableOpacity style={styles.ContainerImagem} onPress={() => openCamera()}>
                        <Image style={styles.Imagem} source={foto ? {uri: foto.uri} : require('../../images/imagemDefault.png')}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.InputContainer}>
                    <Text style={styles.InputDescription}>O que você pode nos dizer sobre esse(a) {tipo == "" ? "..." : tipo.toLowerCase()}?</Text>
                    <TextInput
                        mode="outlined"
                        label="Descrição"
                        value={descricao}
                        onChangeText={descricao => setDescricao(descricao)}
                    />
                </View>

                <View style={styles.BottomContainer}>
                    <TouchableOpacity style={styles.BottomButton} onPress={writeUserData}>
                        <Text style={styles.textSubmitAcessar}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "rgba(245,245,245 ,1)",
    },
    TopTextTitle: {
        fontWeight: "600",
        color: "rgba(66,66,66 ,1)",
        fontSize: 25,
    },
    TopTextDescription: {
        marginTop: 10,
        color: "rgba(66,66,66 ,1)",
    },
    InputContainer: {
        margin: 25,
    },
    Helper: {
        marginBottom: 10,
        color: "rgba(66,66,66 ,1)",
    },
    ContainerMapa: {
        height: 400,
    },
    ContainerImagem: {
        flex: 1,
        alignItems: 'center',
    },
    Imagem:{
        width: 300,
        height: 300,
    },
    InputDescription: {
        fontSize: 19,
        marginBottom: 15,
    },
    BottomContainer: {
        flex: 1,
        alignItems: "flex-end",
        marginBottom: 30,
        marginRight: 20,
    },
    BottomButton: {
        flex: 0.5,
        backgroundColor: "#35AAFF",
        width: 150,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    textSubmitAcessar: {
        color: "#FFF",
        fontSize: 17,
        fontWeight: "bold",
    }
});