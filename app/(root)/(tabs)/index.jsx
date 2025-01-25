import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Audio } from 'expo-av'
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
  Recording,
} from 'expo-av/build/Audio';

export default function Index() {
  const [recording, setRecording] = useState();
  const [startRecord, setStarRecord] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordUri, setUri] = useState(null);



  const StartRecording = async () => {
    try {
      if (permissionResponse.status !== 'granted'){
        console.log('Requesting permissions...');
        await requestPermission();
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        {
          isMeteringEnabled: true,
          android:{
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
            extension: '.wav',
            outputFormat: AndroidOutputFormat.DEFAULT,
            audioEncorder: AndroidAudioEncoder.DEFAULT,
          },
          ios:{
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
            extension: '.wav',
            outputFormat: IOSOutputFormat.LINEAPRCM,
          },
          web: {
            mimeType: 'audio/wav',
            bitsPerSecond: 128000,
          },
        }
      );
      setRecording(recording);
      console.log('Recording started');
    }catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const StopRecording = async () => {
    console.log('Stopping recording...');
    setRecording(undefined);
    console.log('finished setting record statues')
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    setUri(uri);
    console.log('Recording stopped and stored at', uri);
  };

  const handleRecord = async ()=>{
    if (!startRecord){
      await StartRecording();
    }else{
      await StopRecording();
    }
    setStarRecord(!startRecord);
  };

  return (
    <SafeAreaView className = "bg-white h-full">
      <ScrollView>
        <TouchableOpacity onPress={handleRecord} className="bg-primary-200 shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
          <Text>
            {startRecord ? 'Stop':'Record'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
