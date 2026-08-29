import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html'
})
export class ContactComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelectorAll('.contact-reveal-left, .contact-reveal-right').forEach(el => el.classList.add('active'));
    });
  }
}
