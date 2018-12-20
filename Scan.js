import React, { Component } from 'react';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  NativeEventEmitter, // for emitting events for the BLE manager
  NativeModules, // for getting an instance of the BLE manager module
  Platform,
  FlatList,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';

import { createStackNavigator } from 'react-navigation';
import { stringToBytes, bytesToString } from 'convert-string';
import { Button } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
import { updateHeight, updatePos } from './actions/index';

const blue = '#00A7F7';
const purple = '#4B00A4';
const ACCESS_TOKEN = 'token';
const ACCOUNT = 'id';
const DEVICE_NAME_DESK = 'DeskBLE';
const fontFamily = Platform.OS === 'ios' ? 'System' : 'SFProDisplay-Regular';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

export const sendCommand = (id, command) => {
  console.log(`COMMAND SENT TO DEVICE ==> ${JSON.stringify(command)}`);
  BleManager.isPeripheralConnected(id, []).then((isConnected) => {
    if (isConnected) {
      console.log('Peripheral is connected!');
    } else {
      this.props.navigation.navigate('Scan', {
        connected_peripheral: id,
      });
      console.log('Peripheral is NOT connected!');
    }
  });
  if (Platform.OS === 'ios') {
    BleManager.retrieveServices(id)
      .then((peripheralInfo) => {
        // Success code
        console.log(peripheralInfo);
        const id = peripheralInfo.id;
        const services = peripheralInfo.services;
        const characteristics = peripheralInfo.characteristics;
        const tmp = JSON.stringify(command);
        const data = stringToBytes(tmp);
        BleManager.writeWithoutResponse(id, services[0], characteristics[0].characteristic, data)
          .then(() => {})
          .catch((error) => {
            // Failure code
            console.log(error);
          });
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  } else {
    BleManager.retrieveServices(id)
      .then((peripheralInfo) => {
        // Success code
        console.log(peripheralInfo);
        const id = peripheralInfo.id;
        const services = peripheralInfo.services;
        const characteristics = peripheralInfo.characteristics;
        const tmp = JSON.stringify(command);
        const data = stringToBytes(tmp);
        BleManager.write(id, services[2].uuid, characteristics[6].characteristic, data)
          .then(() => {})
          .catch((error) => {
            // Failure code
            console.log(error);
          });
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }
};

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      peripherals: null,
      is_scanning: false,
      deviceList: [],
      connected_peripheral: '',
      id: '',
      height: 0,
      POS_OK: false,
    };
    this.peripherals = []; // temporary storage for the detected peripherals
    this.init();
    this.interval = null;
  }

  connect = (id) => {
    this.interval && clearInterval(this.interval);
    BleManager.stopScan().then(() => {
      // Success code
      console.log('Scan stopped');
    });

    console.log(` connecting to this device ${id}`);
    if (Platform.OS === 'ios') {
      BleManager.connect(id)
        .then(() => {
          BleManager.retrieveServices(id).then((peripheralInfo) => {
            // Success code
            console.log(peripheralInfo);
            const id = peripheralInfo.id;
            const services = peripheralInfo.services;
            const characteristics = peripheralInfo.characteristics;
            console.log(`peripheralInfo${peripheralInfo}`);
            BleManager.startNotification(id, services[0], characteristics[0].characteristic)
              .then(() => {
                // Success code
                bleManagerEmitter.addListener(
                  'BleManagerDidUpdateValueForCharacteristic',
                  this.handleUpdateValueForCharacteristic,
                );
                this.props.navigation.navigate('Control', {
                  connected_peripheral: id,
                  height: this.state.height,
                });
                console.log('Notification started');
              })
              .catch((error) => {
                // Failure code
                console.log(error);
              });
          });
        })
        .catch((error) => {
          Alert.alert('Err..', 'Something went wrong while trying to connect.');
        });
    } else {
      BleManager.connect(id)
        .then(() => {
          BleManager.retrieveServices(id).then((peripheralInfo) => {
            // Success code
            console.log(peripheralInfo);
            const id = peripheralInfo.id;
            const services = peripheralInfo.services;
            const characteristics = peripheralInfo.characteristics;
            console.log(`peripheralInfo${peripheralInfo}`);
            BleManager.startNotification(id, services[2].uuid, characteristics[6].characteristic)
              .then(() => {
                // Success code
                bleManagerEmitter.addListener(
                  'BleManagerDidUpdateValueForCharacteristic',
                  this.handleUpdateValueForCharacteristic,
                );
                this.props.navigation.navigate('Control', {
                  connected_peripheral: id,
                  height: this.state.height,
                });
                console.log('Notification started');
              })
              .catch((error) => {
                // Failure code
                console.log(error);
              });
          });
        })
        .catch((error) => {
          Alert.alert('Err..', 'Something went wrong while trying to connect.');
        });
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      height: nextProps.height,
      POS_OK: nextProps.POS_OK,
    });
  }

  startScan = () => {
    this.setState({ is_scanning: true });

    BleManager.scan([], 15).then(() => {
      console.log('scan started');
    });
  };

  componentDidMount() {}

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  init = () => {
    Platform.OS == 'android'
      && BleManager.enableBluetooth()
        .then(() => {
          console.log('Bluetooth is already enabled');
          BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
            // Success code
            console.log(peripheralsArray);
            if (peripheralsArray.length > 0 && peripheralsArray[0].name === 'KidDesk') {
              this.connect(peripheralsArray[0].id);
            }
          });
          this.startScan();
        })
        .catch((error) => {
          Alert.alert('You need to enable bluetooth to use this app.');
        });
    // initialize the BLE module
    BleManager.start({ showAlert: true }).then(() => {
      this.interval = setInterval(() => {
        BleManager.scan([], 15).then(() => {
          console.log('scan started');
        });
      }, 1000);
    });

    BleManager.scan([], 15).then(() => {
      console.log('scan started');
    });
    if (this.peripherals.length > 0) {
      for (const i in this.peripherals) {
        if (this.peripherals[i].name == 'KidDesk') {
          this.selectKidDesk(this.peripherals[i]);
        }
      }
    }
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (peripheral) => {
      const peripherals = this.peripherals; // get the peripherals
      // check if the peripheral already exists
      const el = peripherals.filter(el => el.id === peripheral.id);

      if (!el.length && peripheral.name != null) {
        peripherals.push({
          id: peripheral.id, // mac address of the peripheral
          name: peripheral.name, // descriptive name given to the peripheral
        });
        if (peripheral.name == 'KidDesk') {
          this.selectKidDesk(peripheral);
        }
      }
      this.peripherals = peripherals; // update the array of peripherals
      const tempDeviceList = this.peripherals.filter(item => item.name != null);
      tempDeviceList && tempDeviceList.length > 0 && this.setState({ deviceList: tempDeviceList });
    });
    // next: add code for listening for when the peripheral scan has stopped

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      console.log('scan stopped');
      console.log(this.peripherals);
      if (this.peripherals.length == 0) {
        this.setState({ is_scanning: false });
        // data.filter((item)=> item.name=="KidDesk") Alert.alert('Nothing found',
        // "Sorry, no peripherals were found");
      }
    });
  };

  selectKidDesk = (KidDeskItem) => {
    console.log(KidDeskItem);
    this.setState({ connected_peripheral: KidDeskItem.id });
    this.connect(KidDeskItem.id);
  };

  selectDevice = (id) => {
    this.setState({ connected_peripheral: id });
    this.connect(id);
  };

  handleUpdateValueForCharacteristic = (data) => {
    console.log(`data.value ${data.value}`);
    if (data && data.value) {
      const temp = bytesToString(data.value);
      const a = `${temp}`;
      if (a.includes('POS_OK')) {
        this.props.updatePos(true);
      }
      console.log(`a ${a}`);
      if (a.split(',').length > 1) {
        const b = a.split(',')[1];
        console.log(`b ${b}`);
        if (a.includes('Height')) {
          const h = Number(b.match(/\d+/g));
          const fh = Math.floor(h);
          console.log(`HEIGHT IS HERE : ${h}`);
          this.props.updateHeight(fh);
        }
        console.log(`Received : ${temp}`);
      }
    }
  };

  handleButton = () => {
    this.startScan();
    for (const i in this.peripherals) {
      if (this.peripherals[i].name == 'KidDesk') {
        // this.selectKidDesk(this.peripherals[i])
      }
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Image
          style={{
            width: 35,
            height: 35,
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 70,
          }}
          source={require('./images/Logo.png')}
        />
        <Text style={styles.headerTitle}>
          <Text style={styles.headerTitleHalf}>Connect to </Text>
          Kid Desk
        </Text>
        <Text style={styles.headerDesc}>
          You don't have any Kid Desk. Please connect this app to Kid Desk via Bluetooth.
        </Text>
        <View style={styles.bluetoothBox}>
          <Text style={styles.connectionStatus}>
            {this.state.deviceList.length > 0
              ? this.state.connected_peripheral
                ? 'Searching for KidDesk'
                : 'Connecting to Kid Desk'
              : 'Searching for KidDesk'}
          </Text>
          {this.state.deviceList && (
            <FlatList
              data={this.state.deviceList}
              style={styles.deviceList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.selectDevice(item.id);
                  }}
                  style={styles.deviceListItem}
                  key={item.id}
                >
                  <Text>
                    {' '}
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            colors={['#D100D0', '#4B00A4']}
            style={styles.linearGradient}
          >
            <Button
              title="Scanning for Kid Desk"
              onPress={this.handleButton}
              loading
              textStyle={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '300',
                fontFamily,
              }}
              buttonStyle={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: -12,
              }}
              transparent
            />
          </LinearGradient>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
  headerTitle: {
    fontFamily,
    fontSize: 28,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    fontWeight: '300',
    color: '#4B00A4',
  },
  headerTitleHalf: {
    color: '#37355C',
  },
  headerDesc: {
    fontFamily,
    fontSize: 18,
    color: '#37355C',
    fontWeight: 'normal',
    marginTop: 15,
    textAlign: 'center',
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 40,
  },
  bluetoothBox: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  deviceList: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#979797',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 40,
  },
  connectionStatus: {
    fontSize: 16,
    color: '#aaa',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginRight: 15,
  },
  openBTsettings: {
    zIndex: 100000,
  },
  deviceListItem: {
    padding: 10,
  },

  linearGradient: {
    padding: 15,
    height: 54,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 25,
    marginBottom: 50,
    position: 'relative',
    marginTop: 15,
  },
});

const mapStateToProps = state => ({
  height: state.update.height,
  POS_OK: state.update.POS_OK,
});

const mapDispatchToProps = dispatch => ({
  updateHeight: bindActionCreators(updateHeight, dispatch),
  updatePos: bindActionCreators(updatePos, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scan);
