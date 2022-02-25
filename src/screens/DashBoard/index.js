import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { app } from '../../firebaseConnection';
import { getDatabase, ref, child, onValue } from "firebase/database";

export default function DashBoard({ route }) {

    const [total, setTotal] = useState();
    const [totalAberto, setTotalAberto] = useState([]);
    const [totalEmAndamento, setTotalEmAndamento] = useState([]);
    const [totalResolvido, setTotalResolvido] = useState([]);
    const [totalBuraco, setTotalBuraco] = useState([]);
    const [totalDesnivel, setTotalDesnivel] = useState([]);
    const [totalBloqueio, setTotalBloqueio] = useState([]);
    const [totalSinalizacao, setTotalSinalizacao] = useState([]);

    const [global, setGlobal] = useState([]);
    const [globalAberto, setGlobalAberto] = useState([]);
    const [globalEmAndamento, setGlobalEmAndamento] = useState([]);
    const [globalResolvido, setGlobalResolvido] = useState([]);
    const [globalBuraco, setGlobalBuraco] = useState([]);
    const [globalDesnivel, setGlobalDesnivel] = useState([]);
    const [globalBloqueio, setGlobalBloqueio] = useState([]);
    const [globalSinalizacao, setGlobalSinalizacao] = useState([]);

    useEffect(()=> {  
        loadOcorrencias();
        loadTodas();
    }, []);

    async function loadOcorrencias(){
        const db = getDatabase(app);
        const ocorrenciaRef = child(ref(db, 'Ocorrencias'), route.params.idUser);
        await onValue(ocorrenciaRef, (snapshot)=>{
            setTotal();
            setTotalAberto([]);
            setTotalEmAndamento([]);
            setTotalResolvido([]);
            setTotalBuraco([]);
            setTotalDesnivel([]);
            setTotalBloqueio([]);
            setTotalSinalizacao([]);

            setTotal(snapshot.size);
            
            snapshot.forEach((childItem)=>{
                let data = childItem.val().status;

                if (data == "Aberto"){
                    setTotalAberto(oldArray => [...oldArray, data]);
                }else if (data == "Em andamento"){
                    setTotalEmAndamento(oldArray => [...oldArray, data]);
                }else if (data == "Resolvido"){
                    setTotalResolvido(oldArray => [...oldArray, data]);
                }
            })

            snapshot.forEach((childItem)=>{
                let data = childItem.val().tipo;
    
                if (data == "Buraco"){
                    setTotalBuraco(oldArray => [...oldArray, data]);
                }else if (data == "Desnível"){
                    setTotalDesnivel(oldArray => [...oldArray, data]);
                }else if (data == "Bloqueio"){
                    setTotalBloqueio(oldArray => [...oldArray, data]);
                }else if (data == "Falta de Sinalização"){
                    setTotalSinalizacao(oldArray => [...oldArray, data]);
                }
            })
        });
    }

    async function loadTodas(){
        const db = getDatabase(app);
        const ocorrenciaRef = ref(db, 'Ocorrencias');
        await onValue(ocorrenciaRef, (snapshot)=>{
            setGlobal([]);
            setGlobalAberto([]);
            setGlobalEmAndamento([]);
            setGlobalResolvido([]);
            setGlobalBuraco([]);
            setGlobalDesnivel([]);
            setGlobalBloqueio([]);
            setGlobalSinalizacao([]);

            snapshot.forEach((childItem)=>{
                childItem.forEach((childItem)=>{
                    let data = childItem.key;
    
                    setGlobal(oldArray => [...oldArray, data]);
                })

                childItem.forEach((childItem)=>{
                    let data = childItem.val().status;
    
                    if (data == "Aberto"){
                        setGlobalAberto(oldArray => [...oldArray, data]);
                    }else if (data == "Em andamento"){
                        setGlobalEmAndamento(oldArray => [...oldArray, data]);
                    }else if (data == "Resolvido"){
                        setGlobalResolvido(oldArray => [...oldArray, data]);
                    }
                })
    
                childItem.forEach((childItem)=>{
                    let data = childItem.val().tipo;
        
                    if (data == "Buraco"){
                        setGlobalBuraco(oldArray => [...oldArray, data]);
                    }else if (data == "Desnível"){
                        setGlobalDesnivel(oldArray => [...oldArray, data]);
                    }else if (data == "Bloqueio"){
                        setGlobalBloqueio(oldArray => [...oldArray, data]);
                    }else if (data == "Falta de Sinalização"){
                        setGlobalSinalizacao(oldArray => [...oldArray, data]);
                    }
                })
            })
        }); 
    }

    return (
        <ScrollView style={styles.Container}>
            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextStatus}>Minhas ocorrências</Text>
                <Text style={styles.TextStatus}>Total: {total}</Text>
                <Text style={styles.TextDescricao}>Em aberto: {totalAberto.length}</Text>
                <Text style={styles.TextDescricao}>Em andamento: {totalEmAndamento.length}</Text>
                <Text style={styles.TextDescricao}>Resolvidas: {totalResolvido.length}</Text>
                <Text style={styles.TextStatus}>Tipos</Text>
                <Text style={styles.TextDescricao}>Buraco: {totalBuraco.length}</Text>
                <Text style={styles.TextDescricao}>Desnível: {totalDesnivel.length}</Text>
                <Text style={styles.TextDescricao}>Bloqueio: {totalBloqueio.length}</Text>
                <Text style={styles.TextDescricao}>Falta de sinalização: {totalSinalizacao.length}</Text>
            </View>

            <View style={styles.ContainerDetalhes}>
                <Text style={styles.TextStatus}>Total de ocorrências registradas</Text>
                <Text style={styles.TextStatus}>Total: {global.length}</Text>
                <Text style={styles.TextDescricao}>Em aberto: {globalAberto.length}</Text>
                <Text style={styles.TextDescricao}>Em andamento: {globalEmAndamento.length}</Text>
                <Text style={styles.TextDescricao}>Resolvidas: {globalResolvido.length}</Text>
                <Text style={styles.TextStatus}>Tipos</Text>
                <Text style={styles.TextDescricao}>Buraco: {globalBuraco.length}</Text>
                <Text style={styles.TextDescricao}>Desnível: {globalDesnivel.length}</Text>
                <Text style={styles.TextDescricao}>Bloqueio: {globalBloqueio.length}</Text>
                <Text style={styles.TextDescricao}>Falta de sinalização: {globalSinalizacao.length}</Text>
            </View>
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
    }
});