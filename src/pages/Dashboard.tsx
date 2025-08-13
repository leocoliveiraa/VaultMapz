import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { Transaction } from "../interfaces/Transaction";
import { transactionsService } from "../services/transactionsService";
import { useAuth } from "../hooks/useAuth";
import { useTheme, colors } from "../contexts/ThemeContext";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import Chart from "../components/Chart";
import {
  FiAlertCircle,
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
} from "react-icons/fi";

const DashboardContainer = styled.div<{ $theme: "light" | "dark" }>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${(props) => (props.$theme === "light" ? "#f9fafb" : "#0f172a")};
  transition: all 0.3s ease;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ErrorMessage = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) =>
    props.$theme === "light" ? "#fef2f2" : "rgba(239, 68, 68, 0.1)"};
  border: 1px solid
    ${(props) =>
      props.$theme === "light" ? "#fecaca" : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => colors[props.$theme].danger};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    flex-shrink: 0;
    font-size: 1.2rem;
  }

  @media (max-width: 767px) {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
`;

const LoadingMessage = styled.div<{ $theme: "light" | "dark" }>`
  padding: 2rem;
  text-align: center;
  font-size: 1rem;
  color: ${(props) => colors[props.$theme].textSecondary};
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  min-height: 250px;
  background: ${(props) => colors[props.$theme].surface};
  border-radius: 12px;
  box-shadow: ${(props) =>
    props.$theme === "light"
      ? "0 1px 3px rgba(0, 0, 0, 0.05)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};
  border: 1px solid ${(props) => colors[props.$theme].border};

  &::before {
    content: "";
    width: 32px;
    height: 32px;
    border: 3px solid ${(props) => colors[props.$theme].border};
    border-top: 3px solid ${(props) => colors[props.$theme].primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (min-width: 768px) {
    padding: 3rem;
    font-size: 1.125rem;
    min-height: 300px;
  }
`;

const TransactionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: minmax(350px, 400px) 1fr;
    gap: 2rem;
    margin-top: 2rem;
    align-items: start;
  }
`;

const ChartContainer = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surface};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${(props) =>
    props.$theme === "light"
      ? "0 1px 3px rgba(0, 0, 0, 0.05)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${(props) =>
      props.$theme === "light"
        ? "0 4px 6px rgba(0, 0, 0, 0.1)"
        : "0 4px 6px rgba(0, 0, 0, 0.15)"};
  }

  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
`;

const WelcomeSection = styled.div<{ $theme: "light" | "dark" }>`
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza conteúdo */
  justify-content: center; /* Alinha verticalmente se necessário */
  text-align: center;
  background: ${(props) =>
    props.$theme === "light"
      ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"};
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: ${(props) =>
    props.$theme === "light"
      ? "0 4px 6px rgba(79, 70, 229, 0.15)"
      : "0 4px 6px rgba(99, 102, 241, 0.15)"};
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  @media (min-width: 768px) {
    padding: 2rem;
    margin-bottom: 2rem;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  font-weight: 700;
  margin: 0 auto 0.5rem auto;
  letter-spacing: -0.025em;
  line-height: 1.3;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0 auto;
  font-weight: 400;
  line-height: 1.5;
  max-width: 600px;
  position: relative;
  text-align: center;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const StatCard = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surface};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: ${(props) =>
    props.$theme === "light"
      ? "0 1px 2px rgba(0, 0, 0, 0.05)"
      : "0 1px 2px rgba(0, 0, 0, 0.1)"};
  border: 1px solid ${(props) => colors[props.$theme].borderSecondary};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.$theme === "light"
        ? "0 4px 6px rgba(0, 0, 0, 0.1)"
        : "0 4px 6px rgba(0, 0, 0, 0.15)"};
  }

  @media (min-width: 768px) {
    padding: 1.25rem;
  }
`;

const StatTitle = styled.p<{ $theme: "light" | "dark" }>`
  font-size: 0.75rem;
  color: ${(props) => colors[props.$theme].textSecondary};
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatValue = styled.h3<{ $theme: "light" | "dark" }>`
  font-size: 1.25rem;
  color: ${(props) => colors[props.$theme].text};
  margin: 0;
  font-weight: 600;

  @media (min-width: 768px) {
    font-size: 1.5rem;
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

      const userTransactions = await transactionsService.getTransactions(
        currentUser.uid
      );

      if (!userTransactions) {
        throw new Error("Nenhuma transação encontrada");
      }

      setTransactions(userTransactions);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);

      let errorMessage = "Erro ao carregar transações";
      if (error.code === "permission-denied") {
        errorMessage = "Permissão negada. Verifique suas credenciais.";
      } else if (error.code === "unauthenticated") {
        errorMessage = "Usuário não autenticado. Faça login novamente.";
      }

      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUser]);

  const handleTransactionChange = () => {
    fetchTransactions();
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const transactionCount = transactions.length;

  return (
    <DashboardContainer $theme={theme}>
      <MainContent>
        <WelcomeSection $theme={theme}>
          <WelcomeTitle>Bem-vindo ao seu Dashboard Financeiro</WelcomeTitle>
          <WelcomeSubtitle>
            Acompanhe seus gastos, receitas e mantenha suas finanças sob
            controle
          </WelcomeSubtitle>
        </WelcomeSection>

        {error && (
          <ErrorMessage $theme={theme}>
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        )}

        {loading ? (
          <LoadingMessage $theme={theme}>
            Carregando suas transações...
          </LoadingMessage>
        ) : (
          <>
            <StatsContainer>
              <StatCard $theme={theme}>
                <StatTitle $theme={theme}>
                  <FiTrendingUp />
                  Receitas
                </StatTitle>
                <StatValue $theme={theme}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalIncome)}
                </StatValue>
              </StatCard>

              <StatCard $theme={theme}>
                <StatTitle $theme={theme}>
                  <FiTrendingUp style={{ transform: "rotate(180deg)" }} />
                  Despesas
                </StatTitle>
                <StatValue $theme={theme}>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalExpenses)}
                </StatValue>
              </StatCard>

              <StatCard $theme={theme}>
                <StatTitle $theme={theme}>
                  <FiDollarSign />
                  Saldo
                </StatTitle>
                <StatValue
                  $theme={theme}
                  style={{ color: balance >= 0 ? "#10b981" : "#ef4444" }}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(balance)}
                </StatValue>
              </StatCard>

              <StatCard $theme={theme}>
                <StatTitle $theme={theme}>
                  <FiPieChart />
                  Transações
                </StatTitle>
                <StatValue $theme={theme}>{transactionCount}</StatValue>
              </StatCard>
            </StatsContainer>

            <ChartContainer $theme={theme}>
              <Chart transactions={transactions} />
            </ChartContainer>

            <TransactionSection>
              <TransactionForm onTransactionAdded={handleTransactionChange} />
              <TransactionList
                transactions={transactions}
                onTransactionDeleted={handleTransactionChange}
              />
            </TransactionSection>
          </>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;





