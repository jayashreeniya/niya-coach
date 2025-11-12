// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
    SafeAreaView,
    Dimensions,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    ScrollView,
} from "react-native";
import MergeEngineUtilities from "../../utilities/src/MergeEngineUtilities";
import { dummyPROFILE_ICON, LOGOUT_ICON, ACCOUNT_ICON, PRIVACY_ICON, FEED_BACK_ICON, BELL_ICON, MENU_ICON, } from "./assets";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";

//@ts-ignore
import Drawer from "react-native-drawer";

// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
import Loader from "../../../components/src/Loader";

// Customizable Area End

import HRListController, {Props} from "./HRListController";

export default class HRListsScreen extends HRListController {
    constructor(props: Props) {
       
        super(props);
        // Customizable Area Start

        Dimensions.addEventListener("change", (e) => {
            MergeEngineUtilities.init(
                artBoardHeightOrg,
                artBoardWidthOrg,
                Dimensions.get("window").height,
                Dimensions.get("window").width
            );
            this.forceUpdate();
        });
       
        // Customizable Area End
    }

    // Customizable Area Start

    renderDrawer = () => {
        return (
            <SafeAreaView style={styles.containerFilter}>
                <View style={styles.HomeContainer}>
                    <View style={styles.headerImage}>
                        <Image style={styles.ProfileImage} source={this.state.prifileimage ? { uri: this.state.prifileimage } : dummyPROFILE_ICON} />
                        <View style={styles.ProfileTextHeader}>
                            <Typography font="MED" color={"white"} size={18}>{this.state.full_name}</Typography>
                        </View>
                    </View>
                    <View style={styles.line}></View>
                    <TouchableOpacity testID="profile_click"
                        style={styles.accoutHeader}
                        onPress={() => this.props.navigation.navigate("UserProfile", { role: "admin" })}
                    >
                        <Image style={styles.account} source={ACCOUNT_ICON} />
                        <Typography size={17} color={"white"} >Account Settings</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={() => this.props.navigation.navigate("SendPushnotification")}
                        testID="sendNotify_click"
                    >
                        <Image style={styles.account} source={BELL_ICON} />
                        <Typography size={17} color={"white"}>Push Notifications</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
                        testID="Privacy_click"
                    >
                        <Image style={styles.account} source={PRIVACY_ICON} />
                        <Typography size={17} color={"white"}>Privacy Policy</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={() => this.props.navigation.navigate("UserFeedback")}
                        testID="feedback_click"
                    >
                        <Image style={styles.account} source={FEED_BACK_ICON} />
                        <Typography size={17} color={"white"}>Feedback</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={this.logOut}
                        testID="logout_click"
                    >
                        <Image style={styles.account} source={LOGOUT_ICON} />
                        <Typography size={17} color={"white"}>Logout</Typography>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    renderList = () => {
        return (
            <>
                {this.state.CompDataList.map((item, index) => {
                    const {full_name, id,} = item?.attributes?.hr_details;

                    return (
                        <View key={id}>

                            <TouchableOpacity testID={`hr${index}`} style={[styles.appointment, { height: 55, minHeight: 55, maxHeight: 60 }]} onPress={()=>this.props.navigation.navigate('HRProfile',{id:id,comany_id:this.state.companyId})}>
                                <View style={[styles.row, styles.mb, { justifyContent: 'space-between', right: 5 }]}>
                                    <Text style={[styles.statusText, { width: '60%', color: '#9A6DB2' }]} numberOfLines={1}>{full_name}</Text>

                                </View>


                            </TouchableOpacity>


                        </View>
                    )
                })}

            </>
        )
    }

    // Customizable Area End

    render() {
        // Customizable Area Start
        // Merge Engine - render - Start
        return (
            <Drawer ref={(ref: any) => { this.drawerRef = ref; }}
                type="overlay"
                tapToClose={true}
                openDrawerOffset={0.35}
                content={this.renderDrawer()}
                style={{ flex: 1, backgroundColor: "#9A6DB2", }}
                
            >
                <SafeAreaView style={styles.container}>
                    <LinearGradient
                        colors={["#9C6FB4", "#9C6FB4"]}

                        style={styles.header}
                    >

                        <View style={[styles.row, styles.mb, styles.pad, { marginBottom: dimensions.hp(2) }]}>
                            <TouchableOpacity testID="btnOpenDrawer" onPress={() => this.drawerRef?.open?.()}>
                                <Image source={MENU_ICON} style={styles.backIcon} />
                            </TouchableOpacity>
                            <Typography
                                style={styles.fullFlex}
                                color="white"
                                font="MED"
                                size={18}
                            >
                                {"List of HRs"}
                            </Typography>
                        </View>

                    </LinearGradient>

                    <View style={{ flex: 1, marginHorizontal: 4 }}>
                        <View style={[styles.containermain, { marginTop: dimensions.hp(2) }]}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}

                            >

                                {this.state.CompDataList.length > 0 && this.renderList()}

                                <View style={{ flex: 1, height: 100 }}>
                                    {this.state.loading ? (
                                        <Loader loading={this.state.loading} />
                                    ) : null}
                                </View>
                            </ScrollView>


                        </View>

                    </View>
                </SafeAreaView>

            </Drawer>
        );
        // Merge Engine - render - End
        // Customizable Area End
    }
}

// Customizable Area Start
const styles = StyleSheet.create({
    appointment: {
        marginHorizontal: dimensions.wp(4),
        marginVertical: dimensions.hp(1),
        backgroundColor: '#fff',
        borderColor: "#D6A6EF",
        borderWidth: 1,
        borderRadius: dimensions.wp(2),
        padding: dimensions.wp(2),
        elevation: 4,
    },
    containermain: {
        flex: 1,
        marginTop: 0,
        backgroundColor: "white"
    },

    fullFlex: {
        flex: 1,
        marginTop: 5
    },
    backIcon: {
        height: dimensions.wp(5),
        width: dimensions.wp(5),
        resizeMode: "contain",
        marginRight: dimensions.wp(7)
    },
    pad: {
        paddingHorizontal: dimensions.wp(5),
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    mb: {
        marginBottom: dimensions.hp(4)
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    header: {
        width: dimensions.wp(100),
        paddingTop: dimensions.hp(3),
        borderBottomColor: Colors.greyText,
        borderBottomWidth: 1
    },
    statusText: {
        paddingVertical: Platform.OS=="android"? dimensions.hp(.5):dimensions.hp(1.8),
        paddingHorizontal: dimensions.wp(3),
        borderRadius: dimensions.wp(3)
    },
    title: {
        marginBottom: 32,
        fontSize: 16,
        textAlign: "left",
        marginVertical: 8,
    },
    body: {
        marginBottom: 32,
        fontSize: 16,
        textAlign: "left",
        marginVertical: 8,
    },
    bgPasswordContainer: {
        flexDirection: "row",
        backgroundColor: "#00000000",
        marginBottom: 16,
        borderBottomWidth: 1,
        borderColor: "#767676",
        borderRadius: 2,
        padding: 10,
        borderWidth: Platform.OS === "web" ? 0 : 1,
    },
    bgMobileInput: {
        flex: 1,
    },
    showHide: {
        alignSelf: "center",
    },
    containerFilter: {
        flex: 1,
        backgroundColor: "#9A6DB2",
        elevation: 5
    },
    ProfileTextHeader: {
        marginVertical: dimensions.hp(1)
    },
    accoutHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: Scale(20)
    },
    HomeContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#9A6DB2",
        // backgroundColor: "#ffffff",
    },
    headerImage: {
        alignItems: "center",
        justifyContent: "center"
    },
    ProfileImage: {
        width: Scale(80),
        height: Scale(80),
        borderRadius: Scale(40),
        resizeMode: "cover",
        borderColor: "#c2b2d8"
    },
    profileText: {
        fontSize: Scale(15),
        color: "#000",
        marginTop: Scale(10)
    },
    line: {
        width: Scale(210),
        height: Scale(1),
        borderWidth: Scale(0.3),
        borderColor: "#DDD",
        marginTop: Scale(30),
        alignSelf: "center"
    },
    account: {
        width: Scale(20),
        height: Scale(20),
        resizeMode: "contain",
        tintColor: "#fff",
        marginRight: dimensions.wp(4)
    },
    AccountText: {
        fontSize: Scale(15),
        color: "#000",
        marginLeft: Scale(20),
    },
    usermgmtIcon: {
        width: Scale(40),
        height: Scale(40),

    },
    userOptionRecView: {
        height: dimensions.hp(15),
        width: dimensions.wp(40),
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#8AC6F6'
    },
    
});
// Customizable Area End
