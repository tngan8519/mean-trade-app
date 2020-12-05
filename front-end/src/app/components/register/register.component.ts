import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  handleSubmit() {
    this.loading = true;

    this.userService
      .register(this.username, this.password)
      .pipe(first())
      .subscribe(
        (data) => {
          // console.log(data);
          this.loading = false;
          this.router.navigateByUrl('').then();
        },
        (error) => {
          // console.log(error);
          this.loading = false;
          this.error = error;
        }
      );
  }
}
