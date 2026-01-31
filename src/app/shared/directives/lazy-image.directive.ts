import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit {
  @Input('appLazyImage') src!: string;
  
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const img = this.el.nativeElement;
    img.style.opacity = '0';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = this.src;
          img.addEventListener('load', () => {
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.3s ease';
          });
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    observer.observe(img);
  }
}