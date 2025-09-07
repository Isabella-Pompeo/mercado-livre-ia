import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, ShieldCheck, CreditCard, CircleHelp as HelpCircle, Star, Package, Users, TrendingUp, LogOut, CreditCard as Edit, Bell, Lock, Globe, Smartphone } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userStats] = useState({
    totalSales: 15,
    totalEarnings: 4750,
    averageRating: 4.8,
    totalPurchases: 8,
  });

  const handleLogout = async () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Editar Perfil',
      'Funcionalidade em desenvolvimento',
      [{ text: 'OK' }]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, showChevron = true }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Icon size={20} color="#3483FA" />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.unauthorizedContainer}>
        <User size={48} color="#CCCCCC" />
        <Text style={styles.unauthorizedTitle}>Faça Login</Text>
        <Text style={styles.unauthorizedDescription}>
          Entre na sua conta para acessar seu perfil e configurações.
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Profile Info */}
      <LinearGradient
        colors={['#3483FA', '#FF6900']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={32} color="#FFFFFF" />
              </View>
            )}
            {user.isVerifiedSeller && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={16} color="#FFFFFF" />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.userTypeContainer}>
              <Text style={styles.userType}>
                {user.userType === 'buyer' ? 'Comprador' :
                 user.userType === 'seller' ? 'Vendedor' :
                 'Comprador e Vendedor'}
              </Text>
              {user.isVerifiedSeller && (
                <Text style={styles.verifiedText}>• Verificado</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={16} color="#3483FA" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      {(user.userType === 'seller' || user.userType === 'both') && (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#28A745" />
              <Text style={styles.statValue}>{userStats.totalSales}</Text>
              <Text style={styles.statLabel}>Vendas</Text>
            </View>
            <View style={styles.statCard}>
              <CreditCard size={24} color="#FF6900" />
              <Text style={styles.statValue}>{formatPrice(userStats.totalEarnings)}</Text>
              <Text style={styles.statLabel}>Faturamento</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Star size={24} color="#FFD700" />
              <Text style={styles.statValue}>{userStats.averageRating}</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            <View style={styles.statCard}>
              <Package size={24} color="#3483FA" />
              <Text style={styles.statValue}>{userStats.totalPurchases}</Text>
              <Text style={styles.statLabel}>Compras</Text>
            </View>
          </View>
        </View>
      )}

      {/* Menu Sections */}
      <View style={styles.content}>
        {/* Account Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <MenuItem
            icon={Settings}
            title="Configurações da Conta"
            subtitle="Dados pessoais, preferências"
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
          />
          
          <MenuItem
            icon={Bell}
            title="Notificações"
            subtitle="Gerenciar alertas e comunicações"
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
          />
          
          <MenuItem
            icon={Lock}
            title="Segurança"
            subtitle="Senha, autenticação de dois fatores"
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
          />
        </View>

        {/* Business Section (for sellers) */}
        {(user.userType === 'seller' || user.userType === 'both') && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Vendas</Text>
            
            <MenuItem
              icon={Package}
              title="Meus Produtos"
              subtitle="Gerenciar anúncios e estoque"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
            />
            
            <MenuItem
              icon={TrendingUp}
              title="Dashboard de Vendas"
              subtitle="Analytics e relatórios"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
            />
            
            <MenuItem
              icon={Users}
              title="Central de Suporte"
              subtitle="Atender clientes e dúvidas"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
            />
            
            {!user.isVerifiedSeller && (
              <MenuItem
                icon={ShieldCheck}
                title="Verificação de Vendedor"
                subtitle="Aumentar confiança dos compradores"
                onPress={() => Alert.alert('Verificação', 'Entre em contato para iniciar o processo de verificação.')}
              />
            )}
          </View>
        )}

        {/* Payment Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Pagamentos</Text>
          
          <MenuItem
            icon={CreditCard}
            title="Métodos de Pagamento"
            subtitle="Cartões e formas de pagamento"
            onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
          />
          
          {(user.userType === 'seller' || user.userType === 'both') && (
            <MenuItem
              icon={TrendingUp}
              title="Histórico de Recebimentos"
              subtitle="Saques e transferências"
              onPress={() => Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!')}
            />
          )}
        </View>

        {/* Support Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          
          <MenuItem
            icon={HelpCircle}
            title="Central de Ajuda"
            subtitle="FAQ e tutoriais"
            onPress={() => Alert.alert('Ajuda', 'Entre em contato pelo suporte@mercadolivreai.com')}
          />
          
          <MenuItem
            icon={Globe}
            title="Sobre o App"
            subtitle="Versão 1.0.0"
            onPress={() => Alert.alert('Mercado Livre IA', 'Versão 1.0.0\n\nO maior marketplace de automações digitais do Brasil.')}
          />
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <MenuItem
            icon={LogOut}
            title="Sair da Conta"
            onPress={handleLogout}
            showChevron={false}
          />
        </View>
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
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#28A745',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userType: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    opacity: 0.9,
    marginLeft: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginTop: -16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  chevron: {
    fontSize: 20,
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
  },
  logoutSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 32,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, y: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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