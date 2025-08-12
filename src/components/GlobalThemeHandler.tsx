import { useEffect } from "react";
import { useTheme, colors } from "../contexts/ThemeContext";

const GlobalThemeHandler: React.FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = colors[theme].background;
    document.body.style.color = colors[theme].text;
    document.body.style.transition =
      "background-color 0.3s ease, color 0.3s ease";
  }, [theme]);

  return null;
};

export default GlobalThemeHandler;
