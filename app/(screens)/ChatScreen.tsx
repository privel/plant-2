import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";





const OPENAI_API_KEY = ""; //Add your key from OPENAI - sk_proj  

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
          {
            role: "system",
            content:
              "Ты опытный садовник с глубокими знаниями о растениях. Отвечай понятно, конкретно и доброжелательно.",
          },
          { role: "user", content: message },
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
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: "user" | "ai" }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const aiReplyText = await getAIResponse(input);
    setLoading(false);

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: aiReplyText,
      sender: "ai",
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80} // можно подстроить под заголовок
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, padding: 15, backgroundColor: "#F5F5F5" }}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: item.sender === "user" ? "#4A90E2" : "#98A47BFF",
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

          {loading && (
            <ActivityIndicator size="small" color="#4A90E2" style={{ marginBottom: 10 }} />
          )}

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
              placeholder="Enter a message..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }} disabled={loading}>
              <Ionicons name="send" size={24} color={loading ? "gray" : "#4A90E2"} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
