import React from "react";

// Customizable Area Start
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    ScrollView
   
} from "react-native";
import { dummyPROFILE_ICON, LOGOUT_ICON, ACCOUNT_ICON, PRIVACY_ICON,  MENU_ICON, CONTACT_US_ICON, } from "./assets";
import LinearGradient from "react-native-linear-gradient";
import Scale from "../../../framework/src/Scale";
import Typography from "../../../components/src/Typography";
import { Colors, dimensions } from "../../../components/src/utils";
//@ts-ignore
import Drawer from "react-native-drawer";
import Loader from "../../../components/src/Loader";
import StarRating from 'react-native-star-rating';
import { imgStar, imgFullStar, imgHalfStar} from '../../AdminConsole3/src/assets';

// Customizable Area End

import HRDashboardControllerr, {
    Props
} from "./HRDashboardController";

export default class HRDashboard extends HRDashboardControllerr {
    constructor(props: Props) {
        super(props);
        // Customizable Area Start


        // Customizable Area End
    }
  
    // Customizable Area Start

    renderDrawer = () => {
        console.log(this.state.profile,"profile data");
         return (
            <SafeAreaView style={[styles.containerFilter,{backgroundColor:'#fff'}]}>
                <View style={[styles.HomeContainer,{backgroundColor:'#fff'}]}>
                    <View style={styles.headerImage}>
                        <Image style={styles.ProfileImage} source={this.state.profile.image ? { uri: this.state.profile.image } : dummyPROFILE_ICON} />
                        <View style={styles.ProfileTextHeader}>
                            <Typography font="MED" style={{color:'#2D2D2D'}} size={18}>{this.state.profile.full_name}</Typography>
                        </View>
                    </View>
                    <View style={[styles.line,{borderColor:'#E9E9E9'}]}></View>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={() => this.props.navigation.navigate("UserProfile", { role: "hr" })}
                        testID="profile_click"
                    >
                        <Image style={styles.account} source={ACCOUNT_ICON} />
                        <Typography size={17} style={{color:'#393939'}} >Account Settings</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
                        testID="Privacy_click"
                    >
                        <Image style={styles.account} source={PRIVACY_ICON} />
                        <Typography size={17} style={{color:'#393939'}}>Privacy Policy</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={() => this.props.navigation.navigate("ContactUsScreen")}
                        testID="contactus_click"
                    >
                        <Image style={styles.account} source={CONTACT_US_ICON} />
                        <Typography size={17} style={{color:'#393939'}}>Contact Us</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={this.logOut}
                        testID="logout_click"
                    >
                        <Image style={styles.account} source={LOGOUT_ICON} />
                        <Typography size={17} style={{color:'#393939'}}>Logout</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.accoutHeader}
                        onPress={this.showDelAlert}
                        testID="logout_click1"
                    >
                        <Image style={styles.account} source={LOGOUT_ICON} />
                        <Typography size={17} style={{color:'darkred'}}>Delete Account</Typography>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

   
    renderList = () => {
        return (
            <>
                {this.state.data?.attributes?.employee_details?.map((item:any, index:any) => {
                    let { email } = item

                    return (
                        <>

                            <TouchableOpacity style={[styles.appointment, { height: 55, minHeight: 55, maxHeight: 60}]} key={index}>
                                <View style={[styles.row, styles.mb, { justifyContent: 'space-between', right: 5, marginBottom:Platform.OS=="ios"?dimensions.hp(1):dimensions.hp(4)}]}>
                                    <Text style={[styles.statusText, { width: '60%', color: '#9A6DB2', marginTop:-5 }]} numberOfLines={1}>{email}</Text>

                                </View>


                            </TouchableOpacity>


                        </>
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
                style={{ flex: 1, backgroundColor: "#fff", }}
            >
                <SafeAreaView style={styles.container}>

                    {this.state.loading && this.state.data.length < 1 ? (
                        <View style={{ flex: 1, height: 100 }}>
                            <Loader loading={this.state.loading} />
                        </View>

                    ) : (
                        <>
                            <LinearGradient
                                colors={["#9C6FB4", "#9C6FB4"]}

                                style={styles.header}
                            >

                                <View style={[styles.row, styles.mb, styles.pad, { marginBottom: dimensions.hp(2) }]}>
                                    <TouchableOpacity testID="menu_open" onPress={() => this.drawerRef?.open?.()}>
                                        <Image source={MENU_ICON} style={styles.backIcon} />
                                    </TouchableOpacity>
                                    <Typography
                                        style={styles.fullFlex}
                                        color="white"
                                        font="MED"
                                        size={18}
                                    >
                                       HR Dashboard
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
                                            {this.state.data?.attributes?.company_details?.name}
                                        </Typography>
                                        <Typography
                                            color="lightLavender"
                                            size={12}
                                            font="MED"
                                            style={[styles.statusText, { marginTop: 0, marginBottom: 10, paddingHorizontal: 0 }]}
                                        >
                                            {"Code:"}{this.state.data?.attributes?.company_details?.hr_code}
                                        </Typography>
                                    </View>
                                  


                                </View>
                                <View style={{ height: dimensions.hp(10), marginBottom: dimensions.hp(3), flexDirection: 'row', backgroundColor: '#F9EEFF', alignItems: 'center', justifyContent: 'space-evenly', marginHorizontal: 24, marginTop: dimensions.hp(-1), borderRadius: 12, borderWidth: 0.1 }}>
                                    <View style={{ margin: 12, }}>
                                        <Typography
                                            style={styles.fullFlex}
                                            color="black"
                                            font="REG"
                                            size={16}

                                            align="center"
                                        >
                                            {this.state.data?.attributes?.total_users}

                                        </Typography>
                                        <Typography
                                            style={styles.fullFlex}
                                            color="greyText"
                                            font="REG"
                                            size={12}
                                        >
                                            Total hours
                                        </Typography>
                                    </View>

                                    <View style={{ margin: 12, }}>
                                        <Typography
                                            style={styles.fullFlex}
                                            color="black"
                                            font="REG"
                                            size={16}
                                            align="center"
                                        >
                                            {this.state.data?.attributes?.total_users}

                                        </Typography>
                                        <Typography
                                            style={styles.fullFlex}
                                            color="greyText"
                                            font="REG"
                                            size={12}
                                        >
                                            Total enrolled
                                        </Typography>
                                    </View>



                                </View>
 {/* feedback */}
 <View style={{ height: dimensions.hp(10), marginBottom: dimensions.hp(3), flexDirection: 'row', backgroundColor: '#F9EEFF', alignItems: 'center',  marginHorizontal: 24, marginTop: dimensions.hp(-1), borderRadius: 12, borderWidth: 0.1 }}>

<Typography
    style={styles.fullFlex}
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
    rating={this.state.data?.attributes?.feedback}
    fullStarColor={'#FDEF09'}
    halfStarEnabled
    starStyle={{ marginTop: Scale(5),marginLeft:Scale(5), width: Scale(20), height: Scale(20) }}
/>
<Typography
    style={[styles.fullFlex,{marginLeft:Scale(15)}]}
    color="greyText"
    font="REG"
    size={15}
>
    {Math.round(this.state.data?.attributes?.feedback).toFixed(0)}/5
</Typography>


</View>

                    
                            </LinearGradient>
                            <View style={[styles.row, styles.mb, { backgroundColor: '#9ECCFF', height: dimensions.hp(0.9), }]} />
                            {this.state.data?.attributes?.focus_areas.length > 0 && <ScrollView showsVerticalScrollIndicator={false} >
                                <View style={{ flex: 1 }}>
                                    <Typography
                                        style={[styles.fullFlex, styles.pad, { textAlign: 'center', marginTop: 0,marginBottom:10 }]}
                                        color="black"
                                        font="REG"
                                        size={15}
                                    >
                                        Top 5 focus areas
                                    </Typography>





                                    {/* horizonatal bar  */}
                                    <View style={{ marginBottom: dimensions.hp(3), padding: Scale(10), flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-evenly', marginHorizontal: 24, marginTop: dimensions.hp(2), borderRadius: 12, borderWidth: Platform.OS=="android"? 0.1: 0.2 }}>

                                        <View style={{ flex: 1 }} >
                                            {this.state.data?.attributes?.focus_areas.map((item: any, index: number) => {
                                                return (

                                                    <View style={{ flexDirection: 'row', alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between', }}>
                                                        <View style={{ flexDirection: 'column', width: dimensions.wp(25), marginRight: 5 }}>
                                                            <Typography font="REG" size={11} >{item?.focus_area}</Typography>
                                                        </View>
                                                        <View style={{ width: dimensions.wp(50), borderWidth: 0.1, borderLeftWidth: 0.5, padding: 10, paddingLeft: 0, }}>

                                                            <View style={{ borderWidth: 0, borderLeftWidth: 0, padding: 10, paddingLeft: 0, flexDirection: 'row' }}>

                                                                <View style={{ width: `${item.per}%`, borderWidth: 0.1, borderLeftWidth: 0.5, padding: 10, paddingLeft: 0, backgroundColor: '#9A6DB2' }} />
                                                                <Text style={{ width: dimensions.wp(8), height: dimensions.hp(3), textAlign: 'left', marginLeft: 12 }}>{Math.round(item.per).toFixed(0)}</Text>

                                                            </View>
                                                            <View style={{ width: dimensions.wp(55), borderWidth: 0.2, borderColor: 'gray' }} />

                                                        </View>




                                                    </View>
                                                )
                                            })}
                                        </View>

                                    </View>

                                    
                                    <View style={{marginHorizontal: 4,flex:1 }}>
                                    <Typography
                                        style={[styles.fullFlex, styles.pad, { textAlign: 'left', marginTop: 10,marginBottom:10 }]}
                                        color="black"
                                        font="REG"
                                        size={15}
                                    >
                                       Employees
                                    </Typography>

                                   {this.renderList()}
                                   </View>

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
    activeRow: {
        borderBottomColor: Colors.white,
        borderBottomWidth: 3
    },
    tableBox: {
        borderWidth: 0.1,
        borderRadius: 18,
        borderColor: "#979797",
        // padding: 15,
        // marginVertical: 10,
        backgroundColor: "#fff",
        margin: 10,
        padding: 10,
        elevation: 10,
        // height: Scale(90),


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
        shadowOpacity:0.2,
        shadowColor:'grey',
        shadowRadius:5
    },
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
        paddingVertical: dimensions.hp(1.9),
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
        borderColor: "#9197De",
        borderWidth:5,
     
    },
    profileText: {
        fontSize: Scale(15),
        color: "#000",
        marginTop: Scale(10)
    },
    line: {
        width: Scale(210),
        borderWidth: Platform.OS=="android"?Scale(1):Scale(0.5),
        borderColor: "#DDD",
        marginTop: Scale(30),
        alignSelf: "center"
    },
    account: {
        width: Scale(20),
        height: Scale(20),
        resizeMode: "contain",
        // tintColor: "#fff",
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
    halfRow: {
        paddingVertical: dimensions.hp(1.5)
    },
    imgShowhide: Platform.OS === "web" ? { height: 30, width: 30 } : {},
});
// Customizable Area End
