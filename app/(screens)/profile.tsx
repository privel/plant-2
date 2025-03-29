import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F7F6F2', padding: 20 }}>
       
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: '#3a5f3a',
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3a5f3a', marginTop: 10 }}>
          Your Name
        </Text>
        <Text style={{ fontSize: 16, color: '#6B6B6B' }}>qwerty@example.com</Text>
      </View>

       <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 10 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <Ionicons name="leaf-outline" size={24} color="#3a5f3a" />
          <Text style={{ marginLeft: 15, fontSize: 16, color: '#3a5f3a' }}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 10 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <Ionicons name="settings-outline" size={24} color="#3a5f3a" />
          <Text style={{ marginLeft: 15, fontSize: 16, color: '#3a5f3a' }}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 15 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <Ionicons name="log-out-outline" size={24} color="#d9534f" />
          <Text style={{ marginLeft: 15, fontSize: 16, color: '#d9534f' }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
