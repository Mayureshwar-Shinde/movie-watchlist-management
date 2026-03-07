import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie';
import { Router } from '@angular/router';

@Component({
  selector: 'movie-card',
  standalone: true,
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Output() editMovie: EventEmitter<Movie> = new EventEmitter();
  @Output() deleteMovie: EventEmitter<Movie> = new EventEmitter();

  constructor(private router: Router) {}

  onView() {
    this.router.navigate(['/movie', this.movie.id]);
  }

  onEdit() {
    let updatedMovie: Movie = { ...this.movie };
    this.editMovie.emit(updatedMovie);
  }

  onDelete() {
    if(confirm('Are you sure?')) {
      this.deleteMovie.emit(this.movie);
    }
  }
}
