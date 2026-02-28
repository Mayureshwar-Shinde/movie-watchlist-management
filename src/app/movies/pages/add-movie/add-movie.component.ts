import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Movie } from '../../models/movie';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'add-movie',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css'
})
export class AddMovieComponent {
  @Input() movie!: Movie;
  @Output() addMovie: EventEmitter<Movie> = new EventEmitter();
  @Output() closeForm: EventEmitter<boolean> = new EventEmitter();

  onSubmit() {
    this.addMovie.emit(this.movie);
  }

  resetForm() {
    this.movie.srno = 0;
  }

  onClose() {
    this.closeForm.emit(true);
  }
}
