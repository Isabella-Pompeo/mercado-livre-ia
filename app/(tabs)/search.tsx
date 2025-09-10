import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, FlatList, useWindowDimensions } from 'react-native';
import { useProducts } from '@/contexts/ProductContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, Filter, Star, ShieldCheck } from 'lucide-react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { products, categories, searchProducts, getProductsByCategory } = useProducts();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as string);
      setFilteredProducts(getProductsByCategory(params.category as string));
    } else {
      setFilteredProducts(products);
    }
  }, [params, products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchProducts(query);
      setFilteredProducts(results);
    } else if (selectedCategory) {
      setFilteredProducts(getProductsByCategory(selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredProducts(getProductsByCategory(category));
    } else {
      setFilteredProducts(searchQuery ? searchProducts(searchQuery) : products);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      {item.isVerified && (
        <View style={styles.verifiedBadge}>
          <ShieldCheck size={12} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.productMeta}>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviewCount})
            </Text>
          </View>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>
            {formatPrice(item.price)}
          </Text>
          <Text style={styles.sellerName}>{item.sellerName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isSmallScreen && styles.headerSmall]}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, isSmallScreen && styles.searchInputContainerSmall]}>
            <SearchIcon size={isSmallScreen ? 16 : 20} color="#999999" style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, isSmallScreen && styles.searchInputSmall]}
              placeholder="Buscar automações, chatbots..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#999999"
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, isSmallScreen && styles.filterButtonSmall]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={isSmallScreen ? 16 : 20} color="#3483FA" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Filter */}
      {showFilters && (
        <View style={[styles.filtersContainer, isSmallScreen && styles.filtersContainerSmall]}>
          <Text style={[styles.filtersTitle, isSmallScreen && styles.filtersTitleSmall]}>Categorias</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoriesFilter, isSmallScreen && styles.categoriesFilterSmall]}
          >
            <TouchableOpacity
              style={[
                styles.categoryFilterButton,
                !selectedCategory && styles.categoryFilterButtonActive,
                isSmallScreen && styles.categoryFilterButtonSmall
              ]}
              onPress={() => handleCategorySelect('')}
            >
              <Text style={[
                styles.categoryFilterText,
                !selectedCategory && styles.categoryFilterTextActive,
                isSmallScreen && styles.categoryFilterTextSmall
              ]}>
                Todas
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryFilterButton,
                  selectedCategory === category && styles.categoryFilterButtonActive,
                  isSmallScreen && styles.categoryFilterButtonSmall
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={[
                  styles.categoryFilterText,
                  selectedCategory === category && styles.categoryFilterTextActive,
                  isSmallScreen && styles.categoryFilterTextSmall
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Results Header */}
      <View style={[styles.resultsHeader, isSmallScreen && styles.resultsHeaderSmall]}>
        <Text style={[styles.resultsCount, isSmallScreen && styles.resultsCountSmall]}>
          {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </Text>
        {selectedCategory && (
          <TouchableOpacity onPress={() => handleCategorySelect('')}>
            <Text style={[styles.clearFilters, isSmallScreen && styles.clearFiltersSmall]}>Limpar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        style={styles.productsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.productsListContent, isSmallScreen && styles.productsListContentSmall]}
        ItemSeparatorComponent={() => <View style={[styles.productSeparator, isSmallScreen && styles.productSeparatorSmall]} />}
      />

      {filteredProducts.length === 0 && (
        <View style={[styles.emptyState, isSmallScreen && styles.emptyStateSmall]}>
          <Text style={[styles.emptyStateTitle, isSmallScreen && styles.emptyStateTitleSmall]}>Nenhum resultado encontrado</Text>
          <Text style={[styles.emptyStateDescription, isSmallScreen && styles.emptyStateDescriptionSmall]}>
            Tente buscar com outras palavras-chave ou explore as categorias disponíveis.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerSmall: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInputContainerSmall: {
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  searchInputSmall: {
    fontSize: 14,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonSmall: {
    width: 42,
    height: 42,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  filtersContainerSmall: {
    paddingVertical: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  filtersTitleSmall: {
    fontSize: 14,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  categoriesFilter: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoriesFilterSmall: {
    paddingHorizontal: 16,
    gap: 6,
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  categoryFilterButtonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryFilterButtonActive: {
    backgroundColor: '#3483FA',
    borderColor: '#3483FA',
  },
  categoryFilterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  categoryFilterTextSmall: {
    fontSize: 12,
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  clearFilters: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3483FA',
  },
  productsList: {
    flex: 1,
  },
  productsListContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    left: 64,
    backgroundColor: '#28A745',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 4,
    lineHeight: 22,
  },
  productDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  category: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#3483FA',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FF6900',
  },
  sellerName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  productSeparator: {
    height: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});