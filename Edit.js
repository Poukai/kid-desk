import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Platform , TouchableOpacity ,Alert } from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Touchable from 'react-native-platform-touchable';
import {getHeight} from './actions/index'
import {bindActionCreators} from 'redux';
import { debounce } from 'lodash';
import {setItem,getItem} from './localdatabase';

const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Regular"

const fontFamilyThin= Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Thin"

const blue = "#00A7F7";
const purple="#4B00A4";
const {width, deviceHeight} = Dimensions.get('window');

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
      height:this.props.navigation.state.params.height,
      loading:false
    };
  }
  componentWillMount() {
    this.setState({loading:false});
  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps Edit.js = "+nextProps);
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
  updateHeightFromNavigation=()=>{
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
      let index = this.props.navigation.state.params.index+""
      let height = this.state.height+""
     this.setState({ loading: false });
     this
    .props
    .navigation
    .navigate('Control', {
        connected_peripheral: this.props.navigation.state.params.connected_peripheral,
        index:index,
        height:height
      })
    }, 5000)
    
  }
  
  sendCommandStop = () => {
    console.log("sendCommandStop begin");
    
    sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
    console.log("sendCommandStop end");
  }
  render() {
    const height = this.state.height;
    console.log(this.state.loading);
    // const loadingValue=this.state.loading;
    return (
      <View style={styles.mainContainer} pointerEvents={this.state.loading ? "none" : "auto"}>
        <Grid>
        <View style={styles.headerTextView}><TouchableOpacity style={styles.backIconButton} underlayColor="grey" onPress={this.handleBackPress}><Icon name="chevron-left" size={40} color={purple} style={styles.headerTextIcon}/></TouchableOpacity><Text style={styles.headerText}>Edit preset height</Text></View>
          <Row style={{maxHeight:480}}>
            <Text style={styles.arrowBlockSmallText}>Tap and hold on arrow to move</Text>
            <Col style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position:'relative'}}>
              <TouchableOpacity
                onPressOut={()=>this.sendCommandStop()} 
                onLongPress={()=>{this.handleClickMovement(Commands.UP)}}
                underlayColor={purple}>
                <View >
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
                  source={require('./images/Moveup.png')}/></View></TouchableOpacity>
              <Text style={styles.heightText}>{height.toString()}</Text>
              <TouchableOpacity
                onPressOut={()=>this.sendCommandStop()} 
                onLongPress={()=>{this.handleClickMovement(Commands.DOWN)}}
                underlayColor={purple}>
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
                  source={require('./images/Movedown.png')}/></View></TouchableOpacity>
            </Col>
          </Row>
                    <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 0}} colors={['#D100D0', '#4B00A4']} style={styles.linearGradient}>
               <Button
                  title="Save"
                  onPress={()=>{
                    this.setState({loading:true},()=>{
                      this.save(); 
                    })
                  }}
                  textStyle={{color:'#fff',fontSize:18,fontWeight:"300" , fontFamily : fontFamily}}
                  loading={this.state.loading}
                  buttonStyle={{ position:"absolute", left : 0 , right : 0  , top : -12}}
                  transparent />
            </LinearGradient>
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
    backgroundColor: '#fff',
    borderColor:purple,
    borderWidth:2,
    width: 50,
    borderRadius: 50,
    height: 50,
    position:"relative"
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
    color: "#d5d5d5",
    zIndex: 10000,
    marginTop: 9,
    marginBottom:10,
    fontSize:18,
  },
  heightText: {
    color: purple,
    fontSize:80,
    width:width,
    marginTop:20,
    marginBottom:20,
    marginLeft:"auto",
    marginRight:"auto",
    textAlign:"center",
    fontWeight:"400",
    fontFamily: fontFamily,
  },
  headerTextView:{
    zIndex: 10000,
    marginTop: 20,
    display:"flex",
    alignItems: 'center',
    flexDirection:'row',
    paddingLeft:5,
    justifyContent: "space-between",
  },
  headerText:{
    color: purple,
    fontSize:18,
    justifyContent: "space-between",
    paddingTop:3,
    position:'absolute',
    left:0,
    fontWeight:"100",
    right:0,
    textAlign:'center',
    marginLeft:"auto",
    marginRight:"auto",
    alignSelf:"center",
    alignItems:"center",
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
    color: '#333',
    fontWeight:"100",
    fontFamily: fontFamily,
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
  arrowCircleActive:{
      backgroundColor:blue
  },
linearGradient:{
  marginTop:-50,
  padding:15,
  height:54,
  width:215,
  marginLeft:15,
  marginRight:15,
  marginRight:"auto",
  marginLeft:"auto",
  borderRadius:25,
  position:"relative",
}
});

const mapStateToProps = (state) => ({height: state.update});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Edit);