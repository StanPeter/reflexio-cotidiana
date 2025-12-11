"use client";

import Link from "next/link";
import styled from "styled-components";
import { PALLETE } from "@/constants";

const Main = styled.main`
	min-height: 100vh;
	position: relative;
	overflow: hidden;
	background: radial-gradient(circle at 18% 20%, rgba(163, 147, 255, 0.2), transparent 30%),
		radial-gradient(circle at 82% 16%, rgba(108, 99, 255, 0.12), transparent 28%),
		linear-gradient(180deg, ${PALLETE.bg} 0%, #f8f7ff 60%, #ffffff 100%);
	color: ${PALLETE.text};
	padding: 72px 16px 96px;
`;

const HeroWrap = styled.div`
	position: relative;
	max-width: 1040px;
	margin: 0 auto;
	min-height: 620px;
	padding-top: 220px;
`;

const HeroSurface = styled.div`
	position: relative;
	z-index: 3;
	max-width: 760px;
	margin: 0 auto;
	text-align: center;
	padding: 0 16px;
`;

const Kicker = styled.p`
	letter-spacing: 0.08em;
	text-transform: uppercase;
	font-size: 12px;
	color: ${PALLETE.indigo};
	margin: 0 0 8px;
`;

const Title = styled.h1`
	margin: 0;
	font-size: clamp(34px, 4vw, 48px);
	font-weight: 800;
	letter-spacing: -0.01em;
	color: ${PALLETE.text};
`;

const Lead = styled.p`
	color: rgba(47, 46, 65, 0.78);
	margin: 12px 0 24px;
	line-height: 1.6;
`;

const CtaRow = styled.div`
	display: flex;
	justify-content: center;
	gap: 12px;
	flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
	border-radius: 14px;
	padding: 12px 18px;
	font-weight: 700;
	text-decoration: none;
	border: 1px solid transparent;
	background: ${PALLETE.indigo};
	color: #ffffff;
	box-shadow: 0 14px 40px rgba(108, 99, 255, 0.28);
	transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;

	&:hover {
		background: #5a55e6;
		transform: translateY(-1px);
	}
`;

const GhostButton = styled(Link)`
	border-radius: 14px;
	padding: 12px 18px;
	font-weight: 700;
	text-decoration: none;
	border: 1px solid rgba(108, 99, 255, 0.25);
	background: rgba(108, 99, 255, 0.08);
	color: ${PALLETE.text};
	transition: transform 140ms ease, background 140ms ease;

	&:hover {
		transform: translateY(-1px);
		background: rgba(108, 99, 255, 0.12);
	}
`;

export function HomeClient() {
	return (
		<Main>
			<HeroWrap>
				<HeroSurface>
					<Kicker>Reflexio Cotidiana</Kicker>
					<Title>Daily reflections made simple</Title>
					<Lead>
						Answer a few mindful prompts each day, track your mood, and see gentle trends over
						time.
					</Lead>
					<CtaRow>
						<PrimaryButton href="/daily-log">Start daily log</PrimaryButton>
						<GhostButton href="/statistics">View stats</GhostButton>
					</CtaRow>
				</HeroSurface>
			</HeroWrap>
		</Main>
	);
}

