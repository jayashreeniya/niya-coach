import React from "react";
import { Modal, View, StyleSheet, ImageBackground } from "react-native";

import { modalBg } from "./assets";
import { dimensions, Colors } from "../utils";
import { Quiz } from "./quiz/quiz";
import Seashell from "./seashell/Seashell";
import { Puzzle } from "./puzzle/puzzle";
import Bubble from "./bubble/Bubble";
import Wheel from "./wheeloffortune/Wheel";
import Typography from "../Typography";
import Button from "../Button";

type GameName = "PUZZLE" | "SEA SHELL" | "BUBBLE";

const GAMES: Record<GameName, GameName> = {
  PUZZLE: "PUZZLE",
  "SEA SHELL": "SEA SHELL",
  BUBBLE: "BUBBLE"
}

type Props = {
  navigation: any;
}


class Game extends React.Component<Props, any> {

  constructor(props: Props){
    super(props);

    this.state = {
      showModal: false
    }
  }

  gameName: string = this.props.navigation.getParam("game");

  openModal = () => {
    this.props.navigation.navigate('GamesCompleted');
  }

  bookAppointment = () => {
    this.setState({ showModal: false });
    this.props.navigation.navigate("Appointments");
  }

  goBack = () => {
    this.setState({ showModal: false });
    this.props.navigation.navigate("HomePage");
  }

  getRandomGame = (option1: JSX.Element, option2: JSX.Element) => {
    const rand = Math.random();
    if(rand < 0.4){
      return option1;
    }
    return option2;
  }

  renderModal = () => {
    return(
      <Modal
        visible={this.state.showModal}
        animationType="slide"
      >
        <View style={styles.modal}>
          <View style={styles.view}>
            <Typography size={18} mb={1.5}>Hey, you did well. That needs lots of focus!</Typography>
            <Typography size={19} mb={10} align="center" font="MED">How are you feeling now?</Typography>
            <Typography size={18} mb={3} align="center" font="MED">Would you like to talk to someone?</Typography>
            <View style={styles.row}>
              <Button
                onPress={this.bookAppointment}
                style={styles.callButton}
              >
                Schedule a call
              </Button>
              <Button
                onPress={this.goBack}
                style={styles.backButton}
                textStyle={{ color: "#7B86DB" }}
              >
                No
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderGame = () => {
    switch(this.gameName){
      case GAMES.PUZZLE:
        const opt1 = <Puzzle goBack={this.openModal} />;
        const opt2 = <Quiz goBack={this.openModal} />;
        return this.getRandomGame(opt1, opt2);
      case GAMES["SEA SHELL"]:
        const option1 = <Seashell goBack={this.openModal} />;
        const option2 = <Wheel goBack={this.openModal} />;
        return this.getRandomGame(option1, option2);
      default:
        return <Bubble goBack={this.openModal} />;
    }
  }

  render(): React.ReactNode {
    return(
      <>
        {this.renderGame()}
        {this.renderModal()}
      </>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: `${Colors.accent}88`,
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyle: {
    height: dimensions.hp(100),
    width: dimensions.wp(100),
    resizeMode: "cover"
  },
  view: {
    backgroundColor: Colors.white,
    width: "90%",
    padding: dimensions.wp(7),
    paddingTop: dimensions.hp(4),
    borderRadius: dimensions.wp(3),
    elevation: 5
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  callButton: {
    backgroundColor: "#7B86DB",
    width: "60%"
  },
  backButton: {
    backgroundColor: Colors.white,
    width: "35%",
    borderWidth: 1,
    borderColor: "#7B86DB"
  }
});

export default Game;