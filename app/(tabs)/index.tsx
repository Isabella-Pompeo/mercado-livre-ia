import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, ShieldCheck, Eye } from 'lucide-react-native';

export default function HomeScreen() {
  const { featuredProducts, categories } = useProducts();
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderProductCard = (product: any, index: number) => (
    <TouchableOpacity
      key={product.id}
      style={[styles.productCard, index === 0 && styles.firstCard]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <Image source={{ uri: product.images[0] }} style={styles.productImage} />
      {product.isVerified && (
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={12} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.productPrice}>
          {formatPrice(product.price)}
        </Text>
        <View style={styles.productMeta}>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviewCount})
            </Text>
          </View>
        </View>
        <Text style={styles.sellerName}>{product.sellerName}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryCard = (category: string, index: number) => (
    <TouchableOpacity
      key={category}
      style={styles.categoryCard}
      onPress={() => router.push(`/search?category=${encodeURIComponent(category)}`)}
    >
      <LinearGradient
        colors={['#3483FA', '#FF6900']}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.categoryText}>{category}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#3483FA', '#FF6900']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              {user ? `Olá, ${user.name.split(' ')[0]}!` : 'Bem-vindo!'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Descubra as melhores automações digitais
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/search')}
      >
        <Text style={styles.searchPlaceholder}>
          Buscar automações, chatbots, templates...
        </Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.slice(0, 6).map(renderCategoryCard)}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
        >
          {featuredProducts.map(renderProductCard)}
        </ScrollView>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <LinearGradient
          colors={['#F8F9FA', '#FFFFFF']}
          style={styles.statsContainer}
        >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Automações</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Vendedores</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5000+</Text>
            <Text style={styles.statLabel}>Clientes</Text>
          </View>
        </LinearGradient>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <LinearGradient
          colors={['#3483FA', '#FF6900']}
          style={styles.ctaContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.ctaTitle}>Comece a vender hoje!</Text>
          <Text style={styles.ctaSubtitle}>
            Transforme seu conhecimento em renda extra
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => user ? router.push('/sell') : router.push('/auth/register')}
          >
            <Text style={styles.ctaButtonText}>Começar a Vender</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
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
  searchBar: {
    marginHorizontal: 24,
    marginTop: -12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333333',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3483FA',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: 120,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  productsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  productCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  firstCard: {
    marginLeft: 4,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F0F0F0',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#28A745',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF6900',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  sellerName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  statsSection: {
    marginTop: 32,
    marginHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#3483FA',
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
  ctaSection: {
    margin: 24,
    marginBottom: 40,
  },
  ctaContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  ctaButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3483FA',
  },
});