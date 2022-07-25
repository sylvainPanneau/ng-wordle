import { Injectable } from '@angular/core';
import { Guess } from './guess';
import { GUESSES } from './guesses-data';
import { Observable, of } from 'rxjs';
import { Word } from './word';
import { CORRECT, PRESENT, INCORRECT, UNKNOWN } from './colors';
import { SolutionServiceService } from './solution-service.service';
const WORD_LENGTH = 5;


@Injectable({

  providedIn: 'root'
})
export class GuessesServiceService {

  constructor(private solutionService: SolutionServiceService) { }

  getGuess(id: number): Observable<Guess> {
    const guess = of(GUESSES[id]);
    return guess;
  }

  getCurrentGuess(): Observable<Guess> {
    // return first guess that has not been submitted
    const currentGuess = of(GUESSES.find(item => !item.submitted)!);
    return currentGuess;
  }

  getCurrentGuessId(): number {
    return GUESSES.find(item => !item.submitted)!.id;
  }

  setGuess(id: number, guess: string): Observable<Guess> {
    const guessToSet = of(GUESSES[id]);
    guessToSet.subscribe(item => {
      // item.word = guess;
      for (let i = 0; i < guess.length; i++) {
        item.word.push({
          id: i,
          letter: guess[i],
          color: UNKNOWN,
          correct: false,
          present: false,
          incorrect: false,
          unknown: false
        });
      }
    }
    );
    return guessToSet;
  }

  isCurrentGuessFull(): boolean {
    const currentGuess = GUESSES.find(item => !item.submitted)!;
    return currentGuess.word.length === WORD_LENGTH;
  }

  isCurrentGuessEmpty(): boolean {
    const currentGuess = GUESSES.find(item => !item.submitted)!;
    console.log("empty ? : ", currentGuess.word.length === 0);
    return currentGuess.word.length === 0;
  }

  isWordSubmitted(id: number): boolean {
    return GUESSES[id].submitted;
  }

  addLetter(id: number, letter: string): Observable<Guess> {
    const guessToAdd = of(GUESSES[id]);
    guessToAdd.subscribe(item => {
      if (item.word.length + 1 <= WORD_LENGTH) {
        // item.word = item.word.concat(letter);
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
    }
    );
    console.log(GUESSES);
    return guessToAdd;
  }

  deleteLetter(id: number): Observable<Guess> {
    const guessToDelete = of(GUESSES[id]);
    guessToDelete.subscribe(item => {
      item.word = item.word.slice(0, -1);
    });
    return guessToDelete;
  }

  submitGuess(id: number): Observable<Guess> {
    const guessToSubmit = of(GUESSES[id]);
    guessToSubmit.subscribe(item => {
      item.submitted = true;
    }
    );
    return guessToSubmit;
  }

  // UPDATE COLOR METHOD
  updateColor(id: number): Observable<Guess> {
    const guessToUpdate = of(GUESSES[id]);
    guessToUpdate.subscribe(item => {
      const solution = this.solutionService.getSolution();
      console.log("solution : ", solution);
      for (let i = 0; i < item.word.length; i++) {
        if (item.word[i].letter === solution[i]) {
          console.log("letter ", item.word[i].letter, " is correct");
          item.word[i].color = CORRECT;
        } else if (solution.includes(item.word[i].letter)) {
          console.log("letter ", item.word[i].letter, " is present");
          item.word[i].color = PRESENT;
        } else {
          console.log("letter ", item.word[i].letter, " is incorrect");
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
    guessToClear.subscribe(item => {
      // item.word = "";
      item.word = [];
    }
    );
    return guessToClear;
  }

  // exportWord(id: number): Observable<Word> {
  //   const guess = of(GUESSES[id]);
  //   const word: Word = [];
  //   guess.subscribe(item => {
  //     try {
  //       for (let i = 0; i < item.word.length; i++) {
  //         word.push({
  //           id: i,
  //           letter: item.word[i],
  //           color: UNKNOWN,
  //           correct: false,
  //           present: false,
  //           incorrect: false,
  //           unknown: false
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       word.push({
  //         id: 0,
  //         letter: "A",
  //         color: UNKNOWN,
  //         correct: false,
  //         present: false,
  //         incorrect: false,
  //         unknown: true,
  //       });
  //     }
  //   });
  //   return of(word);
  // }
}
