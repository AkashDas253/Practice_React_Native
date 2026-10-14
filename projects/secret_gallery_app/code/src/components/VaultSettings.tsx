import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../constants/theme';

interface VaultSettingsProps {
  visible: boolean;
  onClose: () => void;
  currentPin: string;
  onUpdatePin: (oldPin: string, newPin: string) => boolean;
}

export default function VaultSettings({ visible, onClose, currentPin, onUpdatePin }: VaultSettingsProps) {
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');

  const handleSave = () => {
    const success = onUpdatePin(oldPinInput, newPinInput);
    if (success) {
      setOldPinInput('');
      setNewPinInput('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🔒 Vault Settings</Text>
          
          <Text style={styles.label}>Current PIN</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            placeholder="Enter current PIN"
            placeholderTextColor="#777"
            value={oldPinInput}
            onChangeText={setOldPinInput}
          />

          <Text style={styles.label}>New 4-Digit PIN</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            placeholder="Enter new PIN"
            placeholderTextColor="#777"
            value={newPinInput}
            onChangeText={setNewPinInput}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#333' }]} onPress={onClose}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: Colors.accent }]} onPress={handleSave}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>Update PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { width: '85%', backgroundColor: Colors.card, padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 20, textAlign: 'center' },
  label: { color: Colors.textSecondary, fontSize: 12, marginBottom: 5 },
  input: { backgroundColor: '#121212', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
});