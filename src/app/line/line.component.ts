import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { GuessesServiceService } from '../guesses-service.service';
import { Word } from '../word';
import { Guess } from '../guess';
@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {

  @Input()
  id!: number;
  guess!: Guess;
  word!: Word;

  constructor(private guessService: GuessesServiceService) { }

  getGuess(): void {
    this.guessService.getGuess(this.id).subscribe(guess => this.guess = guess);
  }

  getWord(): void {
    if(this.guess) {
      for(let i = 0; i < this.guess.word.length; i++) {
        this.word.push({
          id: i,
          letter: this.guess.word[i]
        });
      }
    }
  }

  ngOnInit(): void {
    this.getGuess();
    console.log("this.guess: ", this.guess);
    this.getWord();
  }

}
