import { Injectable } from '@angular/core';
import { Problem } from 'app/data-structure/problem'
import { PROBLEMS} from 'app/mock-problems'

@Injectable()
export class DataService {
  // since PROBLEMS is a const, we need a variable
  problems: Problem[] = PROBLEMS;
  constructor() { }

  getProblems(): Problem[] {
    return this.problems;
  }

  getProblem(id: number): Problem {
    return this.problems.find((problem) => problem.id === id)
  }

  addProblem(problem: Problem) {
    // TODO
    problem.id = this.
  }

}
