import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TimeTracker from './pages/TimeTracker';
import Reports from './pages/Reports';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ height: '100vh' }}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<TimeTracker />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;