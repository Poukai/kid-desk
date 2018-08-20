import React, { Component, createElement, Children } from 'react';

export default class Touchable extends Component {

        _pressThreshold = 300;

	_pressedIn = null;

	_pressInBubbling = null;

	_onPressIn(event){

		this._pressedIn = Date.now();

		this._pressInBubbling = setTimeout( () => {
			this.props.onPressIn ? this.props.onPressIn(event) : null;
		},0);
	}

	_onPressOut(event){
		clearTimeout(this._pressInBubbling);
		this.props.onPressOut ? this.props.onPressOut(event) : null;
	}

	_onPress(event){
		if( (Date.now() - this._pressedIn) < this._pressThreshold ){
			this.props.onPress ? this.props.onPress(event) : null;
		} 
		this._pressedIn = null;
	}

	getProperty(property, props){
		const prop = props[property];
		delete props[property];
		return  prop;
	}

	bindInteractions(props){
		return {
			...props,
			onPress:this._onPress.bind(this),
			onPressIn:this._onPressIn.bind(this),
			onPressOut:this._onPressOut.bind(this),
		}
	}

	render(){
		const props = this.props;
		const children = this.getProperty('children', props);
		const component = this.getProperty('as', props);
		const newProps = this.bindInteractions(props);
		return createElement(component, newProps, Children.toArray(children));
	}
}