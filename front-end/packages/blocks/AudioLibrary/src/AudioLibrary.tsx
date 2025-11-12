// @ts-nocheck
import React from "react";

// Customizable Area Start
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { back, audioIcon, picture } from "./assets";
import { Colors, dimensions } from "../../../components/src/utils";
import Typography from "../../../components/src/Typography";
import AppLoader from "../../../components/src/Loader"
import VideoPlayer from "../../../components/src/VideoPlayer";
import AudioList from "../../../components/src/AudioList";
// Merge Engine - import assets - Start
// Merge Engine - import assets - End

// Merge Engine - Artboard Dimension  - Start
let artBoardHeightOrg = 667;
let artBoardWidthOrg = 375;
// Merge Engine - Artboard Dimension  - End
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
  renderArticles = (item: Record<string, any>) => {
    console.log('extrass', item?.attributes);
    const pic = item.attributes?.file_info?.[0]?.thumbnail
    if (item.attributes?.file_info?.[0]?.file_content === undefined || item.attributes?.file_info?.[0]?.file_content == "" || item.attributes?.file_info?.[0]?.file_content === null) return;
    
    else {
      return (
        <View style={[styles.videoBlock, styles.audioBlock]}>
          <View style={styles.audioBg}>
            <Image
              source={!pic?picture: {uri:pic}}
              style={{tintColor: pic==null?Colors.greyText:undefined, width: !pic?dimensions.wp(12):'100%', height:!pic?dimensions.wp(12):'100%'}}
            />
          </View>
          <View style={styles.audioDetails}>
            <Typography
              style={styles.blockText}
              size={18}
              font="MED"
              mb={1}
            >
              {item.attributes?.file_info?.[0]?.title || "No title found"}
            </Typography>
            <Typography
              color="greyText"
              style={styles.blockText}
              size={15} font="MED"
              mb={1}
              lines={2}
            >
              {item.attributes?.file_info?.[0]?.description}
            </Typography>
            <TouchableOpacity onPress={() => this.openDoc(
              item?.attributes?.file_info?.[0]?.url,
              item.attributes?.file_info?.[0]?.title,
              item.attributes?.file_info?.[0]?.file_content,
            )}>
              <Typography style={styles.blockText} align="right" color="accent" size={15} font="MED" mb={1}>Read more</Typography>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }



  renderAudios = (item: Record<string, any>) => {
    const pic = item.attributes?.file_info?.[0]?.thumbnail
    return (
      <AudioList audio_pic={pic} songs={[item]} onPressItm={() => this.setState({ selectedId: item.id })} selectedItm={this.state.selectedId} />
    )
  }

  renderVideos = (item: Record<string, any>) => {
    const picture = item.attributes?.file_info?.[0]?.thumbnail
    const onPlay = () => {
      this.setState({
        videoModal: true,
        videoUrl: item?.attributes?.file_info?.[0]?.url
      });
    }

    return (
      <View style={styles.videoBlock}>
        <ImageBackground
          source={{ uri: picture?picture:"https://cdn.pixabay.com/photo/2016/10/26/19/00/domain-names-1772242_1280.jpg" }}
          style={styles.thumbnail}
        >
          <TouchableOpacity
            onPress={onPlay}
            style={styles.videoPlay}
          >
            <Image source={audioIcon} style={styles.audioIcon} />
          </TouchableOpacity>
        </ImageBackground>
        <Typography size={18} font="MED" mb={1}>{item.attributes?.file_info?.[0]?.title || "No title found"}</Typography>
        <Typography color="greyText" size={15}>{item.attributes?.file_info?.[0]?.description}</Typography>
      </View>
    );
  }

  renderMedia = () => {
    const mediaType = this.props.navigation.getParam("type");
    switch (mediaType) {
      case "articles":
        return (
          <FlatList
            data={this.state.mediaList}
            renderItem={({ item }) => this.renderArticles(item)}
            keyExtractor={item => item.id}
            onEndReached={this.loadMoreArticles}
          />
        );
      case "audio":
        return (
          <View style={{ marginTop: dimensions.wp(3), marginBottom: dimensions.hp(20) }}>
            <FlatList
              data={this.state.mediaList}
              renderItem={({ item }) => this.renderAudios(item)}
              keyExtractor={item => item.id}
              onEndReached={this.loadMoreAudios}
            />
          </View>
        );
      default:
        return (
          <FlatList
            data={this.state.mediaList}
            renderItem={({ item }) => this.renderVideos(item)}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMoreVideos}
          />
        );
    }
  }
  // Customizable Area End

  render() {
    // Customizable Area Start
    // Merge Engine - render - Start
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[Colors.accent, "#ABA6F3"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}

        >
          <View style={{ width: dimensions.wp(80), flexDirection: 'row' }} >
            <TouchableOpacity testID="tblBack" style={{ flexDirection: 'column', width: dimensions.wp(20) }} onPress={() => this.props.navigation.goBack()}>
              <Image source={back} style={styles.backIcon} />
            </TouchableOpacity>
            {(this.state.header) ? (
              <Typography
                style={[styles.fullFlex]}
                color="white"
                font="MED"
                size={18}
              >
                {this.state.header}
              </Typography>
            ) : null}
          </View>
        </LinearGradient>
        {this.renderMedia()}

        {this.state.videoModal && <VideoPlayer
          visible={this.state.videoModal}
          url={this.state.videoUrl}
          onClose={this.toggleVideo}
        />}
        <AppLoader loading={this.state.loading} />
      </SafeAreaView>
    );
    // Merge Engine - render - End
    // Customizable Area End
  }
}

