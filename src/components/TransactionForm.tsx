import React, { useState } from "react";
import styled from "styled-components";
import { useTheme, colors } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { transactionsService } from "../services/transactionsService";
import { FiPlusCircle, FiDollarSign, FiCalendar, FiTag } from "react-icons/fi";

interface TransactionFormData {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const FormContainer = styled.div<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${(props) =>
    props.$theme === "light"
      ? "0 1px 3px rgba(0, 0, 0, 0.05)"
      : "0 1px 3px rgba(0, 0, 0, 0.1)"};
  border: 1px solid ${(props) => colors[props.$theme].border};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormTitle = styled.h2<{ $theme: "light" | "dark" }>`
  color: ${(props) => colors[props.$theme].text};
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledForm = styled.form`
  display: grid;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label<{ $theme: "light" | "dark" }>`
  font-size: 0.875rem;
  color: ${(props) => colors[props.$theme].textSecondary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input<{ $theme: "light" | "dark" }>`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => colors[props.$theme].border};
  background: ${(props) => colors[props.$theme].background};
  color: ${(props) => colors[props.$theme].text};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => colors[props.$theme].primary};
    box-shadow: 0 0 0 2px ${(props) => colors[props.$theme].primaryLight};
  }
`;

const Select = styled.select<{ $theme: "light" | "dark" }>`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => colors[props.$theme].border};
  background: ${(props) => colors[props.$theme].background};
  color: ${(props) => colors[props.$theme].text};
  font-size: 0.875rem;
  transition: all 0.2s ease;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => colors[props.$theme].primary};
    box-shadow: 0 0 0 2px ${(props) => colors[props.$theme].primaryLight};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
`;

const RadioLabel = styled.label<{ $theme: "light" | "dark" }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => colors[props.$theme].text};
  cursor: pointer;
`;

const RadioInput = styled.input<{ $theme: "light" | "dark" }>`
  width: 1rem;
  height: 1rem;
  accent-color: ${(props) => colors[props.$theme].primary};
`;

const SubmitButton = styled.button<{ $theme: "light" | "dark" }>`
  background: ${(props) => colors[props.$theme].primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: ${(props) => colors[props.$theme].primaryDark};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onTransactionAdded,
}) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState<TransactionFormData>({
    title: "",
    amount: 0,
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Usuário não autenticado");
      return;
    }

    if (!formData.title.trim() || formData.amount <= 0 || !formData.category) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      await transactionsService.addTransaction({
        userId: currentUser.uid,
        title: formData.title.trim(),
        amount: formData.amount,
        type: formData.type,
        category: formData.category,
        date: formData.date,
        description: "",
      });

      // Reset form
      setFormData({
        title: "",
        amount: 0,
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });

      // Notify parent component
      onTransactionAdded();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Erro ao adicionar transação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer $theme={theme}>
      <FormTitle $theme={theme}>
        <FiPlusCircle /> Adicionar Transação
      </FormTitle>
      <StyledForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label $theme={theme}>
            <FiTag /> Título
          </Label>
          <Input
            $theme={theme}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label $theme={theme}>
            <FiDollarSign /> Valor
          </Label>
          <Input
            $theme={theme}
            type="number"
            name="amount"
            value={formData.amount === 0 ? "" : formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label $theme={theme}>
            <FiCalendar /> Data
          </Label>
          <Input
            $theme={theme}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label $theme={theme}>Tipo</Label>
          <RadioGroup>
            <RadioLabel $theme={theme}>
              <RadioInput
                $theme={theme}
                type="radio"
                name="type"
                value="income"
                checked={formData.type === "income"}
                onChange={handleChange}
              />
              Receita
            </RadioLabel>
            <RadioLabel $theme={theme}>
              <RadioInput
                $theme={theme}
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === "expense"}
                onChange={handleChange}
              />
              Despesa
            </RadioLabel>
          </RadioGroup>
        </InputGroup>

        <InputGroup>
          <Label $theme={theme}>Categoria</Label>
          <Select
            $theme={theme}
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            <option value="food">Alimentação</option>
            <option value="transport">Transporte</option>
            <option value="housing">Moradia</option>
            <option value="entertainment">Lazer</option>
            <option value="health">Saúde</option>
            <option value="education">Educação</option>
            <option value="salary">Salário</option>
            <option value="other">Outros</option>
          </Select>
        </InputGroup>

        <SubmitButton $theme={theme} type="submit" disabled={loading}>
          {loading ? "Adicionando..." : "Adicionar Transação"}
        </SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default TransactionForm;
