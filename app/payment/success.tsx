import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, ArrowLeft, Download } from 'lucide-react-native';

export default function PaymentSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#28A745', '#34A853']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)')}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pagamento Aprovado</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.successCard}>
          <View style={styles.iconContainer}>
            <CheckCircle size={64} color="#28A745" />
          </View>
          
          <Text style={styles.successTitle}>Pagamento Realizado!</Text>
          <Text style={styles.successDescription}>
            Seu pagamento foi processado com sucesso. O produto já está disponível em sua conta.
          </Text>

          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Produto:</Text>
              <Text style={styles.detailValue}>IA de Automação WhatsApp</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Valor:</Text>
              <Text style={styles.detailValue}>R$ 297,00</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Código:</Text>
              <Text style={styles.detailValue}>#MLIA-2024-001</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data:</Text>
              <Text style={styles.detailValue}>{new Date().toLocaleDateString('pt-BR')}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color="#FFFFFF" />
            <Text style={styles.downloadButtonText}>Baixar Produto</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.homeButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Precisa de ajuda?</Text>
          <Text style={styles.supportDescription}>
            Entre em contato com nosso suporte em suporte@mercadolivreai.com
          </Text>
        </View>
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
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#28A745',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  orderDetails: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3483FA',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    gap: 8,
    width: '100%',
  },
  downloadButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  homeButton: {
    width: '100%',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#3483FA',
    borderRadius: 28,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3483FA',
  },
  supportSection: {
    marginTop: 32,
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1976D2',
    marginBottom: 8,
  },
  supportDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1976D2',
    lineHeight: 20,
  },
});