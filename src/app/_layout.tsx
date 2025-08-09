import Providers from "@/providers";
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Stack } from "expo-router";
import { Alert, View, Text, Pressable, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import React, { useRef } from 'react';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChat } from "@ai-sdk/react";
import { generateUUID } from "@/lib/utils";
import { ChatInterface } from "@/components/chat-interface";
import { ChatInput } from "@/components/ui/chat-input";
import { useStore } from "@/lib/globalStore";
import HomePage from "./(app)/index";
import { useNavigation } from '@react-navigation/native';
import { ShieldAlert, BookOpenCheck, MessageSquareText, PlusCircle, Mic, ArrowUp, Flame, Bandage, Wind, Heart, Phone, Sparkles, GraduationCap, Play, Timer, Award } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const { firstAidChats, setFirstAidChats, setActiveFirstAidChatId, egitimChats, setEgitimChats, setActiveEgitimChatId } = useStore();
  const COLOR_FIRST_AID = '#ef4444';
  const COLOR_EDU = '#0ea5e9';
  // Yeni sohbet başlat fonksiyonları
  const startNewFirstAidChat = () => {
    const newId = generateUUID();
    const newChats = [...firstAidChats, { id: newId, title: `Sohbet ${firstAidChats.length + 1}`, messages: [] }];
    setFirstAidChats(newChats);
    setActiveFirstAidChatId(newId);
    navigation.navigate('FirstAidChat');
  };
  const startNewEgitimChat = () => {
    const newId = generateUUID();
    const newChats = [...egitimChats, { id: newId, title: `Sohbet ${egitimChats.length + 1}`, messages: [] }];
    setEgitimChats(newChats);
    setActiveEgitimChatId(newId);
    navigation.navigate('EgitimModu');
  };
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingVertical: 24 }}>
      <View style={{ gap: 8, marginHorizontal: 12 }}>
        <Pressable
          onPress={() => navigation.navigate('Welcome')}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12 }}
        >
          <ShieldAlert size={24} color={COLOR_FIRST_AID} style={{ marginRight: 10 }} />
          <Text style={{ fontWeight: state.index === 0 ? 'bold' : '600', color: COLOR_FIRST_AID, fontSize: 16 }}>
            İlk Yardım Modu
          </Text>
        </Pressable>
        <Pressable onPress={startNewFirstAidChat} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 36, marginBottom: 2, paddingVertical: 4 }}>
          <PlusCircle size={18} color={COLOR_FIRST_AID} style={{ marginRight: 6 }} />
          <Text style={{ color: COLOR_FIRST_AID, fontWeight: '600', fontSize: 14 }}>Yeni Sohbet</Text>
        </Pressable>
        {Array.isArray(firstAidChats) && firstAidChats.map((chat, i) => (
          <Pressable
            key={chat.id}
            onPress={() => {
              setActiveFirstAidChatId(chat.id);
              navigation.navigate('FirstAidChat');
            }}
            style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 36, marginBottom: 2, paddingVertical: 6 }}
          >
            <MessageSquareText size={18} color={'#0f172a'} style={{ marginRight: 6 }} />
            <Text style={{ color: '#0f172a', fontWeight: '500', fontSize: 14 }}>Sohbet {i + 1}</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => navigation.navigate('EgitimModu')}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12 }}
        >
          <BookOpenCheck size={24} color={COLOR_EDU} style={{ marginRight: 10 }} />
          <Text style={{ fontWeight: state.index === 1 ? 'bold' : '600', color: COLOR_EDU, fontSize: 16 }}>
            Eğitim Modu
          </Text>
        </Pressable>
        <Pressable onPress={startNewEgitimChat} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 36, marginBottom: 2, paddingVertical: 4 }}>
          <PlusCircle size={18} color={COLOR_EDU} style={{ marginRight: 6 }} />
          <Text style={{ color: COLOR_EDU, fontWeight: '600', fontSize: 14 }}>Yeni Sohbet</Text>
        </Pressable>
        {Array.isArray(egitimChats) && egitimChats.map((chat, i) => (
          <Pressable
            key={chat.id}
            onPress={() => {
              setActiveEgitimChatId(chat.id);
              navigation.navigate('EgitimModu');
            }}
            style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 36, marginBottom: 2, paddingVertical: 6 }}
          >
            <MessageSquareText size={18} color={'#0f172a'} style={{ marginRight: 6 }} />
            <Text style={{ color: '#0f172a', fontWeight: '500', fontSize: 14 }}>Sohbet {i + 1}</Text>
          </Pressable>
        ))}
      </View>
    </DrawerContentScrollView>
  );
}

