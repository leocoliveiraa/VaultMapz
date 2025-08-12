import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiEye, HiEyeOff } from "react-icons/hi";
import { MdOutlineLock } from "react-icons/md";
import { BsGraphUp, BsShieldLock, BsBarChart, BsGrid } from "react-icons/bs";
import { authService } from "../services/authService";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FontImport = styled.style`
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap");
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #0e1526;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  color: #e2e8f0;
  padding: 2rem;
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: #1a2036;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
    max-width: 500px;
  }
`;

const MarketingSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  background-color: #12182b;
  text-align: center;

  @media (max-width: 900px) {
    padding: 2rem;
  }
`;

const MarketingLogo = styled.h1`
  font-weight: 900;
  font-size: 3.5rem;
  letter-spacing: 0.1em;
  color: #8b5cf6;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    font-size: 2.5rem;
  }
`;

const MarketingDescription = styled.p`
  font-weight: 400;
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 2.5rem; /* Centraliza e adiciona espaço abaixo */

  @media (max-width: 900px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 400px;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  color: #e2e8f0;
  font-weight: 600;
`;

const FeatureIcon = styled.div`
  color: #8b5cf6;
  font-size: 1.5rem;
  margin-right: 1rem;
`;

const LoginCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 4rem;
  background: #1a2036;
  animation: ${fadeIn} 0.6s ease forwards;
  user-select: none;

  @media (max-width: 900px) {
    padding: 2rem;
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const LoginTitle = styled.h2`
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const LoginSubtitle = styled.p`
  font-weight: 400;
  font-size: 1rem;
  color: #94a3b8;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 0.9rem 1.25rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.4);
    background: rgba(255, 255, 255, 0.07);
  }
`;

const IconLeft = styled.div`
  color: #94a3b8;
  margin-right: 0.8rem;
  font-size: 1.2rem;
  user-select: none;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 500;
  padding: 0;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    color: #475569;
  }
`;

const TogglePasswordButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
  user-select: none;
  transition: color 0.3s ease;
  margin-left: 0.5rem;

  &:hover {
    color: #e2e8f0;
  }
`;

const Button = styled.button`
  padding: 1.2rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  user-select: none;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #6d28d9, #8b5cf6);
    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.6);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    box-shadow: none;
    transform: none;
  }
`;

const GoogleButton = styled(Button)`
  background: #1e293b;
  color: #e2e8f0;
  box-shadow: 0 8px 20px rgba(30, 41, 59, 0.4);
  font-weight: 500;

  &:hover:not(:disabled) {
    background: #334155;
    box-shadow: 0 10px 25px rgba(51, 65, 85, 0.6);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  color: #94a3b8;
  font-weight: 500;
  font-size: 0.85rem;
  margin: 2rem 0;

  &::before,
  &::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background: #475569;
    opacity: 0.6;
  }

  &::before {
    margin-right: 1rem;
  }

  &::after {
    margin-left: 1rem;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: #94a3b8;
  user-select: none;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #8b5cf6;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.25rem;
  font-size: 0.85rem;
  text-decoration: none;
  user-select: none;
  transition: color 0.3s ease;

  &:hover {
    color: #a78bfa;
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #b91c1c;
  color: #fecaca;
  padding: 0.85rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: -0.5rem;
  user-select: none;
  text-align: center;
  box-shadow: 0 0 16px rgba(185, 28, 28, 0.4);
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #e2e8f0;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        await authService.register(email, password);
      } else {
        await authService.login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FontImport />
      <AppContainer>
        <MainContent>
          <MarketingSection>
            <MarketingLogo>VaultMapz</MarketingLogo>
            <MarketingDescription>
              A plataforma definitiva para gerenciar suas finanças pessoais e
              alcançar seus objetivos com inteligência e controle.
            </MarketingDescription>

            <FeatureList>
              <FeatureItem>
                <FeatureIcon>
                  <BsGraphUp />
                </FeatureIcon>
                Controle total das suas finanças
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>
                  <BsBarChart />
                </FeatureIcon>
                Relatórios e gráficos intuitivos
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>
                  <BsGrid />
                </FeatureIcon>
                Categorização automática
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>
                  <BsShieldLock />
                </FeatureIcon>
                Acesso seguro e privado
              </FeatureItem>
            </FeatureList>
          </MarketingSection>

          <LoginCard>
            <LoginHeader>
              <LoginTitle>
                {isRegistering ? "Criar Sua Conta" : "Bem-vindo de volta!"}
              </LoginTitle>
              <LoginSubtitle>
                {isRegistering
                  ? "Junte-se a nós para começar a jornada de controle financeiro."
                  : "Faça login para continuar sua gestão financeira."}
              </LoginSubtitle>
            </LoginHeader>

            <Form onSubmit={handleSubmit} noValidate>
              {error && <ErrorMessage>{error}</ErrorMessage>}

              <InputWrapper>
                <IconLeft>
                  <HiOutlineMail />
                </IconLeft>
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </InputWrapper>

              <InputWrapper>
                <IconLeft>
                  <MdOutlineLock />
                </IconLeft>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={
                    isRegistering ? "new-password" : "current-password"
                  }
                  disabled={loading}
                />
                <TogglePasswordButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </TogglePasswordButton>
              </InputWrapper>

              <Button
                type="submit"
                disabled={loading}
                aria-live="polite"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Processando...
                  </>
                ) : isRegistering ? (
                  "Criar Conta"
                ) : (
                  "Entrar"
                )}
              </Button>

              <Divider>ou</Divider>

              <GoogleButton
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                aria-label="Continuar com Google"
              >
                <FcGoogle size={24} />
                Continuar com Google
              </GoogleButton>

              <ToggleText>
                {isRegistering
                  ? "Já possui uma conta?"
                  : "Ainda não tem uma conta?"}
                <ToggleButton
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  disabled={loading}
                  aria-label={
                    isRegistering ? "Ir para login" : "Ir para criar conta"
                  }
                >
                  {isRegistering ? "Faça login" : "Crie uma conta"}
                </ToggleButton>
              </ToggleText>
            </Form>
          </LoginCard>
        </MainContent>
      </AppContainer>
    </>
  );
};

export default Login;
