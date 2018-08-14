import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Platform , TouchableOpacity ,Alert } from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {getHeight} from './actions/index'
import {bindActionCreators} from 'redux';
import { debounce } from 'lodash';
import {setItem,getItem} from './localdatabase';



const blue = "#00A7F7";
const {width, height} = Dimensions.get('window');

const onClickView = funcOnView => {
  return debounce(funcOnView, 2000, {
    trailing: false,
    leading: true
  });
};

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height,
      loading:false
    };
  }
  componentWillMount() {
    this.setState({loading:false});
  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps Edit.js = "+nextProps);
    Alert.alert(JSON.stringify(nextProps));
    this.setState({
      height: nextProps.height.height
    });
  }
  handleBackPress=()=>{
    console.log("back");
    this
      .props
      .navigation
      .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral })
  }
  test=()=>{
    console.log("listener test"+JSON.stringify(this.state));
  }
  componentDidMount(){
    this.props.navigation.addListener('willFocus', () => this.test())
  }
  handleClickMovement = onClickView((cmd) => {
    console.log("handleClickMovement begin");
    sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
    console.log("handleClickMovement end");
    
  })
  
  save= async ()=>{
    let commandToSend ="";
     switch (this.props.navigation.state.params.index) {
      case 1:
      commandToSend =  Commands.SAVE_POS1;
        break;
      case 2:
      commandToSend = Commands.SAVE_POS2;
        break;
      case 3:
      commandToSend =  Commands.SAVE_POS3;
        break;
      case 4:
      commandToSend =  Commands.SAVE_POS4;
        break;
      default:
        break;
    }
    sendCommand(this.props.navigation.state.params.connected_peripheral, commandToSend);
    const setIndex = await setItem(""+this.props.navigation.state.params.index,this.state.height+"");
    
    setTimeout(() =>{
      const index = this.props.navigation.state.params.index+""
      const height = this.state.height+""
     this.setState({ loading: false });
     this
    .props
    .navigation
    .navigate('Control', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        index:index,
        height:height
      })
    }, 3000)
    
  }
  
  sendCommandStop = () => {
    console.log("sendCommandStop begin");
    
    sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
    console.log("sendCommandStop end");
  }
  render() {
    let height = this.state.height;
    console.log(this.state.loading);
    // const loadingValue=this.state.loading;
    return (
      <View style={styles.mainContainer} pointerEvents={this.state.loading ? "none" : "auto"}>
        <Grid>
        <View style={styles.headerTextView}><TouchableHighlight style={styles.backIconButton} onPress={this.handleBackPress}><Icon name="chevron-left" size={40} color="#fff" style={styles.headerTextIcon}/></TouchableHighlight><Text style={styles.headerText}>Edit sitting point</Text></View>
          <Row>
            <Text style={styles.arrowBlockSmallText}>Tap and hold on arrow to move</Text>
            <Col style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position:'relative'}}>
              <TouchableOpacity
                style={styles.arrowCircle}
                onPressOut={this.sendCommandStop}
                onPressIn={()=>{this.handleClickMovement(Commands.UP)}}
                underlayColor={blue}>
                <View>
                <Image
                  style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Moveup.png')}/></View></TouchableOpacity>
              <Text style={styles.heightText}>{height.toString()}</Text>
              <TouchableOpacity
                style={styles.arrowCircle}
                onPressOut={this.sendCommandStop} 
                onPressIn={()=>{this.handleClickMovement(Commands.DOWN)}}
                underlayColor={blue}>
                <View>
                <Image
                  style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/downArrow.png')}/></View></TouchableOpacity>
            <Button
              onPress={()=>{
                this.setState({loading:true},()=>{
                  this.save(); 
                })
              }
            }
              title="Save"
              loading={this.state.loading}
              buttonStyle={styles.settingsButton}
              backgroundColor="#017DF7"/>
            </Col>
          </Row>
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
    height:50,
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
    marginLeft:20
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
  },
  arrowText: {
    color: "#d5d5d5",
    zIndex: 10000,
    marginTop: 9,
    marginBottom:10,
    fontSize:18,
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
  headerTextView:{
    zIndex: 10000,
    marginTop: 20,
    marginBottom:10,
    display:"flex",
    alignItems: 'center',
    flexDirection:'row',
    paddingLeft:5,
    justifyContent: "space-between",
  },
  headerText:{
    color: "#fff",
    fontSize:18,
    justifyContent: "space-between",
    paddingTop:3,
    position:'absolute',
    left:0,
    right:0,
    textAlign:'center',
    marginLeft:"auto",
    marginRight:"auto",
    alignSelf:"center",
    alignItems:"center"
  },
  headerTextIcon:{
    position:'absolute',
  },
  backIconButton:{
    position:'relative',
    zIndex:10000
  },
  arrowTextBottom: {
    color: "#d5d5d5",
    zIndex: 10000,
    position: 'absolute',
    bottom: 10
  },
  arrowBlockSmallText:{
    textAlign:"center",
    position:"absolute",
    top:50,
    left:0,
    right:0,
    fontSize:18,
    color: '#9B9B9B',
    fontWeight:"100",
    fontFamily: "SFProDisplay-Regular",
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
  arrowCircleActive:{
      backgroundColor:blue
  }
});

const mapStateToProps = (state) => ({height: state.update});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Edit);