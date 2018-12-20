import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Platform ,AsyncStorage,Alert, BackHandler} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
const {width, deviceHeight} = Dimensions.get('window');
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {getHeight} from './actions/index'
import {bindActionCreators} from 'redux';
import PouchDB from 'pouchdb-react-native'
import { debounce } from 'lodash';
import {setItem,getItem} from './localdatabase';

const onClickView = funcOnView => {
  return debounce(funcOnView, 2000, {
    trailing: false,
    leading: true
  });
};

const localDB = new PouchDB('myDB')

const blue = "#00A7F7";
const purple="#4B00A4";
const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Regular"

const fontFamilyThin= Platform.OS === "ios"
  ? "System"
  : "SFProDisplay-Thin"
class Stopping extends Component {
  constructor(props) {
    super(props);
  }
  
componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
  setTimeout(() => {
    this.props.navigation.navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral});
  }, 3000);
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
}

onBackButtonPressed() {
  return true;
}

  render() {
    return (
        <Grid style={styles.mainContainer}>
          <Row>
            <Col
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <View>
                <Text style={styles.stopText}>Stopping...</Text>
                </View>
            </Col>
          </Row>
        </Grid>
    );
  }
}
const styles = StyleSheet.create({
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
  stopText:{
    marginTop: 50,
    marginBottom: 91,
    color:"#000000",
    fontSize:24,
    fontFamily: fontFamily,
    elevation:3,
    fontWeight:"300",
  },
});

export default Stopping;