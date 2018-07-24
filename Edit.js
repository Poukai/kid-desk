import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
import {sendCommand} from "./Scan";
import {Commands} from "./config";

const {width, height} = Dimensions.get('window');
const blue = "#00A7F7";
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleClickMovement = (cmd) => {
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, cmd);
    console.log(a)
  }
  handleBackPress=()=>{
    this.props.navigation.navigate('Control')
  }
  save=()=>{
    console.log(this.props.navigation.state.params.cmd);
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, this.props.navigation.state.params.cmd);
    this
      .props
      .navigation
      .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral })
  }
  render() {
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
              <Text style={styles.heightText}>142.5</Text>
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
  },
  arrowText: {
    color: "#d5d5d5",
    zIndex: 10000,
    marginTop: 9,
    marginBottom:10,
    fontSize:18,
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

export default Edit;