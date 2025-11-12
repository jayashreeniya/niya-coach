import PropTypes from 'prop-types';
import React, { Component, } from 'react';
import { CheckBox as CheckBoxIos } from 'react-native-elements';
import { Platform, Switch, View, Text, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Svg, { G, Path, Text as SVGTxt, Image as SVGImg } from 'react-native-svg';
import { responsiveScreenWidth,responsiveWidth } from 'react-native-responsive-dimensions';
type MyProps = { testID?: string, onbackPress?: (value: boolean) => void };
type MyState = { onbackPress?: (value: boolean) => void };

export default class ChatHeader extends Component<MyProps, MyState> {
  static propTypes = {
    testID: PropTypes.string,

    onbackPress: PropTypes.func.isRequired
  };

  constructor(props: any) {
    super(props);


  }

  render() {

    const { testID } = this.props;
    console.log(Dimensions.get('window').width)
    return (
      <View style={{flex:1,width:Dimensions.get('screen').width,height:20}}>
      <Svg width='110%' height="300px"  
       viewBox="0 0 460 268"
      >
        <G stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <G transform="translate(0.000000, -0.000000)">
          <Path d="M0,0.170571538 C63.5555556,0.0615835574 132.222222,0.00708956685 206,0.00708956685 C279.777778,0.00708956685 348.111111,0.0047263779 411,0 L411,265 C350.715719,268.688368 307.382385,268.688368 281,265 C210.781182,255.183114 173,235 110,235 C68,235 31.3333333,238.333333 0,245 L0,0.170571538 Z" id="view_shape" fill="#3E74B9" />
            <Path d="M0,0.166261309 C63.5555556,0.0600273817 132.222222,0.00691041819 206,0.00691041819 C279.777778,0.00691041819 348.111111,0.00460694546 411,1.13686838e-13 L411,258.303626 C350.715719,261.898791 307.382385,261.898791 281,258.303626 C210.781182,248.734806 173,229.061706 110,229.061706 C68,229.061706 31.3333333,232.310808 0,238.809012 L0,0.166261309 Z" fill="#5287CC" />
        </G>
        </G>
        <SVGImg
          onPress={() => console.log('press on Image')}
          x="42" y="58" width="63.014433" height="59"
          href={require('../../blocks/Chatbot6/assets/niya.png')}
          opacity="1"
          clipPath="url(#clip-image)"
        />
        <SVGTxt
          x="200"
          y="80"
          textAnchor="end"
          fontWeight="normal"
          fontStyle='normal'
          fontSize="15"
          fill='rgba(234, 234, 234, 1)'
          opacity={1}

        >
          Chat with

        </SVGTxt>
        <SVGTxt
          x="185"
          y="107"
          textAnchor="end"
          fontWeight="normal"
          fontStyle='normal'
          
          opacity={1}
          fontSize="24"
          fill='rgba(243, 243, 243, 1)'

        >
          Niya

        </SVGTxt>
        {/* <SVGImg
          onPress={() => console.log('press on Image v===back imahe')}
          x="352" y="58" width="20" height="20"
          href={require('../../blocks/Chatbot6/assets/chatback.png')}
          opacity="1"
          clipPath="url(#clip-image)"
        /> */}
        <SVGTxt
          x="160"
          y="150"
          textAnchor="end"
          fontWeight="normal"
          fontSize="16"
          fill='rgba(243, 243, 243, 1)'
          fontStyle='normal'
         
          opacity={1}
        >
          You’re Welcome…

        </SVGTxt>
        <SVGTxt
          x="256"
          y="170"
          textAnchor="end"
          fontWeight="normal"
          fontSize="16"
          fill='rgba(243, 243, 243, 1)'
          fontStyle='normal'
          opacity={1}
          
        >
          I’m online, here i can assist you

        </SVGTxt>

      </Svg>
      </View>

    );

  }

  componentWillReceiveProps(nextProps: any) {

  }

  handleValueChange(value: boolean) {

  }
}
