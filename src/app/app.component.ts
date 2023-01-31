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

  redirectToList(): void {
    this._router.navigate(['categories'], { relativeTo: this._activatedRoute });
  }

  redirectToCreate(): void {
    this._router.navigate(['categories/create'], {
      relativeTo: this._activatedRoute,
    });
  }

  hasRoute(route: string): boolean {
    return this._router.url.includes(route);
  }
}
