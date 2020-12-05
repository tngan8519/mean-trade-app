import { Component, OnInit } from '@angular/core';
import { Toy } from 'src/app/models/toy.model';
import { ToyService } from '../../services/toy.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  toys!: Toy[];
  loading: boolean = false;
  error: boolean = false;
  constructor(private toyService: ToyService) {}

  ngOnInit(): void {
    this.loading = true;

    this.toyService.toyBrowse().subscribe(
      (data) => {
        // console.log(data);
        this.loading = false;
        this.toys = data;
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }
}
