import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, useWindowDimensions } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, Camera, DollarSign, Tag, FileText, ShieldCheck, ArrowLeft } from 'lucide-react-native';

export default function SellScreen() {
  const { user } = useAuth();
  const { addProduct, categories } = useProducts();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    license: 'personal' as 'personal' | 'commercial' | 'unlimited',
    tags: '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedTitle}>Acesso Restrito</Text>
        <Text style={styles.unauthorizedDescription}>
          Você precisa estar logado para acessar a área de vendas.
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (!videoUrl) {
      Alert.alert('Erro', 'O vídeo de demonstração é obrigatório para verificação do produto');
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sellerId: user.id,
        sellerName: user.name,
        images: images.length > 0 ? images : ['https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400'],
        videoUrl: videoUrl,
        rating: 0,
        reviewCount: 0,
        isVerified: false, // Será verificado após análise do vídeo
        license: formData.license,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      addProduct(productData);
      
      Alert.alert(
        'Produto Enviado!',
        'Seu produto foi enviado para análise. Nosso time verificará o vídeo de demonstração e você será notificado quando estiver aprovado.',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                title: '',
                description: '',
                price: '',
                category: '',
                license: 'personal',
                tags: '',
              });
              setImages([]);
              setVideoUrl('');
              router.push('/(tabs)');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
    // Simulação de upload de imagem
    const mockImageUrl = 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400';
    setImages(prev => [...prev, mockImageUrl]);
    Alert.alert('Imagem Adicionada', 'Imagem adicionada com sucesso!');
  };

  const handleVideoUpload = () => {
    // Simulação de upload de vídeo
    setVideoUrl('https://example.com/demo-video');
    Alert.alert('Vídeo Adicionado', 'Vídeo de demonstração adicionado com sucesso! Este vídeo será analisado pela nossa equipe para verificação.');
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Anunciar Produto</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <ShieldCheck size={24} color="#3483FA" />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Verificação Obrigatória</Text>
            <Text style={styles.infoDescription}>
              Todo produto precisa de um vídeo demonstrativo para ser aprovado e publicado na plataforma.
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título do Produto *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            placeholder="Ex: Fluxo de Automação para WhatsApp Business"
            placeholderTextColor="#999999"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Descreva detalhadamente o que seu produto faz, como funciona e que problemas resolve..."
            placeholderTextColor="#999999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço (R$) *</Text>
          <View style={styles.priceInputContainer}>
            <DollarSign size={20} color="#666666" style={styles.priceIcon} />
            <TextInput
              style={[styles.input, styles.priceInput]}
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              placeholder="297.00"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoria *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryOptions}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    formData.category === category && styles.categoryOptionActive
                  ]}
                  onPress={() => handleInputChange('category', category)}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    formData.category === category && styles.categoryOptionTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* License Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Licença</Text>
          <View style={styles.licenseOptions}>
            {[
              { value: 'personal', label: 'Uso Pessoal' },
              { value: 'commercial', label: 'Uso Comercial' },
              { value: 'unlimited', label: 'Licença Ilimitada' },
            ].map((license) => (
              <TouchableOpacity
                key={license.value}
                style={[
                  styles.licenseOption,
                  formData.license === license.value && styles.licenseOptionActive
                ]}
                onPress={() => handleInputChange('license', license.value)}
              >
                <Text style={[
                  styles.licenseOptionText,
                  formData.license === license.value && styles.licenseOptionTextActive
                ]}>
                  {license.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={formData.tags}
            onChangeText={(value) => handleInputChange('tags', value)}
            placeholder="WhatsApp, Chatbot, Automação, Leads (separadas por vírgula)"
            placeholderTextColor="#999999"
          />
        </View>

        {/* Media Upload */}
        <View style={styles.mediaSection}>
          <Text style={styles.sectionTitle}>Mídia do Produto</Text>
          
          {/* Images */}
          <View style={styles.mediaGroup}>
            <Text style={styles.mediaLabel}>Imagens (Screenshots, Demonstrações)</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <Upload size={20} color="#3483FA" />
              <Text style={styles.uploadButtonText}>Adicionar Imagens</Text>
            </TouchableOpacity>
            {images.length > 0 && (
              <View style={styles.imagePreview}>
                {images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.previewImage} />
                ))}
              </View>
            )}
          </View>

          {/* Video */}
          <View style={styles.mediaGroup}>
            <Text style={styles.mediaLabel}>Vídeo de Demonstração *</Text>
            <Text style={styles.mediaDescription}>
              Grave um vídeo mostrando seu produto funcionando. Este vídeo é obrigatório para aprovação.
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton, videoUrl ? styles.uploadButtonSuccess : null]}
              onPress={handleVideoUpload}
            >
              <Camera size={20} color={videoUrl ? "#28A745" : "#3483FA"} />
              <Text style={[styles.uploadButtonText, videoUrl ? styles.uploadButtonSuccessText : null]}>
                {videoUrl ? 'Vídeo Adicionado' : 'Gravar Vídeo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Enviando...' : 'Enviar para Análise'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomNote}>
          <Text style={styles.bottomNoteText}>
            Após enviar, seu produto passará por uma análise de qualidade. Você será notificado quando estiver aprovado e publicado na plataforma.
          </Text>
        </View>
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
    fontSize: isSmallScreen ? 20 : 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingTop: isSmallScreen ? 20 : 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    marginBottom: isSmallScreen ? 24 : 32,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: isSmallScreen ? 14 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1976D2',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: isSmallScreen ? 12 : 14,
    fontFamily: 'Inter-Regular',
    color: '#1976D2',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: isSmallScreen ? 20 : 24,
  },
  label: {
    fontSize: isSmallScreen ? 14 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: isSmallScreen ? 6 : 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 12 : 16,
    fontSize: isSmallScreen ? 14 : 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  textArea: {
    height: isSmallScreen ? 100 : 120,
    textAlignVertical: 'top',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: isSmallScreen ? 12 : 16,
  },
  priceIcon: {
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  categoryOptions: {
    flexDirection: 'row',
    gap: isSmallScreen ? 6 : 8,
    paddingHorizontal: 4,
  },
  categoryOption: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 6 : 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  categoryOptionActive: {
    backgroundColor: '#3483FA',
    borderColor: '#3483FA',
  },
  categoryOptionText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  categoryOptionTextActive: {
    color: '#FFFFFF',
  },
  licenseOptions: {
    gap: isSmallScreen ? 6 : 8,
  },
  licenseOption: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  licenseOptionActive: {
    backgroundColor: '#3483FA',
    borderColor: '#3483FA',
  },
  licenseOptionText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
  },
  licenseOptionTextActive: {
    color: '#FFFFFF',
  },
  mediaSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: isSmallScreen ? 12 : 16,
  },
  mediaGroup: {
    marginBottom: isSmallScreen ? 16 : 20,
  },
  mediaLabel: {
    fontSize: isSmallScreen ? 14 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 4,
  },
  mediaDescription: {
    fontSize: isSmallScreen ? 12 : 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: isSmallScreen ? 8 : 12,
    lineHeight: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3483FA',
    borderStyle: 'dashed',
    paddingVertical: isSmallScreen ? 12 : 16,
    paddingHorizontal: isSmallScreen ? 20 : 24,
  },
  uploadButtonSuccess: {
    borderColor: '#28A745',
    borderStyle: 'solid',
  },
  uploadButtonText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3483FA',
    marginLeft: 8,
  },
  uploadButtonSuccessText: {
    color: '#28A745',
  },
  imagePreview: {
    flexDirection: 'row',
    marginTop: isSmallScreen ? 8 : 12,
    gap: isSmallScreen ? 6 : 8,
  },
  previewImage: {
    width: isSmallScreen ? 50 : 60,
    height: isSmallScreen ? 50 : 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  submitButton: {
    backgroundColor: '#FF6900',
    borderRadius: 28,
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: isSmallScreen ? 28 : 32,
    alignItems: 'center',
    marginBottom: isSmallScreen ? 12 : 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  bottomNote: {
    backgroundColor: '#FFF3CD',
    padding: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    marginBottom: isSmallScreen ? 24 : 32,
  },
  bottomNoteText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontFamily: 'Inter-Regular',
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
  unauthorizedContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  unauthorizedTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: isSmallScreen ? 12 : 16,
    textAlign: 'center',
  },
  unauthorizedDescription: {
    fontSize: isSmallScreen ? 14 : 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: isSmallScreen ? 24 : 32,
  },
  loginButton: {
    backgroundColor: '#3483FA',
    borderRadius: 28,
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: isSmallScreen ? 28 : 32,
  },
  loginButtonText: {
    fontSize: isSmallScreen ? 16 : 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});