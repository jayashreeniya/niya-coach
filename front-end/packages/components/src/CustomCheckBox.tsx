// @ts-nocheck
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CheckBox from '@react-native-community/checkbox';
import {Platform, Switch } from 'react-native';
type MyProps = { testID:string, isChecked: boolean; onChangeValue?: (value: boolean) => void };
type MyState = { isChecked: boolean; onChangeValue?: (value: boolean) => void };

export default class CustomCheckBox extends Component<MyProps, MyState> {
  static propTypes = {
    testID: PropTypes.string, 
    isChecked: PropTypes.bool.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    tintColors: PropTypes.any
  };

  constructor(props: any) {
    super(props);

    this.state = {
      isChecked: this.props.isChecked
    };
  }

  render() {
   
    const { testID, tintColors } = this.props;

    if (Platform.OS === 'ios') {
      return (

        <Switch
          testID={testID}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ marginRight: 5, marginLeft: 5 }}
          value={this.state.isChecked}
          trackColor={{false: 'yellow', true: 'rgb(91,146,218)'}}
          thumbColor={this.state.isChecked ? 'white' : 'white'}
          onValueChange={value => this.handleValueChange(value)}
        />
      );
    } else {
      return (
        <CheckBox
          testID={testID}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginRight: Platform.OS === "web" ? 5 : 0,
            marginLeft: Platform.OS === "web" ? 5 : 0,
        
          }}
          value={this.state.isChecked}
          tintColors={tintColors}
          checked={this.state.isChecked}
          onPress={()=>this.handleAndroid()}
        />
      );
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (true) {
      this.setState({
        isChecked: nextProps.isChecked
      });
    }
  }

  handleValueChange(value: boolean) {
    this.setState({
      isChecked: value
    });
    if (this.props.onChangeValue) {
      this.props.onChangeValue(value);
    }
  }

  handleAndroid(){
    this.setState({
      isChecked: !this.state.isChecked
    }, ()=>{
      this.props.onChangeValue(this.state.isChecked)
    })
  }
}
