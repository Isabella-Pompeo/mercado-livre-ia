import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { AIProduct } from '@/types';
import { Package } from 'lucide-react-native';

export default function PurchasesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  // Por enquanto, estamos usando a lista completa de produtos como se fossem as compras.
  // Em um app real, isso viria de uma API baseada no usuário logado.
  const purchasedProducts: AIProduct[] = products;

  const renderItem = ({ item }: { item: AIProduct }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/product/${item.id}`)}
    />
  );

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

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
        Minhas IAs
      </Text>
      <FlatList
        data={purchasedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, isSmallScreen && styles.listSmall]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  titleSmall: {
    fontSize: 20,
    marginVertical: 12,
  },
  list: {
    paddingHorizontal: 16,
  },
  listSmall: {
    paddingHorizontal: 12,
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
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  unauthorizedDescription: {
    fontSize: 16,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});