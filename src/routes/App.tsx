import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { CharacterEditor } from '@/components/CharacterEditor';
import { SavesList } from '@/components/SavesList';
import { LibraryManager } from '@/components/LibraryManager';
import { SaveToast } from '@/components/SaveToast';

const App = () => {
  return (
    <AppShell>
      <SaveToast />
      <Routes>
        <Route path="/" element={<CharacterEditor />} />
        <Route path="/saves" element={<SavesList />} />
        <Route path="/library" element={<LibraryManager />} />
      </Routes>
    </AppShell>
  );
};

export default App;
