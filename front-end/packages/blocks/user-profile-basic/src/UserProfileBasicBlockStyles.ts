// Customizable Area Start
import { Platform, StyleSheet } from 'react-native'
import { dimensions } from '../../../components/src/utils';
import Scale from "../../dashboard/src/Scale";
export default StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  imgPasswordShowhide: { height: 20, width: 20 } ,
  passwordShowHide: {
    alignSelf: "center",
  },
  header: {
    width: "100%",
    height: Platform.OS=="ios"?Scale(80):Scale(100),
    backgroundColor: "#8289d9",
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: Scale(20)
  },

  profile: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
    borderWidth: Scale(0.3),
    marginTop: Scale(20),
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center"

  },

  arrow: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",

  },

 
  accountText: {
    fontSize: Scale(15),
    color: "#fff",
    fontWeight: "bold",
    marginLeft: Scale(30)
  },

  profileIcon: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(40),
  },

  profileHeader: {
    marginHorizontal: Scale(20)
  },

  edit: {
    position: "absolute",
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    },

  editHeader: {
    position: "absolute",
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    bottom: 0,
    right: 1
  },

  nameHeader: {
     marginTop: Scale(20),
  },

  name: {
    color: "gray",
    fontSize: Scale(12),
    marginLeft: Scale(10)
  },

  access: {
    color: "gray",
    fontSize: Scale(12),
    marginLeft: Scale(10),
    marginTop: Scale(30)
  },

  namefield: {
    width: Scale(375),
    height: Scale(45),
    borderWidth:1,
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center",
    marginTop:Scale(10)
  },

  namefieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Scale(10)
  },

  nameTextInput: {
    marginLeft: Scale(15),
  
  },

  emailHeader: {
    marginHorizontal: Scale(20),
    marginTop: Scale(30),
    flex: 1
  },

  emailBox: {
    height: Scale(45),
    borderWidth:1,
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    marginTop: Scale(10),
    backgroundColor: "#fff",
    justifyContent: "center"
  },

  backHeader: {
    height: Scale(45),
    borderWidth:1,
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    marginTop: Scale(10),
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },

  back: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    marginRight: Scale(10),
  },

  smallBox: {
    width: Scale(55),
    height: Scale(45),
    borderWidth:1,
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center"
  },

  bigBox: {
    width: Scale(300),
    height: Scale(45),
    borderWidth:1,
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center"
  },

  mobile: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Scale(10),
  },

  saveButton: {
    width: Scale(100),
    height: Scale(45),
    borderWidth: Scale(0.3),
    borderRadius: Scale(8),
    borderColor: "#8289d9",
    justifyContent: "center",
    backgroundColor: "#8289d9",
    marginHorizontal: Scale(20),
    alignItems: "center",
    bottom: Scale(50),
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },

  VerifictionBoxInside: {
      borderRadius: Scale(10),
  borderColor: "#9b6db3",
  borderWidth: Scale(1),
  position: 'absolute',
        backgroundColor: "#ffffff",
        alignSelf: 'flex-end',
        top: Scale(100),
        right:-1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        elevation: 3,
        shadowRadius: 5,
        zIndex: 9999,
        justifyContent: 'center',
        width:Scale(375),
        padding:Scale(5)

  },

  nameText: {
    marginLeft: Scale(5),
    marginTop: Scale(5),
    backgroundColor:'white'
  },

  linearGradient: {
     width: '100%',
    height: Scale(90),
    borderRadius: Scale(15)
  },
  // Drawer styles for admin

  containerFilter: {
    flex: 1,
    backgroundColor: "#9A6DB2",
    elevation: 5
  },
  HomeContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9A6DB2",
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
  ProfileTextHeader: {
    marginVertical: dimensions.hp(1)
  },
  line: {
    width: Scale(210),
    height: Scale(1),
    borderWidth: Scale(0.3),
    borderColor: "#DDD",
    marginTop: Scale(30),
    alignSelf: "center"
  },
  accoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Scale(20)
  },
  account: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    tintColor: "#fff",
    marginRight: dimensions.wp(4)
  },
  bgPasswordInput: {
    flex: 1,
    textAlign: "left",
    backgroundColor: "#00000000",
    minHeight: 40,
    includeFontPadding: true,
    marginTop: 5,
    paddingLeft: 0,
    color:"black",
    marginLeft: Scale(15),
  },
})
// Customizable Area End
