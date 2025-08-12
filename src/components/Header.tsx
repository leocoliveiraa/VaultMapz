import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useTheme, colors } from "../contexts/ThemeContext";
import { authService } from "../services/authService";
import { User, LogOut, TrendingUp, Menu, X, Sun, Moon } from "lucide-react";

const HeaderContainer = styled.header<{ $theme: "light" | "dark" }>`
  background: ${(props) =>
    props.$theme === "light"
      ? "rgba(255, 255, 255, 0.9)"
      : "rgba(18, 25, 40, 0.9)"}; /* Fundo mais suave */
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.3s ease;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 101;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9); /* Novo gradiente */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

const BrandText = styled.h1<{ $theme: "light" | "dark" }>`
  font-size: 1.6rem; /* Tamanho da fonte ajustado */
  font-weight: 700; /* Peso da fonte mais forte */
  color: ${(props) => colors[props.$theme].text};
  margin: 0;
  letter-spacing: -0.8px;

  @media (max-width: 767px) {
    font-size: 1.4rem;
  }
`;

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const MobileMenuButton = styled.button<{ $theme: "light" | "dark" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  border-radius: 12px;
  color: ${(props) => colors[props.$theme].text};
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 101;

  &:hover {
    background: ${(props) => colors[props.$theme].surfaceSecondary};
    border-color: ${(props) => colors[props.$theme].border};
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean; $theme: "light" | "dark" }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%; /* Ocupa 80% da tela para um visual mais profissional */
  max-width: 320px;
  height: 100vh;
  background: ${(props) => colors[props.$theme].background};
  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease;
  z-index: 100;
  padding: 5rem 2rem 2rem;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  z-index: 99;

  @media (min-width: 768px) {
    display: none;
  }
`;

const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
`;

const UserInfo = styled.div<{ $theme: "light" | "dark" }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border-radius: 50px;
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserEmail = styled.span<{ $theme: "light" | "dark" }>`
  font-size: 0.9rem;
  color: ${(props) => colors[props.$theme].textSecondary};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionButton = styled.button<{
  $theme: "light" | "dark";
  $variant?: "danger";
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: 1px solid
    ${(props) =>
      props.$variant === "danger"
        ? colors[props.$theme].danger
        : colors[props.$theme].borderSecondary};
  border-radius: 12px;
  color: ${(props) =>
    props.$variant === "danger"
      ? colors[props.$theme].danger
      : colors[props.$theme].textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.$variant === "danger"
        ? `${colors[props.$theme].danger}15`
        : colors[props.$theme].surfaceSecondary};
    border-color: ${(props) =>
      props.$variant === "danger"
        ? colors[props.$theme].danger
        : colors[props.$theme].border};
    color: ${(props) =>
      props.$variant === "danger"
        ? colors[props.$theme].danger
        : colors[props.$theme].text};
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ThemeButton = styled.button<{ $theme: "light" | "dark" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  border-radius: 12px;
  color: ${(props) => colors[props.$theme].text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => colors[props.$theme].surfaceSecondary};
    border-color: ${(props) => colors[props.$theme].border};
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <HeaderContainer $theme={theme}>
        <HeaderContent>
          <Brand>
            <LogoIcon>
              <TrendingUp size={24} /> {/* Tamanho do ícone ajustado */}
            </LogoIcon>
            <BrandText $theme={theme}>VaultMapz Dashboard</BrandText>
          </Brand>

          <DesktopNav>
            <UserInfo $theme={theme}>
              <Avatar>
                {currentUser?.email ? (
                  getUserInitials(currentUser.email)
                ) : (
                  <User size={18} />
                )}
              </Avatar>
              <UserEmail $theme={theme}>{currentUser?.email}</UserEmail>
            </UserInfo>

            <ThemeButton $theme={theme} onClick={toggleTheme}>
              {theme === "light" ? <Moon /> : <Sun />}
            </ThemeButton>

            <ActionButton
              $theme={theme}
              $variant="danger"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Sair</span>
            </ActionButton>
          </DesktopNav>

          <MobileMenuButton $theme={theme} onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </MobileMenuButton>
        </HeaderContent>
      </HeaderContainer>

      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />

      <MobileMenu $isOpen={isMobileMenuOpen} $theme={theme}>
        <UserSection>
          <UserInfo $theme={theme}>
            <Avatar>
              {currentUser?.email ? (
                getUserInitials(currentUser.email)
              ) : (
                <User size={18} />
              )}
            </Avatar>
            <UserEmail $theme={theme}>{currentUser?.email}</UserEmail>
          </UserInfo>

          <ButtonGroup>
            <ThemeButton $theme={theme} onClick={toggleTheme}>
              {theme === "light" ? <Moon /> : <Sun />}
            </ThemeButton>

            <ActionButton
              $theme={theme}
              $variant="danger"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Sair</span>
            </ActionButton>
          </ButtonGroup>
        </UserSection>
      </MobileMenu>
    </>
  );
};

export default Header;
