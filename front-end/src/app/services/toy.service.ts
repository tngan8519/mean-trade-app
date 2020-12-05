import { Injectable } from '@angular/core';
import { Toy } from '../models/toy.model';
// import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ToyService {
  url: string = environment.serverURL;
  // private currentToysSubject: BehaviorSubject<Toy[]>;

  constructor(private http: HttpClient) {
    // this.currentToysSubject = new BehaviorSubject<Toy[]>([]);
  }

  toyBrowse() {
    return this.http.get<Toy[]>(`${this.url}/api/toys`).pipe(
      map((toys) => {
        // this.currentToysSubject.next(toys);

        return toys;
      })
    );
  }

  detailToy(id: string) {
    return this.http.get<any>(`${this.url}/api/toys/${id}`);
  }

  toyUploadImage(fileToUpload: File) {
    let formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http.post<any>(`${this.url}/api/toys/uploadImage`, formData);
  }
  toyPost(
    name: string,
    fileUpload: string,
    rentPrice: number,
    salePrice: number,
    token: string
  ) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.post<any>(
      `${this.url}/api/toys`,
      {
        name,
        imgSrc: fileUpload,
        rentPrice,
        salePrice,
      },
      options
    );
  }
  deleteToy(id: string, token: string) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.delete<Toy>(`${this.url}/api/toys/${id}`, options);
  }

  editToy(
    id: string,
    name: string,
    fileUpload: string,
    rentPrice: number,
    salePrice: number,
    token: string
  ) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = { headers: headers };
    return this.http.put<any>(
      `${this.url}/api/toys/${id}`,
      { name, imgSrc: fileUpload, rentPrice, salePrice },
      options
    );
  }
}
