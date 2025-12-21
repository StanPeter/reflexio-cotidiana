import { Spinner, Text } from "@chakra-ui/react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { useMemo, useRef } from "react";

// Motion envelope per item; small bounds keep items close to their base spot.
type MotionConfig = {
	driftBetweenItemsX: number;
	driftBetweenItemsY: number;
	seed: number;
};

const FloatingNavItem = ({
	item,
	motion: motionMap,
}: {
	item: {
		label: string;
		href: string;
		x: number;
		y: number;
	};
	motion?: Record<string, MotionConfig | null>;
}) => {
	const motionConfig = motionMap?.[item.label] ?? null;
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const noise = useMemo(() => {
		const seed = motionConfig?.seed ?? 0;
		const rand = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		// Seed contributes slight uniqueness per item so paths diverge.
		const seedPhase = (Math.sin(seed * 9973) + 1) * Math.PI;

		return {
			ampX: Math.abs(motionConfig?.driftBetweenItemsX ?? 6),
			ampY: Math.abs(motionConfig?.driftBetweenItemsY ?? 8),
			// Slightly different speeds to avoid obvious loops.
			freqX: rand(0.08, 0.14),
			freqY: rand(0.09, 0.15),
			phaseX: seedPhase + Math.random() * Math.PI,
			phaseY: seedPhase / 2 + Math.random() * Math.PI,
		};
	}, [
		motionConfig?.driftBetweenItemsX,
		motionConfig?.driftBetweenItemsY,
		motionConfig?.seed,
	]);

	// Keep a tiny drift variance so the path never visibly repeats.
	const driftPhase = useRef(Math.random() * Math.PI * 2);

	useAnimationFrame((t) => {
		const seconds = t / 2000;
		const wobble = Math.sin(seconds * 0.12 + driftPhase.current) * 0.6;

		x.set(
			Math.sin(seconds * noise.freqX * Math.PI * 2 + noise.phaseX) *
				noise.ampX +
				wobble,
		);
		y.set(
			Math.cos(seconds * noise.freqY * Math.PI * 2 + noise.phaseY) *
				noise.ampY +
				Math.cos(seconds * 0.1 + driftPhase.current) * 0.6,
		);
	});

	return (
		<motion.a
			href={item.href}
			key={motionConfig?.seed ?? item.label}
			style={{
				x,
				y,
				background: "var(--chakra-colors-background)",
				border: "1px solid var(--chakra-colors-secondary)",
				borderRadius: "100%",
				boxShadow: "0 1px 3px 0px var(--chakra-colors-secondary)",
				display: "grid",
				fontWeight: 500,
				height: "60px",
				alignItems: "center",
				justifyItems: "center",
				width: "110px",
				transition:
					"transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
			}}
			whileHover={{
				scale: 1.05,
				cursor: "pointer",
				boxShadow: "0 4px 6px -1px var(--chakra-colors-primary)",
				borderWidth: "2px",
			}}
		>
			<Text color="var(--chakra-colors-text)" textAlign="center">
				{item.label}
			</Text>
		</motion.a>
	);
};

export default FloatingNavItem;
