import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly isDarkMode = signal(false);

  themeIcon = computed(() =>
    this.isDarkMode() ? 'dark_mode' : 'light_mode'
  );

  constructor() {
    effect(() => {
      const classList = document.body.classList;
      if (this.isDarkMode()) {
        classList.add('dark-theme');
        classList.remove('light-theme');
      } else {
        classList.add('light-theme');
        classList.remove('dark-theme');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}
