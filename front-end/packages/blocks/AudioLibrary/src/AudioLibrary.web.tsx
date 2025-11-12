import React from "react";

import {
  Typography
  // Customizable Area Start
  // Customizable Area End
} from "@material-ui/core";

// Customizable Area Start

import { back } from "./assets";
import AppLoader from "../../../components/src/Loader"
import AudioListWeb from "../../../components/src/AudioListWeb";


// Customizable Area End

import AudioLibraryController, {
  Props
} from "./AudioLibraryController";

export default class AudioLibrary extends AudioLibraryController {
  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    // Customizable Area End
  }

  // Customizable Area Start
  renderMedia = () => { return <AudioListWeb totalCount={this.state.totalCount} songs={this.state.audioList} pageNo={this.state.currentPageNo} handlePagination={this.handlePagination}  /> }
  // Customizable Area End

  render() {
    return (
      // Customizable Area Start
        <div>
          <div style={{display:"flex", justifyContent:"center", padding:"28px", background:"linear-gradient(#ABA6F3,#8E84DA)", color:"#fff"}}>
         <div style={{width:"50px", height:"50px"}}>
          <img src={back} />
         </div>
          {(this.state.header)? (
            <Typography
            style={{fontWeight:"bold"}}
            >
              {this.state.header}
            </Typography>
          ): null}  
        </div>     
        {this.renderMedia()}       
        <AppLoader loading={this.state.loading} />
        </div>
      // Customizable Area End
    );
  }
}
