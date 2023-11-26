// header-user.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  searchTerm = '';
  loggedInUsername: string | null;


  constructor(
    activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    activatedRoute.params.subscribe((params) => {
      if (params.searchTerm) this.searchTerm = params.searchTerm;
    });

    // Fetch the logged-in user's username
    this.loggedInUsername = authService.getLoggedInUsername();
    
  }

  ngOnInit(): void {
  }

  search(term: string): void {
    if (term) this.router.navigateByUrl('/search/' + term);
  }
}
