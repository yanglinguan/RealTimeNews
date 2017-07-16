import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from "app/data-structure/problem"

// .freeze: 
const DEFAULT_PROBLEM: Problem = Object.freeze({
  id:0,
  name: '',
  desc: '',
  difficulty: ''
})

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM)
  difficulties: string[]
  constructor(@Inject('data') private dataService) { }

  ngOnInit() {
  }

  

  

}
