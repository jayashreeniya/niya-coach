import React from "react";
import { SafeAreaView, TouchableOpacity, StyleSheet, Image, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { back } from "../../../../blocks/AudioLibrary/src/assets";
import { star } from "../assets";
import { dimensions, Colors } from "../../utils";
import Typography from "../../Typography";
import Board from "./Board";
import Button from "../../Button";

type State = {
  gameReady: boolean;
  completed: boolean;
  timer: number;
  count: number;
  resetBoard: boolean;
}

class Bubble extends React.Component<{ goBack: () => void }, State> {

  interval: any;

  constructor(props: { goBack: () => void }){
    super(props);

    this.state = {
      gameReady: false,
      completed: false,
      timer: 0,
      count: 0,
      resetBoard: false
    }
  }

  componentWillUnmount(): void {
    if(this.interval){
      clearInterval(this.interval);
    }
  }

  startGame = () => {
    this.setState({ gameReady: true });
    this.startTimer();
  }

  startTimer = () => {
    this.interval = setInterval(this.incrementTime, 1000);
  }

  incrementTime = () => {
    // console.log("Timer: ", this.state.timer)
    if(this.state.timer < 5){
      this.setState(prev => ({
        timer: prev.timer + 1
      }));
    } else {
      this.completeGame();
      clearInterval(this.interval);
    }
  }

  incrementCount = () => {
    this.setState(prev => {
      const score = prev.count + 1;
      const reset = (score > 0) && ((score % 9) === 0);
      return {
        count: prev.count + 1,
        resetBoard: reset
      }
    });
  }

  completeGame = () => {
    this.setState({
      gameReady: false,
      completed: true
    });
  }

  resetGame = () => {
    this.setState({
      gameReady: false,
      completed: false,
      timer: 0,
      count: 0,

    });
  }

  closeGame = () => {
    this.props.goBack();
  }

  renderTop = () => {
    if(this.state.gameReady || this.state.completed){
      return(
        <View style={styles.banner}>
          <View style={[styles.row, { justifyContent: "space-between", marginBottom: 10 }]}>
            <View style={[styles.row, styles.labelWrapper]}>
              <Typography size={15}>Score</Typography>
              <View style={styles.scoreWrapper}>
                <Typography color="green" size={15}>{this.state.count * 5}</Typography>
              </View>
            </View>
            <View style={[styles.row, styles.imageWrapper]}>
              {(this.state.count > 0)? (<>
                <Image source={star} style={styles.star} />
                <Typography size={16}>Great !!</Typography>
              </>): null}
            </View>
          </View>
          {this.state.completed? <Typography align="center" size={15}>You popped {this.state.count} bubbles in 5 seconds</Typography>: null}
        </View>
      );
    }
    return null;
  }

  renderBottom = () => {
    if(!this.state.gameReady && !this.state.completed){
      return(
        <Button
          onPress={this.startGame}
          style={styles.button}
        >
          Start
        </Button>
      );
    } else if(this.state.gameReady) {
      return <Typography size={17} color="white">{10 - this.state.timer}</Typography>
    } else if(this.state.completed) {
      return(
        <>
          <Button
            onPress={this.resetGame}
            style={styles.button}
          >
            Play Again
          </Button>
          <Button
            onPress={this.closeGame}
            style={styles.button}
          >
            Next
          </Button>
        </>
      )
    }
    return null;
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
          <Typography color="white" size={18} font="MED" align="center">Pop the bubbles</Typography>
        </LinearGradient>
        <View style={styles.wrapper}>
          {this.renderTop()}
          <Board
            ready={this.state.gameReady}
            completed={this.state.completed}
            start={this.startGame}
            increment={this.incrementTime}
            collect={this.incrementCount}
            reset={this.state.resetBoard}
          />
          {this.renderBottom()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    width: "100%",
    paddingVertical: dimensions.hp(3),
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
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: dimensions.wp(5)
  },
  row: {
    flexDirection: "row"
  },
  banner: {
    padding: dimensions.wp(5),
    borderRadius: dimensions.wp(4),
    borderColor: Colors.accent,
    borderWidth: 3,
    width: "100%",
    backgroundColor: Colors.white
  },
  labelWrapper: {
    paddingLeft: dimensions.wp(2),
    borderRadius: dimensions.wp(1),
    backgroundColor: "#eeeeee",
    alignItems: "center"
  },
  scoreWrapper: {
    paddingVertical: dimensions.wp(2),
    paddingHorizontal: dimensions.wp(3),
    borderRadius: dimensions.wp(1),
    backgroundColor: Colors.white,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#eeeeee"
  },
  imageWrapper: {
    alignItems: "center"
  },
  star: {
    height: dimensions.wp(7),
    width: dimensions.wp(7),
    tintColor: "#FFEC00",
    marginRight: 10
  },
  button: {
    width: "50%"
  }
});

export default Bubble;