import React, { useState } from 'react';
import PinLockScreen from '../components/PinLockScreen';
import VaultManager from '../components/VaultManager';
import { useVaultManager } from '../hooks/useVaultManager';

export default function SecretGalleryScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { vaultPin, updatePin } = useVaultManager();

  if (!isAuthenticated) {
    return <PinLockScreen correctPin={vaultPin} onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <VaultManager vaultPin={vaultPin} onUpdatePin={updatePin} />;
}