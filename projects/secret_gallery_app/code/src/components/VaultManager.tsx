import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { useVaultManager } from '../hooks/useVaultManager';
import VaultSettings from './VaultSettings';
import MediaViewer from './MediaViewer';

const { width } = Dimensions.get('window');
const itemSize = width / 3 - 6;

interface VaultManagerProps {
  vaultPin: string;
  onUpdatePin: (oldPin: string, newPin: string) => boolean;
}

export default function VaultManager({ vaultPin, onUpdatePin }: VaultManagerProps) {
  const {
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
    selectedMediaUri,
    setSelectedMediaUri,
    createFolder,
    addMedia,
    navigateToFolder,
    navigateBack,
  } = useVaultManager();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        {currentFolderId !== null ? (
          <TouchableOpacity onPress={navigateBack}>
            <Text style={styles.backButton}>⬅ Back</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsSettingsVisible(true)}>
            <Text style={styles.headerTitle}>⚙️ Settings</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.subHeaderTitle}>{currentFolderObj ? currentFolderObj.name : 'Root'}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.actionBtnText}>+ Folder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={addMedia}>
            <Text style={styles.actionBtnText}>+ Media</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[
          ...currentFolders.map(f => ({ ...f, itemType: 'folder' })),
          ...currentMedia.map(m => ({ ...m, itemType: 'media' })),
        ]}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => {
          if (item.itemType === 'folder') {
            return (
              <TouchableOpacity 
                style={styles.folderCard} 
                onPress={() => navigateToFolder(item.id)}
              >
                <Text style={styles.folderEmoji}>📂</Text>
                <Text style={styles.folderName} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity onPress={() => setSelectedMediaUri(item.uri)}>
                <View>
                  <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
                  {item.type === 'video' && (
                    <View style={styles.videoOverlay}>
                      <Text style={styles.playIcon}>▶️</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>This folder is empty.</Text>
            <Text style={styles.subtext}>Create a subfolder or add media to get started.</Text>
          </View>
        }
      />

      {/* New Folder Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Subfolder</Text>
            <TextInput
              style={styles.input}
              placeholder="Folder Name"
              placeholderTextColor="#777"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#333' }]} onPress={() => setIsModalVisible(false)}>
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: Colors.accent }]} onPress={createFolder}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <VaultSettings
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        currentPin={vaultPin}
        onUpdatePin={onUpdatePin}
      />

      {/* Full-Screen Media Viewer / Video Player Modal */}
      <Modal visible={selectedMediaUri !== null} animationType="fade">
        <MediaViewer mediaUri={selectedMediaUri} onClose={() => setSelectedMediaUri(null)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.accent },
  subHeaderTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  backButton: { color: Colors.accent, fontSize: 16, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { backgroundColor: Colors.card, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  actionBtnText: { color: Colors.accent, fontSize: 12, fontWeight: 'bold' },
  folderCard: { width: itemSize, height: itemSize, margin: 2, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  folderEmoji: { fontSize: 32, marginBottom: 5 },
  folderName: { color: Colors.textPrimary, fontSize: 12, paddingHorizontal: 4 },
  mediaThumbnail: { width: itemSize, height: itemSize, margin: 2, borderRadius: 4 },
  videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4 },
  playIcon: { fontSize: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 100 },
  emptyText: { color: Colors.textPrimary, fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  subtext: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { width: '80%', backgroundColor: Colors.card, padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 15 },
  input: { backgroundColor: '#121212', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
});