import React from "react";

import {

  Box,

  Button,

  Typography,

  // Customizable Area Start
  Grid, TextField
  // Customizable Area End
} from "@material-ui/core";

// Customizable Area Start
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import InfiniteScroll from 'react-infinite-scroll-component';

const theme = createTheme({
  palette: {
    primary: {
      main: "#fff",
      contrastText: "#fff",
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      margin: "20px 0px",
    },
  },
});

type MsgobjectType = TypeObjmsg
interface TypeObjmsg {
  message: string
  created_at: string,

}

const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8
};
// Customizable Area End

import ChatBackuprestoreController, {
  Props,
  configJSON,
} from "./ChatBackuprestoreController";
import Loader from "../../../components/src/Loader";
import moment from "moment";


export default class ChatBackuprestore extends ChatBackuprestoreController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderUserChat = () => {

    let userChatData = this.state.messages.reverse()
    return (
      <>
        {
          userChatData.map((message: Record<string, string>, msgidx) => {
            const fromMe = message.account === this.state.sender;
            const nextdata: MsgobjectType = this.state.messages[msgidx - 1] || {};
            const showDate = new Date(message.created_at).toLocaleDateString() !== new Date(nextdata.created_at).toLocaleDateString();

            return (
              <>
                {showDate ?
                  <Box style={{ display: "flex", justifyContent: "center" }}>
                    <Typography style={{ background: "#b7b0b0", color: "#444343", alignItems: "center", fontSize: "14px", padding: "5px", borderRadius: "4px" }}>
                      {moment(message.created_at)?.isSame?.(moment(), "day") ? "Today" : moment(message.created_at)?.format?.("DD MMMM yyyy")}
                    </Typography>
                  </Box> :
                  null}
                <Box style={{ display: 'flex', justifyContent: fromMe ? 'end' : 'start' }}>
                  <Typography style={{ padding: "5px", background: fromMe ? '#dcf8c6' : '#fff', color: "#000", width: 'max-content', borderRadius: '4px', marginBottom: '10px' }}>{message.message}
                    <Typography
                      style={{ textAlign: "end", color: "black", fontSize: "8px" }}
                    >
                      {moment(message.created_at)?.format?.("hh:mm A")}
                    </Typography>
                  </Typography>
                </Box>

              </>
            )
          })
        }
      </>
    )
  }

  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
      <ThemeProvider theme={theme}>
        <Box style={{ flex: 1 }}>
          <Grid container style={{ height: '100vh', maxHeight: '100vh' }}>
            <Grid item xs={3}>
              <Box style={{
                maxWidth: "100%",
                backgroundColor: "#9A6DB2",
              }}
              >
                <Box style={{
                  padding: "10px 20px", maxWidth: "100%", display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }} >
                  <Typography style={{ textAlign: 'left', color: '#fff', fontSize: 16, }}>Chat Backup/Restore</Typography>
                  <Button variant="outlined" style={{
                borderColor: "#fff",
                color: "#fff",
              }}
              onClick={this.chatBackupApi}
              >Backup</Button>
                </Box>
              </Box>
              <Box style={{ height: "89vh" }} id="scrollableDiv">
                <InfiniteScroll
                  dataLength={this.state.DataList.length}
                  next={this.fetchMoreData}
                  hasMore={true}
                  loader={<h4>Loading...</h4>}
                  height={'100%'}
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  {
                    this.state.DataList.map((item: Record<string, string>, index) => {

                      return (
                        <Box key={index} id="displayChat" style={webStyle.userList} onClick={() => this.showDisplayChat(item.full_name, item.id)}
                        >
                          <Box style={{ padding: "10px 20px", maxWidth: "100%" }} >
                            <Typography style={{ textAlign: 'left', color: '#000', fontSize: 16, }}>{item.full_name}</Typography>
                          </Box>
                        </Box>
                      )
                    })
                  }
                </InfiniteScroll>
              </Box>


            </Grid>
            <Grid item xs={9} >
              {
                this.state.displayChat && <Box style={webStyle.chatBox}>

                  <Box style={{
                    maxWidth: "100%",
                    backgroundColor: "#9A6DB2",
                  }}
                  >
                    <Box style={{ padding: "10px 20px", maxWidth: "100%" }} >
                      <Typography style={{ textAlign: 'left', color: '#fff', fontSize: 20 }}>{this.state.displayChat}</Typography>
                    </Box>

                  </Box>

                  <Box style={{ padding: "10px 20px", height: "100%", background: '#ddd5d2', overflowY: 'scroll' }}>

                    {this.state.chatLoader ? (
                      <Loader loading={this.state.chatLoader} />
                    ) : this.renderUserChat()}

                  </Box>


                  <Box style={{
                    maxWidth: "100%",
                    backgroundColor: "#ecebe9",
                    padding: "10px 20px"
                  }}>
                    <form style={webStyle.formStyle}>
                      <TextField style={webStyle.inputStyle} id="input" placeholder="Enter Text....." className="chatInput" value={this.state.newMessage} variant="outlined" onChange={(event) => this.onMsgChange(event.target.value)} />
                      <Button variant="contained" style={webStyle.buttonStyle} onClick={this.chatMessagesend}>
                        Send
                      </Button>
                    </form>
                  </Box>

                </Box>
              }

            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>

      // Customizable Area End
    );
  }
}

// Customizable Area Start
const webStyle = {
  userList: {
    maxWidth: "100%",
    backgroundColor: "#fff",
    borderBottom: '1px solid #d2d2d2',
    cursor: 'pointer'
  },
  chatBox: {
    borderLeft: '1px solid #d2d2d2',
    display: 'flex',
    flexDirection: "column" as 'column',
    justifyContent: "space-between",
    height: '100vh'
  },
  formStyle: {
    display: "flex",
    flexDirection: "row" as "row",
    justifyContent: "space-between",
    margin: "0",
    alignItems: 'center',

  },
  inputStyle: {
    width: "88%",
    "& .MuiTextField-root": {
      background: "#fff",
      "& .MuiOutlinedInput-input": {
        padding: "14.5px 14px"
      }
    }
  },

  buttonStyle: {
    width: "100px",
    height: "45px",
    border: "1px solid #D6A6EF",
    color: "#9A6DB2",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
  },
  loadButtonStyle: {
    width: "200px",
    height: "45px",
    marginTop: "15px",
    border: "1px solid #D6A6EF",
    color: "#fff",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    background: '#9A6DB2'
  },
};
// Customizable Area End