function WelcomeScreen() {
  const navigation = useNavigation();
  const inputRef = React.useRef(null);
  const chatScrollRef = React.useRef(null);
  const {
    firstAidChats,
    setFirstAidChats,
    activeFirstAidChatId,
    setActiveFirstAidChatId,
    clearImageUris,
    setBottomChatHeightHandler,
  } = useStore();

  // Aktif chat yoksa yeni bir chat başlat
  React.useEffect(() => {
    if (!activeFirstAidChatId) {
      const newId = generateUUID();
      setFirstAidChats([
        ...(firstAidChats || []),
        { id: newId, title: `Sohbet ${(firstAidChats || []).length + 1}`, messages: [] },
      ]);
      setActiveFirstAidChatId(newId);
    }
  }, [activeFirstAidChatId, firstAidChats, setFirstAidChats, setActiveFirstAidChatId]);

  const activeChat = Array.isArray(firstAidChats) ? firstAidChats.find((c) => c.id === activeFirstAidChatId) : null;
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    // Yeni bir chat oluştur
    const newChatId = generateUUID();
    const userMsg = { id: generateUUID(), role: "user", content: input };
    const botMsg = { id: generateUUID(), role: "assistant", content: "İlk Yardım: Lütfen sorularınızı yazın!" };
    
    const newChat = {
      id: newChatId,
      title: `Sohbet ${(firstAidChats || []).length + 1}`,
      messages: [userMsg, botMsg]
    };
    
    // Yeni chat'i ekle ve aktif yap
    setFirstAidChats([
      ...(firstAidChats || []),
      newChat
    ]);
    setActiveFirstAidChatId(newChatId);
    
    setInput("");
    clearImageUris();
    
    // İlk Yardım moduna yönlendir
    setTimeout(() => {
      (navigation as any).navigate('FirstAidChat');
    }, 100);
    
    setIsLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Üst kısım - Hoşgeldiniz */}
      <View style={{ 
        paddingHorizontal: 20, 
        paddingVertical: 40,
        alignItems: 'center'
      }}>
        <Text style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          color: '#333', 
          marginBottom: 20, 
          textAlign: 'center' 
        }}>
          Hoşgeldiniz
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: '#666', 
          textAlign: 'center',
          lineHeight: 24,
          maxWidth: 300
        }}>
          İlk yardım konusunda sorularınızı sorabilirsiniz
        </Text>
      </View>

      {/* Chat kısmı - Basit input */}
      <View style={{ flex: 1, paddingHorizontal: 16, justifyContent: 'center' }}>
        <View style={{ 
          backgroundColor: '#fff',
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#e0e0e0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}>
          {/* Input */}
          <View style={{ flex: 1, marginRight: 12 }}>
            <TextInput
              ref={inputRef}
              style={{ 
                fontSize: 16, 
                color: '#333',
                minHeight: 20
              }}
              placeholder="İlk yardım sorunuzu yazın..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              multiline
              onSubmitEditing={handleSend}
            />
          </View>
          
          {/* Mikrofon butonu */}
          <Pressable
            onPress={() => Alert.alert("Sesli mesaj özelliği yakında!")}
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: '#f0f0f0',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8
            }}
          >
            <Mic size={16} color="#666" />
          </Pressable>
          
          {/* Gönder butonu */}
          <Pressable
            onPress={handleSend}
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20, 
              backgroundColor: input.trim() ? '#007AFF' : '#e0e0e0',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ArrowUp size={16} color={input.trim() ? '#fff' : '#999'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function FirstAidChatScreen() {
  const inputRef = React.useRef(null);
  const chatScrollRef = React.useRef(null);
  const { bottom } = useSafeAreaInsets();
  const {
    firstAidChats,
    setFirstAidChats,
    activeFirstAidChatId,
    setActiveFirstAidChatId,
    clearImageUris,
    setBottomChatHeightHandler,
  } = useStore();

  // Aktif chat yoksa yeni bir chat başlat
  React.useEffect(() => {
    if (!activeFirstAidChatId) {
      const newId = generateUUID();
      setFirstAidChats([
        ...firstAidChats,
        { id: newId, title: `Sohbet ${firstAidChats.length + 1}`, messages: [] },
      ]);
      setActiveFirstAidChatId(newId);
    }
  }, [activeFirstAidChatId, firstAidChats, setFirstAidChats, setActiveFirstAidChatId]);

  const activeChat = firstAidChats.find((c) => c.id === activeFirstAidChatId);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    setIsLoading(true);
    // Kullanıcı mesajını ekle
    const userMsg = { id: generateUUID(), role: "user", content: input };
    const updatedMessages = [...activeChat.messages, userMsg];
    // Bot cevabını simüle et
    setTimeout(() => {
      const botMsg = { id: generateUUID(), role: "assistant", content: "İlk Yardım: Lütfen sorularınızı yazın!" };
      const newChats = firstAidChats.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [...updatedMessages, botMsg] } : c
      );
      setFirstAidChats(newChats);
      setIsLoading(false);
    }, 800);
    // Mesajı hemen ekle
    setFirstAidChats(
      firstAidChats.map((c) =>
        c.id === activeChat.id ? { ...c, messages: updatedMessages } : c
      )
    );
    setInput("");
    clearImageUris();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, paddingBottom: 8 }}>
        <ChatInterface
          messages={activeChat?.messages || []}
          scrollViewRef={chatScrollRef}
          isLoading={isLoading}
        />
        <ChatInput
          ref={inputRef}
          scrollViewRef={chatScrollRef}
          input={input}
          onChangeText={setInput}
          focusOnMount={false}
          onSubmit={handleSend}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

