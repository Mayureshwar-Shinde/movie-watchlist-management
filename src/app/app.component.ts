import { Component } from '@angular/core';      // imports of libraries and other components
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',                         // the name which we will use a html element
  standalone: true,                             // it does not belong to node module, rather manage its own dependencies
  imports: [RouterOutlet],                      // dependencies and imports of other components
  templateUrl: './app.component.html',          // its html path
  styleUrl: './app.component.css'               // its css path
})
export class AppComponent {                     // class file of this component
  title = 'movie-app';                          // class body containing methods and variables
}
