"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";

type Answers = {
  mood: number;
  energy: number;
  highlight: string;
  challenge: string;
  gratitude: string;
  focus: string;
};

type StepId = keyof Answers;

type Step = {
  id: StepId;
  title: string;
  helper?: string;
  optional?: boolean;
  render: (value: Answers[StepId], onChange: (value: Answers[StepId]) => void) => React.ReactNode;
};

const palette = {
  indigo: "#6C63FF",
  lavender: "#A393FF",
  bg: "#F2F0FF",
  text: "#2F2E41",
  success: "#4CAF50",
  warning: "#FFB74D",
};

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0px); }
`;

const Shell = styled.div`
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid rgba(108, 99, 255, 0.08);
  box-shadow: 0 20px 70px rgba(47, 46, 65, 0.08);
  padding: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const Kicker = styled.p`
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
  color: ${palette.indigo};
  margin: 0 0 6px;
`;

const Heading = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.01em;
  color: ${palette.text};
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  color: rgba(47, 46, 65, 0.7);
`;

const DatePicker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;

  input {
    border-radius: 10px;
    border: 1px solid rgba(108, 99, 255, 0.2);
    padding: 10px 12px;
    background: #f8f7ff;
    color: ${palette.text};
  }
`;

const ProgressTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background: rgba(108, 99, 255, 0.12);
  overflow: hidden;
  margin: 16px 0 12px;
`;

const ProgressThumb = styled.div<{ $width: number }>`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, ${palette.indigo} 0%, ${palette.lavender} 100%);
  transition: width 220ms ease;
  width: ${({ $width }) => $width}%;
`;

const StepCard = styled.div`
  background: #f8f7ff;
  border: 1px solid rgba(108, 99, 255, 0.08);
  border-radius: 16px;
  padding: 18px;
  animation: ${fadeSlide} 200ms ease;
`;

const StepHead = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background: rgba(108, 99, 255, 0.12);
  color: ${palette.text};
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.01em;
  color: ${palette.text};
`;

const Helper = styled.p`
  color: rgba(47, 46, 65, 0.7);
  margin: 2px 0 0;
`;

const Optional = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: rgba(47, 46, 65, 0.6);
`;

const StepBody = styled.div`
  margin-top: 12px;
`;

const Chips = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active?: boolean }>`
  min-width: 44px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(108, 99, 255, 0.16);
  background: #ffffff;
  color: ${palette.text};
  font-weight: 600;
  transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;

  ${(props) =>
    props.$active &&
    `
    background: linear-gradient(135deg, ${palette.indigo} 0%, ${palette.lavender} 100%);
    color: #ffffff;
    box-shadow: 0 12px 30px rgba(108, 99, 255, 0.28);
    border-color: transparent;
  `}

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(108, 99, 255, 0.35);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(108, 99, 255, 0.16);
  background: #ffffff;
  padding: 12px;
  color: ${palette.text};
  min-height: 88px;
  resize: vertical;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
`;

const PrimaryButton = styled.button`
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 700;
  border: 1px solid transparent;
  background: ${palette.indigo};
  color: #ffffff;
  box-shadow: 0 10px 28px rgba(108, 99, 255, 0.25);
  transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;

  &:hover {
    background: #5a55e6;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 700;
  border: 1px solid rgba(108, 99, 255, 0.18);
  background: rgba(108, 99, 255, 0.08);
  color: ${palette.text};
  transition: transform 140ms ease, background 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(108, 99, 255, 0.12);
  }

  &:disabled {
    opacity: 0.7;
    transform: none;
    cursor: not-allowed;
  }
`;

const Meta = styled.div`
  margin-top: 8px;
  color: rgba(47, 46, 65, 0.65);
  font-size: 14px;
  min-height: 18px;
`;

const Success = styled.span`
  color: ${palette.success};
