import React, { useState, useEffect } from "react";

import {
  Alert,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import Icon from "react-native-vector-icons/FontAwesome";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

const CameraScreen = ({ navigation }) => {
  let RefCamera;
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [list, addList] = useState([]);
  const [disableSnap, setSnap] = useState(false);
  async function requestPermission() {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.CAMERA
    );
    setHasPermission(status === "granted");
  }

  useEffect(() => {
    requestPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    Alert.alert("Lỗi", "Bạn chưa cấp quyền cho ứng dụng");
    navigation.goBack();
  }

  const takePicture = async () => {
    const photo = await RefCamera.takePictureAsync({skipProcessing:true});
    const manipResult = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { height: 1024, width: 768 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    addList([manipResult,...list, ]);

  //   const asset = await MediaLibrary.createAssetAsync(manipResult.uri);

  //   MediaLibrary.createAlbumAsync("Crab", asset)
  //     .then(() => {
 
  //     })
  //     .catch((error) => {
  //       console.log("err", error);
  //     });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "black", justifyContent: "flex-end" }}>
        <Camera
          style={{
            width: width,
            height: width * (4 / 3),
          }}
          ratio={"4:3"}
          type={type}
          ref={(ref) => {
            RefCamera = ref;
          }}
          flashMode={flash}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Icon name="long-arrow-left" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                height: 70,
                width: 70,
                marginBottom: 10,
                borderRadius: 35,
                alignItems: "center",
                justifyContent: "center",
                borderColor: "red",
                borderWidth: 2,
              }}
              disabled={disableSnap}
              onPress={() => {
                //Delay to snap
                setSnap(true);
                setTimeout(() => setSnap(false), 1000);
                takePicture();
              }}
            >
              <View
                style={{
                  backgroundColor: "red",
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                }}
              ></View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                flash == Camera.Constants.FlashMode.off
                  ? setFlash(Camera.Constants.FlashMode.on)
                  : setFlash(Camera.Constants.FlashMode.off);
              }}
            >
              {flash == Camera.Constants.FlashMode.off ? (
                <Ionicons name="md-flash-off" size={32} color="white" />
              ) : (
                <Ionicons name="md-flash" size={32} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          scrollToOverflowEnabled={true}
          data={list}
          horizontal={true}
          keyExtractor={(item,index)=>index}
          renderItem={({ item,index }) => (
            <View>
              <Image
                source={{ uri: item.uri }}
                style={{
                  height: 100,
                  width: 100,
                  margin: 10,
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
              <View style={{borderRadius:10,padding:2, backgroundColor:'grey', top:25,right:25}}>
                <Text style={{fontSize:20,color:"white",}}>{`#${index+1}`}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};
export default CameraScreen;
const styles = StyleSheet.create({
  button: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },
});
