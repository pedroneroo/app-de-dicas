import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

// ---------------------------------------------------------------------------
// DicaPro — App demonstrativo de modelo FREEMIUM (Aula 05 - Prog. Disp. Móveis II)
//
// Conceitos aplicados dos slides:
// - Estratégia Freemium: funcionalidades essenciais grátis + Paywall
// - Monetização via AdMob simulado (Banner Ads + Rewarded Ads)
// - Compra In-App simulada (item não-consumível: "remover limite / virar Pro")
// - WebView para conteúdo legal/estático (aba "Ajuda")
// ---------------------------------------------------------------------------

const TIPS = [
  'Divida tarefas grandes em blocos de 25 minutos (Técnica Pomodoro).',
  'Escreva as 3 prioridades do dia antes de abrir qualquer rede social.',
  'Revise seu código em voz alta antes de dar commit.',
  'Beba um copo de água ao acordar, antes do café.',
  'Feche todas as abas do navegador que não usou nas últimas 2 horas.',
  'Estude por 20 minutos algo fora da sua área de conforto.',
  'Anote 1 coisa que deu certo hoje antes de dormir.',
  'Automatize uma tarefa repetitiva com um script simples.',
  'Faça uma pausa de 5 minutos longe da tela a cada 1 hora.',
  'Leia a documentação oficial antes de copiar código da internet.',
  'Organize seus arquivos em pastas com nomes claros hoje mesmo.',
  'Pratique explicar um conceito técnico para alguém leigo.',
  'Faça backup do seu projeto antes de testar algo arriscado.',
  'Durma pelo menos 7 horas — código ruim nasce de sono ruim.',
  'Comente o "porquê" no código, não o "o quê".',
];

const FREE_DAILY_LIMIT = 3;
const MAX_REWARDED_UNLOCKS = 2;

