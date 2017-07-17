import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from "app/data-structure/problem"

// .freeze: object cannot be changed
const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: '',
  desc: '',
  difficulty: 'easy'
})

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  // Object.assign create shadow copy
  // after user submit the new problem, the newProblem reset back to default problem
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];

  constructor(@Inject('data') private dataService) { }

  ngOnInit() {
  }

  addProblem() {
    this.dataService.addProblem(this.newProblem)
    .catch(err => console.log(err));
    // should reset the newProblem
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);


  }

}
