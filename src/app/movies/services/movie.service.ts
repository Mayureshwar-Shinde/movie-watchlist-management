import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateMovie, Movie } from '../models/movie';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private httpBaseUrl = 'http://13.51.176.215:8080/movie';
  private httpsBaseUrl = 'https://17cygbwcij.execute-api.eu-north-1.amazonaws.com/movie';
  private baseUrl = this.httpsBaseUrl;

  constructor(private http: HttpClient) { }

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<ApiResponse<Movie[]>>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<ApiResponse<Movie>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  addMovie(movie: CreateMovie): Observable<Movie> {
    return this.http.post<ApiResponse<Movie>>(this.baseUrl, movie).pipe(
      map(response => response.data)
    );
  }

  updateMovie(movie: Movie): Observable<Movie> {
    return this.http.put<ApiResponse<Movie>>(`${this.baseUrl}/${movie.id}`, movie).pipe(
      map(response => response.data)
    );
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
