import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme, colors } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { transactionsService } from "../services/transactionsService";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import type { Transaction } from "../interfaces/Transaction";

const LayoutContainer = styled.div<{ $theme: "light" | "dark" }>`
  min-height: 100%;
  background: ${(props) => colors[props.$theme].background};
  padding: 2rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 800px;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const PageTitle = styled.h1<{ $theme: "light" | "dark" }>`
  text-align: center;
  margin-bottom: 2rem;
  color: ${(props) => colors[props.$theme].text};
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(
    135deg,
    ${(props) => colors[props.$theme].primary} 0%,
    ${(props) => colors[props.$theme].primaryDark} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const TransactionLayout: React.FC = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState("");

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
      setTransactions(userTransactions || []);
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      setError("Erro ao carregar transações");
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

  return (
    <LayoutContainer $theme={theme}>
      <PageTitle $theme={theme}>💰 Gerenciador Financeiro</PageTitle>
      <MainContent>
        <TransactionForm onTransactionAdded={handleTransactionChange} />
        <TransactionList
          transactions={transactions}
          onTransactionDeleted={handleTransactionChange}
        />
      </MainContent>
    </LayoutContainer>
  );
};

export default TransactionLayout;