// Customizable Area Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.borderColor
  },
  header: {
    width: dimensions.wp(100),
    paddingHorizontal: dimensions.wp(4),
    paddingTop: dimensions.hp(3),
    paddingBottom: dimensions.hp(6),
    flexDirection: "row",
    // alignItems: "center"
  },
  backIcon: {
    height: dimensions.wp(5),
    width: dimensions.wp(5),
    resizeMode: "contain",
    marginRight: dimensions.wp(7),
    marginTop: dimensions.hp(0.5)
  },
  fullFlex: {
    flexDirection: 'column',
    width: dimensions.wp(60),
    justifyContent: 'center',
    alignItems: 'center'

  },
  videoBlock: {
    marginHorizontal: dimensions.wp(4),
    borderRadius: dimensions.wp(3),
    backgroundColor: Colors.white,
    marginVertical: dimensions.hp(1.5),
    padding: dimensions.wp(4)
  },
  thumbnail: {
    width: dimensions.wp(84),
    height: dimensions.wp(50),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: dimensions.wp(3),
    marginBottom: dimensions.hp(1),
    overflow: "hidden",
  },
  videoPlay: {
    width: dimensions.wp(15),
    height: dimensions.wp(15),
    borderRadius: dimensions.wp(7.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#867CCA",
    borderWidth: 3,
    borderColor: "#E9E2D0"
  },
  audioIcon: {
    width: dimensions.wp(5),
    height: dimensions.wp(5),
    resizeMode: "contain",
    tintColor: Colors.white
  },
  audioBlock: {
    flexDirection: "row",
    overflow: "hidden"
  },
  audioPlay: {
    width: dimensions.wp(12),
    height: dimensions.wp(12),
  },
  audioBg: {
    height: dimensions.wp(30),
    width: dimensions.wp(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    borderRadius: dimensions.wp(3),
    marginRight: dimensions.wp(4)
  },
  audioDetails: {
    justifyContent: "space-between"
  },
  soundIcon: {
    width: dimensions.wp(8),
    height: dimensions.wp(5)
  },
  articleIcon: {
    width: dimensions.wp(12),
    height: dimensions.wp(12),
    tintColor: Colors.greyText
  },
  blockText: {
    width: dimensions.wp(50)
  }
});
// Customizable Area End
