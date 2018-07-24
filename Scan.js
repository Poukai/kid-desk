import React, {Component} from 'react';
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
  Alert
} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {stringToBytes, bytesToString} from 'convert-string';
import {Button} from 'react-native-elements';
import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
var Buffer = require('buffer/').Buffer

const ACCESS_TOKEN = 'token'
const ACCOUNT = 'id'
const DEVICE_NAME_DESK = "DeskBLE"
const fontFamily = Platform.OS === "ios"
  ? "System"
  : "SanFrancisco"
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

const PERIPHERAL_ID = "0000ffe0-0000-1000-8000-00805f9b34fb";
const PRIMARY_SERVICE_ID = "0000ffe1-0000-1000-8000-00805f9b34fb";

export const sendCommand =(id, command)=> {
  console.log("CHECK -->"+id+command);
    let tmp = JSON.stringify(command);
    const data = stringToBytes(tmp);
    console.log("CHECK -->"+id+command+data);
    BleManager.write(id, PERIPHERAL_ID, PRIMARY_SERVICE_ID, data)
      .then(() => {
        console.log('Write success : ' + data);
      })
      .catch((error) => {
        // Failure code
        console.log("Error", error);
      });
    // BleManager
    //   .startNotification(id, PERIPHERAL_ID, PRIMARY_SERVICE_ID, data)
    //   .then((readData) => {
    //     console.log('Write: ' + data + "Response :" + readData);
    //     const buffer = Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
    //     const sensorData = buffer.readUInt8(1, true);
    //     bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', ({value, peripheral, characteristic, service}) => {
    //       // Convert bytes array to string
    //       const data = bytesToString(value);
    //       console.log(`Recieved ${data} for characteristic ${characteristic}`);
    //     });
    //     return sensorData;
    //   })
    //   .catch((error) => {
    //     // Failure code
    //     console.log("Error", error);
    //   });
}

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      peripherals: null,
      is_scanning: false,
      deviceList: [],
      connected_peripheral: "",
      id: ""
    };
    this.peripherals = []; // temporary storage for the detected peripherals
    this.handleUpdateValueForCharacteristic = this
      .handleUpdateValueForCharacteristic
      .bind(this);
  }
  connect = (peripheral_id) => {
    console.log(" connecting to this device " + peripheral_id);
    BleManager
      .connect(peripheral_id)
      .then(() => {
        BleManager
          .startNotification(peripheral_id, PERIPHERAL_ID, PRIMARY_SERVICE_ID)
          .then(() => {
            return bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', ({value, peripheral, characteristic, service}) => {
              // Convert bytes array to string
              const data = bytesToString(value);
              console.log(`Recieved ${data} for characteristic ${characteristic}`);
            });
          });
        BleManager
          .retrieveServices(peripheral_id)
          .then((peripheralInfo) => {
            this
              .props
              .navigation
              .navigate('Control', {connected_peripheral: this.state.connected_peripheral})
            console.log('Peripheral info:', peripheralInfo);
          });
      })
      .catch((error) => {
        Alert.alert("Err..", 'Something went wrong while trying to connect.');
      });

  }
  startScan = () => {
    this.setState({is_scanning: true});

    BleManager.scan([], 5).then(() => {
      console.log('scan started');
    });

  }
  componentDidMount() {
    this.init()
  }
  init = () => {
    Platform.OS == "android" && BleManager
      .enableBluetooth()
      .then(() => {
        console.log('Bluetooth is already enabled');
      })
      .catch((error) => {
        Alert.alert('You need to enable bluetooth to use this app.');
      });
    // initialize the BLE module
    BleManager
      .start({showAlert: false})
      .then(() => {
        console.log('Module initialized');
      });

    this.startScan()

    if (this.peripherals.length > 0) {
      for (let i in this.peripherals) {
        if (this.peripherals[i].name == "KidDesk") {
          this.selectKidDesk(this.peripherals[i])
        }
      }
    }
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (peripheral) => {

      var peripherals = this.peripherals; // get the peripherals
      // check if the peripheral already exists
      var el = peripherals.filter((el) => {
        return el.id === peripheral.id;
      });

      if (!el.length && peripheral.name != null) {
        peripherals.push({
          id: peripheral.id, // mac address of the peripheral
          name: peripheral.name // descriptive name given to the peripheral
        });
        if (peripheral.name == "KidDesk") {
          this.selectKidDesk(peripheral)
        }
      }
      this.peripherals = peripherals; // update the array of peripherals
      const tempDeviceList = this
        .peripherals
        .filter((item) => item.name != null)
      tempDeviceList && tempDeviceList.length > 0 && this.setState({deviceList: tempDeviceList});

    });
    // next: add code for listening for when the peripheral scan has stopped

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      console.log('scan stopped');
      console.log(this.peripherals);
      if (this.peripherals.length == 0) {
        this.setState({is_scanning: false})
        // data.filter((item)=> item.name=="KidDesk") Alert.alert('Nothing found',
        // "Sorry, no peripherals were found");
      }
    });
  }
  selectKidDesk = (KidDeskItem) => {
    console.log(KidDeskItem);
    this.setState({connected_peripheral: KidDeskItem.id})
    this.connect(KidDeskItem.id)
  }
  handleUpdateValueForCharacteristic(data) {
    let temp = bytesToString(data.value);
    console.log('Received : ' + temp);
  }

  handleButton = () => {
    this.init()
    for (var i in this.peripherals) {
      if (this.peripherals[i].name == "KidDesk") {
        this.selectKidDesk(this.peripherals[i])
      }
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Image
          style={{
          width: 35,
          height: 35,
          alignItems: "center",
          alignSelf: "center",
          marginTop: 70
        }}
          source={require('./images/Logo.png')}/>
        <Text style={styles.headerTitle}>Connect to Kid Desk</Text>
        <Text style={styles.headerDesc}>You don't have any Kid Desk. Please connect this app to Kid Desk via Bluetooth.</Text>
        <View style={styles.bluetoothBox}>
          <Text style={styles.connectionStatus}>{this.state.deviceList.length > 0
              ? (this.state.connected_peripheral
                ? "Searching for KidDesk"
                : "Connecting to Kid Desk")
              : "Not Connected"}</Text>
          {this.state.deviceList && <FlatList
            data={this.state.deviceList}
            style={styles.deviceList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <Text style={styles.deviceListItem} key={item.id}>{item.name}</Text>}/>}
          <Button
            onPress={this.handleButton}
            title="Scan for Devices"
            large
            backgroundColor="#017DF7"/>
          <Button
            onPress={this.handleButton}
            buttonStyle={styles.openBTsettings}
            title="Open Bluetooth Settings"
            large
            backgroundColor="#017DF7"/>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  headerTitle: {
    fontFamily: fontFamily,
    fontSize: 28,
    alignItems: "center",
    alignSelf: "center",
    color: "#333",
    fontWeight: "bold",
    marginTop: 30
  },
  headerDesc: {
    fontFamily: fontFamily,
    fontSize: 17,
    color: "#333",
    fontWeight: "normal",
    marginTop: 15,
    textAlign: "center",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 40
  },
  bluetoothBox: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 20,
    marginLeft: 15,
    marginRight: 15
  },
  deviceList: {
    backgroundColor: '#F0EFF5',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#979797",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    marginBottom: 40
  },
  connectionStatus: {
    fontSize: 16,
    color: "#aaa",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginLeft: 15,
    marginRight: 15
  },
  openBTsettings: {
    marginTop: 20
  },
  deviceListItem: {
    padding: 10
  }
});

export default Scan;