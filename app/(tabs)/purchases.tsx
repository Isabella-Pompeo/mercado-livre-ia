import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Download, MessageCircle, Star, ShieldCheck, Calendar, CreditCard } from 'lucide-react-native';

interface Purchase {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerName: string;
  price: number;
  purchaseDate: string;
  status: 'completed' | 'pending_support' | 'disputed';
  hasSupport: boolean;
  isRated: boolean;
  rating?: number;
  tutorial?: string;
}

const MOCK_PURCHASES: Purchase[] = [
  {
    id: '1',
    productId: '1',
    productTitle: 'Fluxo de Automação para WhatsApp Business',
    productImage: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=150',
    sellerName: 'Tech Solutions',
    price: 297,
    purchaseDate: '2024-01-20',
    status: 'completed',
    hasSupport: true,
    isRated: true,
    rating: 5,
    tutorial: 'https://example.com/tutorial-whatsapp.pdf',
  },
  {
    id: '2',
    productId: '2',
    productTitle: 'IA para Análise de Dados de Vendas',
    productImage: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=150',
    sellerName: 'AI Analytics Pro',
    price: 497,
    purchaseDate: '2024-01-18',
    status: 'pending_support',
    hasSupport: false,
    isRated: false,
  },
  {
    id: '3',
    productId: '3',
    productTitle: 'Template de Funil de Vendas Completo',
    productImage: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=150',
    sellerName: 'Marketing Digital Pro',
    price: 197,
    purchaseDate: '2024-01-15',
    status: 'completed',
    hasSupport: true,
    isRated: false,
    tutorial: 'https://example.com/tutorial-funil.pdf',
  },
];

export default function PurchasesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);

  if (!user) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Package size={48} color="#CCCCCC" />
        <Text style={styles.unauthorizedTitle}>Acesso Restrito</Text>
        <Text style={styles.unauthorizedDescription}>
          Faça login para ver suas compras e acessar os produtos adquiridos.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDownload = (purchase: Purchase) => {
    if (purchase.tutorial) {
      Alert.alert(
        'Download do Tutorial',
        `Baixando tutorial de "${purchase.productTitle}"...`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Tutorial Indisponível',
        'O tutorial ainda não foi disponibilizado pelo vendedor.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleContactSupport = (purchase: Purchase) => {
    router.push(`/chat?sellerId=${purchase.productId}&productTitle=${purchase.productTitle}`);
  };

  const handleRate = (purchase: Purchase) => {
    Alert.alert(
      'Avaliar Produto',
      `Que nota você dá para "${purchase.productTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: '⭐', onPress: () => ratePurchase(purchase.id, 1) },
        { text: '⭐⭐', onPress: () => ratePurchase(purchase.id, 2) },
        { text: '⭐⭐⭐', onPress: () => ratePurchase(purchase.id, 3) },
        { text: '⭐⭐⭐⭐', onPress: () => ratePurchase(purchase.id, 4) },
        { text: '⭐⭐⭐⭐⭐', onPress: () => ratePurchase(purchase.id, 5) },
      ]
    );
  };

  const ratePurchase = (purchaseId: string, rating: number) => {
    setPurchases(prev =>
      prev.map(purchase =>
        purchase.id === purchaseId
          ? { ...purchase, isRated: true, rating }
          : purchase
      )
    );
    Alert.alert('Obrigado!', 'Sua avaliação foi registrada com sucesso.');
  };

  const confirmService = (purchaseId: string) => {
    Alert.alert(
      'Confirmar Implantação',
      'Confirma que o serviço foi implantado com sucesso? O pagamento será liberado para o vendedor.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setPurchases(prev =>
              prev.map(purchase =>
                purchase.id === purchaseId
                  ? { ...purchase, status: 'completed' }
                  : purchase
              )
            );
            Alert.alert('Confirmado!', 'Pagamento liberado para o vendedor.');
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#28A745';
      case 'pending_support':
        return '#FFC107';
      case 'disputed':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending_support':
        return 'Aguardando Suporte';
      case 'disputed':
        return 'Em Disputa';
      default:
        return 'Status Desconhecido';
    }
  };

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3483FA', '#FF6900']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Minhas Compras</Text>
        <Text style={styles.headerSubtitle}>
          {purchases.length} produto{purchases.length !== 1 ? 's' : ''} adquirido{purchases.length !== 1 ? 's' : ''}
        </Text>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <CreditCard size={24} color="#3483FA" />
          <Text style={styles.statValue}>{formatPrice(totalSpent)}</Text>
          <Text style={styles.statLabel}>Total Investido</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ShieldCheck size={24} color="#28A745" />
          <Text style={styles.statValue}>
            {purchases.filter(p => p.status === 'completed').length}
          </Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {purchases.map((purchase) => (
          <View key={purchase.id} style={styles.purchaseCard}>
            <View style={styles.purchaseHeader}>
              <Image source={{ uri: purchase.productImage }} style={styles.productImage} />
              <View style={styles.purchaseInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {purchase.productTitle}
                </Text>
                <Text style={styles.sellerName}>por {purchase.sellerName}</Text>
                <View style={styles.purchaseMeta}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>
                      {formatPrice(purchase.price)}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(purchase.status) }]}>
                      <Text style={styles.statusText}>
                        {getStatusText(purchase.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dateContainer}>
                    <Calendar size={12} color="#999999" />
                    <Text style={styles.purchaseDate}>
                      {formatDate(purchase.purchaseDate)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.purchaseActions}>
              {purchase.tutorial && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDownload(purchase)}
                >
                  <Download size={16} color="#3483FA" />
                  <Text style={styles.actionButtonText}>Tutorial</Text>
                </TouchableOpacity>
              )}

              {purchase.status === 'pending_support' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.supportButton]}
                  onPress={() => handleContactSupport(purchase)}
                >
                  <MessageCircle size={16} color="#FFFFFF" />
                  <Text style={[styles.actionButtonText, styles.supportButtonText]}>
                    Solicitar Suporte
                  </Text>
                </TouchableOpacity>
              )}

              {purchase.status === 'pending_support' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.confirmButton]}
                  onPress={() => confirmService(purchase.id)}
                >
                  <ShieldCheck size={16} color="#FFFFFF" />
                  <Text style={[styles.actionButtonText, styles.confirmButtonText]}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              )}

              {purchase.status === 'completed' && !purchase.isRated && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRate(purchase)}
                >
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.actionButtonText}>Avaliar</Text>
                </TouchableOpacity>
              )}

              {purchase.isRated && (
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>
                    Avaliado: {purchase.rating}/5
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {purchases.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>Nenhuma compra encontrada</Text>
            <Text style={styles.emptyDescription}>
              Explore nosso catálogo e encontre a automação perfeita para você!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Text style={styles.exploreButtonText}>Explorar Produtos</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -12,
    borderRadius: 12,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E9ECEF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  purchaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  purchaseInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 4,
    lineHeight: 22,
  },
  sellerName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  purchaseMeta: {
    gap: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF6900',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    marginLeft: 4,
  },
  purchaseActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3483FA',
    backgroundColor: 'transparent',
  },
  supportButton: {
    backgroundColor: '#FF6900',
    borderColor: '#FF6900',
  },
  confirmButton: {
    backgroundColor: '#28A745',
    borderColor: '#28A745',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3483FA',
    marginLeft: 4,
  },
  supportButtonText: {
    color: '#FFFFFF',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#3483FA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  unauthorizedContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  unauthorizedDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#3483FA',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});