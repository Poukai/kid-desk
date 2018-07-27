import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import {Commands} from "./config";
import {sendCommand} from "./Scan";

const blue = "#00A7F7";
class Moving extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClickMovement() {
    console.log("test");
  }
  stopMovement=()=>{
    this
    .props
    .navigation
    .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral })
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
    console.log(a)
  }
  render() {
    console.log(this.props.navigation.state)
    return (
      <View style={styles.mainContainer}>
        <Grid>
          <Row>
            <Col style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position:'relative'}}>
              <Text style={styles.arrowText}>Desk is moving up..{this.props.navigation.state.params.data}</Text>
              {/* <View style={this.props.navigation.state.params.cmd.Command=="UP" ? [styles.arrowCircle,styles.arrowCircleActive] : [styles.arrowCircle]}>
                <Image
                  style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Moveup.png')}/>
              </View> */}
              <Text style={styles.heightText}>142.5{this.props.navigation.state.params.data}</Text>
              {/* <View style={this.props.navigation.state.params.cmd.Command=="DOWN" ? [styles.arrowCircle,styles.arrowCircleActive] : [styles.arrowCircle]}>
                <Image
                  style={{
                  width: 35,
                  height: 35,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative',
                }}
                  source={require('./images/downArrow.png')}/>
              </View> */}
              <Button onPress={this.stopMovement} transparent buttonStyle={styles.arrowText} color="#ff0000" title="Tap to stop." />
            </Col>
          </Row>
        </Grid>
      </View>
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
  arrowBlock: {
    backgroundColor: '#000000',
    textAlign: 'center',
    width: 130,
    height: 130,
    marginTop: 20,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowBlockCutsom: {
    marginRight: 0
  },
  arrowCircle: {
    backgroundColor: '#979797',
    width: 60,
    borderRadius: 50,
    height: 60,
    marginTop:20,
    marginBottom:20
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
    zIndex: 10000,
    marginTop: 9,
    marginBottom:10,
  },
  heightText:{
      color:'#fff',
    fontSize:48,
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

export default Moving;