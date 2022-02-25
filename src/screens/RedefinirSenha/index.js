import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, View, ImageBackground, Alert} from 'react-native';
import { app } from '../../firebaseConnection';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


export default function RedefinirSenha({ navigation }) {

  const [email, setEmail]= useState("")
  
  //Envia email de redefinição de senha
  async function passwordEmail(){
    const auth = getAuth(app);
    sendPasswordResetEmail(auth, email)
    .then(() => {
        Alert.alert('E-mail enviado','Foi enviado para seu e-mail de login um link para redefinição de senha.');
        setEmail('');

        irLogin();
    })
    .catch((error)=>{
      console.log(error);

      if(error.code == "auth/internal-error"){
        Alert.alert('Erro de envio','Erro inesperado ao tentar processar a solicitação.');
      }
      if(error.code == "auth/invalid-email"){
        Alert.alert('Erro de envio','O valor fornecido como e-mail é inválido.');
      }
      if(error.code == "auth/missing-email"){
        Alert.alert('Erro de envio','Por favor, digite seu e-mail de login.');
      }
      if(error.code == "auth/user-not-found"){
        Alert.alert('Erro de envio','Não foi encontrado conta de usuário com esse e-mail.');
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

        <Text style={styles.titulo}>Informe seu e-mail de login:</Text>

        <TextInput style={styles.Inputs}
          placeholder="E-mail"
          keyboardType= 'email-address'
          autoCapitalize= 'none'
          value={email}
          onChangeText={email => setEmail(email)}
        />
       
        <TouchableOpacity style={styles.btnSubmitAcessar}
          onPress={passwordEmail}>
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