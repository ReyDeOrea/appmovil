import RequestsSent from "@/modules/adoption/presentation/views/RequestSent";
import RequestsReceived from "@/modules/adoption/presentation/views/RequestsReceived";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Requests() {

  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Solicitudes de adopción</Text>

      {/* Tabs */}
      <View style={styles.tabs}>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "sent" && styles.activeTab
          ]}
          onPress={() => setActiveTab("sent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sent" && styles.activeTabText
            ]}
          >
            Enviadas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "received" && styles.activeTab
          ]}
          onPress={() => setActiveTab("received")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "received" && styles.activeTabText
            ]}
          >
            Recibidas
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.content}>
        {activeTab === "sent" ? < RequestsSent/> : <  RequestsReceived/>}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20
  },

  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 2,
    borderBottomColor: "transparent"
  },

  activeTab: {
    borderBottomColor: "#D09100"
  },

  tabText: {
    fontSize: 16,
    color: "#999"
  },

  activeTabText: {
    color: "#D09100",
    fontWeight: "bold"
  },

  content: {
    flex: 1
  }

});