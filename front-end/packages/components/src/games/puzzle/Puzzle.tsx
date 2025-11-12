import {
  View,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  UIManager,
  TouchableOpacity,
  Text
} from 'react-native';
import React from 'react';

import { createPuzzle } from './puzzle';
import { getRandomImage } from './api';
import { back } from "../../../../blocks/AudioLibrary/src/assets";
import { Colors, dimensions } from "../../utils";
import Game from './Game';
import Typography from "../../Typography";
import Button from "../../Button";

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class Puzzle extends React.Component<{ goBack: () => void }> {
  state = {
    size: 3,
    puzzle: null,
    image: null,
    completed: false
  };

  componentDidMount() {
    this.preloadNextImage();
  }

  async preloadNextImage() {
    const image = await getRandomImage();
    Image.prefetch(image.uri);

    this.setState({
      image,
      puzzle: createPuzzle(3),
      size: 3
    });
  }

  handleGameChange = (puzzle: any) => {
    this.setState({ puzzle });
  };

  handleQuit = () => {
    this.setState({ puzzle: null, image: null, completed: true });
  };

  reset = () => {
    this.setState({ completed: false });
    this.preloadNextImage();
  }

  render() {
    const { image, puzzle } = this.state;
    
    return (
      <SafeAreaView style={styles.container}>
        {puzzle?<View style={styles.header}>
          <TouchableOpacity
            onPress={this.props.goBack}
            style={{ width: "25%" }}
          >
            <Image source={back} style={{ height: 20, width: 20, resizeMode: "contain", tintColor: "#8E84DA", marginRight: 20 }} />
          </TouchableOpacity>
          <View style={{ width: "75%"}}>
            <Text style={styles.text}>Put the puzzle together</Text>
          </View>
        </View>: null}
        {puzzle?(
          <View style={[styles.header, styles.wrapper]}>
            <Text style={styles.info}>Let's play a game.. Rearrange the squares and put the picture together</Text>
          </View>)
        : null}
        {this.state.completed? (
          <View style={styles.banner}>
            <Typography align="center" size={16} color="white">Great! Thats a perfect picture</Typography>
          </View>
        ): null}
        {this.state.completed? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ flex: 1 }} />
            <Button
              onPress={this.reset}
              style={styles.button}
            >
              Play Again
            </Button>
            <Button
              onPress={() => this.props.goBack()}
              style={styles.button}
            >
              Next
            </Button>
          </View>
        ): null}
        {puzzle && (
          <Game
            puzzle={puzzle}
            image={image}
            onChange={this.handleGameChange}
            onQuit={this.handleQuit}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: "stretch",
    justifyContent: 'center',
  },
  header: {
    height: 55,
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  text: {
    color: "#8E84DA",
    fontSize: 20,
    fontWeight: "bold"
  },
  wrapper: {
    marginVertical: 40,
    marginHorizontal: 20
  },
  info: {
    color: "#8E84DA",
    fontSize: 18,
    textAlign: "center"
  },
  banner: {
    backgroundColor: Colors.accent,
    borderColor: "#3B35BC",
    borderWidth: 3,
    borderRadius: dimensions.wp(3),
    padding: dimensions.wp(5),
    margin: dimensions.wp(5)
  },
  button: {
    width: "50%"
  }
});