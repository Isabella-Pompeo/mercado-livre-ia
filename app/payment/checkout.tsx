import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const product = {
    id: '1',
    name: 'IA de Automação WhatsApp',
    price: 297.00,
    seller: 'Tech Solutions',
  };

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (match) {
      return match.slice(1).filter(Boolean).join(' ');
    }
    return value;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handlePayment = () => {
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      Alert.alert('Erro', 'Preencha todos os dados do cartão');
      return;
    }

    Alert.alert(
      'Pagamento Processado',
      `Pagamento de R$ ${product.price.toFixed(2)} realizado com sucesso!`,
      [
        {
          text: 'OK',
          onPress: () => router.push('/payment/success'),
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3483FA', '#FF6900']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finalizar Compra</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderItem}>
              <Text style={styles.orderLabel}>Produto:</Text>
              <Text style={styles.orderValue}>{product.name}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderLabel}>Vendedor:</Text>
              <Text style={styles.orderValue}>{product.seller}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderLabel}>Preço:</Text>
              <Text style={styles.orderPrice}>R$ {product.price.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do Cartão</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número do Cartão</Text>
            <View style={styles.inputContainer}>
              <CreditCard size={20} color="#666666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formatCardNumber(cardData.number)}
                onChangeText={(value) => handleInputChange('number', value.replace(/\D/g, ''))}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome no Cartão</Text>
            <TextInput
              style={styles.input}
              value={cardData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Como está no cartão"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Validade</Text>
              <TextInput
                style={styles.input}
                value={cardData.expiry}
                onChangeText={(value) => handleInputChange('expiry', formatExpiry(value))}
                placeholder="MM/AA"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cardData.cvv}
                onChangeText={(value) => handleInputChange('cvv', value.replace(/\D/g, ''))}
                placeholder="000"
                placeholderTextColor="#999999"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securityCard}>
          <Lock size={20} color="#28A745" />
          <View style={styles.securityText}>
            <Text style={styles.securityTitle}>Pagamento Seguro</Text>
            <Text style={styles.securityDescription}>
              Seus dados estão protegidos com criptografia SSL de 256 bits
            </Text>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.terms}>
          <Text style={styles.termsText}>
            Ao finalizar a compra, você concorda com nossos{' '}
            <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termsLink}>Política de Privacidade</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>R$ {product.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <CheckCircle size={20} color="#FFFFFF" />
          <Text style={styles.payButtonText}>Pagar Agora</Text>
        </TouchableOpacity>
      </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  orderValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
  },
  orderPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF6900',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    paddingVertical: 16,
  },
  row: {
    flexDirection: 'row',
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  securityText: {
    marginLeft: 12,
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#28A745',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#28A745',
  },
  terms: {
    marginBottom: 32,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#3483FA',
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FF6900',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    borderRadius: 28,
    paddingVertical: 16,
    gap: 8,
  },
  payButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});