import React from "react";

// Customizable Area Start
import {
  Container,
  Box,
  Button,
  Input,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";

// Customizable Area End

import EmailAccountLoginController, {
  Props,
} from "./EmailAccountLoginController";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0000ff",
      contrastText: "#fff",
    },
  },
});

export default class EmailAccountLoginBlock extends EmailAccountLoginController {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      // Required for all blocks
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px 0px",
            }}
          >
            <Typography variant="h4" component="h2">
              {this.labelTitle}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {this.state.labelHeader} {/*UI Engine::From Sketch*/}
            </Typography>

            <Box sx={{ width: "100%", paddingTop: "20px" }}>
              <Box sx={{ padding: "20px 0px" }}>
                <Input
                  data-test-id="txtInputEmail"
                  placeholder={"Email"}
                  fullWidth={true}
                  value={this.state.email}
                  onChange={(e) => this.setEmail(e.target.value)}
                />
              </Box>
              <Box sx={{ padding: "20px 0px" }}>
                <Input
                  data-test-id="txtInputPassword"
                  type={this.state.enablePasswordField ? "password" : "text"}
                  placeholder={"Password"}
                  fullWidth={true}
                  value={this.state.password}
                  onChange={(e) => this.setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        edge="end"
                      >
                        {this.state.enablePasswordField ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Box>
              <Box
                data-test-id={"btnForgotPassword"}
                sx={{
                  fontSize: "18px",
                  color: "#6200EE",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
                onClick={() => this.goToForgotPassword()}
              >
                Forgot Password ?
              </Box>
              <Box
                sx={{
                  fontSize: "18px",
                  color: "#6200EE",
                  fontWeight: "bold",
                  marginTop: "5px",
                }}
              >
                <Checkbox
                  data-test-id={"btnRememberMe"}
                  onClick={() =>
                    this.setRememberMe(!this.state.checkedRememberMe)
                  }
                  checked={this.state.checkedRememberMe}
                />{" "}
                Remember Me
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <Button
                  data-test-id={"btnEmailLogIn"}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => this.doEmailLogIn()}
                >
                  Login {/*UI Engine::From Sketch*/}
                </Button>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                {this.state.labelOr}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 0px",
                }}
              >
                <Button
                  data-test-id="btnSocialLogin"
                  variant="contained"
                  fullWidth
                  onClick={() => this.goToSocialLogin()}
                >
                  {this.state.btnTxtSocialLogin} {/*UI Engine::From Sketch*/}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