`;

const defaultAnswers: Answers = {
  mood: 3,
  energy: 3,
  highlight: "",
  challenge: "",
  gratitude: "",
  focus: "",
};

const steps: Step[] = [
  {
    id: "mood",
    title: "How was your overall mood yesterday?",
    helper: "1 = low • 5 = great",
    render: (value, onChange) => (
      <Chips>
        {[1, 2, 3, 4, 5].map((n) => (
          <Chip key={n} type="button" $active={value === n} onClick={() => onChange(n)}>
            {n}
          </Chip>
        ))}
      </Chips>
    ),
  },
  {
    id: "energy",
    title: "Energy level?",
    helper: "1 = drained • 5 = charged",
    render: (value, onChange) => (
      <Chips>
        {[1, 2, 3, 4, 5].map((n) => (
          <Chip key={n} type="button" $active={value === n} onClick={() => onChange(n)}>
            {n}
          </Chip>
        ))}
      </Chips>
    ),
  },
  {
    id: "highlight",
    title: "What went well?",
    helper: "A small win, a nice moment, anything positive.",
    render: (value, onChange) => (
      <TextArea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder="Write a quick highlight..."
        rows={3}
      />
    ),
  },
  {
    id: "challenge",
    title: "What felt challenging?",
    helper: "Friction, blockers, or anything that drained you.",
    render: (value, onChange) => (
      <TextArea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder="Note a challenge..."
        rows={3}
      />
    ),
  },
  {
    id: "gratitude",
    title: "Something you're grateful for",
    render: (value, onChange) => (
      <TextArea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder="Person, event, feeling..."
        rows={2}
      />
    ),
  },
  {
    id: "focus",
    title: "Today's focus",
    helper: "Pick one thing to move forward.",
    render: (value, onChange) => (
      <TextArea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder="What's the one thing?"
        rows={2}
      />
    ),
  },
];

const formatDateInput = (date: Date) => date.toISOString().slice(0, 10);

export function DailyLogClient() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);
  const [step, setStep] = useState(0);
  const [savedMessage, setSavedMessage] = useState("");

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const current = steps[step]!;

  const handleNext = () => {
    setSavedMessage("");
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleBack = () => {
    setSavedMessage("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleComplete = () => {
    setSavedMessage(`Saved for ${formatDateInput(selectedDate)}. Great job.`);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSelectedDate(new Date(`${value}T00:00:00`));
      setSavedMessage("");
    }
  };

  return (
    <Shell>
      <Card>
        <HeaderRow>
          <div>
            <Kicker>Echo Cotidiana</Kicker>
            <Heading>Daily reflection</Heading>
            <Subtitle>A few mindful prompts to close out yesterday.</Subtitle>
          </div>
          <DatePicker>
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={formatDateInput(selectedDate)} onChange={handleDateChange} />
          </DatePicker>
        </HeaderRow>

        <ProgressTrack>
          <ProgressThumb $width={progress} />
        </ProgressTrack>

        <StepCard key={current.id}>
          <StepHead>
            <Badge>
              {step + 1} / {steps.length}
            </Badge>
            <div>
              <StepTitle>{current.title}</StepTitle>
              {current.helper && <Helper>{current.helper}</Helper>}
            </div>
            {current.optional && <Optional>Optional</Optional>}
          </StepHead>

          <StepBody>
            {current.render(
              answers[current.id],
              (value) => setAnswers((prev) => ({ ...prev, [current.id]: value }))
            )}
          </StepBody>
        </StepCard>

        <NavRow>
          <SecondaryButton type="button" onClick={handleBack} disabled={step === 0}>
            Back
          </SecondaryButton>
          {step < steps.length - 1 ? (
            <PrimaryButton type="button" onClick={handleNext}>
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton type="button" onClick={handleComplete}>
              Complete
            </PrimaryButton>
          )}
        </NavRow>
        <Meta>{savedMessage && <Success>{savedMessage}</Success>}</Meta>
      </Card>
    </Shell>
  );
}

