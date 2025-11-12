import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  numberholder: number;
  lowerbound: number;
  upperbound: number;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class RandomNumberGeneratorController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      // Customizable Area Start
      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      numberholder: 1,
      lowerbound: 0,
      upperbound: 100,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    // Customizable Area End
  }

  // web events

  // Customizable Area Start
  generateRandomNumber = () => {
    const { lowerbound, upperbound } = this.state;
    if (lowerbound > upperbound) {
      this.showAlert(
        "Error",
        "Upperbound much be greater than or equal to the lowerbound."
      );
    } else {
      let numberholder = this.getRandomInt(lowerbound, upperbound);
      this.setState({
        numberholder,
      });
    }
  };

  setLowerBound = (lowerbound: number) => {
    this.setState({ lowerbound });
  };
  setUpperBound = (upperbound: number) => {
    this.setState({ upperbound });
  };

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  // Customizable Area End
}
