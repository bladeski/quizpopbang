import type { Answers } from ".";

export type Team = {
  id: string;
  name: string;
  players: string[];
  answers: Answers[];
  totalPoints: number;
};