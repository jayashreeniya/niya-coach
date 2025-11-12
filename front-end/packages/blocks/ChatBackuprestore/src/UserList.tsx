import React from "react";

// Customizable Area Start
import {

    View,
    Text,
    FlatList,
    StyleSheet,

    Image,
    SafeAreaView,

    TouchableOpacity,

} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Typography from "../../../components/src/Typography";

import Loader from "../../../components/src/Loader";

import { dimensions, Colors } from "../../../components/src/utils";
import UserListController, {
    Props,

} from "./UserListController";
// Customizable Area End


export default class UserList extends UserListController {
    constructor(props: Props) {
        super(props);
        // Customizable Area Start

        // Customizable Area End
    }

    // Customizable Area Start
    renderUserChatList = (item: Record<string, string>) => {
        const { id, full_name } = item;

        return (
            <>


                {full_name ? <TouchableOpacity onPress={this.props.navigation?.navigate.bind(this, 'ChatBackuprestore', { userid: id, name: full_name })} key={id}>

                    <View style={[styles.usercardstyle]}
                    >
                        <View style={[styles.rowtrac, styles.mbtm, { justifyContent: 'space-between', right: 5 }]}>
                            <Text style={[styles.Textusercomp]} numberOfLines={1}>{"Name : "}{full_name}</Text>


                        </View>

                        <View style={[{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 0, right: 5 }]}>
                        </View>
                    </View>


                </TouchableOpacity> : null
                }

            </>
        )
    }
    // Customizable Area End

    render() {
        // Customizable Area Start
        const colorheader = ["#9C6FB4", "#9C6FB4"];
        return (
            <SafeAreaView style={styles.containerview}>
                <LinearGradient
                    colors={colorheader}

                    style={styles.userheader}
                >

                    <View style={[styles.rowtrac, styles.mbtm, styles.padtm]}>
                        <TouchableOpacity testID="Drawer_btn" onPress={this.props.navigation?.goBack?.bind(this, null)}>
                            <Image source={require('../../appointmentmanagement/assets/back.png')} style={styles.backbtnIcon} />
                        </TouchableOpacity>
                        <Typography
                            style={{ flex: 1, marginTop: 5 }}
                            color="white"
                            font="MED"
                            size={16}
                        >
                            {"User List"}
                        </Typography>
                        <TouchableOpacity testID="Drawer_btn" onPress={this.chatBackupApi}>
                        <Typography
                            style={{ flex: 1, marginTop: 5 }}
                            color="white"
                            font="MED"
                            size={15}
                        >
                            {"Chat Bakup"}
                        </Typography>
                           </TouchableOpacity>
                    </View>

                </LinearGradient>

                <View style={{ flex: 1, marginHorizontal: 4 }}>
                    <View style={[styles.containermain,]}>

                        <FlatList
                            data={this.state.DataList}
                            renderItem={({ item }) => this.renderUserChatList(item)}
                            keyExtractor={item => item}
                            onEndReachedThreshold={0.1}
                            onEndReached={this.fetchMoreData}
                        />

                        <View style={[styles.container]}>
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


    containermain: {
        flex: 1,
        marginVertical: dimensions.wp(3),
        backgroundColor: "white"
    },
    Textusercomp: {
        paddingVertical: dimensions.hp(.5),
        paddingHorizontal: dimensions.wp(3),
        borderRadius: dimensions.wp(3),
        width: '60%',
        color: '#9A6DB2'
    },
    rowtrac: {
        flexDirection: "row",
        alignItems: "center",
    },
    containerview: {
        flex: 1,
        backgroundColor: "white"
    },
    usercardstyle: {
        marginHorizontal: dimensions.wp(4),
        marginVertical: dimensions.hp(1),
        backgroundColor: '#fff',
        borderColor: "#D6A6EF",
        borderWidth: 1,
        borderRadius: dimensions.wp(2),
        padding: dimensions.wp(2),
        elevation: 4,
        height: 45,
        minHeight: 50,
        maxHeight: 60
    },


    backbtnIcon: {
        height: dimensions.wp(5),
        width: dimensions.wp(5),
        resizeMode: "contain",
        marginRight: dimensions.wp(7)
    },
    mbtm: {
        marginBottom: dimensions.hp(4)
    },
    padtm: {
        paddingHorizontal: dimensions.wp(5),
    },

    userheader: {
        width: dimensions.wp(100),
        paddingTop: dimensions.hp(3),
        borderBottomColor: Colors.greyText,
        borderBottomWidth: 1
    },
    container: {
        flex: 1,
        height: 100

    }
});
// Customizable Area End
