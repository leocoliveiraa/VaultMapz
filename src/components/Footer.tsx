import React from "react";
import styled from "styled-components";
import { useTheme, colors } from "../contexts/ThemeContext";
import { FaHeart, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const FooterContainer = styled.footer<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surfaceSecondary};
  border-top: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p<{ $theme: "light" | "dark" }>`
  color: ${(props) => colors[props.$theme].textSecondary};
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CreatorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CreatorText = styled.span<{ $theme: "light" | "dark" }>`
  color: ${(props) => colors[props.$theme].textSecondary};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SocialLink = styled.a<{ $theme: "light" | "dark" }>`
  width: 32px;
  height: 32px;
  background: ${(props) => colors[props.$theme].surface};
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => colors[props.$theme].textSecondary};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => colors[props.$theme].surfaceSecondary};
    color: ${(props) => colors[props.$theme].text};
    transform: translateY(-1px);
  }
`;

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <FooterContainer $theme={theme}>
      <FooterContent>
        <Copyright $theme={theme}>
          © 2025 VaultMapz. Todos os direitos reservados.
        </Copyright>

        <CreatorSection>
          <CreatorText $theme={theme}>
            Feito com <FaHeart size={12} color="#ef4444" /> por Léo
          </CreatorText>

          <SocialLinks>
            <SocialLink
              $theme={theme}
              href="https://leocoliveira.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              title="Portfolio"
            >
              <FaGlobe size={14} />
            </SocialLink>
            <SocialLink
              $theme={theme}
              href="https://github.com/leocoliveiraa"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <FaGithub size={14} />
            </SocialLink>
            <SocialLink
              $theme={theme}
              href="https://linkedin.com/in/leocoliveira"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin size={14} />
            </SocialLink>
          </SocialLinks>
        </CreatorSection>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