export default function App() {
  const [tab, setTab] = useState('home'); // 'home' | 'webview'
  const [isPro, setIsPro] = useState(false);
  const [rewardedUnlocks, setRewardedUnlocks] = useState(0);
  const [loadingAd, setLoadingAd] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const visibleLimit = isPro
    ? TIPS.length
    : FREE_DAILY_LIMIT + rewardedUnlocks;

  const tipsToShow = TIPS.slice(0, visibleLimit);
  const lockedCount = TIPS.length - tipsToShow.length;

  // Simula um Rewarded Ad (vídeo recompensado) do Google AdMob.
  // Na vida real aqui entraria o SDK do AdMob (RewardedAd.load / show).
  function handleWatchRewardedAd() {
    if (rewardedUnlocks >= MAX_REWARDED_UNLOCKS) {
      Alert.alert('Limite atingido', 'Você já assistiu o máximo de anúncios de hoje. Vire Pro para dicas ilimitadas!');
      return;
    }
    setLoadingAd(true);
    setTimeout(() => {
      setLoadingAd(false);
      setRewardedUnlocks((n) => n + 1);
      Alert.alert('Recompensa liberada! 🎉', 'Você desbloqueou +1 dica por hoje.');
    }, 1800); // simula o tempo de exibição do vídeo
  }

  // Simula uma compra In-App não-consumível ("remover limite / virar Pro").
  // Na vida real aqui entraria expo-in-app-purchases ou react-native-iap
  // + validação do recibo (Receipt Validation) no servidor.
  function handleBuyPro() {
    Alert.alert(
      'Assinar DicaPro Ilimitado',
      'R$ 9,90/mês — dicas ilimitadas, sem anúncios.\n(Compra simulada para fins didáticos)',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: () => {
            setPurchasing(true);
            setTimeout(() => {
              setPurchasing(false);
              setIsPro(true);
              Alert.alert('Parabéns! 🚀', 'Você agora é DicaPro. Aproveite as dicas ilimitadas.');
            }, 1200);
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>DicaPro</Text>
        <View style={[styles.badge, isPro ? styles.badgePro : styles.badgeFree]}>
          <Text style={styles.badgeText}>{isPro ? 'PRO' : 'FREE'}</Text>
        </View>
      </View>

      {tab === 'home' ? (
        <HomeScreen
          tipsToShow={tipsToShow}
          lockedCount={lockedCount}
          isPro={isPro}
          loadingAd={loadingAd}
          purchasing={purchasing}
          rewardedUnlocks={rewardedUnlocks}
          onWatchAd={handleWatchRewardedAd}
          onBuyPro={handleBuyPro}
        />
      ) : (
        <PortalScreen />
      )}

      <View style={styles.tabBar}>
        <TabButton label="🏠 Dicas" active={tab === 'home'} onPress={() => setTab('home')} />
        <TabButton label="🌐 Ajuda / Portal" active={tab === 'webview'} onPress={() => setTab('webview')} />
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function HomeScreen({
  tipsToShow,
  lockedCount,
  isPro,
  loadingAd,
  purchasing,
  rewardedUnlocks,
  onWatchAd,
  onBuyPro,
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Dicas de hoje</Text>
      <Text style={styles.sectionSubtitle}>
        {isPro
          ? 'Acesso ilimitado ativado ✅'
          : `Plano gratuito: ${tipsToShow.length} dica(s) liberada(s) hoje.`}
      </Text>

      {tipsToShow.map((tip, i) => (
        <View key={i} style={styles.tipCard}>
          <Text style={styles.tipNumber}>{i + 1}</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}

      {!isPro && lockedCount > 0 && (
        <View style={styles.paywall}>
          <Text style={styles.paywallTitle}>🔒 +{lockedCount} dicas bloqueadas</Text>
          <Text style={styles.paywallText}>
            Assista a um vídeo recompensado para liberar mais uma dica, ou vire Pro e desbloqueie tudo, para sempre.
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onWatchAd}
            disabled={loadingAd || rewardedUnlocks >= MAX_REWARDED_UNLOCKS}
          >
            {loadingAd ? (
              <ActivityIndicator color="#1DB954" />
            ) : (
              <Text style={styles.secondaryButtonText}>
                ▶️ Assistir anúncio (+1 dica) — {MAX_REWARDED_UNLOCKS - rewardedUnlocks} restantes hoje
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={onBuyPro} disabled={purchasing}>
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>⭐ Virar DicaPro — R$ 9,90/mês</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Banner Ad simulado — só aparece para usuários free, como no AdMob real */}
      {!isPro && (
        <View style={styles.bannerAd}>
          <Text style={styles.bannerAdText}>Espaço reservado para Banner Ad (Google AdMob)</Text>
        </View>
      )}
    </ScrollView>
  );
}

function PortalScreen() {
  const [loading, setLoading] = useState(true);
  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.webviewLoading}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={{ marginTop: 8, color: '#666' }}>Carregando portal...</Text>
        </View>
      )}
      <WebView
        source={{ uri: 'https://www.ifms.edu.br' }}
        style={{ flex: 1 }}
        startInLoadingState
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => {
          console.log('URL atual:', navState.url);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeFree: { backgroundColor: '#e5e5e5' },
  badgePro: { backgroundColor: '#1DB954' },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#333' },

  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#666', marginBottom: 16 },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#f7f9f7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#eef1ee',
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1DB954',
    marginRight: 10,
    width: 20,
  },
  tipText: { flex: 1, fontSize: 14, color: '#222', lineHeight: 20 },

  paywall: {
    marginTop: 10,
    backgroundColor: '#fff8e6',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#f5e2a8',
  },
  paywallTitle: { fontSize: 16, fontWeight: '800', color: '#5c4a00', marginBottom: 6 },
  paywallText: { fontSize: 13, color: '#6b5a1c', marginBottom: 14, lineHeight: 18 },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: '#1DB954',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  secondaryButtonText: { color: '#1DB954', fontWeight: '700', fontSize: 13 },

  primaryButton: {
    backgroundColor: '#1DB954',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  bannerAd: {
    marginTop: 20,
    height: 60,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  bannerAdText: { fontSize: 11, color: '#999' },

  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabButtonActive: { borderTopWidth: 2, borderTopColor: '#1DB954' },
  tabButtonText: { fontSize: 13, color: '#888', fontWeight: '600' },
  tabButtonTextActive: { color: '#1DB954' },

  webviewLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
});
