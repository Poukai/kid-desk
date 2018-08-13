import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getHeight } from './actions/index'
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Keyboard,
  TextInput,
  TouchableHighlight,
  Text,
  TouchableOpacity,
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
import {Button} from 'react-native-elements';
import { bindActionCreators } from 'redux';
import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
var Buffer = require('buffer/').Buffer
import {Col, Row, Grid} from "react-native-easy-grid";
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {LocalDatabase} from './localdatabase';
import PouchDB from 'pouchdb-react-native'

const localDB = new PouchDB('myDB')
console.log(localDB.adapter)

AsyncStorage.getAllKeys()
  .then(keys => AsyncStorage.multiGet(keys))
  .then(items => console.log('all pure Items', items))
  .catch(error => console.warn('error get all Items', error))
// import {bleManagerEmitter} from "./Scan";

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height,
      userId : "A"
    };
  }
  handleClickMovement = (cmd) => {
    console.log(cmd);
    sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
    this.state.height && this
      .props
      .navigation
      .navigate('Moving', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd : cmd,
        profile:this.state.userId,
        height: this.state.height
      });

  }

  handleLongPress = (cmd) => {
    console.log(cmd);
    this.state.height && this
      .props
      .navigation
      .navigate('Edit', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd,
        height: this.state.height
      });
    
  }
  getDeskHeight = (id,command) => {
    BleManager
    .retrieveServices(id)
    .then((peripheralInfo) => {
      // Success code
      console.log(peripheralInfo);
      const id = peripheralInfo.id;
      const services = peripheralInfo.services;
      const characteristics = peripheralInfo.characteristics;
      let tmp = JSON.stringify(command);
      const data = stringToBytes(tmp);
      BleManager
        .write(id, services[2].uuid, characteristics[6].characteristic, data)
        .then((readData) => {
          console.log("readData"+readData)
        })
        .catch((error) => {
          // Failure code
          console.log(error);
        });
    })
    .catch((error) => {
      // Failure code
      console.log(error);
    });
  
  }

  componentWillMount(){
    this.getDeskHeight(this.props.navigation.state.params.connected_peripheral,Commands.GET_HEIGHT);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height.height
    });
  }
  setData = (profile,pos1=70,pos4=70) => {
   
    

  }
  getData = () => {
  }
  gotoSettings=()=>{
    this
      .props
      .navigation
      .navigate('Settings', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
      });
  }
  switchProfile=(profile)=>{
    this.setState({
      userId : profile
    })
    console.log(profile);
  }
  movemendCommand= async (direction)=>{
    
    const cmd = await this.switchCommandCheckStorage(direction);
    this.handleClickMovement(cmd);
  }
  switchCommandCheckStorage=async (direction)=>{
    let storageKey= "POS2";
    if(this.state.userId == "A" && direction == "up" ){
      // POS2
      storageKey= "POS2";
    }
    else if(this.state.userId == "A" && direction == "down" ){
      // POS1
      storageKey= "POS1";
    }
    else if(this.state.userId == "B" && direction == "up" ){
      // POS4
      storageKey= "POS4";
    }
    else if(this.state.userId == "B" && direction == "down" ){
      // POS3
      storageKey= "POS3";
    }
    console.log("Control switchCommandCheckStorage storageKey begin01 ",storageKey);
    let positionStorage = null;
    try {
      const doc = await db.get(storageKey);
      console.log(doc);
      positionStorage = doc;
      return Commands[storageKey];
    } catch (err) {
      if(direction == "up")
        return Commands.UP;
    if(direction == "down")
        return Commands.DOWN;
    }
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Grid>
        <Row style={styles.buttonsRow}>
        <Text style={styles.profileText}>Profile</Text>
          <Button
            onPress={()=>{this.switchProfile("A")}}
            title="A"
            buttonStyle={[styles.settingsButton,this.state.userId == "A" ? styles.activeButton : styles.inactiveButton]}
            textStyle={this.state.userId == "A" ? styles.activeButtonText : styles.inactiveButtonText}
            transparent/>
          <Button
            onPress={()=>{this.switchProfile("B")}}
            title="B"
            textStyle={this.state.userId == "B" ? styles.activeButtonText : styles.inactiveButtonText}
            buttonStyle={[styles.settingsButton,styles.settingsButton2,this.state.userId == "B" ? styles.activeButton : styles.inactiveButton]}
            transparent/>
            <View style={{flex:1}}>
          <Button
            leftIcon={{
            name: 'settings'
          }}
          onPress={this.gotoSettings}
            transparent
            buttonStyle={styles.settingsButtonBig}
            title='Settings'/>
            </View>
          </Row>


          <Row style={styles.controlsRow}>
            <TouchableOpacity
              onPress={ () => {
                  this.movemendCommand("down");
            }}
          //   onLongPress={() => {
          //   const commandHighPoint = this.state.userId=="A" ? Commands.SAVE_POS1 : Commands.SAVE_POS2
          //   this.handleLongPress(commandHighPoint)
          // }}
          >
            <View
              style={[styles.arrowBlockExtreme]}>
              <View
            style={styles.arrowCircleBig}>
                <Image
                  style={{
                  width: 35,
                  height: 50,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Sitdown.png')}/></View>
              <Text style={styles.arrowText}>Sit down</Text>
              <Text style={styles.arrowTextBottom}>Tap and hold Icon to edit</Text>
                </View>
            </TouchableOpacity>
            </Row>

              <Row style={styles.controlsRow2}>
            <TouchableOpacity 
             onPress={() => {
              this.movemendCommand("up");
            }}
          //   onLongPress={() => {
          //     const commandLowPoint = this.state.userId=="A" ? Commands.SAVE_POS4 : Commands.SAVE_POS3
          //     this.handleLongPress(commandLowPoint)
          // }}
          >
            <View style={[styles.arrowBlockExtreme]}>
              <View
                style={styles.arrowCircleBig}>
                <Image
                  style={{
                  width: 35,
                  height: 50,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Standup.png')}/></View>
              <Text style={styles.arrowText}>Stand Up</Text>
              <Text style={styles.arrowTextBottom}>Tap and hold Icon to edit</Text>
            </View>
          </TouchableOpacity>
              </Row>

        </Grid>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  settingsButtonBig:{
    marginTop:19,
    marginRight:-5,
    alignSelf:'flex-end',
    justifyContent: 'flex-end'
  },
  settingsButton: {
    width:70,
    height:36,
    borderRadius: 18,
    borderColor: "#414141",
    borderWidth: 1,
    marginRight:-30,
    marginTop:25,
    backgroundColor:"#414141"
  },
  settingsButton2:{
    marginLeft:5
  },
  profileText:{
    color:'#fff',
    fontSize:18,
    marginTop:30,
    marginLeft:14,
  },
  buttonsRow :{
    height:80,
    minWidth:width,
    width:width,
    flexWrap: 'wrap',
    
  },
  arrowBlockCutsom: {
    marginRight: 0
  },
  arrowCircle: {
    backgroundColor: '#979797',
    width: 60,
    borderRadius: 50,
    height: 60
  },
  arrowCircleBig: {
    backgroundColor: '#979797',
    width: 70,
    borderRadius: 50,
    height: 70
  },
  activeButton:{backgroundColor:blue,borderColor:blue},
  inactiveButton:{},
  mainContainer: {
    backgroundColor: '#222',
    position: 'absolute',
    minWidth: width,
    minHeight: height,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  arrowText: {
    color: "#9B9B9B",
    zIndex: 10000,
    marginTop: 9,
    fontSize:20,
    fontFamily:"SFProDisplay-Regular"
  },
  arrowTextBottom: {
    color: "#9B9B9B",
    zIndex: 10000,
    position: 'absolute',
    fontSize:14,
    bottom: 13,
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily:"SFProDisplay-Regular"
  },
  arrowBlockExtreme: {
    backgroundColor: '#000000',
    width: width-30,
    maxHeight: (height-110)/2,
    height:(height-110)/2,
    borderRadius: 20,
    marginLeft: 14,
    marginRight: 14,
    flex: 1,
    position:"relative",
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowBlockExtremeSecond: {
  },
  inactiveButtonText:{
    
  },
  controlsRow:{
    marginTop:5,
  },
  controlsRow2:{
  },
  activeButtonText:{
    color:"#fff"
  }
});


const mapStateToProps = (state) => ({height: state.update});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Control);