import React from "react";
import { View, StyleSheet } from "react-native";

import { dimensions, Colors } from "../../utils";
import Shell from "./Shell";

type Props = {
  start: () => void;
  increment: () => void;
  ready: boolean;
  completed: boolean;
  collect: () => void;
}

type State = {
  board: boolean[];
}

class Board extends React.Component<Props, State> {

  constructor(props: Props){
    super(props);

    this.state = {
      board: [true, true, true, true, true, true, true, true, true]
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if(prevProps.completed && !this.props.completed){
      this.setState({ board: [true, true, true, true, true, true, true, true, true  ] });
    }
  }

  handleClose = (i: number) => {
    const newBoard = this.state.board.map((x, idx) => (idx === i)? false : x);
    this.setState({ board: newBoard });
    this.props.collect();
  }

  renderShells = () => {
    return this.state.board.map((status, i) => {
      return(
        <Shell
          open={status}
          disabled={!this.props.ready || !status}
          onPress={this.handleClose}
          index={i}
        />
      );
    })
  }

  render(): React.ReactNode {
    return(
      <View style={styles.board}>
        {this.renderShells()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  board: {
    width: dimensions.wp(90),
    height: dimensions.wp(90),
    borderColor: Colors.accent,
    borderWidth: 3,
    borderRadius: dimensions.wp(4),
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    backgroundColor: Colors.white
  }
});

export default Board;