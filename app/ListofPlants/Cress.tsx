import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

export default function CressScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Изображение */}
      <Image source={require("../../assets/cress.jpg")} style={styles.image} />

      {/* Название */}
      <Text style={styles.title}>🌿 Cress (Кресс-салат)</Text>
      <Text style={styles.subtitle}>Быстрорастущий и полезный салат с пикантным вкусом.</Text>

      {/* Описание */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌱 Описание</Text>
        <Text style={styles.description}>
          Кресс-салат — это быстрорастущее растение с острым вкусом. Его можно выращивать как в саду, так и на подоконнике.
          Используется в салатах, бутербродах и супах.
        </Text>
      </View>

      {/* Требования для ухода */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💡 Условия для роста</Text>
        <Text style={styles.requirement}>☀️ Свет: Яркий рассеянный или полутень</Text>
        <Text style={styles.requirement}>💧 Полив: Ежедневно, почва должна быть влажной</Text>
        <Text style={styles.requirement}>🌡️ Температура: 10–20°C</Text>
        <Text style={styles.requirement}>🪴 Почва: Легкая и влажная, подходит гидропоника</Text>
      </View>

      {/* Состояние растения (визуальные индикаторы) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 Состояние растения</Text>
        <StatusBar label="💧 Вода" value={80} />
        <StatusBar label="🌿 Удобрение" value={30} />
        <StatusBar label="❤️ Здоровье" value={95} />
      </View>

      {/* Интересный факт */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✨ Интересный факт</Text>
        <Text style={styles.description}>
          Кресс-салат настолько быстро растет, что его можно собирать уже через 7–10 дней после посадки!
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
