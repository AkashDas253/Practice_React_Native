import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface MediaItem {
  id: string;
  uri: string;
  folderId: string | null;
  type: 'image' | 'video';
}

const STORAGE_KEYS = {
  FOLDERS: '@vault_folders',
  MEDIA: '@vault_media',
};

const PIN_SECURE_KEY = 'vault_secure_pin';

export function useVaultManager() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [vaultPin, setVaultPin] = useState('1234');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMediaUri, setSelectedMediaUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const savedFolders = await AsyncStorage.getItem(STORAGE_KEYS.FOLDERS);
        const savedMedia = await AsyncStorage.getItem(STORAGE_KEYS.MEDIA);
        
        // Load PIN from SecureStore
        const savedPin = await SecureStore.getItemAsync(PIN_SECURE_KEY);

        if (savedFolders) setFolders(JSON.parse(savedFolders));
        if (savedMedia) setMediaList(JSON.parse(savedMedia));
        if (savedPin) setVaultPin(savedPin);
      } catch (error) {
        console.log('Failed to load persistent data', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveFolders = async (newFolders: Folder[]) => {
    setFolders(newFolders);
    await AsyncStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(newFolders));
  };

  const saveMedia = async (newMedia: MediaItem[]) => {
    setMediaList(newMedia);
    await AsyncStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(newMedia));
  };

  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentMedia = mediaList.filter(m => m.folderId === currentFolderId);
  const currentFolderObj = folders.find(f => f.id === currentFolderId);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName,
      parentId: currentFolderId,
    };
    await saveFolders([...folders, newFolder]);
    setNewFolderName('');
    setIsModalVisible(false);
  };

  const addMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newItems: MediaItem[] = [];
      for (const asset of result.assets) {
        try {
          const filename = asset.uri.split('/').pop() || `media_${Date.now()}.jpg`;
          const destFile = new File(Paths.document, filename);
          const sourceFile = new File(asset.uri);
          sourceFile.copy(destFile);

          const mediaType = asset.type === 'video' || asset.uri.endsWith('.mp4') ? 'video' : 'image';

          newItems.push({
            id: Date.now().toString() + Math.random(),
            uri: destFile.uri,
            folderId: currentFolderId,
            type: mediaType,
          });
        } catch (error) {
          console.log('Error saving file internally:', error);
        }
      }
      await saveMedia([...mediaList, ...newItems]);
    }
  };

  const updatePin = async (oldPin: string, newPin: string) => {
    if (oldPin !== vaultPin) {
      Alert.alert('Error', 'Current PIN is incorrect.');
      return false;
    }
    if (newPin.length !== 4) {
      Alert.alert('Error', 'New PIN must be 4 digits.');
      return false;
    }
    setVaultPin(newPin);
    
    // Save securely using Expo SecureStore
    await SecureStore.setItemAsync(PIN_SECURE_KEY, newPin);
    
    Alert.alert('Success', 'Vault PIN updated successfully and securely stored!');
    return true;
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
  };

  const navigateBack = () => {
    setCurrentFolderId(currentFolderObj?.parentId || null);
  };

  return {
    currentFolderId,
    currentFolders,
    currentMedia,
    currentFolderObj,
    isModalVisible,
    setIsModalVisible,
    isSettingsVisible,
    setIsSettingsVisible,
    newFolderName,
    setNewFolderName,
    vaultPin,
    isLoading,
    selectedMediaUri,
    setSelectedMediaUri,
    createFolder,
    addMedia,
    updatePin,
    navigateToFolder,
    navigateBack,
  };
}