import { Injectable } from '@angular/core';
import { Problem } from 'app/data-structure/problem'
//import { PROBLEMS} from 'app/mock-problems'

import { Http, Response, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/toPromise'

@Injectable()
export class DataService {
  // since PROBLEMS is a const, we need a variable
  //problems: Problem[] = PROBLEMS;

  private _problemSource = new BehaviorSubject<Problem[]>([]);
  constructor(private http: Http) { }

  getProblems(): Observable<Problem[]> {
    //return this.problems;
    // http.get return Observable
    // Observable can be subscribed by others, when change, it will notify others
    this.http.get('api/v1/problems')
    .toPromise()
    .then((res: Response) => {
      // .next create new data
      this._problemSource.next(res.json())
    })
    .catch(this.handleError)

    return this._problemSource.asObservable()
  }

  getProblem(id: number) {
    //return this.problems.find((problem) => problem.id === id)

    return this.http.get(`api/v1/problems/${id}`)
    .toPromise()
    .then((res:Response) => {
      return res.json()
    })
    .catch(this.handleError)
  }

  addProblem(problem: Problem) {
    const headers = new Headers({'content-type': 'application/json'});
    return this.http.post('api/v1/problems', problem, headers)
    .toPromise()
    .then((res: Response) => {
      this.getProblems()
      return res.json()
    })
    .catch(this.handleError)
  }

  private handleError(err: any): Promise<any> {
    console.error('an error occured', err)
    return Promise.reject(err)
  }

}
