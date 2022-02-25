import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Home from './src/screens/Home';
import NovaOcorrencia from './src/screens/NovaOcorrencia';
import Detalhes from './src/screens/Detalhes';
import DashBoard from './src/screens/DashBoard';
import DashBoard_Regional from './src/screens/DashBoard_Regional';
import RedefinirSenha from './src/screens/RedefinirSenha';

const Tab = createMaterialTopTabNavigator();

function TopTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Geral" component={DashBoard} />
      <Tab.Screen name="Regional" component={DashBoard_Regional} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <Stack.Screen 
          name="Cadastro" 
          component={Cadastro} 
          options={{headerShown: false}} 
        />
        <Stack.Screen 
          name="RedefinirSenha" 
          component={RedefinirSenha} 
          options={{headerShown: false}} 
        />
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{
            title: 'RoadApp',
            headerBackVisible: false
          }}
        />
        <Stack.Screen 
          name="NovaOcorrencia" 
          component={NovaOcorrencia}
          options={{
            title: 'Nova Ocorrência',
          }}
        />
        <Stack.Screen 
          name="Detalhes" 
          component={Detalhes}
          options={{
            title: 'Detalhes',
          }}
        />
        <Stack.Screen 
          name="DashBoard" 
          component={TopTab}
          options={{
            title: 'DashBoard',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const screenOptions={
  headerStyle:{
      backgroundColor:'black',
  },
  headerTintColor: '#fff',
  headerTitleAlign: 'center',
  headerTitleStyle: {
      fontWeight: 'bold',
  }
}

export default App;