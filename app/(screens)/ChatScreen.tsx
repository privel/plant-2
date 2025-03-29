/*import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OPENAI_API_KEY = ""; // 🔴 Замени на свой API-ключ
//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
const getAIResponse = async (message: string) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system",content: "Ты опытный садовник с глубокими знаниями о растениях, цветах и деревьях. Ты даёшь советы по уходу за садом, комнатными растениями и огородом. Отвечай подробно, но просто, чтобы даже новичок понял. Давай рекомендации по поливу, освещению, удобрениям и защите от вредителей. Если спрашивают про конкретное растение, расскажи о его потребностях. Будь доброжелательным и вдохновляй людей заботиться о природе!. Пиши конкретно, не стоит писать воду, сокращай сообщение до 200 слов"  },
            { role: "user", content: message }
          ],
          max_tokens: 300,
        }),
      });
  
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Ошибка: нет ответа от ИИ";
    } catch (error) {
      console.error("Ошибка при запросе к OpenAI:", error);
      return "Ошибка: не удалось получить ответ.";
    }
  };
  

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "user" | "ai" }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

     const userMessage = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

     const aiReplyText = await getAIResponse(input);
    setLoading(false);

     const aiMessage = { id: (Date.now() + 1).toString(), text: aiReplyText, sender: "ai" };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };

  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: "#F5F5F5" }}>
       <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: item.sender === "user" ? "#4A90E2" : "#CBD5B1",
              padding: 10,
              borderRadius: 10,
              marginVertical: 5,
              maxWidth: "70%",
            }}
          >
            <Text style={{ color: "white" }}>{item.text}</Text>
          </View>
        )}
      />

       {loading && <ActivityIndicator size="small" color="#4A90E2" style={{ marginBottom: 10 }} />}

   
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          padding: 10,
          borderRadius: 25,
          marginBottom: 10,
        }}
      >
        <TextInput
          style={{ flex: 1, padding: 10 }}
          placeholder="Введите сообщение..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }} disabled={loading}>
          <Ionicons name="send" size={24} color={loading ? "gray" : "#4A90E2"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
*/