import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function SummaryDetails() {
  const { summary, postOperativeSteps, transcript, date } = useGlobalSearchParams();
  
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isNextStepsOpen, setIsNextStepsOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const toggleSummary = () => setIsSummaryOpen(!isSummaryOpen);
  const toggleNextSteps = () => setIsNextStepsOpen(!isNextStepsOpen);
  const toggleTranscript = () => setIsTranscriptOpen(!isTranscriptOpen);

  return (
    <SafeAreaView className="flex-1 bg-primary-300 h-full">
        {/* Header Section */}
        <View style={{ backgroundColor: "#536663",  paddingTop: 20, paddingBottom: 0 }}>
        <Text style={styles.title}>
          Post-Visit Details
        </Text>
        <Text style={styles.date}>
            <Text style={styles.bold}></Text> {date || 'Unknown'}
        </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollView} className = "bg-primary-100 h-full">
            {/* Dropdown for Summary */}
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleSummary}>
                <Text style={styles.dropdownButtonText}>Summary</Text>
            </TouchableOpacity>
            {isSummaryOpen && (
                <Text style={styles.content}>{summary || 'N/A'}</Text>
            )}

            {/* Dropdown for Post-Operative Steps */}
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleNextSteps}>
                <Text style={styles.dropdownButtonText}>Next Steps</Text>
            </TouchableOpacity>
            {isNextStepsOpen && (
                <Text style={styles.content}>{postOperativeSteps || 'N/A'}</Text>
            )}

            {/* Dropdown for Transcript */}
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleTranscript}>
                <Text style={styles.dropdownButtonText}>Transcript</Text>
            </TouchableOpacity>
            {isTranscriptOpen && (
                <Text style={styles.content}>{transcript || 'N/A'}</Text>
            )}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    marginBottom: 30,  // Added more space here
    color: 'white',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  dropdownButton: {
    backgroundColor: '#789482',
    padding: 24,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
    paddingLeft: 20,
    paddingRight: 20,
    color: '#333',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 50,  
    paddingBottom: 50,
  },
});
