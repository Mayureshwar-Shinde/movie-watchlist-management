import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie';

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

  onView() {
    const query = encodeURIComponent(this.movie.title);
    const url = `https://www.google.com/search?q=${query}`;
    window.open(url, '_blank');
  }

  onEdit() {
    let updatedMovie: Movie = { ...this.movie };
    this.editMovie.emit(updatedMovie);
  }

  onDelete() {
    this.deleteMovie.emit(this.movie);
  }
}
