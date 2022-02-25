import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, Animated, Keyboard } from 'react-native';
import { LogBox } from 'react-native'; 
import { app } from '../../firebaseConnection';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {

    const [email, setEmail]= useState("")
    const [senha, setSenha]= useState("")

    //Autenticação de usuário no firebase
    async function logar(){
        const auth = getAuth(app)
        await signInWithEmailAndPassword(auth, email, senha)
        .then((value) => {
            let user = value.user;
            Alert.alert("Login realizado", "Bem-vindo(a): " + user.email);
            navigation.navigate('Home', {idUser: user.uid});
        })
        .catch( (error) => {
            console.log(error);

            if(error.code == "auth/invalid-email"){
                Alert.alert('Erro de Login','O valor fornecido como e-mail é inválido.');
            }
            if(error.code == "auth/wrong-password"){
                Alert.alert('Erro de Login','Senha incorreta.');
            }
            if(error.code == "auth/user-not-found"){
                Alert.alert('Erro de Login','Usuário não encontrado.');
            }
            if(error.code == "auth/internal-error"){
                Alert.alert('Erro de Login','Erro inesperado ao tentar processar a solicitação.');
            }

            return;
        })
    
        setEmail('');
        setSenha('');
    }

    const [offset] = useState(new Animated.ValueXY({ x: 0, y: 90 }));
    const [opacity] = useState(new Animated.Value(0));
    const [logo] = useState(new Animated.ValueXY({x: 210, y: 210}));

    //Animação dos inputs
    useEffect(() => {
        keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        Animated.parallel([
            Animated.spring(offset.y, {
                toValue: 0,
                speed: 3,
                bounciness: 20
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200
            }),
            LogBox.ignoreLogs(['Animated: `useNativeDriver`'])
        ]).start();

    }, []);

    //Animação da logo
    function keyboardDidShow(){
        Animated.parallel([
            Animated.spring(logo.x, {
                toValue: 115,
                duration: 100
            }),
            Animated.timing(logo.y, {
                toValue: 115,
                duration: 100
            }),
        ]).start();
    };
    function keyboardDidHide(){
        Animated.parallel([
            Animated.spring(logo.x, {
                toValue: 210,
                duration: 100
            }),
            Animated.timing(logo.y, {
                toValue: 210,
                duration: 100
            }),
        ]).start();
    };

    return (   
        <KeyboardAvoidingView style={styles.background}>   
            <View style={styles.containerLogo}>
                <Animated.Image 
                style={{
                    width: logo.x,
                    height: logo.y,
                    marginTop: 100
                }}
                source={require('../../images/roadapp.png')}
                />
            </View>         
            <Animated.View style={[styles.container, {opacity: opacity, transform: [{ translateY: offset.y }]}]}>
                <TextInput style={styles.Inputs}
                    placeholder="E-mail"
                    keyboardType= 'email-address'
                    autoCapitalize= 'none'
                    value={email} 
                    onChangeText={text => setEmail(text)}
                />
                <TextInput style={styles.Inputs}
                    placeholder="Senha"
                    secureTextEntry true
                    autoCapitalize= 'none'
                    value={senha} 
                    onChangeText={text => setSenha(text)}
                />
                <TouchableOpacity style={styles.btnSubmitAcessar}
                    onPress={logar}>
                    <Text style={styles.textSubmitAcessar}>Acessar</Text>
                </TouchableOpacity>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity style={styles.btnSubmitCadastrar}
                        onPress={() => navigation.navigate('RedefinirSenha')}>
                        <Text style={styles.textSubmitCadastrar}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSubmitCadastrar}
                        onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={styles.textSubmitCadastrar}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    containerLogo: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "90%",
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: 'center'
    },
    text: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000a0"
    },
    Inputs: {
        backgroundColor: "#dcdcdc",
        width: "90%",
        marginBottom: 15,
        color: '#222',
        fontSize: 17,
        borderRadius: 10,
        fontWeight: "bold",
        textAlign: "center",
    },
    btnSubmitAcessar: {
        backgroundColor: "#35AAFF",
        width: "50%",
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    textSubmitAcessar: {
        color: "#FFF",
        fontSize: 18
    },
    textSubmitCadastrar: {
        color: "#FFF",
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    btnSubmitCadastrar: {
        flex: 1,
        margin: 20,
        alignItems: "center",
        justifyContent: "center"
    },
});