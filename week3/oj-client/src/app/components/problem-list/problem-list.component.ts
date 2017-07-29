import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from 'app/data-structure/problem'; // angular-cli.json define the root is 'src'

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[] = [];
  // inject data service
  constructor(@Inject('data') private dataService) { }

  // before the view is created, ngOnInit will be called
  ngOnInit() {
    this.getProblems();
  }

  getProblems(): void {
    // will use Promiss(async)
    //this.problems = this.dataService.getProblems();
    // getProblems return an observable, when new problem added, problems will also be updated
    this.dataService.getProblems()
    .subscribe(problems => this.problems = problems);
  }

}
