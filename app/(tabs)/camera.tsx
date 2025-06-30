import { Camera, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import type { Camera as CameraTypeInstance } from 'expo-camera'; // Correct type import
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider'; // Correct slider import

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraTypeInstance>(null); // Corrected useRef type

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  function toggleFlash() {
    setFlash((current) => (current === 'off' ? 'torch' : 'off'));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo URI:', photo.uri);
      // TODO: Handle/display photo
    }
  }

  async function startVideoRecording() {
    if (cameraRef.current) {
      const video = await cameraRef.current.recordAsync();
      console.log('Video URI:', video.uri);
      // TODO: Handle/display video
    }
  }

  async function stopVideoRecording() {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={facing}
        flashMode={flash}
        zoom={zoom}
      >
        <View style={styles.controls}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.button} onPress={toggleFlash}>
              <Text style={styles.text}>
                {flash === 'off' ? 'Flash Off' : 'Flash On'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Snap</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={startVideoRecording}>
              <Text style={styles.text}>Record</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={stopVideoRecording}>
              <Text style={styles.text}>Stop</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.text}>Zoom</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={zoom}
              onValueChange={(value) => setZoom(value)}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sliderContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#00000080',
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});
