import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export default function PlantCareScreen() {
  const [entries, setEntries] = useState([]);
  const [height, setHeight] = useState("");
  const [notes, setNotes] = useState("");
  const [watering, setWatering] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const addOrUpdateEntry = () => {
    const healthStatus = determineHealthStatus(watering, sunlight);
    if (editingIndex !== null) {
      const updatedEntries = [...entries];
      updatedEntries[editingIndex] = { date: new Date().toLocaleDateString(), height, notes, watering, sunlight, healthStatus };
      setEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      const newEntry = { date: new Date().toLocaleDateString(), height, notes, watering, sunlight, healthStatus };
      setEntries([newEntry, ...entries]);
    }
    setHeight("");
    setNotes("");
    setWatering("");
    setSunlight("");
  };

  const determineHealthStatus = (watering, sunlight) => {
    if (watering === "Много" || sunlight === "Мало") {
      return "Плохо";
    } else if (watering === "Достаточно" && sunlight === "Достаточно") {
      return "Отлично";
    } else {
      return "Хорошо";
    }
  };

  const editEntry = (index) => {
    setHeight(entries[index].height);
    setNotes(entries[index].notes);
    setWatering(entries[index].watering);
    setSunlight(entries[index].sunlight);
    setEditingIndex(index);
  };

  const deleteEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{editingIndex !== null ? "Редактировать запись" : "Добавить запись"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Высота (см)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Заметки о поливе и освещении"
        multiline
        value={notes}
        onChangeText={setNotes}
      />
      <TextInput
        style={styles.input}
        placeholder="Полив (Мало / Достаточно / Много)"
        value={watering}
        onChangeText={setWatering}
      />
      <TextInput
        style={styles.input}
        placeholder="Освещение (Мало / Достаточно / Много)"
        value={sunlight}
        onChangeText={setSunlight}
      />
      <TouchableOpacity style={styles.button} onPress={addOrUpdateEntry}>
        <Text style={styles.buttonText}>{editingIndex !== null ? "Сохранить изменения" : "Сохранить запись"}</Text>
      </TouchableOpacity>
      
      <Text style={styles.subHeader}>История ухода</Text>
      {entries.map((entry, index) => (
        <View key={index} style={styles.entryCard}>
          <Text style={styles.entryDate}>{entry.date}</Text>
          <Text>Высота: {entry.height} см</Text>
          <Text>Полив: {entry.watering}</Text>
          <Text>Освещение: {entry.sunlight}</Text>
          <Text>Состояние: {entry.healthStatus}</Text>
          <Text>{entry.notes}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => editEntry(index)}>
              <Text style={styles.editText}>Редактировать</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteEntry(index)}>
              <Text style={styles.deleteText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6a994e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  entryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  entryDate: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editText: {
    color: "#1e90ff",
  },
  deleteText: {
    color: "#ff4d4d",
  },
});