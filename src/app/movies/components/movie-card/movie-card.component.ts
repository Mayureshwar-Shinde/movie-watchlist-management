import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie';

@Component({
  selector: 'movie',
  standalone: true,
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieComponent {
  @Input() movie!: Movie;
  @Output() editMovie: EventEmitter<Movie> = new EventEmitter();
  @Output() deleteMovie: EventEmitter<Movie> = new EventEmitter();

  onView() {
    alert("viewing movie");
  }

  onEdit() {
    this.editMovie.emit(this.movie);
  }

  onDelete() {
    this.deleteMovie.emit(this.movie);
  }
}
