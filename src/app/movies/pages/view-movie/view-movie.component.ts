import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-view-movie',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './view-movie.component.html',
  styleUrl: './view-movie.component.css'
})
export class ViewMovieComponent implements OnInit {
  movie!: Movie;
  screenshots: string[] = [];
  movieId: number = 0;
  isLoading: boolean = true;

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

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigateByUrl('/');
  }
}
