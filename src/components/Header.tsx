import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useTheme, colors } from "../contexts/ThemeContext";
import { authService } from "../services/authService";
import {
  FaWallet,
  FaUser,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const HeaderContainer = styled.header<{ $theme: "light" | "dark" }>`
  background: ${(props) =>
    props.$theme === "light"
      ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)"
      : "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)"};
  backdrop-filter: blur(24px);
  border-bottom: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${(props) =>
    props.$theme === "light"
      ? "0 4px 20px rgba(0,0,0,0.08)"
      : "0 4px 20px rgba(0,0,0,0.3)"};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled.div<{ $theme: "light" | "dark" }>`
  width: 42px;
  height: 42px;
  background: ${(props) =>
    props.$theme === "light"
      ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
      : "linear-gradient(135deg, #60a5fa, #3b82f6)"};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
`;

const BrandText = styled.h1<{ $theme: "light" | "dark" }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => colors[props.$theme].text};
  margin: 0;
  background: ${(props) =>
    props.$theme === "light"
      ? "linear-gradient(135deg, #1f2937, #374151)"
      : "linear-gradient(135deg, #f8fafc, #e2e8f0)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 480px) {
    display: none;
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

const ThemeButton = styled.button<{ $theme: "light" | "dark" }>`
  width: 40px;
  height: 40px;
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border: none;
  border-radius: 10px;
  color: ${(props) => colors[props.$theme].textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => colors[props.$theme].surface};
    color: ${(props) => colors[props.$theme].text};
    transform: translateY(-1px);
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const UserProfile = styled.button<{
  $theme: "light" | "dark";
  $isOpen: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${(props) => colors[props.$theme].text};

  &:hover {
    background: ${(props) => colors[props.$theme].surface};
    transform: translateY(-1px);
  }

  ${(props) =>
    props.$isOpen &&
    `
    background: ${colors[props.$theme].surface};
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  `}
`;

const Avatar = styled.div<{ $theme: "light" | "dark" }>`
  width: 32px;
  height: 32px;
  background: ${(props) =>
    props.$theme === "light"
      ? "linear-gradient(135deg, #8b5cf6, #a855f7)"
      : "linear-gradient(135deg, #a78bfa, #8b5cf6)"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
`;

const UserName = styled.span<{ $theme: "light" | "dark" }>`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => colors[props.$theme].text};
`;

const ChevronIcon = styled(FaChevronDown)<{ $isOpen: boolean }>`
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
`;

const Dropdown = styled.div<{ $theme: "light" | "dark"; $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 200px;
  background: ${(props) => colors[props.$theme].background};
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.$isOpen ? "translateY(0)" : "translateY(-10px)"};
  transition: all 0.2s ease;
  z-index: 1000;
`;

const DropdownContent = styled.div<{ $theme: "light" | "dark" }>`
  padding: 1rem;
  text-align: center;
  color: ${(props) => colors[props.$theme].textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const MobileMenuButton = styled.button<{ $theme: "light" | "dark" }>`
  width: 40px;
  height: 40px;
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border: none;
  border-radius: 10px;
  color: ${(props) => colors[props.$theme].text};
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => colors[props.$theme].surface};
    transform: translateY(-1px);
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean; $theme: "light" | "dark" }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: ${(props) => colors[props.$theme].background};
  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease;
  z-index: 100;
  padding: 6rem 2rem 2rem;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
  z-index: 99;
  backdrop-filter: blur(4px);

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileUserCard = styled.div<{ $theme: "light" | "dark" }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const MobileAvatar = styled.div<{ $theme: "light" | "dark" }>`
  width: 48px;
  height: 48px;
  background: ${(props) =>
    props.$theme === "light"
      ? "linear-gradient(135deg, #8b5cf6, #a855f7)"
      : "linear-gradient(135deg, #a78bfa, #8b5cf6)"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActionButton = styled.button<{
  $theme: "light" | "dark";
  $variant?: "danger";
}>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border: none;
  border-radius: 12px;
  color: ${(props) =>
    props.$variant === "danger"
      ? colors[props.$theme].danger
      : colors[props.$theme].text};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;

  &:hover {
    background: ${(props) => colors[props.$theme].surface};
    transform: translateY(-1px);
  }
`;

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getUserInitials = (email: string) => {
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const getUserName = (email: string) => {
    const name = email.split("@")[0];
    return name
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <HeaderContainer $theme={theme}>
        <HeaderContent>
          <Brand>
            <LogoIcon $theme={theme}>
              <FaWallet size={20} />
            </LogoIcon>
            <BrandText $theme={theme}>VaultMapz</BrandText>
          </Brand>

          <DesktopNav>
            <ThemeButton $theme={theme} onClick={toggleTheme}>
              {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
            </ThemeButton>

            <UserSection ref={dropdownRef}>
              <UserProfile
                $theme={theme}
                $isOpen={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar $theme={theme}>
                  {currentUser?.email ? (
                    getUserInitials(currentUser.email)
                  ) : (
                    <FaUser size={14} />
                  )}
                </Avatar>
                <UserName $theme={theme}>
                  {currentUser?.email
                    ? getUserName(currentUser.email)
                    : "Usuário"}
                </UserName>
                <ChevronIcon $isOpen={isDropdownOpen} />
              </UserProfile>

              <Dropdown $theme={theme} $isOpen={isDropdownOpen}>
                <DropdownContent $theme={theme}>
                  Em desenvolvimento
                </DropdownContent>
              </Dropdown>
            </UserSection>

            <ActionButton
              $theme={theme}
              $variant="danger"
              onClick={handleLogout}
              style={{ width: "auto", padding: "0.75rem" }}
            >
              <FaSignOutAlt size={16} />
            </ActionButton>
          </DesktopNav>

          <MobileMenuButton
            $theme={theme}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </MobileMenuButton>
        </HeaderContent>
      </HeaderContainer>

      <MobileMenuOverlay
        $isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <MobileMenu $isOpen={isMobileMenuOpen} $theme={theme}>
        <MobileUserCard $theme={theme}>
          <MobileAvatar $theme={theme}>
            {currentUser?.email ? (
              getUserInitials(currentUser.email)
            ) : (
              <FaUser size={20} />
            )}
          </MobileAvatar>
          <div>
            <UserName $theme={theme}>
              {currentUser?.email ? getUserName(currentUser.email) : "Usuário"}
            </UserName>
          </div>
        </MobileUserCard>

        <MobileActions>
          <ActionButton $theme={theme}>
            <FaCog size={18} />
            <span>Configurações</span>
          </ActionButton>

          <ActionButton $theme={theme} onClick={toggleTheme}>
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
            <span>Tema {theme === "light" ? "Escuro" : "Claro"}</span>
          </ActionButton>

          <ActionButton $theme={theme} $variant="danger" onClick={handleLogout}>
            <FaSignOutAlt size={18} />
            <span>Sair da Conta</span>
          </ActionButton>
        </MobileActions>
      </MobileMenu>
    </>
  );
};

export default Header;
