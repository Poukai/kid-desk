import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getHeight } from './actions/index';
import RNRestart from 'react-native-restart';
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
  Alert,
  AppState
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
import PouchDB from 'pouchdb-react-native'

import { debounce } from 'lodash';
import {setItem,getItem} from './localdatabase';
const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Regular"

const onClickView = funcOnView => {
  return debounce(funcOnView, 1000, {
    trailing: false,
    leading: true
  });
};
const purple="#4B00A4";
const localDB = new PouchDB('myDB')
console.log(localDB.adapter)

// AsyncStorage.getAllKeys()
//   .then(keys => AsyncStorage.multiGet(keys))
//   .then(items => Alert.alert('all pure Items', JSON.stringify(items)))
//   .catch(error => console.warn('error get all Items', error))
// import {bleManagerEmitter} from "./Scan";

const {width} = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;
const blue = "#00A7F7";
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height:0,
      userId : "A",
      index1:null,
      index2:null,
      index3:null,
      index4:null,
      appState: AppState.currentState
    };
  }
  handleClickMovement = onClickView((cmd) => {
    console.log("table should move"+cmd);
    const b = sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
    this.state.height && this
      .props
      .navigation
      .navigate('Moving', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd : cmd,
        profile:this.state.userId,
        height: this.state.height
      });

  })

  handleLongPress = onClickView((cmd) => {
    console.log(cmd);
    this.state.height && this
      .props
      .navigation
      .navigate('Edit', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd,
        height: this.state.height
      });
    
  })
  getDeskHeight = (id,command) => {

    if(Platform.OS === "ios"){
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
        .writeWithoutResponse(id, services[0], characteristics[0].characteristic, data)
        .then((response) => {
          console.log("getDeskHeight  "+response);
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
    else{
      sendCommand(this.props.navigation.state.params.connected_peripheral,Commands.GET_HEIGHT)
    }


    
  
  }

  getValuesFromDb= async()=>{
    const key1 = await getItem('1').then((result) => this.setState({ index1: result }));
    const key2 = await getItem('2').then((result) => this.setState({ index2: result }));
    const key3 = await getItem('3').then((result) => this.setState({ index3: result }));
    const key4 = await getItem('4').then((result) => this.setState({ index4: result }));
    if(this.props.navigation.state.params && this.props.navigation.state.params.index && this.props.navigation.state.params.height){
      const indexKey =  this.props.navigation.state.params.index;
      let height = Number(this.props.navigation.state.params.height);
      this.setState({
        indexKey:height
      })
    }
  }
  componentWillMount(){
    this.getDeskHeight(this.props.navigation.state.params.connected_peripheral,Commands.GET_HEIGHT)
    this.getValuesFromDb();
  }
  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange);
    this.props.navigation.addListener('willFocus', () => this.getValuesFromDb())
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height.height
    });
  }
  componentWillUnmount(){
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      RNRestart.Restart();
    }
    this.setState({appState: nextAppState});
  }
  gotoSettings=()=>{
    this
      .props
      .navigation
      .navigate('Settings', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
      });
  }
  switchProfile=onClickView((profile)=>{
    this.setState({
      userId : profile
    })
    console.log(profile);
  })
  movemendCommand= (direction)=>{
    let cmd="";
    if(direction == "up")
    cmd = Commands.UP
    else if(direction == "down")
    cmd = Commands.DOWN
    this.state.height && this
      .props
      .navigation
      .navigate('Moving', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd : cmd,
        direction:direction,
        profile:this.state.userId,
        height: this.state.height
      });
  }
  editDeskHeight=(index)=>{
    this.state.height && this
    .props
    .navigation
    .navigate('Edit', {
      connected_peripheral: this.props.navigation.state.params.connected_peripheral,
      index,
      height: this.state.height
    });
  }
  moveDeskToPosition =(cmd,finalValue)=>{
    const direction="off";
    this.state.height && this
      .props
      .navigation
      .navigate('Moving', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        cmd : cmd,
        direction:direction,
        finalValue:finalValue,
        profile:this.state.userId,
        height: this.state.height
      });
  }
  tapAndHoldClick=onClickView((index,command)=>{
    let key = "index"+index;
    if(this.state[key]){
      this.moveDeskToPosition(command,this.state[key]);
    }
    else{
    Alert.alert(
      'Preset height',
      'Do you want to preset the height point for '+index+'?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => {
          console.log('OK Pressed');
          this.editDeskHeight(index)
        }},
      ],
      { cancelable: false }
    )
  }
  })
  render() {
    return (
      <View style={styles.mainContainer}>
        <Grid>
        <Row style={styles.buttonsRow}>
            <View style={{flex:1}}>
          <Button
            leftIcon={{
            name: 'settings',color : purple
          }}
          onPress={this.gotoSettings}
            transparent
            iconColor={purple}
            color={purple}
            buttonStyle={styles.settingsButtonBig}
            title='Settings'/>
            </View>
          </Row>
          
          <Row style={styles.controlsRow2}>
            <TouchableOpacity 
             onPress={() => {
              this.movemendCommand("up");
            }}
          >
            <View style={[styles.arrowBlockExtreme]}>
              <View>
                <Image
                  style={{
                  width: 50,
                  height:50,
                  marginTop: "auto",
                  marginBottom:"auto",
                  marginLeft:"auto",
                  marginRight:"auto",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent:"center",
                }}
                resizeMode="contain"
                  source={require('./images/Moveup.png')}/></View>
              <Text style={styles.arrowText}>Up</Text>
            </View>
          </TouchableOpacity>
          <Col>
          <Row>
          <TouchableOpacity 
             onPress={() => {
              this.tapAndHoldClick(1,Commands.POS1);
            }}
            onLongPress={() => {
              this.editDeskHeight(1);
            }}
          >
            <View style={[styles.arrowBlockSmall,{backgroundColor:"#FF66AB" , marginBottom:25}]}>
              <Text style={styles.arrowBlockSmallText}>1</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index1}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index1 ? "Tap and hold to edit" : "Tap and hold to preset"}</Text>
            </View>
          </TouchableOpacity>
          </Row>
          <Row style={{marginTop:-10}}>
          <TouchableOpacity 
             onPress={() => {
              this.tapAndHoldClick(2,Commands.POS2);
            }}
            onLongPress={() => {
              this.editDeskHeight(2);
            }}
          >
            <View style={[styles.arrowBlockSmall,{backgroundColor:"#6CB0FF"}]}>
              <Text style={styles.arrowBlockSmallText}>2</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index2}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index2 ? "Tap and hold to edit" : "Tap and hold to preset"}</Text>
            </View>
          </TouchableOpacity>
          </Row>
            </Col>
              </Row>
          <Row style={styles.controlsRow}>
            <TouchableOpacity
              onPress={ () => {
                  this.movemendCommand("down");
            }}
          >
            <View
              style={[styles.arrowBlockExtreme]}>
              <View>
                <Image
                  style={{
                    width: 50,
                    height:50,
                    marginTop: "auto",
                    marginBottom:"auto",
                    marginLeft:"auto",
                    marginRight:"auto",
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent:"center",
                }}
                resizeMode="contain"
                  source={require('./images/Movedown.png')}/></View>
              <Text style={styles.arrowText}>Down</Text>
                </View>
            </TouchableOpacity>
          
            <Col>
          <Row>
          <TouchableOpacity 
             onPress={() => {
              this.tapAndHoldClick(3,Commands.POS3);
            }}
            onLongPress={() => {
              this.editDeskHeight(3);
            }}
          >
            <View style={[styles.arrowBlockSmall,{backgroundColor:"#FFBC4E", marginBottom:25}]}>
              <Text style={styles.arrowBlockSmallText}>3</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index3}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index3 ? "Tap and hold to edit" : "Tap and hold to preset"}</Text>
            </View>
          </TouchableOpacity>
              
          </Row>
          <Row style={{marginTop:-10}}>
          <TouchableOpacity 
             onPress={() => {
              this.tapAndHoldClick(4,Commands.POS4);
            }}
            onLongPress={() => {
              this.editDeskHeight(4);
            }}
          >
            <View style={[styles.arrowBlockSmall,{backgroundColor:"#D959F4"}]}>
              <Text style={styles.arrowBlockSmallText}>4</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index4}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index4 ? "Tap and hold to edit" : "Tap and hold to preset"}</Text>
            </View>
          </TouchableOpacity>
          </Row>
            </Col>
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
    backgroundColor: '#fff',
    borderColor:purple,
    borderWidth:2,
    width: 50,
    borderRadius: 50,
    height: 50,
    position:"relative"
  },
  activeButton:{backgroundColor:blue,borderColor:blue},
  inactiveButton:{},
  mainContainer: {
    backgroundColor: '#F7F8F9',
    position: 'absolute',
    minWidth: width,
    minHeight: deviceHeight,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  arrowText: {
    color: purple,
    zIndex: 10000,
    marginTop: 9,
    fontSize:20,
    fontWeight:"300",
    fontFamily:fontFamily
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
    fontFamily:fontFamily
  },
  arrowBlockExtreme: {
    backgroundColor: '#fff',
    width: width/2 - 43,
    maxHeight: (deviceHeight-110)/2,
    height: (deviceHeight-110)/2,
    borderRadius: 20,
    marginLeft: 14,
    marginRight: 14,
    flex: 1,
    position:"relative",
    alignItems: 'center',
    justifyContent: 'center',
    elevation:4,
    borderTopWidth:1,
    borderColor:"#eaeaea",
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  arrowBlockSmall:{
    backgroundColor: '#FFFFFF',
    width: width/2,
    maxHeight: (deviceHeight- 125)/4 ,
    height:(deviceHeight- 125)/4 ,
    borderRadius: 20,
    marginRight: 14,
    flex: 1,
    position:"relative",
    alignItems: 'center',
    justifyContent: 'center',
    elevation:4,
    shadowOffset: { width: 3, height: 2 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  arrowBlockSmallText :{
    fontSize: 50,
    color:'#fff',
    position:"relative",
    top:-10,
  },
  arrowBlockSmallTapHoldText : {
    position:'absolute',
    bottom:7,
    left:0,
    right:0,
    fontWeight:"bold",
    opacity:0.7,
    color:"#fff",
    fontSize:12,
    textAlign:'center',
  },
  arrowBlockSmalHeight:{
    position:'absolute',
    top:10,
    right:14,
    color:"#fff",
    fontSize:16,
    textAlign:'center',

  },
  arrowBlockExtremeSecond: {
  },
  inactiveButtonText:{
    
  },
  controlsRow:{
  },
  controlsRow2:{
    marginTop:0,
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