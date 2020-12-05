import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // redirect to home if already logged in before go to this page
    if (this.userService.currentUserValue()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {}

  handleSubmit() {
    this.loading = true;

    this.userService
      .signIn(this.username, this.password)
      .pipe(first())
      .subscribe(
        (data) => {
          // console.log(data);
          this.loading = false;
          this.router.navigateByUrl('').then();
        },
        (error) => {
          this.loading = false;
          this.error = error;
        }
      );
  }
}
