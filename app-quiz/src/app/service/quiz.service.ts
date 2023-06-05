import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) {
  }

  findAll(): Observable<any> {
    return this.http.get<any>('https://opentdb.com/api.php?amount=5');
  }

}
