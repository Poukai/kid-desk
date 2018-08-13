import React, {Component} from 'react';
import {connect} from 'react-redux';
import {updateHeight} from './actions/index'
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  NativeEventEmitter, // for emitting events for the BLE manager
  NativeModules, // for getting an instance of the BLE manager module
  Platform,
  FlatList,
  PermissionsAndroid,
  Alert
} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {stringToBytes, bytesToString} from 'convert-string';
import {Button, FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import {bindActionCreators} from 'redux';
import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
import localStorage from 'react-native-sync-localstorage';
const {width, height} = Dimensions.get('window');
 
var validator = require("email-validator");
var Buffer = require('buffer/').Buffer

const blue = "#00A7F7";
const ACCESS_TOKEN = 'token'
const ACCOUNT = 'id'
const DEVICE_NAME_DESK = "DeskBLE"
const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SFProDisplay"
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      validate: false,
      loading: false,
      showError:false,
    };
    this.checkAuth();
  }
  checkAuth=()=>{
    let storage = async() => await AsyncStorage.getItem('auth');
    storage().then((res) => {
      if (res) {
        console.log("Res "+res);
        this.props.navigation.navigate('Scan');
        //we have out data
      }
    }).catch((err) => {
      // oops
      console.log(err);
    });
  }
  validate = (text) => {
    let a = validator.validate(text); // true
    if (validator.validate(text)) {
      this.setState({validate: true, email: text,showError : false})
    } else {
      this.setState({validate: false, email: text ,showError : true})
    }
  }
  handleButton = () => {
    if (this.state.validate) {
      // api call success
      var data = new FormData();
      data.append("email", "amit@a.com");
      data.append("password", "123456");
      this.setState({loading: true});
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function (event) {
        if (event.target.status == 200) {
          AsyncStorage.setItem('auth', event.target.response);
          this.props.navigation.navigate('Scan');
          this.setState({loading : false});
        }
    }.bind(this));
    xhr.open("POST", "http://35.240.159.234/api/auth");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
  }
}
render() {
  return (
    <ScrollView style={styles.container}>
      <Image
        style={{
        width: 35,
        height: 35,
        alignItems: "center",
        alignSelf: "center",
        marginTop: 70
      }}
        source={require('./images/Logo.png')}/>
      <Text style={styles.headerTitle}>Welcome to Kid Desk</Text>
      <Text style={styles.headerDesc}>Please submit your email before using the app.</Text>
      <View style={styles.bluetoothBox}>
          <TextInput
        style={styles.emailField}
        onChangeText={(text) => this.validate(text)}
        value={this.state.email}
        placeholder="Please enter your Email Address"
      />
      {this.state.showError && <FormValidationMessage>Please enter a valid Email</FormValidationMessage>}
        <Button
          onPress={this.handleButton}
          buttonStyle={styles.openBTsettings}
          title="Submit"
          large
          backgroundColor="#017DF7"/>
      </View>
    </ScrollView>
  );
}
}

const styles = StyleSheet
.create({
container: {
  backgroundColor: '#fff',
  paddingBottom: 50
},
headerTitle: {
  fontFamily: fontFamily,
  fontSize: 28,
  alignItems: "center",
  alignSelf: "center",
  color: "#333",
  fontWeight: "bold",
  marginTop: 30
},
headerDesc: {
  fontFamily: fontFamily,
  fontSize: 18,
  color: "#333333",
  fontWeight: "normal",
  marginTop: 15,
  textAlign: "center",
  marginLeft: 60,
  marginRight: 60,
  marginBottom: 40
},
bluetoothBox: {
  borderColor: '#eee',
  paddingTop: 20,
  marginLeft: 15,
  marginRight: 15
},
emailField: {
  borderWidth: 2,
  borderColor: "#eee",
  paddingRight:10,
  marginLeft:15,
  marginRight:15,
  paddingRight:20,
  height:50,
  textAlign:'center',
  fontSize:18
},
deviceList: {
  backgroundColor: '#F0EFF5',
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: "#979797",
  marginLeft: 15,
  marginRight: 15,
  marginTop: 20,
  marginBottom: 40
},
connectionStatus: {
  fontSize: 16,
  color: "#aaa",
  alignItems: "flex-start",
  alignSelf: "flex-start",
  marginLeft: 15,
  marginRight: 15
},
openBTsettings: {
  marginBottom: 50,
  marginTop: 40
},
deviceListItem: {
  padding: 10
}
});

export default Home;