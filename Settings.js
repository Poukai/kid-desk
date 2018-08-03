import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Alert} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {Commands,updateId} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getHeight} from './actions/index'

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height,
      resetting:false,
      done:false
    };
  }
  resetDesk=()=>{
  sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.RESET);
  this.setState({resetting:true});
  // sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.GET_HEIGHT);
  }

  componentWillReceiveProps(nextProps) {
    console.log("HEIGHT "+nextProps.height.height);
    if(nextProps.height.height == 72){
      this.setState({
        resetting:false,
        done:true,
      })
    }
    this.setState({
      height: nextProps.height.height
    });
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
    this
      .props
      .navigation
      .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral })
  }
  save(){

  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Grid>
        <View style={styles.headerTextView}><TouchableHighlight style={styles.arrowCircleSmall} underlayColor={blue} onPress={this.handleBackPress}><Icon name="chevron-left" size={24} color="#fff" style={styles.headerTextIcon}/></TouchableHighlight><Text style={styles.headerText}>Settings</Text>
          </View>
        <View>
          <Row style={styles.resetBlock}>{this.state.done && <Text style={styles.resetCompletedText}>Reset Completed!</Text>}
              <TouchableHighlight style={styles.resetIconView} onPress={this.handleClickMovement} underlayColor={blue}>
              <Icon name="cw" type="entypo" size={75} color="#000" style={styles.headerTextIcon}/>
              </TouchableHighlight>
              <Text style={styles.resetText}>{this.state.resetting ? "Resetting" : "Reset the desk"}</Text>
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
  headerTextView:{
    position:'absolute',
    width:width
  },
  arrowCircleSmall:{
    backgroundColor: '#979797',
    width: 25,
    borderRadius: 50,
    height: 25,
    marginTop:21,
    marginLeft:25,
    zIndex:10000,
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
  resetCompletedText:{
    color: "#000",
    width:width,
    backgroundColor:"#5AAB93",
    textAlign:"center",
    padding:13,
    fontSize:18,
    marginRight:"auto",
    flexDirection: 'column',
    marginLeft:"auto",
    alignSelf:'center',
    alignItems : 'center',
    marginTop:20,
    marginBottom:30,
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


const mapStateToProps = (state) => ({height: state.update});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);