import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html'
})
export class AboutComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => el.classList.add('active'));
    });
  }
}
