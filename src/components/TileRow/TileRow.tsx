"use client";
import { FC } from "react";
import { motion, useAnimation } from "framer-motion";
import { Tile } from "@/components/Tile";

interface TileRowProps {
	word: string[];
	animate?: any; // This is to accept the framer motion controls,
	correct: boolean
}

export const TileRow: FC<TileRowProps> = ({ word, animate, correct }) => {
	return (
		<motion.div
			className="flex gap-2"
			animate={animate}
		>
			{word.map((letter: string, index: number) => (
				<Tile key={index} letter={letter} correct={correct}/>
			))}
		</motion.div>
	);
};
