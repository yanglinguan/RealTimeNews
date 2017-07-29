import { Component, OnInit } from '@angular/core';

import { CollaborationService } from '../../services/collaboration.service'

// will find the type of ace in runtime
declare const ace: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  editor: any;
  languages: string[] = ['Java', 'Python', 'JavaScript', "C++"];
  language: string = 'Java';
  defaultContent = {
    'JavaScript': `function foo(items) {
      var x = "All this is syntax highlighted";
      return x;
    }`,
    'Java': `public class Example {
    public static void main(String[] args) {
      // Type your Java code here
      }
    }`,
    'C++': `int main() {
      // Type your C++ code here
      return 0;
      }`,
    'Python': `class Solution:
    def example():
      # Write your Python code here`
  }

  constructor(private collaboration: CollaborationService) { }

  ngOnInit() {
    this.editor = ace.edit('editor');
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor()
    this.collaboration.init();
  }

  setLanguage(language: string) {
    this.language = language;
    this.resetEditor();
    
  }

  resetEditor(): void {
    console.log('Resetting editor...');
    this.editor.getSession().setMode(`ace/mode/${this.convertLanguage()}`);
    this.editor.setValue(this.defaultContent[this.language])
  }

  submit() {
    const userCode = this.editor.getValue();
    console.log(userCode)

  }

  convertLanguage(): string {
    if ( this.language === "C++" ) {
      return "c_cpp"
    } else {
      return this.language.toLowerCase()
    }
  }

}
