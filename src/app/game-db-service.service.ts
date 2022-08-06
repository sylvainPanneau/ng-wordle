import { Injectable } from '@angular/core';
import FR_WORDS from "../../data/fr_words.json";
import EN_WORDS from "../../data/en_words.json";

@Injectable({
  providedIn: 'root'
})
export class GameDbServiceService {

  private language: string = 'fr';

  constructor() { }

  setLanguage(language: string): void {
    if(language === 'fr' || language === 'en') {
      this.language = language;
    }
    else this.language = 'fr';
  }

  getLanguage(): string {
    return this.language;
  }

  getGameDb(): string[] {
    if(this.language === 'fr') {
      return FR_WORDS;
    }
    else return EN_WORDS;
  }
}
