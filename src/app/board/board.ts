import { Component, HostListener, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GuessesServiceService } from '../guesses-service.service';
import { Letter, Word } from '../word';
import { Guess } from '../guess';
import Data from '../../../data/words.json';
import { CORRECT, INCORRECT, PRESENT, UNKNOWN } from '../colors';
import { SolutionServiceService } from '../solution-service.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  LINE_IDS = [0, 1, 2, 3, 4, 5];
  word!: Word;
  selectedLetter: string = "";
  won: boolean = false;
  gameOver: boolean = false;
  solution: string = "";
  allSubmittedLetters: Letter[] = [];
  canShake: { [key: number]: boolean } = {};
  isScreenHandSet$?: Observable<boolean>;

  row1: string[] = ["A", 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
  row2: string[] = ["Q", 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M']
  row3: string[] = ["W", 'X', 'C', 'V', 'B', 'N']

  hasBeenCorrect: string[] = []; // keep track of all keyboard letters that have been marked as correct on the keyboard layout

  constructor(
    private guessService: GuessesServiceService,
    private solutionService: SolutionServiceService,
    private breakPointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.solution = this.solutionService.getSolution();
    this.getAllSubmittedLetters();
    this.guessService.getCanShake().subscribe(item => {
      this.canShake = item;
    });
    this.isScreenHandSet$ = this.breakPointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(({ matches }) => matches));
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let guess: string = "";
    this.guessService.getCurrentGuess().subscribe(item => {
      item.word.forEach(letter => {
        guess += letter.letter;
      });
    });
    if (event.key === "Backspace" && !this.isEmpty()) {
      this.backspace(this.guessService.getCurrentGuessId());
      this.manageShakeOperations(this.guessService.getCurrentGuessId());
    }
    if (event.key === "Enter" && this.isFull() && Data.includes(guess)) {
      const id = this.guessService.getCurrentGuessId(); // save id before submitting
      this.submit(id);
      this.setGameState(id);
      this.getAllSubmittedLetters();
    }
    else if (event.key === "Enter" && this.isFull() && !Data.includes(guess)) {
      const id = this.guessService.getCurrentGuessId();
      this.manageShakeOperations(id);
    }
    if ((this.row1.includes(event.key.toUpperCase())
      || this.row2.includes(event.key.toUpperCase())
      || this.row3.includes(event.key.toUpperCase())) &&
      !(this.gameOver || this.won)) {
      this.selectedLetter = event.key.toUpperCase();
      this.addLetterCurrentGuess();
    }
  }

  setGameState(submittedGuessId: number): void {
    this.guessService.getGuess(submittedGuessId).subscribe(item => {
      if (item.word.every(letter => letter.color === CORRECT)) {
        this.won = true;
        this.gameOver = false;
      }
    });
    this.guessService.allGuessesSubmitted().subscribe(item => {
      if (item && !this.won) {
        this.gameOver = true;
      }
    });
  }

  updateCanShake(): void {
    //forcing the update for the html binding (canShake[id]) in case the line is already marked as shakeable but user submits it again
    this.canShake = {};
    setTimeout(() => {
      this.guessService.getCanShake().subscribe(item => {
        this.canShake = item;
      });
    }, 0.1);
  }

  manageShakeOperations(lineId: number): void {
    this.guessService.setTryToSubmit(lineId);
    this.guessService.tryToshake(lineId);
    this.updateCanShake();
  }

  onClick(key: string) {
    this.selectedLetter = key.toUpperCase();
    let guess: string = "";
    this.guessService.getCurrentGuess().subscribe(item => {
      item.word.forEach(letter => {
        guess += letter.letter;
      });
    });
    if (key === "backspace" && !this.isEmpty()) {
      this.backspace(this.guessService.getCurrentGuessId());
      this.manageShakeOperations(this.guessService.getCurrentGuessId());
    }
    else if (key === "Enter" && this.isFull() && Data.includes(guess)) {
      const id = this.guessService.getCurrentGuessId();
      this.submit(id);
      this.setGameState(id);
      this.getAllSubmittedLetters();
    }
    else if (key === "Enter" && this.isFull() && !Data.includes(guess)) {
      const id = this.guessService.getCurrentGuessId();
      this.manageShakeOperations(id);
    }
    else if ((this.row1.includes(key.toUpperCase())
      || this.row2.includes(key.toUpperCase())
      || this.row3.includes(key.toUpperCase())) &&
      !(this.gameOver || this.won)) {
      this.addLetterCurrentGuess();
    }
  }

  submit(id: number): void {
    this.guessService.updateColor(this.guessService.getCurrentGuessId());
    this.guessService.submitGuess(this.guessService.getCurrentGuessId());
    console.log("Submitted guess");
  }

  backspace(id: number): void {
    this.guessService.deleteLetter(this.guessService.getCurrentGuessId());
  }

  addLetterCurrentGuess(): Observable<Guess> {
    return this.guessService.addLetter(this.guessService.getCurrentGuessId(), this.selectedLetter);
  }

  getWord(id: number): Word {
    let word!: Word;

    this.guessService.getGuess(id).subscribe(item => {
      word = item.word;
    });
    return word;
  }

  isFull(): boolean {
    return this.guessService.isCurrentGuessFull();
  }

  isEmpty(): boolean {
    return this.guessService.isCurrentGuessEmpty();
  }

  getLetter(wordId: number, index: number): string {
    let letter = "";
    try {
      letter = this.getWord(wordId)[index].letter;
    } catch (e) {
      letter = "";
    }
    return letter;
  }

  canFlip(wordId: number, index: number): boolean {
    return this.guessService.isWordSubmitted(wordId);
  }

  isCorrect(wordId: number, index: number): boolean {
    let res: boolean = false;
    try {
      res = this.getWord(wordId)[index].color === CORRECT && this.guessService.isWordSubmitted(wordId);
    } catch (e) {
      res = false;
    }
    return res;
  }

  isIncorrect(wordId: number, index: number): boolean {
    let res: boolean = false;
    try {
      res = this.getWord(wordId)[index].color === INCORRECT && this.guessService.isWordSubmitted(wordId);
    } catch (e) {
      res = false;
    }
    return res;
  }

  isPresent(wordId: number, index: number): boolean {
    let res: boolean = false;
    try {
      res = this.getWord(wordId)[index].color === PRESENT && this.guessService.isWordSubmitted(wordId);
    } catch (e) {
      res = false;
    }
    return res;
  }

  isUnknown(wordId: number, index: number): boolean {
    let res: boolean = false;
    try {
      res = this.getWord(wordId)[index].color === UNKNOWN && this.guessService.isWordSubmitted(wordId);
    } catch (e) {
      res = false;
    }
    return res;
  }

  isCorrectLetter(letter: string): boolean {
    let res: boolean = false;
    try {
      this.allSubmittedLetters.forEach(item => {
        if (item.letter === letter && item.color === CORRECT) {
          res = true;
        }
      });
    } catch (e) {
      res = false;
    }
    if (res) { // if letter is marked as correct on the keyboard
      this.hasBeenCorrect.push(letter);
    }
    return res;
  }

  isIncorrectLetter(letter: string): boolean {
    let res: boolean = false;
    try {
      this.allSubmittedLetters.forEach(item => {
        if (item.letter === letter && item.color === INCORRECT) {
          res = true;
        }
      });
    } catch (e) {
      res = false;
    }
    return res;
  }

  isPresentLetter(letter: string): boolean {
    let res: boolean = false;
    try {
      this.allSubmittedLetters.forEach(item => {
        if (item.letter === letter && item.color === PRESENT && !this.hasBeenCorrect.includes(letter)) {
          res = true;
        }
      });
    } catch (e) {
      res = false;
    }
    return res;
  }

  isUnknownLetter(letter: string): boolean {
    let res: boolean = false;
    try {
      this.allSubmittedLetters.forEach(item => {
        if (item.letter === letter && item.color === UNKNOWN) {
          res = true;
        }
      });
    } catch (e) {
      res = false;
    }
    return res;
  }

  getAllSubmittedLetters(): void {
    this.guessService.getAllSubmittedLetters()
      .subscribe(item => {
        this.allSubmittedLetters = item;
      });
  }

  getColor(wordId: number, index: number): string {
    let color = "";
    try {
      if (this.guessService.isWordSubmitted(wordId)) {
        color = this.getWord(wordId)[index].color;
      }
    } catch (e) {
      color = "";
    }
    return color;
  }

  onKeyUp(event: KeyboardEvent) {
    this.selectedLetter = event.key;
    this.addLetterCurrentGuess();
  }

}
