import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { processAgentTask, getMeApi } from '../../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const { logout, token } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [meData, setMeData] = useState(null);
  const [meLoading, setMeLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMeApi();
        setMeData(data);
      } catch (err) {
        console.log('Error validando token:', err);
      } finally {
        setMeLoading(false);
      }
    };
    fetchMe();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: inputText };
    addMessage(userMsg);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      // Usamos el 'chat' en task_type porque llama a Mistral-Nemo
      const response = await processAgentTask('chat', currentInput);
      
      const assistantMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.data || 'No response returned.' 
      };
      
      addMessage(assistantMsg);
    } catch (error) {
       addMessage({
         id: (Date.now() + 1).toString(), 
         role: 'assistant', 
         content: 'Error: No se pudo conectar con los agentes locales de Ollama.'
       });
    } finally {
      setLoading(false);
    }
  };

  const renderBubble = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubbleContainer, isUser ? styles.userBubbleContainer : styles.botBubbleContainer]}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.bubbleText, isUser ? styles.userText : styles.botText]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Agente KConecta (Mistral)</Text>
            {meLoading ? (
               <Text style={styles.headerSubtitle}>Verificando token en Laravel...</Text>
            ) : meData ? (
               <View>
                 <Text style={styles.headerSubtitle}>✅ Sesión Sanctum Activa</Text>
                 <Text style={styles.userInfoText}>ID: {meData.user.id} | {meData.user.email}</Text>
                 <Text style={styles.tokenText} numberOfLines={1} ellipsizeMode="middle">Token: {token}</Text>
               </View>
            ) : (
               <Text style={styles.headerSubtitle}>⚠️ Sesión no verificada</Text>
            )}
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderBubble}
          contentContainerStyle={styles.chatArea}
          inverted={false}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Pensando...</Text>
          </View>
        )}

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje o tarea..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() || isLoading ? styles.disabledBtn : null]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { flex: 1 },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#343A40' },
  userInfoText: { fontSize: 11, color: '#495057', marginTop: 2, fontWeight: '500' },
  tokenText: { fontSize: 10, color: '#ADB5BD', marginTop: 1, fontStyle: 'italic', width: 220 },
  headerSubtitle: { fontSize: 12, color: '#28A745', marginTop: 4, fontWeight: '600' },
  chatArea: { padding: 16, paddingBottom: 24, gap: 12 },
  bubbleContainer: { width: '100%', marginBottom: 12 },
  userBubbleContainer: { alignItems: 'flex-end' },
  botBubbleContainer: { alignItems: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: '#007AFF', borderTopRightRadius: 4 },
  botBubble: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#DEE2E6' },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFFFFF' },
  botText: { color: '#343A40' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, alignSelf: 'flex-start' },
  loadingText: { marginLeft: 8, color: '#6C757D', fontSize: 14 },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#F1F3F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  disabledBtn: { backgroundColor: '#A2C9F4' },
  sendButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});
