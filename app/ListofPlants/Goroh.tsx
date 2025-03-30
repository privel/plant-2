import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

export default function PeaScreen() {
  return (
    <ScrollView style={styles.container}>
      <Image source={require("../../assets/goroh.jpeg")} style={styles.image} />
      <Text style={styles.title}>🌱 Pea Plant</Text>
      <Text style={styles.subtitle}>Горох — быстрорастущее растение, богатое белком.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌿 Описание</Text>
        <Text style={styles.description}>
          Горох — однолетнее растение, которое широко используется в кулинарии.
          Его стебли вьются, а стручки содержат съедобные семена.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💡 Условия для роста</Text>
        <Text style={styles.requirement}>☀️ Свет: Полутень или яркий солнечный свет</Text>
        <Text style={styles.requirement}>💧 Полив: 2–3 раза в неделю</Text>
        <Text style={styles.requirement}>🌡️ Температура: 15–20°C</Text>
        <Text style={styles.requirement}>🪴 Почва: Легкая, влажная, богатая органикой</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 Состояние растения</Text>
        <StatusBar label="💧 Вода" value={65} />
        <StatusBar label="🌿 Удобрение" value={40} />
        <StatusBar label="❤️ Здоровье" value={90} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✨ Интересный факт</Text>
        <Text style={styles.description}>
          Горох был одним из первых овощей, выращенных человеком, и сыграл важную роль в открытиях Грегора Менделя
          в области генетики!
        </Text>
      </View>
    </ScrollView>
  );
}

const StatusBar = ({ label, value }) => {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}:</Text>
      <View style={styles.statusBar}>
        <View style={[styles.statusFill, { width: `${value}%` }]} />
      </View>
      <Text style={styles.statusValue}>{value}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f6f2",
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3c6e3c",
    marginTop: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3c6e3c",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  requirement: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    width: 90,
  },
  statusBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  statusFill: {
    height: "100%",
    backgroundColor: "#3c6e3c",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
