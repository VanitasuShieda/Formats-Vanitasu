import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { darkTheme } from './theme/Theme';
import MainLayout from './components/MainLayout';
import './index.css';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;
