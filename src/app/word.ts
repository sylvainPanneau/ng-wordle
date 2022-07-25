interface Letter {
    id: number;
    letter: string;
    color: string;
    correct: boolean;
    incorrect: boolean;
    present: boolean;
    unknown: boolean;
}

export type Word = Letter[];