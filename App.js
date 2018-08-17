import React from 'react';
import GlobalFont from 'react-native-global-font';
import {StyleSheet, Text, View, StatusBar, AsyncStorage , Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Scan from "./Scan";
import Control from "./Control";
import Moving from "./Moving";
import Edit from "./Edit";
import Home from "./Home";
import Settings from "./Settings";
import Stopping from "./Stopping";
import {Provider} from 'react-redux';
import rootReducer from './reducers/index'
import {createStore} from 'redux'
import {fadeIn} from 'react-navigation-transitions';
import localStorage from 'react-native-sync-localstorage';
import './ReactotronConfig.js';

global.id="abcdef0123456789";

const store = createStore(rootReducer);

const RootStack = createStackNavigator({
  Scan: {
    screen: Scan
  },
  Control: {
    screen: Control
  },
  Moving: {
    screen: Moving
  },
  Settings: {
    screen: Settings
  },
  Edit: {
    screen: Edit
  },
  Stopping: {
    screen: Stopping
  },
  Home: {
    screen: Home
  }
}, {
  initialRouteName: "Home",
  transitionConfig: () => fadeIn(),
  headerMode: 'none'
});

class App extends React.Component {
  componentDidMount() {
    const fontFamily = Platform.OS === "ios"
      ? "System"
      : "SFProDisplay-Regular"
    let fontName = fontFamily
    GlobalFont.applyGlobal(fontName)
 }
  componentWillMount() {
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{
          flex: 1
        }}>
          <StatusBar hidden={true}/><RootStack/>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App;