import React, { Component } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity, AsyncStorage } from "react-native";
import axios from 'axios';

const API_URL = "http://192.168.100.6:4000/api/geapp";

let setStoragge = async (ubic) => {
  try{
    await AsyncStorage.setItem('ubicacion', ubic);
    getStoragge();
  }
  catch(err){
    console.log(err)
  }
};

let clearStoragge = async() => {
  try{
    await AsyncStorage.clear();
  }
  catch(err){
    console.log(err)
  }
};

let getStoragge = async() => {
  try{
    mensaje = await AsyncStorage.getItem('ubicacion');
  }
  catch(err){
    console.log(err)
  }
};

export default class App extends Component {
  state = {
    longitud: null,
    latitud: null,
    fecha: null
  }

  

  geo = () => {
    navigator.geolocation.getCurrentPosition(
      posicion => {
        const longitud = JSON.stringify(posicion.coords.longitude);
        const latitud = JSON.stringify(posicion.coords.latitude);

        this.setState({ longitud, latitud });

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        
        const actual = yyyy + '-' + mm + '-' + dd;
        this.setState({ fecha : actual })

        const data = {
          nombre: 'Joel',
          longitud: this.state.longitud,
          latitud: this.state.latitud,
          fecha: this.state.fecha,
          ubicacion: `${latitud.toString()}, ${longitud.toString()}`
        }

        setStoragge(data.ubiacion)

        axios.post(API_URL, JSON.stringify(data))
        .then(response => {
          alert(JSON.stringify(response.data.ok))
          clearStoragge()
        })
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  render() {
    return (
      <View style={estilos.contenedor}>
        <Text>Geapp Tracker</Text>
        <TouchableOpacity onPress={()=>{setInterval(this.tracker,2000)}}>
          <Text style={estilos.texto}>Iniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{this.tracker}}>
        <Text style={estilos.texto}>Parar</Text>
          <Text>Longitud: {this.state.longitud}</Text>
          <Text>Latitud: {this.state.latitud}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e7ea"
  },
  texto: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  }
});