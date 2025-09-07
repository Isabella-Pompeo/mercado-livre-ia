import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sellerId: string;
  sellerName: string;
  images: string[];
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  license: 'personal' | 'commercial' | 'unlimited';
  tags: string[];
  createdAt: string;
}

interface ProductContextType {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Fluxo de Automação para WhatsApp Business',
    description: 'Sistema completo de automação para WhatsApp Business com chatbot integrado, respostas automáticas e gestão de leads.',
    price: 297,
    category: 'Automação WhatsApp',
    sellerId: '1',
    sellerName: 'Tech Solutions',
    images: [
      'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    videoUrl: 'https://example.com/demo-video',
    rating: 4.8,
    reviewCount: 124,
    isVerified: true,
    license: 'commercial',
    tags: ['WhatsApp', 'Chatbot', 'Automação', 'Leads'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'IA para Análise de Dados de Vendas',
    description: 'Sistema de inteligência artificial que analisa dados de vendas e gera relatórios automáticos com insights valiosos.',
    price: 497,
    category: 'Inteligência Artificial',
    sellerId: '2',
    sellerName: 'AI Analytics Pro',
    images: [
      'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 4.9,
    reviewCount: 89,
    isVerified: true,
    license: 'unlimited',
    tags: ['IA', 'Dados', 'Analytics', 'Vendas'],
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Template de Funil de Vendas Completo',
    description: 'Template profissional de funil de vendas com páginas de captura, e-mails de sequência e checkout otimizado.',
    price: 197,
    category: 'Templates Marketing',
    sellerId: '3',
    sellerName: 'Marketing Digital Pro',
    images: [
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    rating: 4.6,
    reviewCount: 156,
    isVerified: true,
    license: 'personal',
    tags: ['Funil', 'Marketing', 'Template', 'Conversão'],
    createdAt: '2024-01-08',
  },
];

const CATEGORIES = [
  'Automação WhatsApp',
  'Inteligência Artificial', 
  'Templates Marketing',
  'Chatbots',
  'E-commerce',
  'CRM Automação',
  'Social Media',
  'Email Marketing'
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Produtos em destaque são os com melhor avaliação
    const featured = products.filter(p => p.rating >= 4.7).slice(0, 5);
    setFeaturedProducts(featured);
  }, [products]);

  const searchProducts = (query: string): Product[] => {
    if (!query) return products;
    
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getProductsByCategory = (category: string): Product[] => {
    return products.filter(product => product.category === category);
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  return (
    <ProductContext.Provider value={{
      products,
      featuredProducts,
      categories: CATEGORIES,
      searchProducts,
      getProductsByCategory,
      getProductById,
      addProduct,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};