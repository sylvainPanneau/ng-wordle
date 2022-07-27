import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.scss']
})
export class EndGameComponent implements OnInit {

  @Input()
  gameWon?: boolean;
  @Input()
  gameOver?: boolean;
  @Input()
  solution?: string;

  definitionUrl: string = "https://1mot.net/";

  constructor() { }

  ngOnInit(): void {
  }

}
