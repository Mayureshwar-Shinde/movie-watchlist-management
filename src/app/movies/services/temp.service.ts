import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempService {
  private baseUrl = 'http://13.51.176.215:8080/movie';

  constructor() { }
}
