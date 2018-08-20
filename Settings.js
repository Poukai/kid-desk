import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight ,TouchableOpacity, Alert ,BackHandler} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {Commands,updateId} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Animatable from 'react-native-animatable';
import {getHeight} from './actions/index'

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";
const purple="#4B00A4";

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
  setTimeout(() => {
    this.setState({resetting:false,done:true});
  }, 12000);
  // sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.GET_HEIGHT);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
  }
  
  onBackButtonPressed=()=> {
    return this.state.resetting;
  }
  componentWillReceiveProps(nextProps) {
    console.log("HEIGHT "+nextProps.height.height);
    this.setState({
      height: nextProps.height.height
    });
    if(nextProps.height.height <=70){
      this
      .props
      .navigation
      .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral })
    }
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
      <View style={styles.mainContainer}  pointerEvents={this.state.resetting ? "none" : "auto"}>
        <Grid>
        <View style={styles.headerTextView}><TouchableOpacity style={styles.backIconButton}  onPress={this.handleBackPress}><Icon name="chevron-left" size={40} color="#37355C" style={styles.headerTextIconback}/></TouchableOpacity><Text style={styles.headerText}>Settings</Text></View>
        <View>
          <Row style={styles.resetBlock}>{this.state.done && <View style={styles.resetCompletedText}><Text style={{color :"#37355C" , fontSize :18 }}>Reset Completed!</Text></View>}
              <TouchableHighlight style={styles.resetIconView} onPress={this.handleClickMovement} >
              <View>
          {this.state.resetting ? <Animatable.View
              animation="rotate"
              easing="linear"
              iterationCount="infinite"
            >
              <Icon name="rotate-right" type="FontAwesome" size={75} color={purple} style={styles.headerTextIcon}/>
            </Animatable.View> : <Icon name="rotate-right" type="FontAwesome" size={75} color={purple} style={styles.headerTextIcon}/>}
            </View>
              </TouchableHighlight>
              <Text style={styles.resetText}>{this.state.resetting ? "Resetting..." : "Reset the desk"}</Text>
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
  backIconButton:{
    position:'relative',
    zIndex:10000
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
    marginTop: 20,
    width:width,
    marginBottom:10,
    alignItems: 'flex-start',
    position:"absolute",
    flexDirection:'row',
    paddingLeft:5,
    maxHeight:80,
    justifyContent: "space-between",
  },
  headerText:{
    color: purple,
    fontSize:18,
    justifyContent: "space-between",
    paddingTop:8,
    position:'absolute',
    left:0,
    right:0,
    textAlign:'center',
    marginLeft:"auto",
    marginRight:"auto",
    alignSelf:"flex-start",
    alignItems:"flex-start"
  },
  headerTextIconback:{
    position:'relative',
    zIndex:10000
  },
  headerTextIcon:{
    
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
    backgroundColor: '#F7F8F9',
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
  resetText:{
    color: "#37355C",
    fontSize:18,
    marginRight:"auto",
    flexDirection: 'column',
    marginLeft:"auto",
    alignSelf:'center',
    alignItems : 'center',
    marginTop:30
  },
  resetCompletedText:{
    width:250,
    backgroundColor:"#B8F7E9",
    textAlign:"center",
    padding:13,
    fontSize:18,
    marginRight:"auto",
    flexDirection: 'column',
    marginLeft:"auto",
    alignSelf:'center',
    alignItems : 'center',
    marginTop:20,
    marginBottom:40,
    borderRadius:25,
  },
  resetIconView:{
    borderRadius:100,
    width: 120,
    height:120,
    backgroundColor: '#fff',
    marginRight:"auto",
    marginLeft:"auto",
    justifyContent:'center',
    flexDirection: 'row',
    alignItems : 'center',
    paddingTop:5,
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