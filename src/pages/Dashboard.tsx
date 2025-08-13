import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { Transaction } from "../interfaces/Transaction";
import { transactionsService } from "../services/transactionsService";
import { useAuth } from "../hooks/useAuth";
import { useTheme, colors } from "../contexts/ThemeContext";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Chart from "../components/Chart";
import { FiAlertCircle, FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from "react-icons/fi";

const Container = styled.div<{ $theme: "light" | "dark" }>`
  min-height: 100vh;
  background: ${props => props.$theme === "light" 
    ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" 
    : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"};
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Content = styled.main`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.section<{ $theme: "light" | "dark" }>`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 1rem;
  background: ${props => colors[props.$theme].surface};
  border-radius: 16px;
  box-shadow: ${props => props.$theme === "light" 
    ? "0 8px 32px rgba(0, 0, 0, 0.1)" 
    : "0 8px 32px rgba(0, 0, 0, 0.3)"};
  border: 1px solid ${props => colors[props.$theme].border};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed, #ec4899);
  }
`;

const Title = styled.h1<{ $theme: "light" | "dark" }>`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${props => colors[props.$theme].text};
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.025em;
  
  @media (min-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p<{ $theme: "light" | "dark" }>`
  font-size: 1rem;
  color: ${props => colors[props.$theme].textSecondary};
  margin: 0 auto;
  max-width: 500px;
  line-height: 1.6;
  font-weight: 500;
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ErrorAlert = styled.div<{ $theme: "light" | "dark" }>`
  background: ${props => props.$theme === "light" ? "#fef2f2" : "rgba(239, 68, 68, 0.1)"};
  border: 1px solid ${props => props.$theme === "light" ? "#fca5a5" : "rgba(239, 68, 68, 0.2)"};
  color: ${props => colors[props.$theme].danger};
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;

  svg {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
`;

const LoadingState = styled.div<{ $theme: "light" | "dark" }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: ${props => colors[props.$theme].surface};
  border-radius: 16px;
  border: 1px solid ${props => colors[props.$theme].border};
  min-height: 300px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${props => colors[props.$theme].border};
    border-top: 3px solid ${props => colors[props.$theme].primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${props => colors[props.$theme].textSecondary};
    font-weight: 500;
    margin: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
`;

const StatCard = styled.div<{ $theme: "light" | "dark"; $accent?: string }>`
  background: ${props => colors[props.$theme].surface};
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid ${props => colors[props.$theme].border};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$accent || colors[props.$theme].primary};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$theme === "light" 
      ? "0 8px 25px rgba(0, 0, 0, 0.1)" 
      : "0 8px 25px rgba(0, 0, 0, 0.2)"};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.span<{ $theme: "light" | "dark" }>`
  font-size: 0.8rem;
  color: ${props => colors[props.$theme].textSecondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const StatValue = styled.div<{ $theme: "light" | "dark"; $color?: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$color || colors[props.$theme].text};
  
  @media (min-width: 768px) {
    font-size: 1.375rem;
  }
`;

const ChartSection = styled.div<{ $theme: "light" | "dark" }>`
  background: ${props => colors[props.$theme].surface};
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid ${props => colors[props.$theme].border};
  margin-bottom: 2rem;
  box-shadow: ${props => props.$theme === "light" 
    ? "0 4px 20px rgba(0, 0, 0, 0.08)" 
    : "0 4px 20px rgba(0, 0, 0, 0.15)"};

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const TransactionGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 380px 1fr;
    gap: 2rem;
  }
`;

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    if (!currentUser) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userTransactions = await transactionsService.getTransactions(currentUser.uid);
      
      if (!userTransactions) {
        throw new Error("Nenhuma transação encontrada");
      }

      setTransactions(userTransactions);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      
      const errorMessages = {
        "permission-denied": "Permissão negada. Verifique suas credenciais.",
        "unauthenticated": "Usuário não autenticado. Faça login novamente.",
      };
      
      setError(errorMessages[error.code] || "Erro ao carregar transações");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUser]);

  const handleTransactionChange = () => fetchTransactions();

  const stats = {
    income: transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    expenses: transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
  };

  const balance = stats.income - stats.expenses;
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  if (loading) {
    return (
      <Container $theme={theme}>
        <Content>
          <LoadingState $theme={theme}>
            <div className="spinner" />
            <p>Carregando suas transações...</p>
          </LoadingState>
        </Content>
      </Container>
    );
  }

  return (
    <Container $theme={theme}>
      <Content>
        <Header $theme={theme}>
          <Title $theme={theme}>Dashboard Financeiro</Title>
          <Subtitle $theme={theme}>
            Controle suas finanças de forma inteligente e organize seu futuro financeiro
          </Subtitle>
        </Header>

        {error && (
          <ErrorAlert $theme={theme}>
            <FiAlertCircle />
            {error}
          </ErrorAlert>
        )}

        <StatsGrid>
          <StatCard $theme={theme} $accent="#10b981">
            <StatHeader>
              <FiTrendingUp size={16} color="#10b981" />
              <StatLabel $theme={theme}>Receitas</StatLabel>
            </StatHeader>
            <StatValue $theme={theme} $color="#10b981">
              {formatCurrency(stats.income)}
            </StatValue>
          </StatCard>

          <StatCard $theme={theme} $accent="#ef4444">
            <StatHeader>
              <FiTrendingDown size={16} color="#ef4444" />
              <StatLabel $theme={theme}>Despesas</StatLabel>
            </StatHeader>
            <StatValue $theme={theme} $color="#ef4444">
              {formatCurrency(stats.expenses)}
            </StatValue>
          </StatCard>

          <StatCard $theme={theme} $accent={balance >= 0 ? "#10b981" : "#ef4444"}>
            <StatHeader>
              <FiDollarSign size={16} color={balance >= 0 ? "#10b981" : "#ef4444"} />
              <StatLabel $theme={theme}>Saldo</StatLabel>
            </StatHeader>
            <StatValue $theme={theme} $color={balance >= 0 ? "#10b981" : "#ef4444"}>
              {formatCurrency(balance)}
            </StatValue>
          </StatCard>

          <StatCard $theme={theme} $accent="#6366f1">
            <StatHeader>
              <FiActivity size={16} color="#6366f1" />
              <StatLabel $theme={theme}>Transações</StatLabel>
            </StatHeader>
            <StatValue $theme={theme} $color="#6366f1">
              {transactions.length}
            </StatValue>
          </StatCard>
        </StatsGrid>

        <ChartSection $theme={theme}>
          <Chart transactions={transactions} />
        </ChartSection>

        <TransactionGrid>
          <TransactionForm onTransactionAdded={handleTransactionChange} />
          <TransactionList
            transactions={transactions}
            onTransactionDeleted={handleTransactionChange}
          />
        </TransactionGrid>
      </Content>
    </Container>
  );
};

export default Dashboard;
