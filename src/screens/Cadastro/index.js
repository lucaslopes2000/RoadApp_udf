import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, View, ImageBackground, Alert} from 'react-native';
import { app } from '../../firebaseConnection';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, child} from "firebase/database";


export default function Cadastro({ navigation }) {

  const [nome, setNome]= useState("")
  const [email, setEmail]= useState("")
  const [cpf, setCpf]= useState("")
  const [senha, setSenha]= useState("")

  //Cadastra novo usuário no firebase
  async function cadastrar(){
    const auth = getAuth(app)
    await createUserWithEmailAndPassword(auth, email, senha)
    .then((value)=> {
        //alert(value.user.uid);
        const database = getDatabase(app);
        set(child(ref(database, 'Usuarios'), value.user.uid),{
          nome: nome, cpf: cpf
        })

        Alert.alert('Cadastro realizado','Usuario criado com sucesso!');
        setNome('');
        setCpf(''),
        setEmail('');
        setSenha('');

        irLogin();
    })
    .catch((error)=>{
      console.log(error);

      if(error.code == "auth/internal-error"){
        Alert.alert('Erro de cadastro','Erro inesperado ao tentar processar a solicitação.');
      }
      if(error.code == "auth/invalid-email"){
        Alert.alert('Erro de cadastro','O valor fornecido como e-mail é inválido.');
      }
      if(error.code == "auth/email-already-in-use"){
        Alert.alert('Erro de cadastro','O e-mail fornecido já está em uso por outro usuário.');
      }
      if(error.code == "auth/weak-password"){
        Alert.alert('Erro de cadastro','A senha deve conter no mínimo 6 caracteres.');
      }
    })
  }

  //Navega para tela de login
  function irLogin() {
    navigation.navigate('Login');
  }

  return (
    <ImageBackground source={require('../../images/imagebk.jpg')} style={styles.image}> 
      <View style={styles.containerAcess}>

        <Text style={styles.titulo}>Insira seus dados para cadastro:</Text>

        <TextInput style={styles.Inputs}
          placeholder="Nome"
          value={nome}
          onChangeText={nome => setNome(nome)}
        />
        <TextInput style={styles.Inputs}
          placeholder="E-mail"
          keyboardType= 'email-address'
          autoCapitalize= 'none'
          value={email}
          onChangeText={email => setEmail(email)}
        />
        <TextInput style={styles.Inputs}
          placeholder="CPF"
          keyboardType= 'numeric'
          value={cpf}
          onChangeText={cpf => setCpf(cpf)}
        />
        <TextInput style={styles.Inputs}
          placeholder="Senha"
          secureTextEntry true
          autoCapitalize= 'none'
          value={senha}
          onChangeText={senha => setSenha(senha)}
        />
       
        <TouchableOpacity style={styles.btnSubmitAcessar}
          onPress={cadastrar}>
          <Text style={styles.textSubmitAcessar}>Enviar</Text>
        </TouchableOpacity>    
      </View>        
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  containerAcess: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: 'center'
  },
  titulo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 42,
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowRadius: 50,
  },
  Inputs: {
    backgroundColor: "#dcdcdc",
    width: "84%",
    marginBottom: 20,
    fontSize: 20,
    borderRadius: 10,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10
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
  }
});