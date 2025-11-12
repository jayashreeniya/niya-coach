// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform
} from "react-native";
import Button from "../../../components/src/Button";
import { dummyPROFILE_ICON, LOGOUT_ICON, ACCOUNT_ICON, PRIVACY_ICON, FEED_BACK_ICON, BELL_ICON, MENU_ICON, imgStar, imgFullStar, imgHalfStar } from "./assets";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";
//@ts-ignore
import Drawer from "react-native-drawer";
import Loader from "../../../components/src/Loader";

import StarRating from 'react-native-star-rating';

// Customizable Area End

import DetailComViewController, {
    Props,
} from "./DetailComViewController";

export default class DetailComView extends DetailComViewController {
    constructor(props: Props) {
        super(props);
        // Customizable Area Start


        // Customizable Area End
    }

    // Customizable Area Start

    renderComDrawer = () => {
        return (
            <SafeAreaView style={styles.compcontainerFilter}>
                <View style={styles.compHomeContainer}>
                    <View style={styles.headerstyle}>
                        <Image style={styles.compProfileImage} source={this.state.prifileimage ? { uri: this.state.prifileimage } : dummyPROFILE_ICON} />
                        <View style={styles.compProfileTextHeader}>
                            <Typography font="MED" color={"white"} size={18}>{this.state.full_name}</Typography>
                        </View>
                    </View>
                    <View style={styles.line}></View>
                    <TouchableOpacity
                        style={styles.compaccoutHeader}
                        onPress={() => this.props.navigation.navigate("UserProfile", { role: "admin" })}
                        testID="profile_click"
                    >
                        <Image style={styles.accountcomImg} source={ACCOUNT_ICON} />
                        <Typography size={17} color={"white"} >Account Settings</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.compaccoutHeader}
                        onPress={() => this.props.navigation.navigate("SendPushnotification")}
                        testID="sendNotify_click"
                    >
                        <Image style={styles.accountcomImg} source={BELL_ICON} />
                        <Typography size={17} color={"white"}>Push Notifications</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.compaccoutHeader}
                        onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
                        testID="Privacy_click"
                    >
                        <Image style={styles.accountcomImg} source={PRIVACY_ICON} />
                        <Typography size={17} color={"white"}>Privacy Policy</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.compaccoutHeader}
                        onPress={() => this.props.navigation.navigate("UserFeedback")}
                        testID="feedback_click"
                    >
                        <Image style={styles.accountcomImg} source={FEED_BACK_ICON} />
                        <Typography size={17} color={"white"}>Feedback</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.compaccoutHeader}
                        onPress={this.logOut}
                        testID="logout_click"

                    >
                        <Image style={styles.accountcomImg} source={LOGOUT_ICON} />
                        <Typography size={17} color={"white"}>Logout</Typography>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    renderItm = (item) => {
         let { employees, hrs } = item?.item;
        return (

            <View key={item.item.id} style={{ alignSelf: 'baseline', alignContent: 'center', alignItems: 'center', justifyContent: 'flex-end', borderWidth: 0.1 }}>

                <View style={{ height: dimensions.hp(20), borderWidth: 0.1, borderLeftWidth: 0, padding: 10, paddingBottom: 0, paddingLeft: 0, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'baseline', marginBottom: 0 }}>

                    <View style={{ borderWidth: 0, borderLeftWidth: 0, padding: 10, paddingLeft: 0, flexDirection: 'row' }}>

                        <View style={{ height: `${employees}%`, width: dimensions.wp(5), borderWidth: 0, borderLeftWidth: 0, padding: 30, paddingLeft: 0, marginBottom: 0, backgroundColor: '#DEBEEF', alignSelf: 'baseline', marginTop: 10, marginLeft: 20 }} />
                        <View style={{ height: `${hrs}%`, width: dimensions.wp(5), padding: 30, paddingLeft: 0, marginBottom: 0, backgroundColor: '#B6CCFA', alignSelf: 'baseline', marginTop: 10, marginLeft: 1 }} />

                    </View>
                    <View style={{ width: dimensions.wp(15), borderWidth: 0.8, borderColor: 'gray', marginRight: dimensions.wp(2.5) }} />

                </View>

                <Typography
                    style={[styles.fullFlexview, { marginRight: dimensions.wp(3) }]}
                    color="black"
                    font="REG"
                    size={11}
                    align="center"
                >
                    {item?.item?.month}

                </Typography>


            </View>
        )
    }
    renderCompDataList = () => {
        return (
            <>
                {this.state.CompDataList?.attributes?.employees?.map((item, index) => {
                    const { full_name } = item

                    return (
                        <View key={item.id}>

                            <TouchableOpacity testID={`company${index}`} style={[styles.appointment]}>
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

    grapBarRender = (item: any, index: number) => {
        return (

            <View key={index} style={styles.graphview}>
                <View style={styles.focusview}>
                    <Typography font="REG" size={11} >{item?.focus_area}</Typography>
                </View>
                <View style={styles.bardataview}>

                    <View style={styles.ineerbarview}>

                        <View style={[styles.bardataview,{ width: `${item.per}%`, borderWidth: 0.1, borderLeftWidth: 0.5, padding: 10, paddingLeft: 0, backgroundColor: '#9A6DB2' }]} />
                        <Text style={styles.horbartex}>{Math.round(item.per).toFixed(0)}</Text>

                    </View>
                    <View style={styles.bottom} />

                </View>




            </View>
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
                content={this.renderComDrawer()}
                style={{ flex: 1, backgroundColor: "#9A6DB2", }}
                testID="btnOpenDrawer"
            >
                <SafeAreaView style={styles.areacontainer}>

                    {this.state.loading && this.state.CompDataList.length < 1 ? (
                        <View style={{ flex: 1, height: 100 }}>
                            <Loader loading={this.state.loading} />
                        </View>

                    ) : (
                        <>
                            <LinearGradient
                                colors={["#9C6FB4", "#9C6FB4"]}

                                style={styles.headerview}
                            >

                                <View style={[styles.row, styles.mb2, styles.pad,]}>
                                    <TouchableOpacity testID="btnOpenDrawer" onPress={()=> this.drawerRef?.open?.()}>
                                        <Image source={MENU_ICON} style={styles.backIconbtnDet} />
                                    </TouchableOpacity>
                                    <Typography
                                        style={styles.fullFlexview}
                                        color="white"
                                        font="MED"
                                        size={18}
                                    >
                                        Company Profile
                                    </Typography>
                                </View>
                                <View style={[styles.row, styles.mb, styles.pad, { justifyContent: 'space-between', }]}>
                                    <View style={{ flex: 1 }}>
                                        <Typography
                                            color="white"
                                            size={14}
                                            font="MED"
                                            style={[styles.statusText, { marginLeft: 0, paddingHorizontal: 0 }]}

                                        >
                                            {this.state.CompDataList?.attributes?.name}
                                        </Typography>
                                        <Typography
                                            color="lightLavender"
                                            size={12}
                                            font="MED"
                                            style={[styles.statusText, { marginTop: 0, marginBottom: 10, paddingHorizontal: 0 }]}
                                        >
                                            {"Code:"}{this.state.CompDataList?.attributes?.hr_code}
                                        </Typography>
                                    </View>
                                    <Button
                                        mode="outlined"
                                        onPress={this.props.navigation?.navigate?.bind(this,'AddNewComp', { usertype: 'EditCompanies', id: this.state.CompDataList?.attributes?.id })
                                        }
                                        style={[styles.actionButton, { width: "35%", }]}
                                        textColor="darkviolet"
                                        textStyle={styles.actionButtonText}
                                        testID="btnAddNewCom"
                                    >
                                        Edit Profile
                                    </Button>


                                </View>
                                <View style={styles.compLview}>
                                    <View style={{ margin: 12, }}>
                                        <Typography
                                            style={styles.fullFlexview}
                                            color="black"
                                            font="REG"
                                            size={16}

                                            align="center"
                                        >
                                            {this.state.CompDataList?.attributes?.total_users}

                                        </Typography>
                                        <Typography
                                            style={styles.fullFlexview}
                                            color="greyText"
                                            font="REG"
                                            size={12}
                                        >
                                            Total hours
                                        </Typography>
                                    </View>

                                    <View style={{ margin: 12, }}>
                                        <Typography
                                            style={styles.fullFlexview}
                                            color="black"
                                            font="REG"
                                            size={16}
                                            align="center"
                                        >
                                            {this.state.CompDataList?.attributes?.total_users}

                                        </Typography>
                                        <Typography
                                            style={styles.fullFlexview}
                                            color="greyText"
                                            font="REG"
                                            size={12}
                                        >
                                            Total enrolled
                                        </Typography>
                                    </View>



                                </View>

                                {/* feedback */}
                                <View style={styles.compLview}>

                                    <Typography
                                        style={styles.fullFlexview}
                                        color="black"
                                        font="REG"
                                        size={16}

                                        align="center"
                                    >
                                        Feedback

                                    </Typography>



                                    <StarRating
                                        disabled={false}
                                        emptyStar={imgStar}
                                        fullStar={imgFullStar}
                                        halfStar={imgHalfStar}
                                        iconSet={'Ionicons'}
                                        maxStars={5}
                                        rating={this.state.CompDataList?.attributes?.feedback}
                                        fullStarColor={'#FDEF09'}
                                        halfStarEnabled
                                        starStyle={{ marginTop: Scale(5), marginLeft: Scale(5), width: Scale(20), height: Scale(20) }}
                                    />
                                    <Typography
                                        style={[styles.fullFlexview, { marginLeft: Scale(15) }]}
                                        color="greyText"
                                        font="REG"
                                        size={15}
                                    >
                                        {Math.round(this.state.CompDataList?.attributes?.feedback).toFixed(0)}/5
                                    </Typography>


                                </View>

                            </LinearGradient>
                            <View style={[styles.row, styles.mb, { backgroundColor: '#9ECCFF', height: dimensions.hp(0.9), }]} />
                            {this.state.CompDataList?.attributes?.focus_areas.length > 0 && <ScrollView showsVerticalScrollIndicator={false} >
                                <View style={{ flex: 1 }}>
                                    <Typography
                                        style={[styles.fullFlexview, styles.pad, { textAlign: 'center', marginTop: 0 }]}
                                        color="black"
                                        font="REG"
                                        size={16}
                                    >
                                        Top 5 focus areas
                                    </Typography>





                                    {/* horizonatal bar  */}
                                    <View style={{ marginBottom: dimensions.hp(3), padding: Scale(10), flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-evenly', marginHorizontal: 24, marginTop: dimensions.hp(2), borderRadius: 12, borderWidth: 0.19 }}>

                                        <View style={{ flex: 1 }} >
                                            {this.state.CompDataList?.attributes?.focus_areas.map((item: any, index: number) => {
                                                this.grapBarRender(item, index)
                                            })}
                                        </View>

                                    </View>
                                    <View style={{ marginBottom: dimensions.hp(3), padding: Scale(10), flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-evenly', marginHorizontal: 24, marginTop: dimensions.hp(2), borderRadius: 12, borderWidth: 0.19 }}>


                                        <View style={{ marginBottom: dimensions.hp(1), padding: Scale(2), flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-evenly', marginHorizontal: 10, marginTop: dimensions.hp(1), borderRadius: 12, borderWidth: 0.19 }}>
                                            <View style={{ borderWidth: 0, borderLeftWidth: 0, padding: 10, paddingLeft: 0, flexDirection: 'row' }} />

                                            <FlatList
                                                data={this.state.CompDataList?.attributes?.user_logged_in}
                                                horizontal
                                                renderItem={(itm) => this.renderItm(itm)}
                                                testID="flat-data"
                                            />
                                        </View>

                                    </View>
                                    {/* Emp List */}
                                    <Typography
                                        style={[styles.fullFlexview, styles.pad, { textAlign: 'left', marginTop: 0 }]}
                                        color="black"
                                        font="REG"
                                        size={16}
                                    >
                                        Employees
                                    </Typography>

                                    {this.renderCompDataList()}


                                </View>
                            </ScrollView>
                            }
                        </>
                    )
                    }




                </SafeAreaView>

            </Drawer>
        );
        // Merge Engine - render - End
        // Customizable Area End
    }
}

// Customizable Area Start
const styles = StyleSheet.create({


    actionButton: {
        width: "49%",
        paddingVertical: Scale(4),
        marginBottom: 0,
        height: dimensions.hp(5),
        // zIndex:1000,
        paddingHorizontal: 0
    },
    actionButtonText: {
        fontSize: Scale(13.5)
    },

    fullFlexview: {
        flex: 1,
        marginTop: 5
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    backIconbtnDet: {
        height: dimensions.wp(5),
        width: dimensions.wp(5),
        resizeMode: "contain",
        marginRight: dimensions.wp(7)
    },
   
    mb: {
        marginBottom: dimensions.hp(4)
    },
    mb2:{
        marginBottom: dimensions.hp(2) 
    },
    pad: {
        paddingHorizontal: dimensions.wp(5),
    },
   
    areacontainer: {
        flex: 1,
        backgroundColor: Colors.white
    },
    headerview: {
        width: dimensions.wp(100),
        paddingTop: dimensions.hp(3),
        borderBottomColor: Colors.greyText,
        borderBottomWidth: 1
    },
    statusText: {
        paddingVertical: Platform.OS=="android"?dimensions.hp(.5):dimensions.hp(1.8),
        paddingHorizontal: dimensions.wp(3),
        borderRadius: dimensions.wp(3)
    },


    compProfileImage: {
        width: Scale(80),
        height: Scale(80),
        borderRadius: Scale(40),
        resizeMode: "cover",
        borderColor: "#c2b2d8"
    },

    compProfileTextHeader: {
        marginVertical: dimensions.hp(1)
    },
    compaccoutHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: Scale(20)
    },
    appointment: {
        marginHorizontal: dimensions.wp(4),
        marginVertical: dimensions.hp(1),
        backgroundColor: '#fff',
        borderColor: "#D6A6EF",
        borderWidth: 1,
        borderRadius: dimensions.wp(2),
        padding: dimensions.wp(2),
        elevation: 4,
        height: 55,
        minHeight: 55,
        maxHeight: 60
    },

    compHomeContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#9A6DB2",
        // backgroundColor: "#ffffff",
    },
    headerstyle: {
        alignItems: "center",
        justifyContent: "center"
    },

    accountcomImg: {
        width: Scale(20),
        height: Scale(20),
        resizeMode: "contain",
        tintColor: "#fff",
        marginRight: dimensions.wp(4)
    },
    line: {
        width: Scale(210),
        height: Scale(1),
        borderWidth: Scale(0.3),
        borderColor: "#DDD",
        marginTop: Scale(30),
        alignSelf: "center"
    },
    graphview: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    focusview: {
        flexDirection: 'column',
        width: dimensions.wp(25),
        marginRight: 5
    },
    bardataview: {
        width: dimensions.wp(50),
        borderWidth: 0.1,
        borderLeftWidth: 0.5,
        padding: 10,
        paddingLeft: 0
    },
    ineerbarview: {
        borderWidth: 0,
        borderLeftWidth: 0,
        padding: 10,
        paddingLeft: 0,
        flexDirection: 'row'
    },
    bottom:{
        width: dimensions.wp(55), borderWidth: 0.2, borderColor: 'gray'

    },
    horbartex:{
        width: dimensions.wp(8), height: dimensions.hp(3), textAlign: 'left', marginLeft: 12 
    },

    compcontainerFilter: {
        flex: 1,
        backgroundColor: "#9A6DB2",
        elevation: 5
    },
    compLview: {
        height: dimensions.hp(10),
        marginBottom: dimensions.hp(3),
        flexDirection: 'row',
        backgroundColor: '#F9EEFF',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal: 24,
        marginTop: dimensions.hp(-1),
        borderRadius: 12,
        borderWidth: 0.1
    }
});
// Customizable Area End
