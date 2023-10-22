import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { Route } from 'react-router';
import './App.css';
import { SignInScreen } from './features/Auth/screens/SignInScreen';
import { SignUpScreen } from './features/Auth/screens/SignUpScreen';

const theme = createTheme({
  typography: {
    fontFamily: ['Inter', '-apple-system', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'].join(','),
  },
});

const App: React.FC = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path={'/' || '/admin'} element={<Navigate to="/admin/dashboard" />} />
            <Route path="/sign-in" element={<SignInScreen />} />
            <Route path="/sign-up" element={<SignUpScreen />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
