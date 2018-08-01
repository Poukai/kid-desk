import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight , Platform} from "react-native";
import {Col, Row, Grid} from "react-native-easy-grid";
import {Icon, Button} from 'react-native-elements'
import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import {Commands} from "./config";
import {sendCommand} from "./Scan";
import {connect} from 'react-redux';
import {getHeight} from './actions/index'
import {bindActionCreators} from 'redux';
const blue = "#00A7F7";
const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SFProDisplay"
class Moving extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height
    };
  }
  componentWillMount() {
    this.setState({height : this.props.navigation.state.params.height});
  }

  handleClickMovement() {
    console.log("test");
  }
  stopMovement = () => {
    this
      .props
      .navigation
      .navigate('Control', {connected_peripheral: this.props.navigation.state.params.connected_peripheral})
    const a = sendCommand(this.props.navigation.state.params.connected_peripheral, Commands.STOP);
    // console.log(a)
    
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height.height
    }, this._storeData);
  }
  render() {
    const height = this.state.height;
    console.log(height);
    return (
      <View style={styles.mainContainer}>
        <Grid>
          <Row>
            <Col
              style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Text style={styles.arrowText}>Desk is moving {this.props.navigation.state.params.cmd.Command=="UP" ?"up" : "down"}...</Text>
              <Text style={styles.heightText}>{height.toString()}</Text>
              <TouchableHighlight
                onPress={this.stopMovement}
                transparent>
                <Text style={styles.stopText}>Tap to Stop</Text>
                </TouchableHighlight>
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
  mainContainer: {
    backgroundColor: '#000000',
    minWidth: width,
    minHeight: height
  },
  arrowText: {
    marginTop: 9,
    marginBottom: 91,
    color:"#fff",
    fontSize:22,
    fontFamily: fontFamily,
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
  stopText:{
    color: '#D8D8D8',
    fontSize: 22,
    marginTop:50,
    marginLeft:"auto",
    marginRight:"auto",
    fontWeight:"100",
    fontFamily: "SFProDisplay-Thin",
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
  arrowCircleActive: {
    backgroundColor: blue
  }
});

const mapStateToProps = (state) => ({height: state.update});

const mapDispatchToProps = dispatch => ({
  getHeight: bindActionCreators(getHeight, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Moving);