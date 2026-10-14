import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors } from '../constants/theme';

interface PinLockScreenProps {
  correctPin: string;
  onSuccess: () => void;
}

export default function PinLockScreen({ correctPin, onSuccess }: PinLockScreenProps) {
  const [pin, setPin] = useState('');

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onSuccess();
        } else {
          Alert.alert('Incorrect PIN', 'Please try again');
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Secret Gallery',
      fallbackLabel: 'Use PIN',
    });
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🔒</Text>
        <Text style={styles.title}>Enter Vault PIN</Text>
        
        <View style={styles.pinDotsContainer}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                index < pin.length ? styles.pinDotFilled : null,
              ]}
            />
          ))}
        </View>

        <View style={styles.padContainer}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'].map((item, index) => {
            if (item === 'bio') {
              return (
                <TouchableOpacity key={index} style={styles.padButton} onPress={handleBiometric}>
                  <Text style={styles.padText}>🔓</Text>
                </TouchableOpacity>
              );
            }
            if (item === 'del') {
              return (
                <TouchableOpacity key={index} style={styles.padButton} onPress={handleDelete}>
                  <Text style={styles.padText}>⌫</Text>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity key={index} style={styles.padButton} onPress={() => handlePress(item)}>
                <Text style={styles.padText}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emoji: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 20 },
  pinDotsContainer: { flexDirection: 'row', marginBottom: 40 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: Colors.accent, marginHorizontal: 10 },
  pinDotFilled: { backgroundColor: Colors.accent },
  padContainer: { width: '80%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  padButton: { width: '30%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', margin: '1.5%', backgroundColor: Colors.card, borderRadius: 40 },
  padText: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
});