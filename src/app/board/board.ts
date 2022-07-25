import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GuessesServiceService } from '../guesses-service.service';
import { Word } from '../word';
import { Guess } from '../guess';

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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "Enter" && this.isFull()) {
      this.guessService.submitGuess(this.guessService.getCurrentGuessId());
      console.log("Submitted guess");
      return;
    }
    if (event.key !== "Enter" && event.key !== "Backspace") {
      this.selectedLetter = event.key.toUpperCase();
      this.addLetterCurrentGuess();
    }
  }

  onClick(key: string) {
    this.selectedLetter = key;
    this.addLetterCurrentGuess();
  }

  addLetterCurrentGuess(): Observable<Guess> {
    return this.guessService.addLetter(this.guessService.getCurrentGuessId(), this.selectedLetter);
  }

  getWord(id: number): Word {
    this.guessService.exportWord(id).subscribe(item => {
      this.word = item;
    });
    return this.word;
  }

  isFull(): boolean {
    return this.guessService.isCurrentGuessFull();
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

  onKeyUp(event: KeyboardEvent) {
    this.selectedLetter = event.key;
    this.addLetterCurrentGuess();
  }

  ngOnInit(): void {
  }

}
