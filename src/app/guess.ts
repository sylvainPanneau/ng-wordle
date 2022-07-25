import { Word } from "./word";

export interface Guess {
    id: number;
    word: string;
    submitted: boolean;
}