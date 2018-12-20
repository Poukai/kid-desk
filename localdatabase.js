import { AsyncStorage } from 'react-native';
import _ from 'lodash';

// const TAG = 'LocalDatabase';
// const KEY_SAVE = {
//   USER: 'USER'
// };
// export default class LocalDatabase {
//   static async getValue(key) {
//     return await AsyncStorage.getItem(key);
//   }
//   static async saveValue(key, value) {
//     return await AsyncStorage.setItem(key, value);
//   }
//   static async getAllKeys() {
//     return await AsyncStorage.getAllKeys();
//   }
// }
export  const setItem= async(key, value) =>{
    try {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // console.error('AsyncStorage#setItem error: ' + error.message);
    }
}
export const getItem = async(key)=> {
    return await AsyncStorage.getItem(key)
        .then((result) => {
            if (result) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    // console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
                }
            }
            return result;
        });
}
export const  removeItem = async(key)=> {
    return await AsyncStorage.removeItem(key);
}