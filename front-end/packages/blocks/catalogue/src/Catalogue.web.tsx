import React from "react";
// Customizable Area Start
import {
  Box,
  Modal,
  Button,
  Container,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
// Customizable Area End

import CatalogueController, { Props } from "./CatalogueController";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0000ff",
      contrastText: "#fff",
    },
  },
});

export default class Catalogue extends CatalogueController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  getWebList(item: any) {
    let value = item.attributes;
    return (
      <Box sx={webStyle.productBox} key={`product-item-${item.id}`}>
        <Box sx={webStyle.ImgContainer}>
          <img style={webStyle.productImg} src={value.images?.[0].url} />
        </Box>
        <Box sx={webStyle.detailContent}>
          <Typography variant="h6">{value.name}</Typography>
          <Typography variant="h6">{value.price}</Typography>
          <Typography variant="h6">{value.average_rating}</Typography>
        </Box>
      </Box>
    );
  }
  // Customizable Area End

  render() {
    return (
      //Merge Engine DefaultContainer
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Box sx={webStyle.productContainer}>
            {this.state.arrayHolder &&
              this.state.arrayHolder.map((item: any, index: any) =>
                this.getWebList(item)
              )}
          </Box>
        </Container>
      </ThemeProvider>
      //Merge Engine End DefaultContainer
    );
  }
}

// Customizable Area Start
const webStyle = {
  productContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    backgroundColor: "white",
    marginTop: "20px",
  },
  productBox: {
    height: 250,
    width: "49%",
    marginRight: "5px",
    flexDirection: "column",
  },
  ImgContainer: {
    //marginBottom: 15,
    height: 150,
  },
  productImg: {
    width: "100%",
    height: "100%",
  },
  detailContent: {
    display: "flex",
    flexDirection: "column",
  },
};
// Customizable Area End
