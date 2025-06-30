import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';

import { Camera as ExpoCamera, useCameraPermissions } from 'expo-camera';
import type { Camera as CameraTypeInstance } from 'expo-camera';
import { CameraType, FlashMode } from 'expo-camera/build/Camera.types';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back' as CameraType);
  const [flash, setFlash] = useState<FlashMode>('off' as FlashMode);
  const [zoom, setZoom] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraTypeInstance>(null);

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
    setFacing((current) =>
      current === 'back' ? ('front' as CameraType) : ('back' as CameraType)
    );
  }

  function toggleFlash() {
    setFlash((current) =>
      current === 'off' ? ('torch' as FlashMode) : ('off' as FlashMode)
    );
  }

  async function takePhoto() {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo URI:', photo.uri);
        // TODO: Handle/display photo
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }

  async function startVideoRecording() {
    try {
      if (cameraRef.current && !isRecording) {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        console.log('Video URI:', video.uri);
        // TODO: Handle/display video
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      setIsRecording(false);
    }
  }

  async function stopVideoRecording() {
    try {
      if (cameraRef.current && isRecording) {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  return (
    <View style={styles.container}>
      <ExpoCamera
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

            <TouchableOpacity
              style={[styles.button, isRecording && styles.recording]}
              onPress={isRecording ? stopVideoRecording : startVideoRecording}
            >
              <Text style={styles.text}>
                {isRecording ? 'Stop' : 'Record'}
              </Text>
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
      </ExpoCamera>
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
  recording: {
    backgroundColor: 'red',
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});
 