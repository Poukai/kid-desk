import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {sendCommand,getDeskHeight} from "./Scan";
import {Commands} from "./config";
import {AsyncStorage} from 'react-native';
import localStorage from 'react-native-sync-localstorage';
import {stringToBytes, bytesToString} from 'convert-string';
import { bindActionCreators } from 'redux';
import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
var Buffer = require('buffer/').Buffer

console.log(global.storage);
const storage = global.storage;
// import {bleManagerEmitter} from "./Scan";

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId : "A",
      initialHeight : 70
    };
    this.setData("A");
    this.setData("B");
  }
  handleClickMovement = (cmd) => {
    console.log(this.state.initialHeight);
    this
      .props
      .navigation
      .navigate('Moving', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd,
        height: this.state.initialHeight
      });
    sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);

  }

  handleLongPress = (cmd) => {
    console.log(this.state.initialHeight);
    this
      .props
      .navigation
      .navigate('Edit', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd,
        height: this.state.initialHeight
      });
    sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
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

  setData = (profile,pos1=70,pos4=70) => {
    console.log("Setting Data in localStorage for "+profile , pos1 , pos4);
    localStorage.setItem(profile, {"POS1": pos1,"POS4": pos4});

  }
  getData = () => {
    console.log("userA" + JSON.stringify(localStorage.getItem('userA')));
    console.log("userB" + JSON.stringify(localStorage.getItem('userB')));
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
  render() {
    return (
      <View style={styles.mainContainer}>
        <Grid>

        <Row style={styles.buttonsRow}>
        <Button
            onPress={()=>{this.getDeskHeight(this.props.navigation.state.params.connected_peripheral,Commands.GET_HEIGHT)}}
            title="get height"
            buttonStyle={styles.settingsButton}
            transparent/>
          <Button
            onPress={()=>{this.switchProfile("A")}}
            title="Profile A"
            buttonStyle={styles.settingsButton}
            transparent/>
          <Button
            onPress={()=>{this.switchProfile("B")}}
            title="Profile B"
            buttonStyle={styles.settingsButton}
            transparent/>
          <Button
            leftIcon={{
            name: 'settings'
          }}onPress={this.gotoSettings}
            transparent
            buttonStyle={styles.settingsButton}
            title='Settings'/></Row>
          <Row>
            <Col
              style={[styles.arrowBlockExtreme]}>
              <TouchableHighlight
                style={styles.arrowCircleBig}
                onPress={() => {
                this.handleClickMovement(Commands.DOWN)
              }}
                onLongPress={() => {
                this.handleLongPress(Commands.SAVE_POS1)
              }}
                underlayColor={blue}>
                <Image
                  style={{
                  width: 35,
                  height: 50,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Sitdown.png')}/></TouchableHighlight>
              <Text style={styles.arrowText}>Sit down</Text>
              <Text style={styles.arrowTextBottom}>Tap and hold Icon to edit</Text>

            </Col>
            </Row>
            <Row>
            <Col style={[styles.arrowBlockExtreme,styles.arrowBlockExtremeSecond]}>
              <TouchableHighlight
                style={styles.arrowCircleBig}
                onPress={() => {
                this.handleClickMovement(Commands.UP)
              }}
                onLongPress={() => {
                this.handleLongPress(Commands.SAVE_POS4)
              }}
                underlayColor={blue}>
                <Image
                  style={{
                  width: 35,
                  height: 50,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Standup.png')}/></TouchableHighlight>
              <Text style={styles.arrowText}>Stand Up</Text>
              <Text style={styles.arrowTextBottom}>Tap and hold Icon to edit</Text>
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  settingsButton: {
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    marginTop:30,
  },
  buttonsRow :{
    height:80,
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
    color: "#d5d5d5",
    zIndex: 10000,
    marginTop: 9,
    fontSize:20,
    fontFamily:"SFProDisplay-Regular"
  },
  arrowTextBottom: {
    color: "#d5d5d5",
    zIndex: 10000,
    position: 'absolute',
    fontSize:12,
    bottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily:"SFProDisplay-Regular"
  },
  arrowBlockExtreme: {
    backgroundColor: '#000000',
    textAlign: 'center',
    width: 30,
    height: 250,
    borderRadius: 20,
    marginLeft: 14,
    marginRight: 14,
    flex: 1,
    marginTop:20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowBlockExtremeSecond: {
    marginTop: 10
  }
});

export default Control;