import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Platform ,AsyncStorage,Alert, BackHandler} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {getHeight} from './actions/index'
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
const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Regular"
class Moving extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height,
    };
  }
  moveDeskBasedOnPosition = async () =>{
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
      const d = await getItem(key);
      if(d){
        sendCommand(this.props.navigation.state.params.connected_peripheral, Commands[key]);
      }
      else{
        sendCommand(this.props.navigation.state.params.connected_peripheral, this.props.navigation.state.params.cmd);
      }
  }
  componentWillMount() {
    sendCommand(this.props.navigation.state.params.connected_peripheral, this.props.navigation.state.params.cmd);
    // this.moveDeskBasedOnPosition()
    // this.setState({height : this.props.navigation.state.params.height});
    
  }
  
componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
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
    this.props.navigation.navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral});
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
    this.setState({
      height: nextProps.height.height
    }, this._storeData);
  }
  render() {
    let height = this.state.height;
    console.log(height);
    const image = this.props.navigation.state.params.direction == "up" ? require('./images/up-mini.png') : require('./images/down-mini.png');
    const text = this.props.navigation.state.params.direction;
    // if(this.props.navigation.state.params.cmd.Command=="POS1" || this.props.navigation.state.params.cmd.Command=="POS2"){
    //     const image = "./images/up-mini.png";
    //     const text = "up";
    // }
    // else if(this.props.navigation.state.params.cmd.Command=="POS3" || this.props.navigation.state.params.cmd.Command=="POS4"){
    //   const image = "./images/down-mini.png";
    //     const text = "down";
    // }
    return (
      <TouchableHighlight transparent style={styles.mainContainer} onPress={this.HandlestopMovement}>
        <Grid>
          <Row>
            <Col
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Text style={styles.stopText}>Desk is moving {text}...</Text>
              { this.props.navigation.state.params.direction == "up" && <Image source={image} style={styles.arrowImage}/>}
              <Text style={styles.heightText}>{height.toString()}</Text>
              { this.props.navigation.state.params.direction == "down" && <Image source={image} style={styles.arrowImage}/>}
              <View>
                <Text style={styles.arrowText}>Tap to Stop</Text>
                </View>
            </Col>
          </Row>
        </Grid>
      </TouchableHighlight>
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
    backgroundColor: '#000000',
    minWidth: width,
    minHeight: height
  },
  arrowText: {
    marginTop: 9,
    marginBottom: 91,
    color:"#fff",
    fontSize:22,
    fontFamily: fontFamily,
  },
  heightText: {
    color: '#fff',
    fontSize:72,
    width:width,
    marginLeft:"auto",
    marginRight:"auto",
    textAlign:"center",
    fontWeight:"100",
    fontFamily: "SFProDisplay-Thin",
  },
  stopText:{
    color: '#9B9B9B',
    fontSize: 22,
    marginTop:30,
    marginBottom:10,
    marginLeft:"auto",
    marginRight:"auto",
    fontWeight:"100",
    fontFamily: "SFProDisplay-Regular",
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
    height: height / 2,
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

const mapStateToProps = (state) => ({height: state.update});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Moving);