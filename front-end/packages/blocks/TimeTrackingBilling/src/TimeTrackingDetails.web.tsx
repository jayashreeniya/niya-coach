import React from "react";

import {
    Container,
    Box,
    Typography,

    // Customizable Area Start
    Button
    // Customizable Area End
} from "@material-ui/core";

// Customizable Area Start
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Loader from "../../../components/src/Loader";


const theme = createTheme({
    palette: {
        primary: {
            main: "#fff",
            contrastText: "#fff",
        },
    },
    typography: {

        subtitle1: {
            margin: "20px 0px",
        },
    },
});
// Customizable Area End

import TimeTrackingDetController, {
    Props,
} from "./TimeTrackingDetController";

export default class TimeTrackingDetails extends TimeTrackingDetController {
    constructor(props: Props) {
        super(props);
        // Customizable Area Start
        // Customizable Area End
    }

    // Customizable Area Start

    // Customizable Area End

    render() {
        return (
            // Customizable Area Start
            <ThemeProvider theme={theme}>
                <Box style={{ flex: 1 }}>
                    <Box style={{
                        backgroundColor: "#9A6DB2",
                        maxWidth: "100%",
                        marginBottom: "20px"
                    }}

                    >
                        <Box style={{ maxWidth: "100%", padding: "10px 20px" }} >
                            <Typography style={{ flex: 1, color: '#fff', textAlign: 'left', fontSize: 20, flexWrap: 'wrap' }}>Time Tracking and Billing</Typography>
                        </Box>

                    </Box>

                    <Container >
                        <Box sx={webStyle.mainWrapper}>
                            {this.state.loading ? (
                                <Loader loading={this.state.loading} />
                            ) :
                                (
                                    <>
                                        {
                                            this.state.TrackingDataList.map((item, index) => {
                                                const { billing, month, spend_time } = item;

                                                return (
                                                    <Box style={webStyle.buttonStyle} key={index}>
                                                        <Typography style={{ fontSize: '16px', fontWeight: 600, paddingBottom: '5px' }}>
                                                            {month}
                                                        </Typography>
                                                        <Typography style={{ fontSize: '14px' }}>
                                                            {spend_time}
                                                        </Typography>
                                                        <Typography style={{ fontSize: '14px', color: "#999", textAlign: 'end' }}>
                                                            {"Billing: "}{billing}
                                                        </Typography>
                                                    </Box>
                                                )

                                            }
                                            )
                                        }
                                        <Button style={webStyle.loadButtonStyle} onClick={() => this.fetchMoreData()}>
                                            Load More
                                        </Button>
                                    </>

                                )

                            }

                        </Box>
                    </Container>
                </Box>
            </ThemeProvider>
            // Customizable Area End
        );
    }
}

// Customizable Area Start
const webStyle = {
    mainWrapper: {
        display: "flex",
        fontFamily: "Roboto-Medium",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "30px",
        background: "#fff",
    },
    buttonStyle: {
        width: "100%",
        marginTop: "15px",
        border: "1px solid #D6A6EF",
        color: "#9A6DB2",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        borderRadius: '5px',
        padding: "15px",

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
