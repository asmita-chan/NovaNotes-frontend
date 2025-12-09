import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note-service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-notes',
  imports: [FormsModule, UpperCasePipe, CommonModule, NgxSpinnerModule],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  constructor(private noteService: NoteService, private toastr: ToastrService, private cd: ChangeDetectorRef, private spinner: NgxSpinnerService, private router: Router, private ar: ActivatedRoute){}
  ngOnInit(){
    this.spinner.show();
    this.name = history.state?.name;
    console.log("name", this.name);
    this.userId = sessionStorage.getItem('userId');
    this.getAllNotes();
  }
  userId: any;
  notesListAll: any[] = [];
  notesListFiltered: any[] = [];
  title: any;
  content: any;
  isDone: Boolean = false;
  notesId: any;
  showAddNote: Boolean = false;
  showUpdateNote: Boolean = false;
  showProfileMenu: any;
  name: String = '';
  cardColors: any[] = [
    "linear-gradient(135deg, #FFD6E8, #FF9ACB)",  // pink
    "linear-gradient(135deg, #D6F1FF, #8BD1FF)",  // blue
    "linear-gradient(135deg, #E8FFD6, #B4FF8B)",  // green
    "linear-gradient(135deg, #FFF6D6, #FFE18B)",  // yellow
    "linear-gradient(135deg, #EBD6FF, #C69AFF)",  // purple
    "linear-gradient(135deg, #ffecec9c, #ff93939c)"
  ];
  notes = [];
  searchText = "";
  menuOpen = false;

  logout() {
    this.spinner.show();
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    this.router.navigate(['']).then(() => {
      this.spinner.hide();
    });
  }
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
  get userInitial() {
    return sessionStorage.getItem("username")?.charAt(0).toUpperCase() || "U";
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  filterNotes() {
    const text = this.searchText.trim().toLowerCase();
    if(text === ""){
      this.notesListFiltered = [...this.notesListAll];
      return;
    }
    this.notesListFiltered = this.notesListAll.filter(note => note.title.toLowerCase().includes(text) || note.content.toLowerCase().includes(text));
  }
  openAddModal() {
    this.showAddNote = true;
  }
  closeAddModal(){
    this.showAddNote = false;
  }
  openUpdateModal(note: any){
    this.showUpdateNote = true;
    this.title = note.title;
    this.content = note.content;
    this.isDone = note.isDone;
    this.notesId = note.notesId;
  }
  closeUpdateModal(){
    this.showUpdateNote = false;
    this.title = '';
    this.content = '';
    this.isDone = false;
    this.notesId = this.notesId;
  }
  getAllNotes(){
    let postJson = {
      "createdBy": this.userId
    }
    this.noteService.getAllNotes(postJson).pipe(finalize(() => this.spinner.hide())).subscribe({
      next: (res) => {
        this.notesListAll = res;
        this.notesListFiltered = [...this.notesListAll];
        this.cd.detectChanges();
      },
      error: (err) => {
        this.toastr.error("Please try again later.", "Unable to fetch notes.")
        console.error(err);
        this.cd.detectChanges();
      }
    })
  }
  addNote(){
    if(!this.title || this.title.trim().length===0){
      this.toastr.warning("Please choose a title");
      return;
    }
    let postJson = {
      "title": this.title,
      "content": this.content,
      "isDone": this.isDone,
      "activeFlag": "true",
      "createdBy": this.userId
    }
    this.spinner.show();
    this.noteService.addNote(postJson).pipe(finalize(() => this.spinner.hide())).subscribe({
      next: (res) => {
        this.getAllNotes();
        this.toastr.success("Note Added!");
        setTimeout(() => {
          this.showAddNote = false;
        }, 0);
        this.title = '';
        this.content = '';
        this.isDone = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error( "Please try again later.", "Unable to add note.");
        this.showAddNote = false;
      }
    })
  }
  deleteNote(note: any, event: Event){
    event.stopPropagation();
    note._deleted = true;
    let postJson = {
      "notesId": note.notesId
    }
    this.spinner.show();
    this.noteService.deleteNote(postJson).pipe(finalize(() => this.spinner.hide())).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.getAllNotes(), 700
        })
        this.toastr.success("Note deleted!");
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Please try again later.", "Unable to delete note.");
      }
    })
  }
  updateNote(){
    let postJson = {
      "notesId": this.notesId,
      "title": this.title,
      "content": this.content,
      "isDone": this.isDone,
      "activeFlag": "true"
    }
    this.spinner.show();
    this.noteService.updateNote(postJson).pipe(finalize(() => this.spinner.hide())).subscribe({
      next: (res) => {
        this.getAllNotes();
        setTimeout(() => {
          this.showUpdateNote = false;
        }, 0);
        this.title = '';
        this.content = '';
        this.isDone = false;
        this.toastr.success("Note Updated!");
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Please try again later.", "Unable to update note!");
        setTimeout(() => {
          this.showUpdateNote = false;
        }, 0);
      }
    })
  }
}
