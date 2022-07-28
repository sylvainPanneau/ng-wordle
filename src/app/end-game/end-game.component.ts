import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s 1s ease-in')
      ]),
    ]),
  ],
})
export class EndGameComponent implements OnInit {

  @Input()
  gameWon?: boolean;
  @Input()
  gameOver?: boolean;
  @Input()
  solution?: string;

  isOpen: boolean = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  definitionUrl: string = "https://1mot.net/";

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isOpen = true;
    }, 1);
  }

}
