import { Injectable } from '@angular/core';
import { Guess } from './guess';
import { Word } from './word';
import { GameDbServiceService } from './game-db-service.service';

@Injectable({
  providedIn: 'root'
})
export class SolutionServiceService {

  Data: string[] = this.gameDBService.getGameDb();
  solution: string = this.Data[Math.floor(Math.random() * this.Data.length)];

  constructor(private gameDBService: GameDbServiceService) { }

  updateSolution(): void{
    this.Data = this.gameDBService.getGameDb();
    this.solution = this.Data[Math.floor(Math.random() * this.Data.length)];
  }

  getSolution(): string {
    return this.solution;
  }
}
