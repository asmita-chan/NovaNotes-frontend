import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note-service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-notes',
  imports: [FormsModule, UpperCasePipe, CommonModule, NgxSpinnerModule],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  constructor(private noteService: NoteService, private toastr: ToastrService, private cd: ChangeDetectorRef, private spinner: NgxSpinnerService){}
  ngOnInit(){
    this.spinner.show();
    this.userId = sessionStorage.getItem('userId');
    this.getAllNotes();
  }
  // searchText = '';
  // notes: any;
  // filteredNotes() {
  //   if (!this.searchText) return this.notes;
  //   return this.notes.filter((n: any) =>
  //     n.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
  //     n.content.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }
  userId: any;
  notesListAll: any[] = [];
  title: any;
  content: any;
  isDone: Boolean = false;
  notesId: any;
  showAddNote: Boolean = false;
  showUpdateNote: Boolean = false;
  // deleted : Boolean = false;

  username: String = 'Asmita';
  cardColors: any[] = [
  "linear-gradient(135deg, #FFD6E8, #FF9ACB)",  // pink
  "linear-gradient(135deg, #D6F1FF, #8BD1FF)",  // blue
  "linear-gradient(135deg, #E8FFD6, #B4FF8B)",  // green
  "linear-gradient(135deg, #FFF6D6, #FFE18B)",  // yellow
  "linear-gradient(135deg, #EBD6FF, #C69AFF)",  // purple
  "linear-gradient(135deg, #ffecec9c, #ff93939c)",
];
  showProfileMenu: any;
  toggleProfileMenu() {
    throw new Error('Method not implemented.');
  }
  notes = [];
  searchText = "";
  menuOpen = false;

  get userInitial() {
    return sessionStorage.getItem("username")?.charAt(0).toUpperCase() || "U";
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  filteredNotes() {
    if (!this.searchText) return this.notes;
    const s = this.searchText.toLowerCase();
    return;
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
    this.noteService.getAllNotes(postJson).subscribe({
      next: (res) => {
        this.notesListAll = res;
        this.spinner.hide();
        this.cd.detectChanges();
      },
      error: (err) => {
        this.toastr.error("Please try again later.", "Unable to fetch notes.")
        console.error(err);
        this.spinner.hide();
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
    this.noteService.addNote(postJson).subscribe({
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
    this.noteService.deleteNote(postJson).subscribe({
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
    this.noteService.updateNote(postJson).subscribe({
      next: (res) => {
        this.getAllNotes();
        setTimeout(() => {
          this.showUpdateNote = false;
        }, 0);
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
