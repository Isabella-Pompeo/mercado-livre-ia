import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CreditCard, DollarSign, Smartphone, CheckCircle, Plus } from 'lucide-react-native';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedMethod, setSelectedMethod] = useState('mercado-pago');

  const paymentMethods = [
    {
      id: 'mercado-pago',
      name: 'Mercado Pago',
      icon: DollarSign,
      description: 'Pagamento rápido e seguro',
      color: '#009EE3',
    },
    {
      id: 'credit-card',
      name: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Parcelamento em até 12x',
      color: '#FF6900',
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: Smartphone,
      description: 'Pagamento instantâneo',
      color: '#32BCAD',
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleContinue = () => {
    if (selectedMethod === 'mercado-pago') {
      Alert.alert(
        'Mercado Pago',
        'Você será redirecionado para o Mercado Pago para finalizar o pagamento.',
        [
          {
            text: 'Continuar',
            onPress: () => router.push('/payment/checkout'),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          }
        ]
      );
    } else {
      router.push('/payment/checkout');
    }
  };

  const isSmallScreen = width < 375;

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
          <Text style={[styles.headerTitle, isSmallScreen && styles.headerTitleSmall]}>Formas de Pagamento</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleSmall]}>Resumo do Pedido</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderItem}>
              <Text style={[styles.orderLabel, isSmallScreen && styles.orderLabelSmall]}>Produto:</Text>
              <Text style={[styles.orderValue, isSmallScreen && styles.orderValueSmall]}>IA de Automação WhatsApp</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={[styles.orderLabel, isSmallScreen && styles.orderLabelSmall]}>Vendedor:</Text>
              <Text style={[styles.orderValue, isSmallScreen && styles.orderValueSmall]}>Tech Solutions</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={[styles.orderLabel, isSmallScreen && styles.orderLabelSmall]}>Preço:</Text>
              <Text style={[styles.orderPrice, isSmallScreen && styles.orderPriceSmall]}>R$ 297,00</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isSmallScreen && styles.sectionTitleSmall]}>Selecione a Forma de Pagamento</Text>
          
          {paymentMethods.map((method) => {
            const IconComponent = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                  { borderLeftColor: method.color }
                ]}
                onPress={() => handleMethodSelect(method.id)}
              >
                <View style={styles.methodContent}>
                  <View style={styles.methodLeft}>
                    <View style={[styles.methodIcon, { backgroundColor: `${method.color}20` }]}>
                      <IconComponent size={isSmallScreen ? 20 : 24} color={method.color} />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={[styles.methodName, isSmallScreen && styles.methodNameSmall]}>{method.name}</Text>
                      <Text style={[styles.methodDescription, isSmallScreen && styles.methodDescriptionSmall]}>{method.description}</Text>
                    </View>
                  </View>
                  
                  {isSelected && (
                    <CheckCircle size={isSmallScreen ? 20 : 24} color="#28A745" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Add New Card Option */}
          <TouchableOpacity style={styles.addCardButton}>
            <Plus size={isSmallScreen ? 18 : 20} color="#3483FA" />
            <Text style={[styles.addCardText, isSmallScreen && styles.addCardTextSmall]}>Adicionar novo cartão</Text>
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={styles.securityCard}>
          <CheckCircle size={isSmallScreen ? 18 : 20} color="#28A745" />
          <View style={styles.securityText}>
            <Text style={[styles.securityTitle, isSmallScreen && styles.securityTitleSmall]}>Compra Segura</Text>
            <Text style={[styles.securityDescription, isSmallScreen && styles.securityDescriptionSmall]}>
              Seus dados estão protegidos e sua compra é garantida pela nossa política de satisfação.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={[styles.continueButtonText, isSmallScreen && styles.continueButtonTextSmall]}>Continuar</Text>
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
  headerTitleSmall: {
    fontSize: 20,
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
  sectionTitleSmall: {
    fontSize: 16,
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
  orderLabelSmall: {
    fontSize: 12,
  },
  orderValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
  },
  orderValueSmall: {
    fontSize: 12,
  },
  orderPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FF6900',
  },
  orderPriceSmall: {
    fontSize: 14,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#009EE3',
  },
  methodCardSelected: {
    borderWidth: 2,
    borderColor: '#3483FA',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  methodNameSmall: {
    fontSize: 14,
  },
  methodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  methodDescriptionSmall: {
    fontSize: 12,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  addCardText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3483FA',
    marginLeft: 12,
  },
  addCardTextSmall: {
    fontSize: 14,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
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
  securityTitleSmall: {
    fontSize: 14,
  },
  securityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#28A745',
  },
  securityDescriptionSmall: {
    fontSize: 12,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  continueButton: {
    backgroundColor: '#3483FA',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  continueButtonTextSmall: {
    fontSize: 16,
  },
});