import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  redirectTo(route: string) {
    this._router.navigate([route], { relativeTo: this._activatedRoute });
  }

  hasRoute(route: string): boolean {
    return this._router.url.includes(route);
  }
}
