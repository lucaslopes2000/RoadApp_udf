import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function CardOcorrencia({ data, irDetalhes }) {

    //Define qual ícone será exibido
    switch (data.tipo) {
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

    return(
        <TouchableOpacity style={styles.Container} onPress={() => irDetalhes(data.key)}>
            <View style={styles.IconeContainer}>
                <Text style={styles.Icone}>{icone}</Text>
            </View>
            <View style={styles.Descricao}>
                <Text style={styles.Titulo}>{data.tipo}</Text>
                <Text style={styles.Texto}>Status: {data.status}</Text>
                <Text style={styles.Texto}>Local: {data.endereco}</Text>
                <Text style={styles.Texto}>Horário: {data.abertoDtHr}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "rgba(79,195,247 ,1)",
        borderColor: "rgba(179,229,252 ,1)",
        borderRadius: 10,
        borderWidth: 5,
        margin: 10,
        height: 136,
    },
    IconeContainer: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center",
    },
    Icone: {
        fontSize: 50,
    },
    Descricao: {
        flex: 0.7,
        justifyContent: "center",
    },
    Titulo: {
        color: "rgba(225,245,254 ,1)",
        fontSize: 23,
        fontWeight: 'bold'
    },
    Texto: {
        color: "rgba(225,245,254 ,1)",
        fontSize: 14,
        marginTop: 2
    },
});
