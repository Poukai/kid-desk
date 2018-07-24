import { sendCommand } from "./Scan"

const ACCESS_TOKEN = 'token'
const ACCOUNT = 'id'
const DEVICE_NAME_DESK = "DeskBLE"

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule); // create an event emitter for the BLE Manager module

const PERIPHERAL_ID = "0000ffe0-0000-1000-8000-00805f9b34fb";
const PRIMARY_SERVICE_ID = "0000ffe1-0000-1000-8000-00805f9b34fb";