function EgitimModuScreen() {
  const inputRef = React.useRef(null);
  const chatScrollRef = React.useRef(null);
  const { bottom } = useSafeAreaInsets();
  const {
    egitimChats,
    setEgitimChats,
    activeEgitimChatId,
    setActiveEgitimChatId,
    clearImageUris,
  } = useStore();

  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'learn' | 'chat'>('learn');

  const blogPosts = [
    {
      id: 'bleeding-basics',
      title: 'Kanama Kontrolü: Temel İlkeler',
      excerpt:
        'Basınç uygulama, elevasyon ve turnike kullanımı ne zaman gerekir? Adım adım anlatım.',
      icon: Bandage,
      color: '#fee2e2',
      iconColor: '#dc2626',
      prompt: 'Kanama kontrolünü adım adım açıkla. Örnek senaryolarla pratik öneriler ver.',
      readTime: '4 dk',
    },
    {
      id: 'burns-care',
      title: 'Yanıklar ve Doğru İlk Yardım',
      excerpt:
        'Soğutma süresi, kabarcıklar ve örtme yöntemleri. Kaçınılması gereken yaygın hatalar.',
      icon: Flame,
      color: '#ffedd5',
      iconColor: '#c2410c',
      prompt: 'Yanıklarda ilk yardımın doğru uygulanışını seviyeli olarak öğret.',
      readTime: '5 dk',
    },
    {
      id: 'choking-heimlich',
      title: 'Boğulma: Heimlich Manevrası Rehberi',
      excerpt:
        'Yetişkin, çocuk ve bebekler için farklı uygulamalar ve güvenlik ipuçları.',
      icon: Wind,
      color: '#dbeafe',
      iconColor: '#1d4ed8',
      prompt: 'Boğulmada yapılacakları yaş gruplarına göre açıkla ve uygulama ipuçları ver.',
      readTime: '6 dk',
    },
    {
      id: 'cpr-checklist',
      title: 'CPR Kontrol Listesi',
      excerpt:
        'Ritim, derinlik, oran ve geri bildirim. Uygulamada kaçınılan hatalar.',
      icon: Heart,
      color: '#fce7f3',
      iconColor: '#be185d',
      prompt: 'CPR adımlarını kontrol listesi şeklinde öğret, pratik öneriler ekle.',
      readTime: '7 dk',
    },
  ];

  // Chat başlatma - basitleştirilmiş
  React.useEffect(() => {
    console.log("EgitimModuScreen: useEffect çalıştı", { activeEgitimChatId, egitimChatsLength: egitimChats?.length });
    
    if (!activeEgitimChatId) {
      console.log("EgitimModuScreen: Yeni chat oluşturuluyor");
      const newId = generateUUID();
      const newChat = { 
        id: newId, 
        title: `Sohbet ${(egitimChats || []).length + 1}`, 
        messages: [] 
      };
      
      setEgitimChats([...(egitimChats || []), newChat]);
      setActiveEgitimChatId(newId);
    }
  }, []); // Sadece component mount olduğunda çalışsın

  const activeChat = React.useMemo(() => {
    return Array.isArray(egitimChats) ? egitimChats.find((c) => c.id === activeEgitimChatId) : null;
  }, [egitimChats, activeEgitimChatId]);

  console.log("EgitimModuScreen: Render", { 
    activeChatId: activeEgitimChatId, 
    activeChatMessages: activeChat?.messages?.length,
    input,
    isLoading 
  });

  const sendText = React.useCallback((text: string) => {
    const trimmed = (text || '').trim();
    if (!trimmed || !activeChat) return;
    setIsLoading(true);
    const userMsg = { id: generateUUID(), role: 'user', content: trimmed };
    const updatedMessages = [...(activeChat.messages || []), userMsg];
    const updatedChat = { ...activeChat, messages: updatedMessages };
    const updatedChats = (egitimChats || []).map((chat) =>
      chat.id === activeChat.id ? updatedChat : chat,
    );
    setEgitimChats(updatedChats);
    setInput("");
    clearImageUris();
    setTimeout(() => {
      const botMsg = {
        id: generateUUID(),
        role: 'assistant',
        content: 'Eğitim asistanı: Hazırım. Devam edelim.',
      };
      const finalMessages = [...updatedMessages, botMsg];
      const finalChat = { ...activeChat, messages: finalMessages };
      const finalChats = updatedChats.map((chat) =>
        chat.id === activeChat.id ? finalChat : chat,
      );
      setEgitimChats(finalChats);
      setIsLoading(false);
      setActiveTab('chat');
    }, 600);
  }, [activeChat, egitimChats, setEgitimChats, clearImageUris]);

  const handleSend = React.useCallback(() => {
    sendText(input);
  }, [input, sendText]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <LinearGradient
        colors={["#1976d2", "#42a5f5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <GraduationCap size={22} color={'#e3f2fd'} style={{ marginRight: 8 }} />
            <Text style={{ color: '#e3f2fd', fontSize: 14 }}>Eğitim Modu</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>İlk Yardımı Adım Adım Öğrenin</Text>
          <Text style={{ color: '#e3f2fd', marginTop: 8, lineHeight: 20 }}>
            Rehberli dersler ve akıllı sohbet ile kendinizi geliştirin.
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <Pressable
              onPress={() => { sendText('Bana rehberli bir CPR dersi ver. Seviye: başlangıç.'); }}
              style={{ backgroundColor: '#0ea5e9', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginRight: 8, flexDirection: 'row', alignItems: 'center' }}
            >
              <Play size={16} color={'#fff'} style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontWeight: '600' }}>Dersi Başlat</Text>
            </Pressable>
            <Pressable
              onPress={() => { sendText('10 soruluk hızlı ilk yardım testi başlat.'); }}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}
            >
              <Timer size={16} color={'#fff'} style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontWeight: '600' }}>Hızlı Test</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View style={{ backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, flexDirection: 'row' }}>
          <Pressable
            onPress={() => setActiveTab('learn')}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: activeTab === 'learn' ? '#fff' : 'transparent', alignItems: 'center' }}
          >
            <Text style={{ color: activeTab === 'learn' ? '#0f172a' : '#475569', fontWeight: '600' }}>Dersler</Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('chat')}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: activeTab === 'chat' ? '#fff' : 'transparent', alignItems: 'center' }}
          >
            <Text style={{ color: activeTab === 'chat' ? '#0f172a' : '#475569', fontWeight: '600' }}>Sohbet</Text>
          </Pressable>
        </View>
      </View>

      {activeTab === 'learn' ? (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, flexGrow: 1 }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ height: 52, alignItems: 'center' }}
          >
            <Pressable onPress={() => sendText('Kanama için rehberli eğitim ver.')} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fee2e2', borderRadius: 999, marginRight: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Bandage size={16} color={'#dc2626'} style={{ marginRight: 6 }} />
              <Text style={{ color: '#991b1b', fontWeight: '600' }}>Kanama</Text>
            </Pressable>
            <Pressable onPress={() => sendText('Yanıklar için rehberli eğitim ver.')} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#ffedd5', borderRadius: 999, marginRight: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Flame size={16} color={'#c2410c'} style={{ marginRight: 6 }} />
              <Text style={{ color: '#9a3412', fontWeight: '600' }}>Yanık</Text>
            </Pressable>
            <Pressable onPress={() => sendText('Boğulma durumunda yapılacaklar eğitimi ver.')} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#dbeafe', borderRadius: 999, marginRight: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Wind size={16} color={'#1d4ed8'} style={{ marginRight: 6 }} />
              <Text style={{ color: '#1e40af', fontWeight: '600' }}>Boğulma</Text>
            </Pressable>
            <Pressable onPress={() => sendText('CPR için adım adım eğitim ver.')} style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fce7f3', borderRadius: 999, marginRight: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Heart size={16} color={'#be185d'} style={{ marginRight: 6 }} />
              <Text style={{ color: '#9d174d', fontWeight: '600' }}>CPR</Text>
            </Pressable>
          </ScrollView>

          {/* Blog Yazıları */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 }}>Blog Yazıları</Text>
            <View style={{ gap: 12 }}>
              {blogPosts.map((post) => {
                const Icon = post.icon;
                return (
                  <Pressable
                    key={post.id}
                    onPress={() => sendText(`${post.title} hakkında beni eğit. ${post.prompt}`)}
                  >
                    <View
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 16,
                        padding: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 6,
                      }}
                    >
                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          backgroundColor: post.color,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                        }}
                      >
                        <Icon size={18} color={post.iconColor} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '700', color: '#0f172a' }}>{post.title}</Text>
                        <Text style={{ color: '#475569', marginTop: 2 }}>{post.excerpt}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 6 }}>
                          <Text style={{ color: '#64748b', fontSize: 12 }}>{post.readTime} • Okuma</Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 8, paddingBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 }}>Önerilen Dersler</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 2 }}>
              <Pressable onPress={() => sendText('Başlangıç seviyesi ilk yardım genel dersi başlat.')} style={{ width: 260, marginRight: 12 }}>
                <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Sparkles size={18} color={'#0ea5e9'} style={{ marginRight: 8 }} />
                    <Text style={{ fontWeight: '700', color: '#0f172a' }}>İlk Yardım 101</Text>
                  </View>
                  <Text style={{ color: '#334155' }}>Temelden ileri seviyeye doğru ilerleyen rehberli eğitim.</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Award size={14} color={'#64748b'} style={{ marginRight: 6 }} />
                    <Text style={{ color: '#64748b', fontSize: 12 }}>30 dk • Başlangıç</Text>
                  </View>
                </View>
              </Pressable>
              <Pressable onPress={() => sendText('Acil durumlarda CPR için hızlı rehber başlat.')} style={{ width: 260, marginRight: 12 }}>
                <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Heart size={18} color={'#ef4444'} style={{ marginRight: 8 }} />
                    <Text style={{ fontWeight: '700', color: '#0f172a' }}>CPR Hızlı Rehber</Text>
                  </View>
                  <Text style={{ color: '#334155' }}>Uygulamalı örneklerle pratik odaklı bir akış.</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Timer size={14} color={'#64748b'} style={{ marginRight: 6 }} />
                    <Text style={{ color: '#64748b', fontSize: 12 }}>15 dk • Orta</Text>
                  </View>
                </View>
              </Pressable>
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <ChatInterface
              messages={activeChat?.messages || []}
              scrollViewRef={chatScrollRef}
              isLoading={isLoading}
            />
            <ChatInput
              ref={inputRef}
              scrollViewRef={chatScrollRef}
              input={input}
              onChangeText={setInput}
              focusOnMount={false}
              onSubmit={handleSend}
            />
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
}

