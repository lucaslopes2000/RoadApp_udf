import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { app } from '../../firebaseConnection';
import { getDatabase, ref, onValue } from "firebase/database";

export default function DashBoard_Regional() {

    const pesquisa = ["Estado", "Região"];
    const estados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
    const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

    const [option, setOption]= useState();

    const [uf, setUf]= useState();

    const [estado, setEstado] = useState([]);
    const [estadoAberto, setEstadoAberto] = useState([]);
    const [estadoEmAndamento, setEstadoEmAndamento] = useState([]);
    const [estadoResolvido, setEstadoResolvido] = useState([]);
    const [estadoBuraco, setEstadoBuraco] = useState([]);
    const [estadoDesnivel, setEstadoDesnivel] = useState([]);
    const [estadoBloqueio, setEstadoBloqueio] = useState([]);
    const [estadoSinalizacao, setEstadoSinalizacao] = useState([]);

    const [reg, setReg]= useState();

    const [regiao, setRegiao] = useState([]);
    const [regiaoAberto, setRegiaoAberto] = useState([]);
    const [regiaoEmAndamento, setRegiaoEmAndamento] = useState([]);
    const [regiaoResolvido, setRegiaoResolvido] = useState([]);
    const [regiaoBuraco, setRegiaoBuraco] = useState([]);
    const [regiaoDesnivel, setRegiaoDesnivel] = useState([]);
    const [regiaoBloqueio, setRegiaoBloqueio] = useState([]);
    const [regiaoSinalizacao, setRegiaoSinalizacao] = useState([]);

    async function loadEstado(dado){
        const db = getDatabase(app);
        const ocorrenciaRef = ref(db, 'Ocorrencias');
        await onValue(ocorrenciaRef, (snapshot)=>{
            setEstado([]);
            setEstadoAberto([]);
            setEstadoEmAndamento([]);
            setEstadoResolvido([]);
            setEstadoBuraco([]);
            setEstadoDesnivel([]);
            setEstadoBloqueio([]);
            setEstadoSinalizacao([]);

            snapshot.forEach((childItem)=>{
                childItem.forEach((childItem)=>{
                    let data = childItem.val().uf;

                    if (data == dado){
                        setEstado(oldArray => [...oldArray, data]);
                    }
                })

                childItem.forEach((childItem)=>{
                    let data = childItem.val().status;
                    let dataUf = childItem.val().uf;
    
                    if (data == "Aberto" && dataUf == dado){
                        setEstadoAberto(oldArray => [...oldArray, data]);
                    }else if (data == "Em andamento" && dataUf == dado){
                        setEstadoEmAndamento(oldArray => [...oldArray, data]);
                    }else if (data == "Resolvido" && dataUf == dado){
                        setEstadoResolvido(oldArray => [...oldArray, data]);
                    }
                })
    
                childItem.forEach((childItem)=>{
                    let data = childItem.val().tipo;
                    let dataUf = childItem.val().uf;
        
                    if (data == "Buraco" && dataUf == dado){
                        setEstadoBuraco(oldArray => [...oldArray, data]);
                    }else if (data == "Desnível" && dataUf == dado){
                        setEstadoDesnivel(oldArray => [...oldArray, data]);
                    }else if (data == "Bloqueio" && dataUf == dado){
                        setEstadoBloqueio(oldArray => [...oldArray, data]);
                    }else if (data == "Falta de Sinalização" && dataUf == dado){
                        setEstadoSinalizacao(oldArray => [...oldArray, data]);
                    }
                })
            })
        });    
    }

    async function loadRegiao(dado){
        const db = getDatabase(app);
        const ocorrenciaRef = ref(db, 'Ocorrencias');
        await onValue(ocorrenciaRef, (snapshot)=>{
            setRegiao([]);
            setRegiaoAberto([]);
            setRegiaoEmAndamento([]);
            setRegiaoResolvido([]);
            setRegiaoBuraco([]);
            setRegiaoDesnivel([]);
            setRegiaoBloqueio([]);
            setRegiaoSinalizacao([]);

            snapshot.forEach((childItem)=>{
                childItem.forEach((childItem)=>{
                    let data = childItem.val().regiao;

                    if (data == dado){
                        setRegiao(oldArray => [...oldArray, data]);
                    }
                })

                childItem.forEach((childItem)=>{
                    let data = childItem.val().status;
                    let dataUf = childItem.val().regiao;
    
                    if (data == "Aberto" && dataUf == dado){
                        setRegiaoAberto(oldArray => [...oldArray, data]);
                    }else if (data == "Em andamento" && dataUf == dado){
                        setRegiaoEmAndamento(oldArray => [...oldArray, data]);
                    }else if (data == "Resolvido" && dataUf == dado){
                        setRegiaoResolvido(oldArray => [...oldArray, data]);
                    }
                })
    
                childItem.forEach((childItem)=>{
                    let data = childItem.val().tipo;
                    let dataUf = childItem.val().regiao;
        
                    if (data == "Buraco" && dataUf == dado){
                        setRegiaoBuraco(oldArray => [...oldArray, data]);
                    }else if (data == "Desnível" && dataUf == dado){
                        setRegiaoDesnivel(oldArray => [...oldArray, data]);
                    }else if (data == "Bloqueio" && dataUf == dado){
                        setRegiaoBloqueio(oldArray => [...oldArray, data]);
                    }else if (data == "Falta de Sinalização" && dataUf == dado){
                        setRegiaoSinalizacao(oldArray => [...oldArray, data]);
                    }
                })
            })
        });    
    }

    return (
        <ScrollView style={styles.Container}>
            <View style={{justifyContent:"center", alignItems:'center'}}>
                <SelectDropdown
                    data={pesquisa}
                    defaultButtonText="Pesquisar por..."
                    buttonStyle={styles.ContainerDropdown}
                    renderDropdownIcon={() => {
                        return (
                          <Icon name="chevron-down" color={"#444"} size={18} />
                        );
                    }}
                    dropdownIconPosition={"right"}
                    onSelect={(selectedItem) => {
                        setOption(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item) => {
                        return item
                    }}
                />
            </View>
            {option != null &&
            <View style={{justifyContent:"center", alignItems:'center'}}>
                <SelectDropdown
                    data={option == "Estado" ? estados : regioes}
                    defaultButtonText= {'Selecionar ' +(option == "Estado" ? "estado" : "região")+ '...'}
                    buttonStyle={styles.ContainerDropdown}
                    renderDropdownIcon={() => {
                        return (
                          <Icon name="chevron-down" color={"#444"} size={18} />
                        );
                    }}
                    dropdownIconPosition={"right"}
                    onSelect={(selectedItem) => {
                        if(option == "Estado"){
                            setReg(null);
                            loadEstado(selectedItem);
                            setUf(selectedItem);
                        }else if(option == "Região"){
                            setUf(null);
                            loadRegiao(selectedItem);
                            setReg(selectedItem);
                        }
                    }}
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item) => {
                        return item
                    }}
                />
            </View>
            }

            {uf != null &&
            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextStatus}>Ocorrências por Estado</Text>
                <Text style={styles.TextStatus}>{uf}</Text>
                <Text style={styles.TextStatus}>Total: {estado.length}</Text>
                <Text style={styles.TextDescricao}>Em aberto: {estadoAberto.length}</Text>
                <Text style={styles.TextDescricao}>Em andamento: {estadoEmAndamento.length}</Text>
                <Text style={styles.TextDescricao}>Resolvidas: {estadoResolvido.length}</Text>
                <Text style={styles.TextStatus}>Tipos</Text>
                <Text style={styles.TextDescricao}>Buraco: {estadoBuraco.length}</Text>
                <Text style={styles.TextDescricao}>Desnível: {estadoDesnivel.length}</Text>
                <Text style={styles.TextDescricao}>Bloqueio: {estadoBloqueio.length}</Text>
                <Text style={styles.TextDescricao}>Falta de sinalização: {estadoSinalizacao.length}</Text>
            </View>
            }

            {reg != null &&
            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextStatus}>Ocorrências por Região</Text>
                <Text style={styles.TextStatus}>{reg}</Text>
                <Text style={styles.TextStatus}>Total: {regiao.length}</Text>
                <Text style={styles.TextDescricao}>Em aberto: {regiaoAberto.length}</Text>
                <Text style={styles.TextDescricao}>Em andamento: {regiaoEmAndamento.length}</Text>
                <Text style={styles.TextDescricao}>Resolvidas: {regiaoResolvido.length}</Text>
                <Text style={styles.TextStatus}>Tipos</Text>
                <Text style={styles.TextDescricao}>Buraco: {regiaoBuraco.length}</Text>
                <Text style={styles.TextDescricao}>Desnível: {regiaoDesnivel.length}</Text>
                <Text style={styles.TextDescricao}>Bloqueio: {regiaoBloqueio.length}</Text>
                <Text style={styles.TextDescricao}>Falta de sinalização: {regiaoSinalizacao.length}</Text>
            </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    TextStatus:{
        fontSize: 20,
        marginBottom: 15,
        textAlign:'center',
        fontWeight: 'bold',
    },
    TextDescricao:{
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        textAlign:'justify'
    },
    ContainerDetalhes:{
        padding: 10,
        backgroundColor:'#e3e3e3',
        borderRadius: 15,
        elevation: 10,
        margin: 18,
    },
    ContainerDropdown:{
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 1,
        width: '80%'
    }
});