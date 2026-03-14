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

  hours: number = 0;
  minutes: number = 0;

  ngOnInit() {
    this.hours = Math.floor(this.movie.duration / 60);
    this.minutes = this.movie.duration % 60;
  }

  onSubmit() {
    this.movie.duration = (this.hours * 60) + this.minutes;
    this.addMovie.emit(this.movie);
  }

  resetForm() {
    this.movie.id = 0;
  }

  onClose() {
    this.closeForm.emit(true);
  }
}
