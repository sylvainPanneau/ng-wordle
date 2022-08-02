import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';

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
  isScreenHandSet$?: Observable<boolean>;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  definitionUrl: string = "https://1mot.net/";

  constructor(private breakPointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isOpen = true;
    }, 1);
    this.isScreenHandSet$ = this.breakPointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(({ matches }) => matches));
  }

}
