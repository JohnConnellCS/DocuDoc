import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import {StatusBar} from 'expo-status-bar';
import { Audio } from 'expo-av'
import { useRouter } from 'expo-router';
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
  Recording,
} from 'expo-av/build/Audio';
const { getAllUsersData,  submitConversationData} = require('../../../src/firebase');
import axios from "axios";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [recording, setRecording] = useState();
  const [startRecord, setStarRecord] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordUri, setUri] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posted, setPosted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const data = await getAllUsersData();
        setSummaries(data);
        setLoading(false);
        setPosted(false);
      } catch (err) {
        console.error("Error fetching summaries:", err);
      }
    };
    fetchSummaries();
  }, [posted]);



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
    console.log('start uploading recording for process');
    uploadRecording(uri);
  };

  const uploadRecording = async (uri) => {
    if (!uri){
      console.error("No recording URI available");
      return;
    }
    try {
      const formData = new FormData();

      const fileName = uri.split('/').pop();
      formData.append("audio", {
        uri,
        name: fileName,
        type: "audio/wav",
      });

      const response = await axios.post("http://192.168.1.13:5001/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response from server:", response.data);
      await postToFirebase(response.data);
    }catch (error){
      console.error("Error uploading audio file:", error);
    }
  };

  const postToFirebase = async (response) => {
    try{
      const rawData = response[0].text || "Sample raw transcript";
      console.log("raw data: ", rawData);
      const transcriptSummary = response[0].summary || "Sample transcript summary";
      console.log("transcript sum: ", transcriptSummary);
      const postOpSummary = response[0].instructions || "Sample post doc instructions";
      console.log("post op summary", postOpSummary);
      await submitConversationData(rawData, transcriptSummary, postOpSummary);
      console.log("Data successfully saved to Firestore.");
      setPosted(true);
    }catch (error) {
      console.error("Error saving data to Firebase:", error);
    }
  };

  const handleRecord = async ()=>{
    if (!startRecord){
      await StartRecording();
    }else{
      await StopRecording();
    }
    setStarRecord(!startRecord);
  };

  const handleViewDetails = (summary) => {
    router.push({
      pathname: './summaryDetails',
      params: {
        transcript: summary.transcript,
        summary: summary.summary,
        postOperativeSteps: summary.postOperativeSteps,
        date: summary.timestamp?.toDate().toLocaleString(),
      },
    });
  };

  const truncateText = (text, wordLimit) => {
    if (!text) return "Untitled";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return (
    <SafeAreaView className="bg-primary-300 h-full">
      <StatusBar barStyle="light-content" hidden={true} />
        {/* Header Section */}
      <View style={{ backgroundColor: '#536663', paddingVertical: 15 }}>
        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: 'white' }}>
          DocuDoc
        </Text>
      </View>

      <ScrollView className="px-4 bg-primary-100">
        {/* Record Button */}
        <TouchableOpacity
          onPress={handleRecord}
          className="bg-primary-200 shadow-md shadow-zinc-300 rounded-full py-4 mt-5"
        >
          <Text className="text-center text-white font-semibold">
            {startRecord ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
  
        {/* Display List of Summaries */}
        <View style={{ padding: 20, backgroundColor: '#789482', borderRadius: 10, marginTop: 20 }}>
          {loading ? (
            <View className="flex items-center justify-center mt-20">
              <ActivityIndicator size="large" color="#789482" />
            </View>
          ) : summaries.length === 0 ? (
            <Text className="text-center text-gray-500 mt-10">No summaries available.</Text>
          ) : (
            summaries.map((summary, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleViewDetails(summary)}
                className="bg-gray-100 shadow-sm shadow-gray-400 rounded-md p-4 my-2"
              >
                <Text className="text-base font-semibold text-accent-300">
                  {truncateText(summary.summary, 18)}
                </Text>
                <Text className="text-sm text-primary-300">
                  {summary.timestamp?.toDate().toLocaleString() || 'No Date'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}