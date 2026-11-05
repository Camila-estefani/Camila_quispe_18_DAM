import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import PermissionsScreen from './screens/PermissionsScreen';
import LocationScreen from './screens/LocationScreen';

export type Screen = 'permisos' | 'ubicacion';

export default function App() {
  const [screen, setScreen] = useState<Screen>('permisos');

  return (
    <>
      <StatusBar style="light" />
      {screen === 'permisos' ? (
        <PermissionsScreen onGoToLocation={() => setScreen('ubicacion')} />
      ) : (
        <LocationScreen onBack={() => setScreen('permisos')} />
      )}
    </>
  );
}
