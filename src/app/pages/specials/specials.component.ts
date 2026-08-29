import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-specials',
  standalone: true,
  templateUrl: './specials.component.html'
})
export class SpecialsComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelectorAll('.reveal-special-left, .reveal-special-right').forEach(el => el.classList.add('active'));
    });
  }
}
