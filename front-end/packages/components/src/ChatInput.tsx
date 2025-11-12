import React, {Component, useState, useEffect, useRef, memo } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Platform,
	TouchableOpacity,

    Image
} from "react-native";
import PropTypes from 'prop-types';
import { Icon, } from "react-native-elements";
type MyProps = {msg?:string, reply?: string, isLeft?:boolean,username?:string,onsendReply?: (value: string) => void };
type MyState = {msg?:string,reply?: string,isLeft?:boolean,username?:string, onsendReply?: (value: string) => void };


export default class  ChatInput extends Component<MyProps, MyState> {
	
    static propTypes = {
        testID: PropTypes.string,
    
        onsendReply: PropTypes.func.isRequired,
    
      };
    
      constructor(props: any) {
        super(props);
        this.state={
        
            msg:this.props.msg
        }
    
    
      }



	render() {
        return (
            <View style={[styles.container]}>
                
                <View style={styles.innerContainer}>
                    <View style={styles.inputsend}>
                      
                        <TextInput
                            multiline
                            placeholder={"Message"}
                            style={styles.input}
                            value={this.state.msg}
                            onChangeText={(text) =>this.setState({msg:text})}
                        />
                    
                    </View>
                    <TouchableOpacity  style={styles.sendButton}>
                        <Image source={require('../../blocks/Chatbot6/assets/sendbtn.png')} style={{height: 20,
		                 width: 20,alignSelf:'auto'}} />
                    </TouchableOpacity>
                </View>
    
            </View>
            )
        
    }


	
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		backgroundColor: "#ffffff",
        alignItems:'center',
      
	},
	replyContainer: {
		paddingHorizontal: 10,
		marginHorizontal: 10,
		justifyContent: "center",
		alignItems: "flex-start",
	},
	title: {
		marginTop: 5,
		fontWeight: "bold",
	},
	closeReply: {
		position: "absolute",
		right: 10,
		top: 5,
	},
	reply: {
		marginTop: 5,
	},
	innerContainer: {
		paddingHorizontal: 10,
		marginHorizontal: 10,
		justifyContent: "space-between",
		alignItems: "center",
		flexDirection: "row",
		paddingVertical: 10,
	},
	inputsend: {
		flexDirection: "row",
		backgroundColor: '#fff',
        borderColor:'#EAEAEA',
        borderWidth:1,
		flex: 1,
		marginRight: 10,
		paddingVertical: Platform.OS === "ios" ? 10 : 0,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "space-between",
	},
	input: {
		backgroundColor: "transparent",
		paddingLeft: 20,
		color: '#ACACAC',
		flex: 1,
		fontSize: 15,
		height: 50,
		alignSelf: "center",
	},
	rightIconButtonStyle: {
		justifyContent: "center",
		alignItems: "center",
		paddingRight: 15,
		paddingLeft: 10,
		borderLeftWidth: 1,
		borderLeftColor: "#fff",
	},
	swipeToCancelView: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 30,
	},
	swipeText: {
		color:'green',
		fontSize: 15,
	},
	emoticonButton: {
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: 10,
	},
	recordingActive: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingLeft: 10,
	},
	recordingTime: {
		color: 'blue',
		fontSize: 20,
		marginLeft: 5,
	},
	microphoneAndLock: {
		alignItems: "center",
		justifyContent: "flex-end",
	},
	lockView: {
		backgroundColor: "#eee",
		width: 60,
		alignItems: "center",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		height: 130,
		paddingTop: 20,
	},
	sendButton: {
		backgroundColor: '#BF3017',
		borderRadius: 50,
		height: 50,
		width: 50,
		alignItems: "center",
		justifyContent: "center",
	},
});

