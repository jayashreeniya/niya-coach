import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { SearchBar } from "react-native-elements";

interface Props {
  containerStyle: any;
  placeholder: any;
  showLoading: boolean;
  onChangeText: (text: string) => any;
  autoCorrect: any;
  autoFocus: any;
  value: any;
  platform: "default" | "ios" | "android";
}

interface S {
  containerStyle: any;
  placeholder: any;
  showLoading: boolean;
  onChangeText: (text: string) => any;
  autoCorrect: any;
  autoFocus: any;
  value: any;
  platform: "default" | "ios" | "android";
}


export default class GenericSearch extends Component<Props, S> {

  constructor(props: Props) {
    super(props);

    this.state = {
      containerStyle: props.containerStyle,
      placeholder: props.placeholder,
      showLoading: props.showLoading,
      onChangeText: props.onChangeText,
      autoCorrect: props.autoCorrect,
      autoFocus: props.autoFocus,
      value: props.value,
      platform: props.platform,
    };
  }



  render() {

    return (
      <View style={styles.container}>
        <SearchBar
          containerStyle={this.props.containerStyle}
          placeholder={this.props.placeholder}
          autoCorrect={this.props.autoCorrect}
          autoFocus={this.props.autoFocus}
          value={this.props.value}
          showLoading={this.props.showLoading}
          onChangeText={(text: string) => this.props.onChangeText(text)}
          platform={this.props.platform}
        />
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0
  },
});
