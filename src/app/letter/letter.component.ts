import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss']
})
export class LetterComponent implements OnInit {

  @Input() letter: string;

  constructor() { 
    this.letter = '';
  }

  ngOnInit(): void {
  }

}
