import { Component, OnInit } from '@angular/core';
import { Toy } from 'src/app/models/toy.model';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { ToyService } from '../../services/toy.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  toy!: Toy;
  id!: string | null;

  userInfo!: User;
  loadingDetail: boolean = false;
  errorDetail: string = '';
  loadingDelete: boolean = false;
  errorDelete: string = '';
  date!: string;
  isSameUser: boolean = false;

  constructor(
    private userService: UserService,
    private toyService: ToyService,
    private route: ActivatedRoute,
    private router: Router
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
        this.date = new Date(t.createdAt).toUTCString();
        this.isSameUser =
          this.userInfo && this.toy.author._id === this.userInfo._id;
      });
    }
  }

  handleDelete(toyid: string) {
    this.loadingDelete = true;
    this.toyService.deleteToy(toyid, this.userInfo.token).subscribe(
      (res) => {
        this.loadingDelete = false;
        this.router.navigateByUrl('/browse').then();
      },
      (err) => {
        this.loadingDelete = false;
        this.errorDelete = err;
      }
    );
  }
}
