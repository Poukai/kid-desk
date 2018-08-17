import React from 'react'
import { View, Text, Image, StyleSheet, TouchableHighlight , Alert ,BackHandler} from "react-native";
import * as Animatable from 'react-native-animatable';
import {Icon, Button} from 'react-native-elements';

class  ResetIcon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    render() {
        return (
            <View>
            <Icon name="cw" type="entypo" size={75} transition="rotate" color={purple} style={styles.headerTextIcon}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    headerTextIcon:{
        
    }
});
export default ResetIcon;