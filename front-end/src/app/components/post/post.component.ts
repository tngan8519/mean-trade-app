import { Component, OnInit } from '@angular/core';
import { ToyService } from '../../services/toy.service';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  userInfo!: User;

  name: string = '';
  fileUpload: string = '';
  rentPrice!: number;
  salePrice!: number;
  loading: boolean = false;
  error: string = '';

  constructor(
    private toyService: ToyService,
    private userService: UserService,
    private router: Router
  ) {
    this.userService.currentUser.subscribe((x: User) => (this.userInfo = x));
  }

  ngOnInit(): void {}

  handleFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    this.toyService.toyUploadImage(file).subscribe(
      (res) => {
        console.log(res);
        if (res.success === true) {
          this.fileUpload = res.image;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    this.toyService
      .toyPost(
        this.name,
        this.fileUpload,
        this.rentPrice,
        this.salePrice,
        this.userInfo.token
      )
      .subscribe(
        (res) => {
          console.log(res);
          if (res.message === 'New toy created') {
            this.router.navigateByUrl('/browse').then();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
