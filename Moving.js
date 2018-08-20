import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight,TouchableOpacity , Platform ,AsyncStorage,Alert, BackHandler} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
const {width, deviceHeight} = Dimensions.get('window');
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {getHeight,updatePos} from './actions/index'
import {bindActionCreators} from 'redux';
import PouchDB from 'pouchdb-react-native'
import { debounce } from 'lodash';
import {setItem,getItem} from './localdatabase';

const onClickView = funcOnView => {
  return debounce(funcOnView, 2000, {
    trailing: false,
    leading: true
  });
};

const localDB = new PouchDB('myDB')

const blue = "#00A7F7";
const purple="#4B00A4";
const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Regular"

const fontFamilyThin= Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Thin"
class Moving extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height:this.props.navigation.state.params.height,
      POS_OK : false
    };
  }
  // moveDeskBasedOnPosition = async () =>{
  //   let save_position_command = Commands.SAVE_POS2;
  //     let key="POS2";
  //     if(this.props.navigation.state.params.cmd.Command == "UP" ){
  //       save_position_command = Commands.SAVE_POS2;
  //       key="POS2";
  //     }
  //     else if(this.props.navigation.state.params.cmd.Command == "DOWN" ){
  //       save_position_command = Commands.SAVE_POS1;
  //       key="POS1";
  //     }
  //     else if( this.props.navigation.state.params.cmd.Command == "UP" ){
  //       save_position_command = Commands.SAVE_POS4;
  //       key="POS4";
  //     }
  //     else if(this.props.navigation.state.params.cmd.Command == "DOWN" ){
  //       save_position_command = Commands.SAVE_POS3;
  //       key="POS3";
  //     }
  //     const d = await getItem(key);
  //     if(d){
  //       sendCommand(this.props.navigation.state.params.connected_peripheral, Commands[key]);
  //     }
  // }
  resetPosition(){
    this.props.updatePos(false);
  }
  componentWillMount() {
    sendCommand(this.props.navigation.state.params.connected_peripheral, this.props.navigation.state.params.cmd);
    
  }
  
componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
  this.props.navigation.addListener('willFocus', () => this.resetPosition())
}
componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
}

onBackButtonPressed() {
  return true;
}
  handleClickMovement() {
    console.log("test");
  }
  HandlestopMovement= onClickView((event)=>{
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
    this.props.navigation.navigate('Stopping', {connected_peripheral: this.props.navigation.state.params.connected_peripheral});
    //  this.stopMovement()
  })
  stopMovement = async () => {
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
    
      let save_position_command = Commands.SAVE_POS2;
      let key="POS2";
      if(this.props.navigation.state.params.profile == "A" && this.props.navigation.state.params.cmd.Command == "UP" ){
        save_position_command = Commands.SAVE_POS2;
        key="POS2";
      }
      else if(this.props.navigation.state.params.profile == "A" && this.props.navigation.state.params.cmd.Command == "DOWN" ){
        save_position_command = Commands.SAVE_POS1;
        key="POS1";
      }
      else if(this.props.navigation.state.params.profile == "B" && this.props.navigation.state.params.cmd.Command == "UP" ){
        save_position_command = Commands.SAVE_POS4;
        key="POS4";
      }
      else if(this.props.navigation.state.params.profile == "B" && this.props.navigation.state.params.cmd.Command == "DOWN" ){
        save_position_command = Commands.SAVE_POS3;
        key="POS3";
      }
      let newHeight = this.state.height+"";
      const c = await  getItem(key);
      console.log("stopMovement 00000 ---- result = ",c);
      // console.log(c);
      if(c){
        this.props.navigation.navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral});
      }
      else{
        // let start = Date.now(),
        // now = start;
        // while (now - start < 2000) {
        //   now = Date.now();
        // }
        const css = await setItem(key,newHeight);
        setTimeout(()=>{sendCommand(this.props.navigation.state.params.connected_peripheral, save_position_command);},1000);
        this.props.navigation.navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral})
      }
    
  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps  MOVING  "+JSON.stringify(nextProps.POS_OK));
    this.setState({
      height: nextProps.height,
      POS_OK : nextProps.POS_OK
    });
    if(nextProps.POS_OK){
      this.props.navigation.navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral});
    }
  }
  render() {
    let height = this.state.height;
    const text = this.props.navigation.state.params.direction=="off" ? "" : this.props.navigation.state.params.direction;
    // if(this.props.navigation.state.params.cmd.Command=="POS1" || this.props.navigation.state.params.cmd.Command=="POS2"){
    //     const image = "./images/up-mini.png";
    //     const text = "up";
    // }
    // else if(this.props.navigation.state.params.cmd.Command=="POS3" || this.props.navigation.state.params.cmd.Command=="POS4"){
    //   const image = "./images/down-mini.png";
    //     const text = "down";
    // }
    return (
      <TouchableOpacity transparent style={styles.mainContainer} onPress={this.HandlestopMovement}>
        <Grid>
          <Row>
            <Col
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Text style={styles.stopText}>Desk is moving <Text style={{color:purple , fontWeight :"bold"}}>{text}</Text>...</Text>
              <Text style={styles.heightText}>{height.toString()}</Text>
              <View>
                <Text style={styles.arrowText}>Tap to stop</Text>
                </View>
            </Col>
          </Row>
        </Grid>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  settingsButton: {
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    marginTop: 40,
    width: 120,
    marginLeft: "auto",
    marginRight: 10
  },
  mainContainer: {
    backgroundColor: '#F7F8F9',
    width: width,
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
    minHeight: deviceHeight,
  },
  arrowText: {
    marginTop: 50,
    marginBottom: 91,
    color:"#000000",
    fontSize:22,
    fontFamily: fontFamily,
    elevation:3,
    fontWeight:"300",
  },
  heightText: {
    color: purple,
    fontSize:80,
    width:width,
    marginLeft:"auto",
    marginRight:"auto",
    textAlign:"center",
    fontWeight:"400",
    fontFamily: fontFamily,
  },
  stopText:{
    color: '#000000',
    fontSize: 22,
    marginTop:30,
    marginBottom:50,
    marginLeft:"auto",
    marginRight:"auto",
    fontWeight:"100",
  },
  arrowImage:{
    width:30,
    height:30,
    marginTop:10,
    marginBottom:20
  },
  arrowTextBottom: {
    color: "#d5d5d5",
    zIndex: 10000,
    position: 'absolute',
    bottom: 10
  },
  arrowBlockExtreme: {
    backgroundColor: '#000000',
    textAlign: 'center',
    width: 30,
    height: deviceHeight / 2,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowBlockExtremeRight: {
    minWidth: 75
  },
  arrowCircleActive: {
    backgroundColor: blue
  }
});

const mapStateToProps = (state) => ({
  height: state.update.height,
  POS_OK : state.update.POS_OK
});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch),
  updatePos: bindActionCreators(updatePos, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Moving);