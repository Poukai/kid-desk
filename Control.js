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
import PouchDB from 'pouchdb-react-native'

import { debounce } from 'lodash';
import {setItem,getItem} from './localdatabase';


const onClickView = funcOnView => {
  return debounce(funcOnView, 1000, {
    trailing: false,
    leading: true
  });
};
const localDB = new PouchDB('myDB')
console.log(localDB.adapter)

// AsyncStorage.getAllKeys()
//   .then(keys => AsyncStorage.multiGet(keys))
//   .then(items => Alert.alert('all pure Items', JSON.stringify(items)))
//   .catch(error => console.warn('error get all Items', error))
// import {bleManagerEmitter} from "./Scan";

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height,
      userId : "A",
      index1:null,
      index2:null,
      index3:null,
      index4:null,
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
        .then(() => {
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

  getValuesFromDb= async()=>{
    const key1 = await getItem('1').then((result) => this.setState({ index1: result }));
    const key2 = await getItem('2').then((result) => this.setState({ index2: result }));
    const key3 = await getItem('3').then((result) => this.setState({ index3: result }));
    const key4 = await getItem('4').then((result) => this.setState({ index4: result }));
    if(this.props.navigation.state.params && this.props.navigation.state.params.index && this.props.navigation.state.params.height){
      const indexKey =  this.props.navigation.state.params.index;
      const height = Number(this.props.navigation.state.params.height);
      this.setState({
        indexKey:height
      })
    }
  }
  componentWillMount(){
    this.getValuesFromDb();
    this.getDeskHeight(this.props.navigation.state.params.connected_peripheral,Commands.GET_HEIGHT)
  }
  componentDidMount(){
    this.props.navigation.addListener('willFocus', () => this.getValuesFromDb())
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height.height
    });
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
  moveDeskToPosition =(cmd)=>{
    const direction="up";
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
  tapAndHoldClick=onClickView((index,command)=>{
    let key = "index"+index;
    if(this.state[key]){
      this.moveDeskToPosition(command);
    }
    else{
    Alert.alert(
      'Preset height',
      'Do you want to preset the height point for '+index+' ?',
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
            <Button
            onPress={()=>{AsyncStorage.clear()}}
            title="Clear"
            buttonStyle={[styles.settingsButton,this.state.userId == "A" ? styles.activeButton : styles.inactiveButton]}
            textStyle={this.state.userId == "A" ? styles.activeButtonText : styles.inactiveButtonText}
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
          
          <Row style={styles.controlsRow2}>
            <TouchableOpacity 
             onPress={() => {
              this.movemendCommand("up");
            }}
          >
            <View style={[styles.arrowBlockExtreme]}>
              <View
                style={styles.arrowCircleBig}>
                <Image
                  style={{
                  width: 40,
                  marginTop: -4,
                  alignItems: "center",
                  alignSelf: "center",
                  position: 'relative'
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
            <View style={[styles.arrowBlockSmall]}>
              <Text style={styles.arrowBlockSmallText}>1</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index1}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index1 ? "Tap and hold to edit" : "Tap and hold to create"}</Text>
            </View>
          </TouchableOpacity>
          </Row>
          <Row>
          <TouchableOpacity 
             onPress={() => {
              this.tapAndHoldClick(2,Commands.POS2);
            }}
            onLongPress={() => {
              this.editDeskHeight(2);
            }}
          >
            <View style={[styles.arrowBlockSmall]}>
              <Text style={styles.arrowBlockSmallText}>2</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index2}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index2 ? "Tap and hold to edit" : "Tap and hold to create"}</Text>
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
              <View
            style={styles.arrowCircleBig}>
                <Image
                  style={{
                    width: 40,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: -4,
                  position: 'relative'
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
            <View style={[styles.arrowBlockSmall]}>
              <Text style={styles.arrowBlockSmallText}>3</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index3}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index3 ? "Tap and hold to edit" : "Tap and hold to create"}</Text>
            </View>
          </TouchableOpacity>
              
          </Row>
          <Row>
          <TouchableOpacity 
             onPress={() => {
              this.tapAndHoldClick(4,Commands.POS4);
            }}
            onLongPress={() => {
              this.editDeskHeight(4);
            }}
          >
            <View style={[styles.arrowBlockSmall]}>
              <Text style={styles.arrowBlockSmallText}>4</Text>
              <Text style={styles.arrowBlockSmalHeight}>{this.state.index4}</Text>
              <Text style={styles.arrowBlockSmallTapHoldText}>{this.state.index4 ? "Tap and hold to edit" : "Tap and hold to create"}</Text>
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
    width: 145,
    maxHeight: (height-110)/2,
    height:(height-110)/2,
    borderRadius: 20,
    marginLeft: 14,
    marginRight: 9,
    flex: 1,
    position:"relative",
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowBlockSmall:{
    backgroundColor: '#000000',
    width: width-34-145,
    maxHeight: (height-140)/4,
    height:(height-140)/4,
    borderRadius: 20,
    marginRight: 14,
    flex: 1,
    position:"relative",
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowBlockSmallText :{
    fontSize: 50,
    color:'#9B9B9B',
    position:"relative",
    top:-10,
  },
  arrowBlockSmallTapHoldText : {
    position:'absolute',
    bottom:7,
    left:0,
    right:0,
    color:"#9B9B9B",
    fontSize:12,
    textAlign:'center',
  },
  arrowBlockSmalHeight:{
    position:'absolute',
    top:10,
    right:14,
    color:"#9B9B9B",
    fontSize:16,
    textAlign:'center',

  },
  arrowBlockExtremeSecond: {
  },
  inactiveButtonText:{
    
  },
  controlsRow:{
    marginTop:5,
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