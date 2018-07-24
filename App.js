import React from 'react';
import { StyleSheet, Text, View ,StatusBar } from 'react-native';
import {
  createStackNavigator,
} from 'react-navigation';
import Scan from "./Scan";
import Control from "./Control";
import  Moving from "./Moving";
import Edit from "./Edit";
import Settings from "./Settings";

const RootStack = createStackNavigator({
  Scan: { screen: Scan },
  Control: { screen: Control },
  Moving: { screen: Moving },
  Settings: { screen: Settings },
  Edit: { screen: Edit },
},{
  initialRouteName: 'Edit',
  headerMode: 'none'
});

class App extends React.Component {
  render() {
  return (<View style={{flex:1}}>
    <StatusBar hidden={true} /><RootStack />
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;