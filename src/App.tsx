import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/main-page/MainPage'
import EventsPage from './pages/events-page/EventsPage';
import FightersPage from './pages/fighters-page/FightersPage';
import EventFightsPage from './pages/event-fights-page/EventFightsPage';
import NoPage from './pages/no-page/NoPage';
import FightHistoryPage from './pages/fight-history-page/FightHistoryPage';
import SettingsPage from './pages/settings-page/SettingsPage';
import FighterStatsPage from './pages/fighter-stats-page/FighterStatsPage';
import GeneralStatsPage from './pages/general-stats-page/GeneralStatsPage';
import DeletedFighterPage from './pages/deleted-fighter-page/DeletedFighterPage';
import EventSnapshotPage from './pages/event-snapshot-page/EventSnapshotPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<MainPage />} />
        <Route path='/events' element={<EventsPage />} />
        <Route path='/events/:eventID/fights' element={<EventFightsPage />} />
        <Route path='/fighters' element={<FightersPage />} />
        <Route path='/fighters/:fighterID/fights' element={<FightHistoryPage />} />
        <Route path='/fighters/:fighterID/stats' element={<FighterStatsPage />} />
        <Route path='/fighters/deleted' element={<DeletedFighterPage />} />
        <Route path='/stats' element={<GeneralStatsPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/events/:eventID/snapshot' element={<EventSnapshotPage />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
