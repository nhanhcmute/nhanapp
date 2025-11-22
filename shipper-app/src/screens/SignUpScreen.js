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

const SignUpScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [isLoading, setIsLoading] = useState(false);
  
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP Data
  const [otpCode, setOtpCode] = useState('');

  const handleSendOTP = async () => {
    if (!name || !email || !username || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await client.post('/user.ctr/send_otp', {
        email: email,
        type: 'signup'
      });

      if (response.data.status === 200) {
        setStep(2);
      } else {
        Alert.alert('Lỗi', response.data.message || 'Không thể gửi OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi mã OTP!');
    } finally {
      setIsLoading(false);
    }
  };

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
        type: 'signup'
      });

      if (response.data.status === 200) {
        await performSignup();
      } else {
        Alert.alert('Lỗi', response.data.message || 'Mã OTP không đúng');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xác thực OTP!');
      setIsLoading(false);
    }
  };

  const performSignup = async () => {
    try {
      const response = await client.post('/user.ctr/signup', {
        name: name,
        email: email,
        username: username,
        password: password
      });

      if (response.data.status === 200) {
        setStep(3);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        Alert.alert('Lỗi', response.data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng ký!');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ tên"
          placeholderTextColor="rgba(255,255,255,0.7)"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          placeholderTextColor="rgba(255,255,255,0.7)"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên đăng nhập</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Nhập tên đăng nhập"
          placeholderTextColor="rgba(255,255,255,0.7)"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="rgba(255,255,255,0.7)"
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="rgba(255,255,255,0.7)"
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSendOTP}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>🚀 Tiếp tục - Gửi mã OTP</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.infoText}>📧 Chúng tôi đã gửi mã OTP 6 chữ số đến email</Text>
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
          <Text style={styles.buttonText}>✅ Xác thực & Đăng ký</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setStep(1)}
      >
        <Text style={styles.linkText}>← Quay lại</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <View style={styles.successContainer}>
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      <Text style={styles.successText}>Đăng ký thành công!</Text>
      <Text style={styles.subText}>Bạn sẽ được chuyển đến trang đăng nhập...</Text>
    </View>
  );

  return (
    <ImageBackground 
      source={require('../../assets/blackcathalloween.jpg')} 
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
                <Text style={styles.cardTitle}>
                  {step === 1 ? 'Đăng ký tài khoản' : step === 2 ? 'Xác thực OTP' : 'Hoàn tất'}
                </Text>
                <Ionicons name="paw" size={24} color="#ff6b81" />
              </View>

              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              {step !== 3 && (
                <TouchableOpacity 
                  style={styles.loginLinkButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginLinkText}>
                    Bạn đã có tài khoản? <Text style={styles.highlightText}>Đăng nhập ngay</Text>
                  </Text>
                </TouchableOpacity>
              )}
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
  label: {
    color: 'white',
    marginBottom: 5,
    fontSize: 14,
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
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subText: {
    color: 'white',
    marginTop: 10,
  },
  loginLinkButton: {
    marginTop: 20,
  },
  loginLinkText: {
    color: 'white',
    fontSize: 14,
  },
  highlightText: {
    color: '#ffd93d',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
