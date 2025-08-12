import React from "react";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Header from "../components/Header";
import styled from "styled-components";

const PageWrapper = styled.div``;

const ContentWrapper = styled.main``;

const Routes: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Login />;

  return (
    <PageWrapper>
      <Header />
      <ContentWrapper>
        <Dashboard />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default Routes;
