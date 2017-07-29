import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'

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

  sessionId: string;

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

  constructor(private collaboration: CollaborationService,
              private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
    });
  }

  initEditor() {
    this.editor = ace.edit('editor');
    this.editor.setTheme("ace/theme/eclipse");
    this.resetEditor();

    // remove cursor focus on the textarea
    document.getElementsByTagName('textarea')[0].focus();

    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChanged = null;

    // register change callback, when change the editor, create change event and sent back to server through collaboration service
    this.editor.on('change', e => {
      console.log('editor changed: ' + JSON.stringify(e));
      if(this.editor.lastAppliedChanged != e) {
        this.collaboration.change(JSON.stringify(e));
      }

    });

    // cursor move handle cursor change event
    this.editor.getSession().getSelection().on('changeCursor', () => {
      const cursorPosition = this.editor.getSession().getSelection().getCursor();
      this.collaboration.cursorMove(JSON.stringify(cursorPosition));
    })

    // restore buffer get the change from the other participants
    this.collaboration.restoreBuffer();

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
