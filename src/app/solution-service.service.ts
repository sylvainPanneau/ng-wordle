import { Injectable } from '@angular/core';
import { Guess } from './guess';
import { Word } from './word';
import Data from '../../data/words.json';
import { GameDbServiceService } from './game-db-service.service';

@Injectable({
  providedIn: 'root'
})
export class SolutionServiceService {

  solution: string = Data[Math.floor(Math.random() * Data.length)];

  constructor(private gameDBService: GameDbServiceService) { }

  getSolution(): string {
    return this.solution;
  }
}
