import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import GlobalThemeHandler from "./components/GlobalThemeHandler";
import AppRoutes from "./routes";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalThemeHandler />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
