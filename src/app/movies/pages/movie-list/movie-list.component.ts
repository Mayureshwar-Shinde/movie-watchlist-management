import { Component, OnInit } from '@angular/core';
import { MovieCardComponent } from '../../../movies/components/movie-card/movie-card.component';
import { Movie } from '../../models/movie';
import { AddMovieComponent } from '../add-movie/add-movie.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'movie-list',
  standalone: true,
  imports: [MovieCardComponent, AddMovieComponent, CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = new Array();
  movie!: Movie;
  showForm: boolean = false;

  constructor() {
    this.movies = [
      {
        srno: 1,
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        rating: 9.3,
        watched: true,
        image_url: 'https://thegoodwillblog.in/wp-content/uploads/2023/07/d56b2942bc24e60043c79b061040c63d43ba529f0db1feff055e3b7a4dcc28ce._ur19201080_.jpg?w=1568'
      },
      {
        srno: 2,
        title: 'Inception',
        description: 'A skilled thief is given a chance at redemption if he can successfully perform inception.',
        rating: 8.8,
        watched: true,
        image_url: 'https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/64865f6f9eec37001dad29f5.jpg'
      },
      {
        srno: 3,
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival.',
        rating: 8.6,
        watched: false,
        image_url: 'https://www.hauweele.net/~gawen/blog/wp-content/uploads/2014/11/interstellar.jpg'
      },
      {
        srno: 4,
        title: 'The Dark Knight',
        description: 'Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos.',
        rating: 9.0,
        watched: true,
        image_url: 'https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/52217243-a137-45d6-9c6a-0dfab4633034/74906de0-d644-4b0d-bf22-e2a321583a93?host=wbd-images.prod-vod.h264.io&partner=beamcom&w=500'
      },
      {
        srno: 5,
        title: 'Parasite',
        description: 'A poor family schemes to become employed by a wealthy household with unexpected consequences.',
        rating: 8.5,
        watched: false,
        image_url: 'https://i.ytimg.com/vi/isOGD_7hNIY/maxresdefault.jpg'
      }
    ];

    this.resetMovie();
  }

  resetMovie() {
    this.movie = {
      srno: 0,
      title: '',
      description: '',
      rating: 0.0,
      watched: false,
      image_url: ''
    };
  }

  ngOnInit(): void {
  }

  deleteMovie(movie: Movie) {
    this.movies = this.movies.filter(
      currentMovie => currentMovie.srno != movie.srno
    );
  }

  validateMovie(movie: Movie): boolean {
    const title = movie.title?.trim();
    const description = movie.description?.trim();
    const imageUrl = movie.image_url?.trim();
    const rating = movie.rating;

    if (!title || !description || !imageUrl || rating === null || rating === undefined || rating <= 0) {
      return false;
    }
    return true;
  }

  addMovie(movie: Movie) {
    if(!this.validateMovie(movie)) return;
    if(!movie.srno) {
      movie.srno = this.movies.length + 1;
      this.movies = [...this.movies, movie];
    } else {
      this.movies = this.movies.map(
        m => m.srno === movie.srno ? { ...m, ...movie } : m
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
