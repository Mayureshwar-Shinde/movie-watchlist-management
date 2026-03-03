import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from '../../../movies/components/movie-card/movie-card.component';
import { Movie } from '../../models/movie';
import { AddMovieComponent } from '../add-movie/add-movie.component';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent, AddMovieComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  movie!: Movie;
  showForm: boolean = false;

  constructor(private movieService: MovieService) {
    this.resetMovie();
  }

  resetMovie() {
    this.movie = {
      id: 0,
      title: '',
      description: '',
      rating: 0.0,
      watched: false,
      thumbnail: ''
    };
  }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe(
      movies => this.movies = movies,
      err => console.error('Failed to load movies', err)
    );
  }

  deleteMovie(movie: Movie) {
    this.movies = this.movies.filter(
      currentMovie => currentMovie.id != movie.id
    );
  }

  validateMovie(movie: Movie): boolean {
    const title = movie.title?.trim();
    const description = movie.description?.trim();
    const imageUrl = movie.thumbnail?.trim();
    const rating = movie.rating;

    if (!title || !description || !imageUrl || rating === null || rating === undefined || rating <= 0) {
      return false;
    }
    return true;
  }

  addMovie(movie: Movie) {
    if(!this.validateMovie(movie)) return;
    if(!movie.id) {
      movie.id = this.movies.length + 1;
      this.movies = [...this.movies, movie];
    } else {
      this.movies = this.movies.map(
        m => m.id === movie.id ? { ...m, ...movie } : m
      );
    }
    this.resetMovie();
    this.showForm = false;
  }

  editMovie(updatedMovie: Movie) {
    this.movie = updatedMovie;
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetMovie();
    }
  }
}
