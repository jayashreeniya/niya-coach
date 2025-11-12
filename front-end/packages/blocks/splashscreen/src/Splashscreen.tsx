import React from "react";
// Customizable Area Start
import { 
  StyleSheet, 
  Text, 
  Image, 
  View, 
  SafeAreaView,
  ImageBackground, 
  Dimensions
} from "react-native";
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: 1,
    text: "Your personal coach for wellbeing and growth \n",
    image: require('../assets/ss1.png'),
    image1: require('../assets/ss3icon.png'),
    image2: require('../assets/ssimg3.png'),   
 
    backgroundColor: "#59B2AB",
  },
  {
    key: 2,
    // text: "Tell us what you'd like help  \nwith, and we'll match with you the \n expert that's right for you.",
    text: "Tell us what you would like help with and we will match you with the expert that's right for you.",
    image: require('../assets/ss2.png'),
     image1: require('../assets/ss3icon.png'),
     image2: require('../assets/ssimg3.png'),  
   
    backgroundColor: "#FEBE29",
  },
  {
    key: 3,
    text: "We keep all your information \nconfidential. It's not shared with anyone.",
    image1: require('../assets/ss3icon.png'),
    
    image: require('../assets/ss3.png'),
    image2: require('../assets/ssimg3.png'), 
      
    backgroundColor: "#22BCB5",
  },
];
import Scale from "../../../components/src/Scale";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
// Customizable Area End

import SplashscreenController, { Props } from "./SplashscreenController";

import { imgSplash } from "./assets";

export default class Splashscreen extends SplashscreenController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  _renderNextButton = () => {
    return (
      <View style={{justifyContent:"center",alignItems:'center'}}>
        <Image
        source={require("../assets/nextButton.png")}
        />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={{justifyContent:"center",alignItems:'center'}}>
        <Image
        source={require("../assets/nextButton.png")}
        />
      </View>
    );
  };
  
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <View style={styles.mainContainer}>
      
          <AppIntroSlider
            data={slides}
            style={{flex: 1}}
            renderItem={(item)=>{
              console.log("item = >",item.item.text)
              return(
                <View style={{flex:1}}>
                  <ImageBackground style={{flex:1,alignItems:'center', justifyContent: "center",}} source={item.item.image}>
                    <Image
                    style={{marginTop:width/4}}
                    source={item.item.image1}
                    />
                  <Text style={{color:"#fff",bottom:Scale(20),width:Scale(285),fontSize:Scale(20),textAlign:'center'}}>
                    {item.item.text}
                  </Text>
                  <Image
                    style={{bottom:Scale(90)}}
                    source={item.item.image2}
                    />
   
                  </ImageBackground>
                </View>
              )
            }}
            renderNextButton={this._renderNextButton}
            renderDoneButton={this._renderDoneButton}
            onDone={this.goToLogIn}
            bottomButton
          />
      
      </View>
      // Customizable Area End
    );
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  logoView: {
    flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center"
  },
  logoText: {
    fontSize: 42,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "#323441",
    marginTop: 15
  },
  mainContainer: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#fff"
  }
});
// Customizable Area End
