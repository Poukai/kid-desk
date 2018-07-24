import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Alert} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {Commands} from "./config";
import {sendCommand} from "./Scan";

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  resetDesk=()=>{

  }
  handleClickMovement=()=> {
    Alert.alert(
      'Confirmation',
      'Do you want to reset the desk? It will take 2-3 minutes to finish.',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => {console.log('OK Pressed');this.resetDesk()}},
      ],
      { cancelable: false }
    )
    // const a = sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
    // console.log(a)
  }
  handleBackPress=()=>{
    this.props.navigation.navigate('Control')
  }
  save(){

  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Grid>
        <Text style={styles.headerText}>Settings</Text>
        <View>
          <Row style={styles.resetBlock}>
              <TouchableHighlight style={styles.resetIconView} onPress={this.handleClickMovement} underlayColor={blue}>
              <Icon name="cw" type="entypo" size={75} color="#000" style={styles.headerTextIcon}/>
              </TouchableHighlight>
              <Text style={styles.resetText}>Reset the desk</Text>
          </Row>
          </View>
        </Grid>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  settingsButton: {
    borderRadius: 3,
    marginTop: 40,
    width: 220,
  },
  arrowCircle: {
    backgroundColor: '#979797',
    width: 60,
    borderRadius: 50,
    height: 60,
    marginTop:20,
    marginBottom:20
  },
  arrowCircleSmall:{
    backgroundColor: '#979797',
    width: 25,
    borderRadius: 50,
    height: 25,
    marginTop:4,
    marginLeft:10
  },
  arrowCircleBig: {
    backgroundColor: '#979797',
    width: 70,
    borderRadius: 50,
    height: 70
  },
  mainContainer: {
    backgroundColor: '#000000',
    width: width,
    minHeight: height,
    height:height
  },
  arrowText: {
    color: "#d5d5d5",
    zIndex: 10000,
    marginTop: 9,
    marginBottom:10,
    fontSize:18,
  },
  headerText:{
    color: "#fff",
    fontSize:18,
    marginTop:20,
    position:'absolute',
    left:0,
    right:0,
    textAlign:'center'
  },
  resetText:{
    color: "#fff",
    fontSize:18,
    marginRight:"auto",
    flexDirection: 'column',
    marginLeft:"auto",
    alignSelf:'center',
    alignItems : 'center',
    marginTop:20
  },
  resetIconView:{
    borderRadius:100,
    width: 120,
    height:120,
    backgroundColor: '#3f3f3f',
    marginRight:"auto",
    marginLeft:"auto",
    justifyContent:'center',
    flexDirection: 'row',
    alignItems : 'center',
    paddingLeft:8,
    paddingTop:5
  },
  resetBlock:{
    minWidth:'100%',
    minHeight:height,
    justifyContent:'center',
    alignItems : 'center',
    flex:1,
    flexDirection: 'column',
  }
});

export default Settings;