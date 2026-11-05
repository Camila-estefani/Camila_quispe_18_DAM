import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import EditorScreen from './screens/EditorScreen';
import { Note } from './database/db';

type Screen = 'home' | 'editor';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const openEditor = (note: Note | null) => {
    setSelectedNote(note);
    setScreen('editor');
  };

  const handleSave = () => {
    setScreen('home');
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setScreen('home');
    setSelectedNote(null);
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === 'home' ? (
        <HomeScreen onOpenNote={openEditor} />
      ) : (
        <EditorScreen note={selectedNote} onSave={handleSave} onCancel={handleCancel} />
      )}
    </>
  );
}