// Drawer ekranlarının headerRight'ına 112 butonu ekle
const headerRight112 = () => (
  <Pressable
    onPress={() => {
      if (typeof window !== 'undefined') {
        window.open('tel:112');
      } else {
        require('react-native').Linking.openURL('tel:112');
      }
    }}
    style={{ marginRight: 10 }}
    accessibilityLabel="112 Acil Çağrı"
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#d32f2f', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
      <Phone size={18} color={'#fff'} style={{ marginRight: 4 }} />
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>112</Text>
    </View>
  </Pressable>
);

export default function Layout() {
  return (
    <Providers>
      <Drawer.Navigator
        id={undefined}
        initialRouteName="Welcome"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: true, headerRight: headerRight112, headerTitleAlign: 'center' }}
      >
        <Drawer.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'İlk Yardım Modu', headerTitle: 'İlk Yardım Modu' }} />
        <Drawer.Screen name="FirstAidChat" component={FirstAidChatScreen} options={{ title: 'Sohbet', headerTitle: 'İlk Yardım Modu' }} />
        <Drawer.Screen name="EgitimModu" component={EgitimModuScreen} options={{ title: 'Eğitim Modu', headerTitle: 'Eğitim Modu' }} />
      </Drawer.Navigator>
    </Providers>
  );
}
