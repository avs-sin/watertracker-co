import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store';
import { updateAvatar } from '../store/settingsSlice';
import { saveUserSettings } from '../utils/storage';

// Simple avatar option - in a real app you'd use images
const avatarIcons = [
  { id: 1, icon: 'account' },
  { id: 2, icon: 'account-outline' },
  { id: 3, icon: 'face' },
  { id: 4, icon: 'face-outline' },
  { id: 5, icon: 'face-man' },
  { id: 6, icon: 'face-man-outline' },
  { id: 7, icon: 'face-woman' },
  { id: 8, icon: 'face-woman-outline' },
  { id: 9, icon: 'alien' },
  { id: 10, icon: 'robot' },
  { id: 11, icon: 'cat' },
  { id: 12, icon: 'dog' },
  { id: 13, icon: 'rabbit' },
  { id: 14, icon: 'cow' },
  { id: 15, icon: 'duck' },
  { id: 16, icon: 'penguin' }
];

// Avatar colors
const avatarColors = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FFC107', // Amber
  '#FF5722', // Deep Orange
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
  '#795548', // Brown
  '#FF9800', // Orange
  '#607D8B', // Blue Grey
  '#E91E63', // Pink
];

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const [selectedAvatarId, setSelectedAvatarId] = useState(settings.avatarId);
  
  const handleSaveAvatar = async () => {
    // Update avatar in Redux
    dispatch(updateAvatar(selectedAvatarId));
    
    // Save to AsyncStorage
    await saveUserSettings({
      ...settings,
      avatarId: selectedAvatarId,
    });
    
    Alert.alert('Success', 'Avatar updated successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };
  
  const renderAvatarItem = ({ item, index }: { item: { id: number; icon: string }; index: number }) => {
    const colorIndex = (item.id - 1) % avatarColors.length;
    const backgroundColor = avatarColors[colorIndex];
    
    return (
      <TouchableOpacity
        style={[
          styles.avatarItem,
          selectedAvatarId === item.id && styles.selectedAvatarItem
        ]}
        onPress={() => setSelectedAvatarId(item.id)}
      >
        <View style={[styles.avatar, { backgroundColor }]}>
          <Icon name={item.icon} size={30} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your avatar</Text>
      
      <View style={styles.previewContainer}>
        <View style={[
          styles.previewAvatar, 
          { backgroundColor: avatarColors[(selectedAvatarId - 1) % avatarColors.length] }
        ]}>
          <Icon 
            name={avatarIcons.find(a => a.id === selectedAvatarId)?.icon || 'account'} 
            size={60} 
            color="#FFFFFF" 
          />
        </View>
        <Text style={styles.username}>{settings.username}</Text>
      </View>
      
      <FlatList
        data={avatarIcons}
        renderItem={renderAvatarItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        contentContainerStyle={styles.avatarGrid}
      />
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAvatar}>
        <Text style={styles.saveButtonText}>Save Avatar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  avatarGrid: {
    paddingBottom: 16,
  },
  avatarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderRadius: 8,
    padding: 8,
  },
  selectedAvatarItem: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;