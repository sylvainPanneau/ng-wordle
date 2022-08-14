import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})

export class PlayerServiceService {

  players: Player[] = [
    {
      id: 1,
      userName: 'John Doe',
      email: 'jdoe@gmail.com',
    },
    {
      id: 2,
      userName: 'Jane Doe',
      email: 'janeddooe@gmail.com',
    },
    {
      id: 3,
      userName: 'John Smith',
      email: 'jsmith@gmail.com',
    },
  ];

  constructor() { }

  getPlayers(): Observable<Player[]> {
    return of(this.players);
  }

  searchPlayers(term: string): Observable<Player[]> {
    if(!term.trim()) {
      return of([]);
    }
    return of(this.players.filter(player => player.userName.toLowerCase().includes(term.toLowerCase())));
  }
}
