import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Platform ,AsyncStorage,Alert} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {getHeight} from './actions/index'
import {bindActionCreators} from 'redux';
import { BackHandler } from 'react-native';
import PouchDB from 'pouchdb-react-native'

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
  componentWillMount() {
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
  stopMovement = async () => {
    console.log(this.props.navigation.state.params.cmd.Command);
      let save_position_command = Commands.SAVE_POS2;
      let key="POS2";
      if(this.props.navigation.state.params.profile == "A" && this.props.navigation.state.params.cmd.Command == "UP" ){
        save_position = Commands.SAVE_POS2;
        key="POS2";
      }
      else if(this.props.navigation.state.params.profile == "A" && this.props.navigation.state.params.cmd.Command == "DOWN" ){
        save_position = Commands.SAVE_POS1;
        key="POS1";
      }
      else if(this.props.navigation.state.params.profile == "B" && this.props.navigation.state.params.cmd.Command == "UP" ){
        save_position = Commands.SAVE_POS4;
        key="POS4";
      }
      else if(this.props.navigation.state.params.profile == "B" && this.props.navigation.state.params.cmd.Command == "DOWN" ){
        save_position = Commands.SAVE_POS3;
        key="POS3";
      }
      const obj = {
        height : this.state.height,
        profile : this.props.navigation.state.params.profile
      };
      console.log("check here1");
      try {
        var doc = await localDB.get(key);
        var response = await localDB.put({
          _id: key,
          _rev: doc._rev,
          obj : obj
        });
      } catch (err) {
        console.log(err);
      }
      console.log("check here2");
      console.log("saved Data ===="+response);
      const a = sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
      sendCommand(this.props.navigation.state.params.connected_peripheral, save_position_command);
      this
        .props
        .navigation
        .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral})
    // console.log(a)
    console.log("check here3");
    
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height.height
    }, this._storeData);
  }
  render() {
    const height = this.state.height;
    console.log(height);
    const image = "./images/up-mini.png";
    const text = "up";
    // if(this.props.navigation.state.params.cmd.Command=="POS1" || this.props.navigation.state.params.cmd.Command=="POS2"){
    //     const image = "./images/up-mini.png";
    //     const text = "up";
    // }
    // else if(this.props.navigation.state.params.cmd.Command=="POS3" || this.props.navigation.state.params.cmd.Command=="POS4"){
    //   const image = "./images/down-mini.png";
    //     const text = "down";
    // }
    return (
      <TouchableHighlight transparent style={styles.mainContainer} onPress={this.stopMovement}>
        <Grid>
          <Row>
            <Col
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Text style={styles.arrowText}>Desk is moving {text}...</Text>
              {/* <Image source={require(image)}/> */}
              <Text style={styles.heightText}>{height.toString()}</Text>
              <View>
                <Text style={styles.stopText}>Tap to Stop</Text>
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
    marginTop:50,
    marginLeft:"auto",
    marginRight:"auto",
    fontWeight:"100",
    fontFamily: "SFProDisplay-Thin",
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