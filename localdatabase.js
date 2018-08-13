import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const TAG = 'LocalDatabase';
const KEY_SAVE = {
  USER: 'USER'
};
export default class LocalDatabase {
  static async getValue(key) {
    return await AsyncStorage.getItem(key);
  }
  static async saveValue(key, value) {
    return await AsyncStorage.setItem(key, value);
  }
  static async getAllKeys() {
    return await AsyncStorage.getAllKeys();
  }
}