import React from "react";

// Customizable Area Start
import {
    View,
    Button,
    StyleSheet,
    Platform,
    ScrollView,
    Text,
    TextInput,
    Image,
    KeyboardAvoidingView,
    TouchableOpacity,
    Dimensions,

} from "react-native";

// Customizable Area End

import ForgotPasswordController, { Props } from "./ForgotPasswordController";

export default class PasswordCreatedSuccessfully extends ForgotPasswordController {
    // Customizable Area Start
    // Customizable Area End

    constructor(props: Props) {
        super(props);
        this.isChangePassword = true;
        // Customizable Area Start
        // Customizable Area End
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={this.isPlatformiOS() ? "padding" : undefined}
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
               
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    style={
                        Platform.OS === "web" ? styles.containerWeb : styles.containerMobile
                    }
                >
                    {/* ------------------- HEADER ---------------------- */}
                    {/* Customizable Area Start */}
                    <View>
                    <View style={styles.headline}>
                    <Image style={{ width: Dimensions.get('window').width, height: 200, alignSelf: 'center', alignItems: 'center', marginTop: 100, resizeMode: 'contain' }}
                        {...this.setPasspassCreatedSuccessfullyImg}>

                    </Image>
                </View>
                        <View style={styles.headline}>


                            {/* Confirmation status  */}

                            <Text style={styles.stepText}>
                                {this.labelTextIsYourPasswordHasBeenSuccessfullyChanged}
                            </Text>

                        </View>
                    </View>

                    {/* Customizable Area End */}
                </ScrollView>
                <View style={{ left: 0, right: 0, bottom: 0, position: 'absolute', margin: 40, padding: 10, flex: 1 }}>

                    <TouchableOpacity style={styles.styleButton}
                        onPress={() => this.goToLogin()}
                    >

                        <Text style={{ textAlign: 'center', margin: 0, fontSize: 16, color: '#fff', opacity: 1 }}>{this.buttonTextBacktoLogin}</Text>

                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        );
    }
}

// Customizable Area Start
const styles = StyleSheet.create({
    styleButton: {
        backgroundColor: '#5287CC',
        borderRadius: 6,
        height: 50,
        width: '100%',
        alignItems: "center",
        justifyContent: "center",

    },
    containerMobile: {
        flex: 1,
        padding: 16,
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        maxWidth: 650,
        backgroundColor: "#fff"
    },
    containerWeb: {
        padding: 16,
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 650
    },


    headline: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },

    stepText: {
        marginBottom: 2,
        fontSize: 20,
        textAlign: "center",
        color: '#3F3F3F',
        marginVertical: 8,
        marginTop: 20,
        fontWeight:'bold'
    },


});
// Customizable Area End
