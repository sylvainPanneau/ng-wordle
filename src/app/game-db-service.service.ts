import { Injectable } from '@angular/core';
import FR_WORDS from "../../data/fr_words.json";
import EN_WORDS from "../../data/en_words.json";

@Injectable({
  providedIn: 'root'
})
export class GameDbServiceService {

  constructor() { }

  getGameDb(language: any): string[] {
    if (language === 'fr') {
      return FR_WORDS;
    } else {
      return EN_WORDS;
    }
  }
}
