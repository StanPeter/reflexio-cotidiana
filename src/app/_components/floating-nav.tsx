'use client';

import Link from "next/link";
import styled, { keyframes } from "styled-components";

type NavItem = {
	label: string;
	href: string;
	x: number;
	y: number;
	delay?: number;
};

const float = keyframes`
  0% { transform: translate(0px, 0px); }
  50% { transform: translate(10px, -14px); }
  100% { transform: translate(0px, 0px); }
`;

const NavLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  z-index: 2;
`;

const Bubble = styled(Link)<{ $x: number; $y: number; $duration: number; $delay: number }>`
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid rgba(108, 99, 255, 0.12);
  box-shadow: 0 18px 55px rgba(47, 46, 65, 0.18);
  display: grid;
  place-items: center;
  color: #2f2e41;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: -0.01em;
  animation: ${float} linear infinite;
  animation-duration: ${({ $duration }) => $duration}s;
  animation-delay: ${({ $delay }) => $delay}s;
  backdrop-filter: blur(10px);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  pointer-events: auto;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;

  &:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 24px 60px rgba(108, 99, 255, 0.28);
    border-color: rgba(108, 99, 255, 0.32);
  }

  span {
    text-align: center;
  }
`;

export function FloatingNav({ items }: { items: NavItem[] }) {
	return (
		<NavLayer>
			{items.map((item, idx) => (
				<Bubble
					key={item.label}
					href={item.href}
					$x={item.x}
					$y={item.y}
					$duration={5.2 + idx * 0.6}
					$delay={item.delay ?? 0}
				>
					<span>{item.label}</span>
				</Bubble>
			))}
		</NavLayer>
	);
}

