import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  const handleRecord = ()=>{}
  return (
    <SafeAreaView className = "bg-white h-full">
      <ScrollView>
        <TouchableOpacity onPress={handleRecord} className="bg-primary-200 shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5">
          <Text>Record</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
