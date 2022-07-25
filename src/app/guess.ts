import { Word } from "./word";

export interface Guess {
    id: number;
    word: Word;
    submitted: boolean;
}