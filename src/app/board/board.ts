import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GuessesServiceService } from '../guesses-service.service';
import { Word } from '../word';
import { Guess } from '../guess';
import Data from '../../../data/words.json';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  LINE_IDS = [0, 1, 2, 3, 4, 5];
  word!: Word;
  selectedLetter: string = "";

  row1: string[] = ["A", 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
  row2: string[] = ["Q", 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M']
  row3: string[] = ["W", 'X', 'C', 'V', 'B', 'N']

  constructor(private guessService: GuessesServiceService) { }

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
    }
    if (event.key === "Enter" && this.isFull() && Data.includes(guess)) {
      this.submit(this.guessService.getCurrentGuessId());
    }
    if (this.row1.includes(event.key.toUpperCase()) || this.row2.includes(event.key.toUpperCase()) || this.row3.includes(event.key.toUpperCase())) {
      this.selectedLetter = event.key.toUpperCase();
      this.addLetterCurrentGuess();
    }
  }

  onClick(key: string) {
    this.selectedLetter = key.toUpperCase();
    if (key === "backspace" && !this.isEmpty()) {
      this.backspace(this.guessService.getCurrentGuessId());
    }
    else if (key === "Enter" && this.isFull() && Data.includes(this.selectedLetter)) {
      this.submit(this.guessService.getCurrentGuessId());
    }
    else if (this.row1.includes(key.toUpperCase()) || this.row2.includes(key.toUpperCase()) || this.row3.includes(key.toUpperCase())) {
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

  ngOnInit(): void {
  }

}
