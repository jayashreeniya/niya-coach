// Customizable Area Start
import { StyleSheet } from 'react-native'
import Scale from "../../dashboard/src/Scale";
import {dimensions } from "../../../components/src/utils";

export default StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
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
  header: {
    width: "101%",
    height: Scale(80),
    backgroundColor: "#8289d9",
    flexDirection: "row",
    alignItems: 'center',
    paddingHorizontal: Scale(20)
  },

  accountText: {
    fontSize: Scale(15),
    color: "#fff",
    fontWeight: "bold",
    marginLeft: Scale(30)
  },


  arrow: {
    width: Scale(20),
    height: Scale(20),
    resizeMode: "contain",
    marginHorizontal:Scale(20),
    marginTop:Scale(0),
    tintColor: "black"
},

smilee:{
  width:Scale(100),
  height:Scale(100),
  resizeMode:"contain",
  alignSelf:"center",
  marginTop:Scale(30)
},

niya:{
  fontSize:Scale(22),
  color:"#000",
  textAlign:"center",
  fontWeight:"700",
  marginTop:Scale(30)
},

dummy:{
  fontSize:Scale(15),
  fontWeight:"600",
  marginTop:Scale(20),
  alignSelf:"center"
},

get:{
  fontSize:Scale(30),
  fontWeight:"bold",
  marginTop:Scale(20),
  alignSelf:"center",
  color:"#9b6db3",
},

access: {
  color:"#9b6db3",
  fontSize: Scale(15),
  marginLeft: Scale(10),
  marginTop: Scale(30)
},


backHeaderText:{
  marginHorizontal:Scale(20),
},

message: {
  height: Scale(150),
  borderWidth: 0.5,
  borderRadius: Scale(8),
  borderColor: "#9b6db3",
  marginTop: Scale(10),
  backgroundColor: "#fff",
},

saveButton: {
  width: Scale(375),
  height: Scale(50),
  borderWidth: Scale(0.3),
  borderRadius: Scale(8),
  justifyContent: "center",
  backgroundColor: "#9b6db3",
  marginHorizontal: Scale(20),
  alignItems: "center",
  position:"absolute",
  bottom:50

},

saveText: {
  color: "#fff",
  fontWeight: "bold",
},

nameTextInput: {
  marginLeft: Scale(15),
  color:"#9b6db3",
},
// modal start here
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22,
  backgroundColor: '#BFBFBF'
},
modalView: {
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
modalButton: {
  backgroundColor: "#9b6db3",
  borderRadius: 6,
  height: 50,
  alignItems: "center",
  justifyContent: "center",
   width: '50%',
 
},
textStyle: {
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: 14
},
})
// Customizable Area End