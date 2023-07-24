//CRUD
import Note from "../models/note.js";

export const noteOperations = {
    notes:[],
    add(noteObject){
        const note = new Note(noteObject);
        this.notes.push(note);
    },
    total(){
        return this.notes.length;
    },
    seachById(id){
        return this.notes.find(note=>note.id==id);
    },
    searchByTitle(title){
        return this.notes.find(note=>note.title==title);
    },
    toggleMark(id){
        this.seachById(id).toggleMark();
        // const noteObject = this.seachById(id);
        // noteObject.isMarked = !noteObject.isMarked;
    },
    getNotes(){
        return this.notes;
    },
    remove(){
        this.notes = this.notes.filter(note=>!note.isMarked);
    },
    sort(by){
        const sortNote = [...this.notes];
        if(by==='title'){
        sortNote.sort((a,b)=>{
            let fa = a.title.toLowerCase(),
            fb = b.title.toLowerCase();

            if(fa < fb) return -1;
            if(fa > fb) return 1;
            return 0;
        });}
        else{
            sortNote.sort((a,b)=>{
                let da = new Date(a.cdate),
                db = new Date(b.cdate);

                return da-db;
            })
        }
        return sortNote; 
    },
    clearAll(){
        this.notes = this.notes.splice();
        return this.notes;
    },
    save(){

    },
    update(){
        return this.notes;
    },
    getAllNotes(){
        return this.notes;
    },
    setdata(data){
        this.notes = data;
        return this.notes;
    },
    // setalltask(newtaskarr){
    //     this.taskarr = newtaskarr;
    //     this.printArr();
    // },
    printArr(){
        const tbody = document.querySelector('itemstask');
        tbody.innerHTML = '';
        
    },
    marktotal(){
        return this.notes.filter(note=>note.isMarked).length;
    },
    unmarktotal(){
        return this.total()-this.marktotal();
    }
}
