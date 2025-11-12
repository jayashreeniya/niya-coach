import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';

import { move, movableSquares, isSolved } from './puzzle';
import Board from './Board';
import { configureTransition } from './configureTransitions';

const STATES = {
  LoadingImage: 'LoadingImage',
  WillTransitionIn: 'WillTransitionIn',
  RequestTransitionOut: 'RequestTransitionOut',
  WillTransitionOut: 'WillTransitionOut',
};

type Props = {
  puzzle: any;
  image: any;
  onChange: (s: number) => void;
  onQuit: () => void;
}

type State = {
  transitionState: string;
  moves: number;
  elapsed: number;
  previousMove: any;
  image: any;
}

export default class Game extends React.Component<Props, State> {

  intervalId: any;

  constructor(props: Props) {
    super(props);
    const { image } = props;
    this.state = {
      transitionState: image ? STATES.WillTransitionIn : STATES.LoadingImage,
      moves: 0,
      elapsed: 0,
      previousMove: null,
      image: null,
    };
    configureTransition();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { image } = nextProps;
    const { transitionState } = this.state;
    if (image && transitionState === STATES.LoadingImage) {
      configureTransition(() => {
        this.setState({ transitionState: STATES.WillTransitionIn });
      });
    }
  }

  handleBoardTransitionIn = () => {
    this.intervalId = setInterval(() => {
      const { elapsed } = this.state;
      this.setState({ elapsed: elapsed + 1 });
    }, 1000);
  };

  requestTransitionOut = () => {
    clearInterval(this.intervalId);
    this.setState({ transitionState: STATES.RequestTransitionOut });
  };

  handleBoardTransitionOut = async () => {
    const { onQuit } = this.props;
    await configureTransition(() => {
      this.setState({ transitionState: STATES.WillTransitionOut });
    });
    onQuit();
  };


  handlePressSquare = (square: any) => {
    const { puzzle, onChange } = this.props;
    const { moves } = this.state;

    if (!movableSquares(puzzle).includes(square)) return;

    const updated = move(puzzle, square);

    this.setState({ moves: moves + 1, previousMove: square });

    onChange(updated);

    if (isSolved(updated)) {
      this.requestTransitionOut();
    }
  };

  //   render() {
  //     return null;
  //   }

  render() {
    const { puzzle, image } = this.props;
    const {
      transitionState,
      previousMove,
    } = this.state;

    return (
      <View style={styles.container}>
        {transitionState === STATES.LoadingImage && (
          <ActivityIndicator
            size={'large'}
            color={'black'}
          />
        )}
        {transitionState !== STATES.LoadingImage && (
          <View style={styles.centered}>
            <View style={styles.header}>
            </View>
            <Board
              puzzle={puzzle}
              image={image}
              previousMove={previousMove}
              teardown={
                transitionState === STATES.RequestTransitionOut
              }
              onMoveSquare={this.handlePressSquare}
              onTransitionOut={this.handleBoardTransitionOut}
              onTransitionIn={this.handleBoardTransitionIn}
            />
            <View style={{ height: 30 }} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 16,
    alignSelf: 'stretch',
  },
});