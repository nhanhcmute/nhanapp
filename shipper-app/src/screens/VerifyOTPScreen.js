import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Alert, 
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';

const VerifyOTPScreen = ({ navigation, route }) => {
  const { email, username, type } = route.params || {};
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã OTP 6 chữ số!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await client.post('/user.ctr/verify_otp', {
        email: email,
        otpCode: otpCode,
        type: type
      });

      if (response.data.status === 200) {
        // Navigate to ResetPassword if forgot_password
        if (type === 'forgot_password') {
          navigation.navigate('ResetPassword', {
            email: email,
            username: username,
            otpVerified: true
          });
        } else {
          // Handle other types if needed
          Alert.alert('Thành công', 'Xác thực thành công!');
        }
      } else {
        Alert.alert('Lỗi', response.data.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xác thực OTP!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await client.post('/user.ctr/send_otp', {
        email: email,
        username: username,
        type: type
      });

      if (response.data.status === 200) {
        Alert.alert('Thành công', 'Mã OTP đã được gửi lại!');
      } else {
        Alert.alert('Lỗi', response.data.message || 'Không thể gửi lại OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi lại OTP!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/bao.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="paw" size={24} color="#ff6b81" />
                <Text style={styles.cardTitle}>Xác thực OTP</Text>
                <Ionicons name="paw" size={24} color="#ff6b81" />
              </View>

              <Text style={styles.infoText}>📧 Chúng tôi đã gửi mã OTP 6 chữ số đến</Text>
              <Text style={styles.emailText}>{email}</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  value={otpCode}
                  onChangeText={(text) => setOtpCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="------"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleVerifyOTP}
                disabled={isLoading || otpCode.length !== 6}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>✅ Xác thực OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={isLoading}
              >
                <Text style={styles.linkText}>🔄 Gửi lại mã OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.linkText}>← Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  button: {
    width: '100%',
    backgroundColor: '#ff6b81',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ff6b81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 15,
  },
  linkText: {
    color: 'white',
    fontSize: 14,
  },
  infoText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  emailText: {
    color: '#ffd93d',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default VerifyOTPScreen;
