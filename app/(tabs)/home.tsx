import React from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { AIProduct } from '@/types';

const HomeScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const renderItem = ({ item }: { item: AIProduct }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/product/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace de IAs</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: isSmallScreen ? 12 : 16,
  },
  list: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
  },
});

export default HomeScreen;