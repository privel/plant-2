// import { useState } from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   KeyboardAvoidingView,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Platform,
//   Image
// } from 'react-native';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { FirebaseError } from 'firebase/app';
// import { initializeApp } from 'firebase/app';
// import { firebaseConfig } from "../constants/firebaseConfig";
// import { Ionicons } from '@expo/vector-icons';

// import { getFirestore, doc, setDoc } from "firebase/firestore";


// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export default function Index() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const signUp = async () => {
//     setLoading(true);
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert('Check your emails!');
//     } catch (e: any) {
//       const err = e as FirebaseError;
//       alert('Registration failed: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (e: any) {
//       const err = e as FirebaseError;
//       alert('Sign in failed: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={styles.container}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
//           keyboardVerticalOffset={80}
//         >

// <View style={styles.logoContainer}>
//   <Image
//     source={require('../assets/images/clover-96.png')}
//     style={styles.logoImage}
//     resizeMode="contain"
//   />
//   <Text style={styles.logoText}>MicroHerb</Text>
// </View>

//           <TextInput
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//             keyboardType="email-address"
//             placeholder="Email"
//             placeholderTextColor="#6b8e73"
//           />

//           <View style={styles.inputWithIcon}>
//             <TextInput
//               style={styles.passwordInput}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               placeholder="Password"
//               placeholderTextColor="#6b8e73"
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconInside}>
//               <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#6b8e73" />
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <ActivityIndicator size="small" color="#6b8e73" style={{ margin: 20 }} />
//           ) : (
//             <>
//               <TouchableOpacity style={styles.button} onPress={signIn}>
//                 <Text style={styles.buttonText}>Login</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={signUp}>
//                 <Text style={[styles.buttonText, styles.secondaryButtonText]}>Create Account</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </KeyboardAvoidingView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   logoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 40
//   },
//   logoImage: {
//     width: 40,
//     height: 40,
//     marginRight: 10
//   },
//   logoText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#3a5f3a'
//   },
//   container: {
//     backgroundColor: '#f5f8f2',
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20
//   },
//   logo: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#3a5f3a',
//     marginBottom: 40,
//     textAlign: 'center'
//   },
//   input: {
//     marginVertical: 10,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#cde3d4',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     backgroundColor: '#ffffff',
//     color: '#3a5f3a'
//   },
//   inputWithIcon: {
//     marginVertical: 10,
//     position: 'relative',
//   },
//   passwordInput: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#cde3d4',
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     paddingRight: 40,
//     backgroundColor: '#ffffff',
//     color: '#3a5f3a'
//   },
//   eyeIconInside: {
//     position: 'absolute',
//     right: 12,
//     top: 14,
//   },
//   button: {
//     backgroundColor: '#7aa17a',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 20,
//     alignItems: 'center'
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 16
//   },
//   secondaryButton: {
//     backgroundColor: '#ffffff',
//     borderColor: '#7aa17a',
//     borderWidth: 1,
//     marginTop: 12
//   },
//   secondaryButtonText: {
//     color: '#7aa17a'
//   }
// });


import AuthScreen from './auth/AuthScreen';

export default function Index() {
  return <AuthScreen />;
}
