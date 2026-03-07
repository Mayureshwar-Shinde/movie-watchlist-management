import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { AddMovieComponent } from '../add-movie/add-movie.component';

@Component({
  selector: 'app-view-movie',
  standalone: true,
  imports: [RouterLink, AddMovieComponent],
  templateUrl: './view-movie.component.html',
  styleUrl: './view-movie.component.css'
})
export class ViewMovieComponent implements OnInit {
  movie!: Movie;
  screenshots: string[] = [];
  movieId: number = 0;
  isLoading: boolean = true;
  showScreenshots: boolean = false;
  isEditing: boolean = false;
  editingMovie!: Movie;

  constructor(
    private router: Router,
    private location: Location,
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.movieId = Number(this.route.snapshot.paramMap.get('id'));

    this.movieService.getMovie(this.movieId).subscribe({
      next: movie => {
        this.movie = movie;
        this.screenshots = this.createStubScreenshots();
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load movie', err)
        this.isLoading = false;
      }
    });
  }

  private createStubScreenshots(): string[] {
    const seed = this.movie?.id ?? this.movie?.title ?? 'movie';
    return [1, 2, 3, 4].map((index) => `https://picsum.photos/seed/${seed}-shot-${index}/720/405`);
  }

  toggleScreenshots(): void {
    this.showScreenshots = !this.showScreenshots;
  }

  startEdit(): void {
    this.editingMovie = { ...this.movie };
    if(this.isEditing == true) this.isEditing = false
    else this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveMovie(updated: Movie): void {
    updated.id = this.movie.id;
    this.movieService.updateMovie(updated).subscribe({
      next: movie => {
        this.movie = movie;
        this.screenshots = this.createStubScreenshots();
        this.isEditing = false;
      },
      error: err => console.error('Failed to update movie', err)
    });
  }

  deleteMovie() {
    if(!confirm('Are you sure you want to delete this movie?')) return;
    this.movieService.deleteMovie(this.movie.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => console.error('Failed to delete movie', err)
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigateByUrl('/');
  }
}
