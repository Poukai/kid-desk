import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Platform} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {getHeight} from './actions/index'
import {bindActionCreators} from 'redux';
const blue = "#00A7F7";
const {width, height} = Dimensions.get('window');
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height
    };
  }
  componentWillMount() {
    this.setState({height : this.props.navigation.state.params.height});
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height.height
    });
  }
  handleClickMovement = (cmd) => {
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
    console.log(a)
  }
  handleBackPress=()=>{
    this
      .props
      .navigation
      .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral })
  }
  componentWillMount() {
    this.setState({height : this.props.navigation.state.params.height});
  }
  save=()=>{
    console.log(this.props.navigation.state.params.cmd);
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, this.props.navigation.state.params.cmd);
    this
      .props
      .navigation
      .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral })
  }
  sendCommandStop = (cmd) => {
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
    console.log(a)
  }
  render() {
    const height = this.state.height;
    console.log(height);
    return (
      <View style={styles.mainContainer}>
        <Grid>
        <View style={styles.headerTextView}><TouchableHighlight style={styles.arrowCircleSmall} underlayColor={blue} onPress={this.handleBackPress}><Icon name="chevron-left" size={24} color="#fff" style={styles.headerTextIcon}/></TouchableHighlight><Text style={styles.headerText}>Edit sitting point</Text></View>
          <Row>
            <Col style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position:'relative'}}>
              <TouchableHighlight
                style={styles.arrowCircle}
                onPressOut={() => {
                  setTimeout(this.sendCommandStop(Commands.STOP),2000);
                }}
                onPressIn={() => {
                this.handleClickMovement(Commands.UP)
              }}
                underlayColor={blue}>
                <Image
                  style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Moveup.png')}/></TouchableHighlight>
              <Text style={styles.heightText}>{height.toString()}</Text>
              <TouchableHighlight
                style={styles.arrowCircle}
                onPressIn={() => {
                this.handleClickMovement(Commands.DOWN)
              }}
              onPressOut={() => {
                setTimeout(this.sendCommandStop(Commands.STOP),2000);
              }}
                underlayColor={blue}>
                <Image
                  style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/downArrow.png')}/></TouchableHighlight>
            <Button
              onPress={this.save}
              title="Save"
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
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
    paddingLeft:5,
  },
  headerText:{
    color: "#fff",
    fontSize:18,
    marginRight:"auto",
    marginLeft:15,
    paddingTop:5,
  },
  headerTextIcon:{
    position:'relative',
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
  arrowCircleActive:{
      backgroundColor:blue
  }
});

const mapStateToProps = (state) => ({height: state.update});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Edit);