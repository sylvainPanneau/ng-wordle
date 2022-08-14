import { Injectable } from '@angular/core';
import { Guess } from './guess';
import { GUESSES } from './guesses-data';
import { Observable, of } from 'rxjs';
import { Letter, Word } from './word';
import { CORRECT, PRESENT, INCORRECT, UNKNOWN } from './colors';
import { SolutionServiceService } from './solution-service.service';
const WORD_LENGTH = 5;

@Injectable({
  providedIn: 'root',
})
export class GuessesServiceService {
  constructor(private solutionService: SolutionServiceService) {}

  getGuess(id: number): Observable<Guess> {
    const guess = of(GUESSES[id]);
    return guess;
  }

  setTryToSubmit(wordId: number) {
    const guessToSubmit = of(GUESSES[wordId]);
    guessToSubmit.subscribe((item) => {
      item.triedToBeSubmitted = true;
    });
    return guessToSubmit;
  }

  getCanShake(): Observable<{ [key: number]: boolean }> {
    let canShake: { [key: number]: boolean } = {};
    this.getGuesses().subscribe((item) => {
      item.forEach((guess) => {
        canShake[guess.id] = guess.canShake;
      });
    });
    return of(canShake);
  }

  tryToshake(wordId: number): Observable<Guess> {
    const guessToShake = of(GUESSES[wordId]);
    let shakeValue: boolean = false;
    let guess!: Guess;
    let wordStr: string = '';
    this.getGuess(wordId).subscribe((item) => {
      guess = item;
      item.word.forEach((letter) => {
        wordStr += letter.letter;
      });
    });
    if (!guess.triedToBeSubmitted) {
      guessToShake.subscribe((item) => {
        item.canShake = false;
      });
      return guessToShake;
    }
    if (wordStr.length !== WORD_LENGTH) {
      shakeValue = false;
    } else if (wordStr.length === WORD_LENGTH) {
      shakeValue = true;
    }
    guessToShake.subscribe((item) => {
      item.canShake = shakeValue;
    });
    return guessToShake;
  }

  getCurrentGuess(): Observable<Guess> {
    // return first guess that has not been submitted
    const currentGuess = of(GUESSES.find((item) => !item.submitted)!);
    return currentGuess;
  }

  getCurrentGuessId(): number {
    return GUESSES.find((item) => !item.submitted)!.id;
  }

  getLastSubmittedGuess(): Observable<Guess> {
    const lastSubmittedGuess = of(GUESSES[this.getCurrentGuessId() - 1]);
    return lastSubmittedGuess;
  }

  getAllSubmittedGuesses(): Observable<Guess[]> {
    let allGuessesSubmitted: Guess[] = [];
    this.getGuesses().subscribe((item) => {
      allGuessesSubmitted = item.filter((item) => item.submitted);
    });
    return of(allGuessesSubmitted);
  }

  getAllSubmittedLetters(): Observable<Letter[]> {
    let result: Letter[] = [];
    this.getAllSubmittedGuesses().subscribe((item) => {
      item.forEach((guess) => {
        guess.word.forEach((letter) => {
          result.push(letter);
        });
      });
    });
    return of(result);
  }

  setGuess(id: number, guess: string): Observable<Guess> {
    const guessToSet = of(GUESSES[id]);
    guessToSet.subscribe((item) => {
      for (let i = 0; i < guess.length; i++) {
        item.word.push({
          id: i,
          letter: guess[i],
          color: UNKNOWN,
          correct: false,
          present: false,
          incorrect: false,
          unknown: false,
        });
      }
    });
    return guessToSet;
  }

  allGuessesSubmitted(): Observable<boolean> {
    const allSubmitted = of(GUESSES.every((item) => item.submitted));
    return allSubmitted;
  }

  isCurrentGuessFull(): boolean {
    const currentGuess = GUESSES.find((item) => !item.submitted)!;
    return currentGuess.word.length === WORD_LENGTH;
  }

  isCurrentGuessEmpty(): boolean {
    const currentGuess = GUESSES.find((item) => !item.submitted)!;
    console.log('empty ? : ', currentGuess.word.length === 0);
    return currentGuess.word.length === 0;
  }

  isWordSubmitted(id: number): boolean {
    return GUESSES[id].submitted;
  }

  addLetter(id: number, letter: string): Observable<Guess> {
    const guessToAdd = of(GUESSES[id]);
    guessToAdd.subscribe((item) => {
      if (item.word.length + 1 <= WORD_LENGTH) {
        item.word.push({
          id: item.word.length,
          letter: letter,
          color: UNKNOWN,
          correct: false,
          present: false,
          incorrect: false,
          unknown: true,
        });
      }
    });
    console.log(GUESSES);
    return guessToAdd;
  }

  deleteLetter(id: number): Observable<Guess> {
    const guessToDelete = of(GUESSES[id]);
    guessToDelete.subscribe((item) => {
      item.word = item.word.slice(0, -1);
    });
    return guessToDelete;
  }

  submitGuess(id: number): Observable<Guess> {
    const guessToSubmit = of(GUESSES[id]);
    guessToSubmit.subscribe((item) => {
      item.submitted = true;
    });
    return guessToSubmit;
  }

  updateColor(id: number): Observable<Guess> {
    const guessToUpdate = of(GUESSES[id]);
    guessToUpdate.subscribe((item) => {
      const solution = this.solutionService.getSolution();
      console.log('solution : ', solution);
      for (let i = 0; i < item.word.length; i++) {
        if (item.word[i].letter === solution[i]) {
          console.log('letter ', item.word[i].letter, ' is correct');
          item.word[i].color = CORRECT;
        } else if (solution.includes(item.word[i].letter)) {
          console.log('letter ', item.word[i].letter, ' is present');
          item.word[i].color = PRESENT;
        } else {
          console.log('letter ', item.word[i].letter, ' is incorrect');
          item.word[i].color = INCORRECT;
        }
      }
    });
    return guessToUpdate;
  }

  getGuesses(): Observable<Guess[]> {
    const guesses = of(GUESSES);
    return guesses;
  }

  clearGuess(id: number): Observable<Guess> {
    const guessToClear = of(GUESSES[id]);
    guessToClear.subscribe((item) => {
      item.word = [];
    });
    return guessToClear;
  }

  resetGame(): void {
    GUESSES.forEach((item) => {
      item.submitted = false;
      item.canShake = false;
      item.triedToBeSubmitted = false;
      item.word = [];
    });
  }
}
