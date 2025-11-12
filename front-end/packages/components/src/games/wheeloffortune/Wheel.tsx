import React from "react";
import { View } from "react-native";

import WheelOfFortune from "./WheelOfFortune";
import Typography from "../../Typography";
import ModalWrapper from "../../ModalWrapper";

type State = {
  answer: string;
  showModal: boolean;
}

class Wheel extends React.Component<{ goBack: () => void }, State> {

  constructor(props: { goBack: () => void }){
    super(props);

    this.state = {
      answer: "",
      showModal: false
    }
  }
  child: any;
  answers = [
    "You are not alone. You are always surrounded by love",
    "You are loved despite your sadness",
    "You are doing the best you can",
    "You are not damaged or wounded",
    "As you forgive, you become stronger"
  ];

  participants = ['','','','',''];

  wheelOptions = {
    rewards: this.participants,
    knobSize: 30,
    borderWidth: 8,
    borderColor: "#3B35BC",
    innerRadius: 45,
    duration: 4000,
    backgroundColor: 'white',
    textAngle: 'horizontal',
    getWinner: (value: any, index: number) => {
    },
    onRef: (ref: any) => (this.child = ref),
    playButton: () => <Typography size={14} color="white">Spin</Typography>
  };

  renderModal = () => {
    return(
      <ModalWrapper
        visible={this.state.showModal}
        onClose={() => this.setState({ showModal: false, answer: "" })}
      >
        <View style={{ paddingVertical: 20 }}>
          <Typography align="center" font="MED" size={18}>{this.state.answer}</Typography>
        </View>
      </ModalWrapper>
    );
  }

  render(): React.ReactNode {
    console.log(this.child);
    return(
      <>
        <WheelOfFortune
          options={this.wheelOptions}
          getWinner={(x: number) => {
            this.setState({ answer: this.answers[x], showModal: true });
          }}
          goBack={this.props.goBack}
        />
        {this.renderModal()}
      </>
    );
  }
}

export default Wheel;