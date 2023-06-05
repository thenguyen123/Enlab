import {Component, OnInit} from '@angular/core';
import {QuizService} from '../service/quiz.service';
import {Quiz} from '../model/quiz';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {QuizResult} from '../model/quiz-result';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  listQuiz: Quiz[];
  resultListQuiz: QuizResult[];
  resultQuiz: QuizResult;
  quiz: Quiz;
  i = 0;
  listAnswer: string[];
  mapQuiz: Map<string, string> = new Map<string, string>();
  totalQuestion: number;
  check: boolean;
  answer: string;
  count = 0;
  currentDateStart: any;
  currentDateEnd: Date;
  workTime: number;
  workTimeSeconds: any;
  display: string;
  minutes: number;
  answerResult: string;
  checkDisplay: boolean;

  constructor(private quizService: QuizService) {
  }

  ngOnInit(): void {
    this.findAll();
    this.currentDateStart = new Date();
  }

  findAll() {
    this.quizService.findAll().subscribe(param => {
      this.listQuiz = param.results;
      this.totalQuestion = this.listQuiz.length;
      console.log(this.listQuiz);
      this.findQuestion();
    });
  }

  findQuestion() {
    this.quiz = this.listQuiz[this.i];
    this.addListAnswer();
  }

  choose(a: string, question: string) {
    this.mapQuiz.set(question, a);
  }

  addListAnswer() {
    this.quiz.incorrect_answers.push(this.quiz.correct_answer);
    this.listAnswer = this.shuffleArray(this.quiz.incorrect_answers);
  }

  shuffleArray(array: string[]) {
    array.sort(() => Math.random() - 0.5);
    return array;
  }

  checkAnswer(quiz: Quiz) {
    this.answer = '';
    this.check = false;
    this.i++;
    if (this.mapQuiz.get(quiz.question) === quiz.correct_answer) {
      this.answer = this.mapQuiz.get(quiz.question);
      this.check = true;
      this.count++;
      if (this.i === this.totalQuestion) {
        this.finish();
      }
      setTimeout(() => {
        this.findQuestion();
      }, 1000);
    } else {
      this.answer = this.mapQuiz.get(quiz.question);
      this.check = false;
      if (this.i === this.totalQuestion) {
        this.finish();
      }
      setTimeout(() => {
        this.findQuestion();
      }, 1000);
    }
  }

  finish() {
    this.currentDateEnd = new Date();
    this.workTime = Math.abs((this.currentDateEnd.getTime() - this.currentDateStart.getTime()) / 1000);
    this.minutes = Math.floor((this.workTime % 3600) / 60);
    this.workTimeSeconds = Math.floor(this.workTime % 60);
    this.display = this.minutes + ' minutes :' + this.workTimeSeconds + ' seconds';
    if (this.count > (this.totalQuestion / 2)) {
      Swal.fire({
        icon: 'success',
        title: 'Congratulations on completing the questions.Completion time is ' + this.display +
          '. The number of correct answers is ' + this.count + '/' + this.totalQuestion,
        showCancelButton: true,
        confirmButtonText: 'Review',
      }).then((result) => {
        if (result.isConfirmed) {
          this.checkDisplay = true;
          this.displayAnswer();
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Sorry you did not pass the test.Completion time is ' + this.display +
          '. The number of correct answers is' + this.count + '/' + this.totalQuestion,
        showCancelButton: true,
        confirmButtonText: 'Review',
      }).then((result) => {
        if (result.isConfirmed) {
          this.checkDisplay = true;
          this.displayAnswer();
        }
      });
    }
  }

  displayAnswer() {
    // tslint:disable-next-line:prefer-for-of
    this.resultListQuiz = [];
    for (let j = 0; j < this.listQuiz.length; j++) {
      this.answerResult = this.mapQuiz.get(this.listQuiz[j].question);

      this.resultQuiz = {
          quiz: this.listQuiz[j],
          chooseAnswer: this.answerResult
        };
      console.log(this.resultQuiz);
      this.resultListQuiz.push(this.resultQuiz);
    }
    console.log(this.resultListQuiz);
  }
}
