import React from "react";

// Customizable Area Start
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Image,
    TouchableOpacity,
    FlatList,

} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Typography from "../../../components/src/Typography";

import Loader from "../../../components/src/Loader";

import { dimensions, Colors } from "../../../components/src/utils";

import TimeTrackingDetController, {
    Props,
} from "./TimeTrackingDetController";

// Customizable Area End

export default class TimeTrackingDet extends TimeTrackingDetController {
    constructor(props: Props) {
        super(props);
        // Customizable Area Start

        // Customizable Area End
    }

    // Customizable Area Start
    renderUserTTDetails = (item:Record<string,string>) => {
        const { billing, month, spend_time, } = item;

        return (
            <View style={{ flex: 1 }}>
             <View >


                            <View style={styles.timestyle}>
                                <View style={{ flex: 1, width: dimensions.wp(60) }}>
                                    <Text style={[styles.statusTextcomp, { width: '80%', color: '#9A6DB2', fontWeight: 'bold' }]} numberOfLines={1}>{month}</Text>

                                    <Typography
                                        color="greyText"
                                        size={11}
                                        font="MED"
                                        style={[styles.statusTextcomp, { marginTop: 1, width: "100%" }]}
                                    >
                                        {spend_time}
                                    </Typography>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: "flex-end", right: 5 }}>
                                    <Typography color="greyText" size={11} font="REG">{"Billing: "}{billing}</Typography>

                                </View>
                            </View>


                        </View>
    
              
            </View>
        )
    }
    // Customizable Area End

    render() {
        // Customizable Area Start
        const colordataTT = ["#9C6FB4", "#9C6FB4"];

        // Merge Engine - render - Start
        return (
            <SafeAreaView style={styles.containerview}>
                <LinearGradient
                    colors={colordataTT}

                    style={styles.timetrackingheader}
                >

                    <View style={[styles.rowtrac, styles.mbtm, styles.padtm]}>
                        <TouchableOpacity testID="btnDrawer" onPress={this.props.navigation?.goBack?.bind(this, null)}>
                            <Image source={require('../../appointmentmanagement/assets/back.png')} style={styles.backIcon} />
                        </TouchableOpacity>
                        <Typography
                            style={{ flex: 1 }}
                            color="white"
                            font="MED"
                            size={18}
                        >
                            {"Time Tracking and Billing"}
                        </Typography>
                    </View>

                </LinearGradient>

                <View style={{ flex: 1, marginHorizontal: 4 }}>
                    <View style={[styles.containermain,]}>
                        <FlatList
                            contentContainerStyle={{ flexGrow: 1 }}
                            data={this.state.TrackingDataList}
                            renderItem={({ item }) => this.renderUserTTDetails(item)}
                            keyExtractor={item => item}
                            onEndReachedThreshold={0.1}
                            onEndReached={this.fetchMoreData}
                        />
                        <View style={{ flex: 1, height: 100 }}>
                            {this.state.loading ? (
                                <Loader loading={this.state.loading} />
                            ) : null}
                        </View>


                    </View>

                </View>
            </SafeAreaView>

        );

        // Customizable Area End
    }
}

// Customizable Area Start
const styles = StyleSheet.create({
    statusTextcomp: {
        paddingVertical: dimensions.hp(.5),
        paddingHorizontal: dimensions.wp(3),
        borderRadius: dimensions.wp(3),
        width: '60%',
        color: '#9A6DB2'
    },
    containermain: {
        flex: 1,
        backgroundColor: "white",
        marginTop: dimensions.wp(3),
        marginBottom: dimensions.hp(3)
    },
    timestyle: {
        marginHorizontal: dimensions.wp(4),
        marginVertical: dimensions.hp(1),
        backgroundColor: '#fff',
        borderColor: "#D6A6EF",
        borderWidth: 1,
        borderRadius: dimensions.wp(2),
        padding: dimensions.wp(2),
        elevation: 4,

    },
    containerview: {
        flex: 1,
        backgroundColor: "white"
    },
    rowtrac: {
        flexDirection: "row",
        alignItems: "center",
    },
    mbtm: {
        marginBottom: dimensions.hp(4)
    },
    padtm: {
        paddingHorizontal: dimensions.wp(5),
    },
    container: {
        flex: 1,

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



    backIcon: {
        height: dimensions.wp(5),
        width: dimensions.wp(5),
        resizeMode: "contain",
        marginRight: dimensions.wp(7)
    },
    timetrackingheader: {
        width: dimensions.wp(100),
        paddingTop: dimensions.hp(3),
        borderBottomColor: Colors.greyText,
        borderBottomWidth: 1
    }
});
// Customizable Area End
