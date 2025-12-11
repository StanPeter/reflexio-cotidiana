'use client';

import styled from "styled-components";

import { DailyLogClient } from "./DailyLogClient";

const Main = styled.main`
  min-height: 100vh;
  background: linear-gradient(180deg, #f2f0ff 0%, #f8f7ff 50%, #ffffff 100%);
  color: #2f2e41;
  padding: 64px 16px 96px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export default function DailyLogPage() {
  return (
    <Main>
      <DailyLogClient />
    </Main>
  );
}