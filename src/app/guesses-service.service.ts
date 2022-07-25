import { Injectable } from '@angular/core';
import { Guess } from './guess';
import { GUESSES } from './guesses-data';
import { Observable, of } from 'rxjs';
import { Word } from './word';
const WORD_LENGTH = 5;


@Injectable({

  providedIn: 'root'
})
export class GuessesServiceService {

  constructor() { }

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
      item.word = guess;
    }
    );
    return guessToSet;
  }

  isCurrentGuessFull(): boolean {
    const currentGuess = GUESSES.find(item => !item.submitted)!;
    return currentGuess.word.length === WORD_LENGTH;
  }

  addLetter(id: number, letter: string): Observable<Guess> {
    const guessToAdd = of(GUESSES[id]);
    guessToAdd.subscribe(item => {
      if(item.word.length + 1 <= WORD_LENGTH){
        item.word = item.word.concat(letter);
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
    }
    );
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

  getGuesses(): Observable<Guess[]> {
    const guesses = of(GUESSES);
    return guesses;
  }

  clearGuess(id: number): Observable<Guess> {
    const guessToClear = of(GUESSES[id]);
    guessToClear.subscribe(item => {
      item.word = "";
    }
    );
    return guessToClear;
  }

  exportWord(id: number): Observable<Word> {
    const guess = of(GUESSES[id]);
    const word: Word = [];
    guess.subscribe(item => {
      try {
        for (let i = 0; i < item.word.length; i++) {
          word.push({
            id: i,
            letter: item.word[i]
          });
        }
      } catch (error) {
        console.log(error);
        word.push({
          id: 0,
          letter: "A"
        });
      }
    });
    return of(word);
  }
}
