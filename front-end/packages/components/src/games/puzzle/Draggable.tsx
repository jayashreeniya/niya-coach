import { PanResponder } from 'react-native';
import React from 'react';

export default class Draggable extends React.Component<{}, { dragging: boolean }> {

  panResponder: any;

  constructor(props: {}) {
    super(props);
    this.state = {
      dragging: false,
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
  }

  handleStartShouldSetPanResponder = () => {
    const { enabled } = this.props;
    return enabled;
  };

  handlePanResponderGrant = () => {
    const { onTouchStart } = this.props;
    this.setState({ dragging: true });
    onTouchStart();
  };

  handlePanResponderMove = (e: any, gestureState: any) => {
    const { onTouchMove } = this.props;
    const offset = {
      top: gestureState.dy,
      left: gestureState.dx,
    };
    onTouchMove(offset);
  };

  handlePanResponderEnd = (e: any, gestureState: any) => {
    const { onTouchMove, onTouchEnd } = this.props;
    const offset = {
      top: gestureState.dy,
      left: gestureState.dx,
    };
    this.setState({
      dragging: false,
    });
    onTouchMove(offset);
    onTouchEnd(offset);
  };

  render() {
    const { children } = this.props;
    const { dragging } = this.state;

    return children({
      handlers: this.panResponder.panHandlers,
      dragging,
    });
  }
}