import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="app">
      <nav class="app__nav">
        <div class="u-container">
          <a routerLink="/" 
             class="app__nav-link" 
             routerLinkActive="app__nav-link--active"
             [routerLinkActiveOptions]="{ exact: true }">
            <svg class="app__nav-icon" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Movie Catalog</span>
          </a>
        </div>
      </nav>
      
      <main class="app__content">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app__footer">
        <div class="u-container">
          <p>Movie Catalog © {{currentYear}} - Made with Angular 18</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app__nav {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .app__nav-link {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 20px 0;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.2s ease;
      
      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    }
    
    .app__nav-icon {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
    
    .app__nav-link--active {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--secondary-color);
        border-radius: 2px 2px 0 0;
      }
    }
    
    .app__content {
      flex: 1;
    }
    
    .app__footer {
      background: var(--text-primary);
      color: white;
      padding: 24px 0;
      text-align: center;
      margin-top: auto;
      
      p {
        margin: 0;
        opacity: 0.8;
        font-size: 0.9rem;
      }
    }
  `],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}