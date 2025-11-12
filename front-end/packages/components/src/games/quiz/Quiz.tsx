import React from "react";
import { View, SafeAreaView, TouchableOpacity, StyleSheet, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { questionCount, QuizColor, generateQuestions, generateOptions, verify } from "./quiz";
import { back } from "../../../../blocks/AudioLibrary/src/assets";
import { Colors, dimensions } from "../../utils";
import Typography from "../../Typography";
import Button from "../../Button";

type State = {
  colorMap: Partial<Record<QuizColor, string>>;
  list: string[];
  gameReady: boolean;
  score: number;
  count: number | null;
  completed: boolean;
  options: { name: QuizColor, code: string }[];
}

class Quiz extends React.Component<{ goBack: () => void }, State> {

  constructor(props: { goBack: () => void }){
    super(props);

    this.state = {
      colorMap: {},
      list: [],
      gameReady: false,
      score: 0,
      count: null,
      completed: false,
      options: []
    }
  }

  componentDidMount(): void {
    const newQuestions = generateQuestions();
    const colors = Object.keys(newQuestions);
    const options = generateOptions(colors[0], newQuestions[colors[0]]);
    this.setState({
      colorMap: newQuestions,
      list: colors,
      gameReady: true,
      count: 0,
      options
    });
  }

  resetGame = () => {
    const newQuestions = generateQuestions();
    const colors = Object.keys(newQuestions);
    const options = generateOptions(colors[0], newQuestions[colors[0]]);
    this.setState({
      colorMap: newQuestions,
      list: colors,
      gameReady: true,
      count: 0,
      options,
      score: 0,
      completed: false
    });
  }

  verifySelection = (code: string) => {
    if(this.state.completed){
      return;
    }
    const name = this.state.list[this.state.count || 0];
    let options = this.state.options;
    if((typeof this.state.count === "number") && this.state.count < 9){
      options = generateOptions(
        this.state.list[this.state.count + 1],
        this.state.colorMap[this.state.list[this.state.count + 1]]
      );
    }
    const status = verify(name, code);

    this.setState(prev => ({
      count: Math.min((prev.count || 0) + 1, 9),
      score: status? (prev.score + 100): prev.score,
      completed: prev.count === 9,
      options
    }));
  }

  renderScore = () => {
    return(
      <View>
        <View style={styles.scoreWrapper}>
          <View style={[styles.score, { width: `${this.state.score / 100 * questionCount}%` }]} />
        </View>
        <View style={styles.scorePad}>
          <Typography size={17} font="MED">Score: {this.state.score}</Typography>
        </View>
      </View>
    );
  }

  renderQuestion = () => {
    const current = this.state.list[this.state.count || 0];
    return(
      <View style={styles.question}>
        <Typography
          size={30}
          font="BLD"
          align="center"
          mb={2}
          style={{ color: this.state.colorMap[current] }}
        >
          {current}
        </Typography>
        <Typography align="center" font="MED" size={17}>Choose the color of the word</Typography>
      </View>
    );
  }

  renderOptions = () => {
    return(
      <View style={styles.optionsBlock}>
        {this.state.options.map((opt, i) => {
          return(
            <TouchableOpacity
              key={`${i}`}
              onPress={() => this.verifySelection(opt.code)}
              style={styles.option}
            >
              <Typography
                align="center"
                size={17}
                font="MED"
                style={{ color: opt.code }}
              >
                {opt.name}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  renderButton = () => {

    if(!this.state.completed) return null;

    return(
      <>
        <Button
          onPress={this.resetGame}
          style={{ alignSelf: "center", width: dimensions.wp(50) }}
        >
          Play Again
        </Button>
        <Button
          onPress={() => this.props.goBack()}
          style={{ alignSelf: "center", width: dimensions.wp(50) }}
        >
          Next
        </Button>
      </>
    );
  }

  render(): React.ReactNode {
    return(
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#555ab6', '#7e85d5']}
          start={{ x: 0.5, y: 0.6 }}
          end={{ x: 0.9, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={this.props.goBack}>
            <Image style={styles.backIcon} source={back} />
          </TouchableOpacity>
          <Typography color="white" size={18} font="MED" align="center">Find color of the word</Typography>
        </LinearGradient>
        <View style={styles.wrapper}>
          {this.renderScore()}
          {this.renderQuestion()}
          {this.renderOptions()}
          <View style={{ flex: 1 }} />
          {this.renderButton()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  header: {
    width: "100%",
    paddingVertical: dimensions.hp(3),
    backgroundColor: "#8289d9",
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: dimensions.wp(5)
  },
  backIcon: {
    width: dimensions.wp(5),
    height: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(6),
  },
  wrapper: {
    padding: dimensions.wp(5),
    flex: 1
  },
  scoreWrapper: {
    height: dimensions.hp(1.5),
    marginBottom: dimensions.hp(2),
    borderRadius: dimensions.hp(.75),
    backgroundColor: "#efefef"
  },
  score: {
    height: dimensions.hp(1.5),
    borderRadius: dimensions.hp(.75),
    backgroundColor: "#F59591"
  },
  scorePad: {
    paddingVertical: dimensions.wp(3),
    paddingHorizontal: dimensions.wp(4),
    backgroundColor: "#efefef",
    alignSelf: "flex-start",
    borderRadius: dimensions.wp(2)
  },
  question: {
    marginVertical: dimensions.hp(3)
  },
  optionsBlock: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  option: {
    width: dimensions.wp(40),
    paddingVertical: dimensions.wp(3),
    backgroundColor: "#efefef",
    borderRadius: dimensions.wp(3),
    margin: dimensions.wp(2)
  }
});

export default Quiz;