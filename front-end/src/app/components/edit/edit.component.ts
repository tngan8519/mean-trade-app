import { Component, OnInit } from '@angular/core';
import { Toy } from 'src/app/models/toy.model';
import { ToyService } from '../../services/toy.service';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  loadingEdit: boolean = false;
  errorEdit: string = '';
  toy!: Toy;
  id!: string | null;
  fileUpload!: string;
  userInfo!: User;

  constructor(
    private userService: UserService,
    private toyService: ToyService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userService.currentUser.subscribe((x: User) => (this.userInfo = x));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    if (this.id) {
      this.toyService.detailToy(this.id).subscribe((t: Toy) => {
        this.toy = t;
      });
    }
  }

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
    if (this.id) {
      this.toyService
        .editToy(
          this.id,
          this.toy.name,
          this.fileUpload,
          this.toy.rentPrice,
          this.toy.salePrice,
          this.userInfo.token
        )
        .subscribe(
          (res) => {
            console.log(res);
            if (res.message === 'Toy update') {
              this.router.navigateByUrl(`/toy/${this.id}`).then();
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}
