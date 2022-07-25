import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  LINE_IDS = [0, 1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit(): void {
  }

}
