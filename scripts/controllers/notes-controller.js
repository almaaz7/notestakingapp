//controller (i/o) + events + talk to service

import { noteOperations } from '../services/note-service.js';
window.addEventListener('load', init);
function init() {
    showCounts();
    bindEvents();
    // disableButton();
}
var count = 1;

const disableButton = () => document.querySelector('#delete').disabled = true;
const enableButton = () => document.querySelector('#delete').disabled = false;

function bindEvents() {
    document.querySelector('#add').addEventListener('click', addNote);
    document.querySelector('#delete').addEventListener('click', deleteMarked);
    document.querySelector('#search').addEventListener('click', searchButton);
    document.querySelector('#sort').addEventListener('click', sortIcon);
    document.querySelector('#update').addEventListener('click', update);
    document.querySelector('#clearall').addEventListener('click', clear);
    document.querySelector('#save').addEventListener('click', save);
    document.querySelector('#load').addEventListener('click', load);
}

function clear() {
    noteOperations.clearAll();
    showCounts();
    printNotes(noteOperations.getNotes());
    deletedata();
}
function deleteMarked() {
    noteOperations.remove();
    printNotes(noteOperations.getNotes()); // printnotes and printnote are two different function
}
function showCounts() {
    noteOperations.marktotal() > 0 ? enableButton() : disableButton();
    document.querySelector('#total').innerText = noteOperations.total();
    document.querySelector('#marktotal').innerText = noteOperations.marktotal();
    document.querySelector('#unmarktotal').innerText = noteOperations.unmarktotal();
}
function addNote() {
    const fields = ['id', 'title', 'desc', 'cdate', 'importance'];
    const noteObject = {}; //object literal we want specific object.
    for (let field of fields) {
        noteObject[field] = document.querySelector(`#${field}`).value;
    }
    noteOperations.add(noteObject);
    printNote(noteObject);
    for (let field of fields) {
        let space = document.querySelector(`#${field}`);
        space.value = "";
    }
    showCounts();
}

function printIcon(myClassName = 'trash', fn, id) {
    const iTag = document.createElement('i');
    iTag.setAttribute('note-id', id);//we create our own attribute
    iTag.className = `fa-solid fa-${myClassName} me-5 hand`;
    iTag.addEventListener('click', fn);
    return iTag;
}
function toggleMark() {
    //console.log("toogle", this)
    const icon = this;
    const id = this.getAttribute('note-id');
    noteOperations.toggleMark(id);
    const tr = icon.parentNode.parentNode;
    // tr.className = 'table-danger';
    tr.classList.toggle('table-danger');
    showCounts();
}
function edit() {
    const icon = this;
    const id = this.getAttribute('note-id');
    const tr = icon.parentNode.parentNode;
    const fields = ['id', 'title', 'desc', 'cdate', 'importance'];
    for (var i = 0; i < fields.length; i++) {
        document.querySelector(`#${fields[i]}`).value = tr.cells[i].innerHTML;
    }
}

function update() {
    let id = document.querySelector('#id').value;
    let revnote = noteOperations.seachById(id);
    revnote.title = document.querySelector('#title').value;
    revnote.desc = document.querySelector('#desc').value;
    revnote.cdate = document.querySelector('#cdate').value;
    revnote.importance = document.querySelector('#importance').value;
    const tbody = document.querySelector('#notes');
    tbody.innerHTML = '';
    printNote(revnote);
}

function printNotes(notes) { //we have to pass the argument in the function
    const tbody = document.querySelector('#notes');
    tbody.innerHTML = '';
    notes.forEach(note => printNote(note));
    showCounts();
}
function printNote(noteObject) {
    const tbody = document.querySelector('#notes');
    const row = tbody.insertRow(); //create <tr>
    for (let key in noteObject) {
        if (key == 'isMarked') {
            continue;
        }
        const td = row.insertCell(); //<td>
        td.innerText = noteObject[key];
    }
    const td = row.insertCell();
    td.appendChild(printIcon('trash', toggleMark, noteObject.id));
    td.appendChild(printIcon('user-pen', edit, noteObject.id));

}

function find() {

    const searhBy = document.querySelector('#selectValue').value;
    let foundValue;
    if (searhBy == 'byid') {
        const seachValue = document.querySelector('#searchvalue').value;
        foundValue = noteOperations.seachById(seachValue);
        const tbody = document.querySelector('#notes');
        tbody.innerHTML = '';
        printNote(foundValue);
    }
    else if (searhBy == 'bytitle') {
        const seachValue = document.querySelector('#searchvalue').value;
        foundValue = noteOperations.searchByTitle(seachValue);
        const tbody = document.querySelector('#notes');
        tbody.innerHTML = '';
        printNote(foundValue);
    } else {
        alert("select value");
    }
}

function searchButton() {
    let searchBox = document.getElementById('searchbox');
    searchBox.classList.toggle('karleToggle');
    document.querySelector('#findresult').addEventListener('click', find);
}

function sortIcon() {
    const th = document.querySelectorAll('.sort');
    for (const t of th) {
        t.classList.toggle("sortable");
    }
    document.querySelector('.title').addEventListener('click', function () { sortfn("title") });
    document.querySelector('.cdate').addEventListener('click', function () { sortfn("cdate") });

}
function sortfn(by) {
    let sortdata = noteOperations.sort(by);
    const tbody = document.querySelector('#notes');
    tbody.innerHTML = '';
    printNotes(sortdata);
}

function save() {
    if (window.localStorage) {
        const data = noteOperations.getAllNotes();
        localStorage.setItem('userData', JSON.stringify(data));
        console.log('data stored');
    } else {
        console.log('outdated browser');
    }
}

function load() {
    if (window.localStorage) {
        const data = localStorage.getItem('userData');
        console.log(JSON.parse(data));
        let revdata = noteOperations.setdata(JSON.parse(data));
        const tbody = document.querySelector('#notes');
        tbody.innerHTML = '';
        printNotes(revdata);
    } else {
        console.log('null');
    }
}

function deletedata() {
    localStorage.removeItem('userData');
    console.log('data deleted');
}


// function load() {
//     if (window.localStorage) {
//         const alltast = localStorage.task;
//         noteOperations.setalltask(JSON.parse(alltast));
//     } else {
//         alert("browser ")
//     }
// }
