import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {sendCommand} from "./Scan";
import {Commands} from "./config";
// import {bleManagerEmitter} from "./Scan";

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClickMovement = (cmd) => {
    this
      .props
      .navigation
      .navigate('Moving', {connected_peripheral: this.props.navigation.state.params.connected_peripheral,cmd });
    sendCommand(this.props.navigation.state.params.connected_peripheral, cmd );
    
  }
  handleLongPress = (cmd) => {
    this
      .props
      .navigation
      .navigate('Edit', {connected_peripheral: this.props.navigation.state.params.connected_peripheral,cmd });
    sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Button
          leftIcon={{
          name: 'settings'
        }}
          transparent
          buttonStyle={styles.settingsButton}
          title='Settings'/>
        <Grid>
          <Row style={{
            height: 170
          }}>
            <Col style={[styles.arrowBlock, styles.arrowBlockCutsom]}>
              <TouchableHighlight
                style={styles.arrowCircle}
                onPress={() => {
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
              <Text style={styles.arrowText}>Move up</Text>
            </Col>
            <Col style={styles.arrowBlock}>
              <TouchableHighlight
                style={styles.arrowCircle}
                onPress={() => {
                this.handleClickMovement(Commands.DOWN)
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
              <Text style={styles.arrowText}>Move down</Text>
            </Col>
          </Row>
          <Row>
            <Col
              style={[styles.arrowBlockExtreme, styles.arrowBlockExtremeRight, styles.arrowBlockCutsom]}>
              <TouchableHighlight
                style={styles.arrowCircleBig}
                onPress={() => {
                this.handleClickMovement(Commands.DOWN)
              }}
              onLongPress={() => {
                this.handleLongPress(Commands.SAVE_POS1)
              }}
                underlayColor={blue}>
                <Image
                  style={{
                  width: 35,
                  height: 50,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Sitdown.png')}/></TouchableHighlight>
              <Text style={styles.arrowText}>Sit down</Text>
              <Text style={styles.arrowTextBottom}>Tap and hold Icon to edit</Text>

            </Col>
            <Col style={[styles.arrowBlockExtreme]}>
              <TouchableHighlight
                style={styles.arrowCircleBig}
                onPress={() => {
                this.handleClickMovement(Commands.UP)
              }}
              onLongPress={() => {
                this.handleLongPress(Commands.SAVE_POS4)
              }}
                underlayColor={blue}>
                <Image
                  style={{
                  width: 35,
                  height: 50,
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 14,
                  position: 'relative'
                }}
                  source={require('./images/Standup.png')}/></TouchableHighlight>
              <Text style={styles.arrowText}>Stand Up</Text>
              <Text style={styles.arrowTextBottom}>Tap and hold Icon to edit</Text>
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
    height: 60
  },
  arrowCircleBig: {
    backgroundColor: '#979797',
    width: 70,
    borderRadius: 50,
    height: 70
  },
  mainContainer: {
    backgroundColor: '#222',
    position: 'absolute',
    minWidth: width,
    minHeight: height,
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  arrowText: {
    color: "#d5d5d5",
    zIndex: 10000,
    marginTop: 9
  },
  arrowTextBottom: {
    color: "#d5d5d5",
    zIndex: 10000,
    position: 'absolute',
    bottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: 'center'
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
  }
});

export default Control;