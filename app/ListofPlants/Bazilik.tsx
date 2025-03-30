import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

export default function BasilScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Изображение */}
      <Image source={require("../../assets/bazilik.jpg")} style={styles.image} />

      {/* Название */}
      <Text style={styles.title}>🌿 Basil (Базилик)</Text>
      <Text style={styles.subtitle}>Ароматное растение, идеально подходящее для кухни.</Text>

      {/* Описание */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌱 Описание</Text>
        <Text style={styles.description}>
          Базилик — это популярное пряное растение с ярко выраженным ароматом.
          Его листья используют в кулинарии, особенно в итальянских блюдах, салатах и соусах.
        </Text>
      </View>

      {/* Требования для ухода */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💡 Условия для роста</Text>
        <Text style={styles.requirement}>☀️ Свет: Яркий солнечный свет, минимум 6 часов в день</Text>
        <Text style={styles.requirement}>💧 Полив: 2-3 раза в неделю, избегать застоя воды</Text>
        <Text style={styles.requirement}>🌡️ Температура: 18–25°C</Text>
        <Text style={styles.requirement}>🪴 Почва: Легкая, хорошо дренированная</Text>
      </View>

      {/* Состояние растения (визуальные индикаторы) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 Состояние растения</Text>
        <StatusBar label="💧 Вода" value={70} />
        <StatusBar label="🌿 Удобрение" value={50} />
        <StatusBar label="❤️ Здоровье" value={85} />
      </View>

      {/* Интересный факт */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✨ Интересный факт</Text>
        <Text style={styles.description}>
          В Древней Греции базилик считался "королевской" травой, отсюда и его название (от греческого "basilikos" – царский).
        </Text>
      </View>
    </ScrollView>
  );
}

// Компонент индикатора состояния
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

// Стили
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
