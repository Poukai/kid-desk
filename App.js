import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Scan from "./Scan";
import Control from "./Control";
import Moving from "./Moving";
import Edit from "./Edit";
import Settings from "./Settings";
import {Provider} from 'react-redux';
import store from './store';

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
  }
}, {
  initialRouteName: 'Scan',
  headerMode: 'none'
});

class App extends React.Component {
  render() {
    return (
      <View style={{
        flex: 1
      }}>
        <Provider store={store}>
          <StatusBar hidden={true}/><RootStack/>
        </Provider>

      </View>
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