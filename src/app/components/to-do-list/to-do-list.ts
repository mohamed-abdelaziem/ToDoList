import { Component, computed, Host, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITask } from '../../interfaces/task.interface';
type status = "all" | "complete" | "active";

@Component({
  selector: 'app-to-do-list',
  imports: [FormsModule],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.css',
})


export class ToDoList{

// activeProperty
activeTab : string = 'all';

// inject tostar service
private toastr = inject(ToastrService);

// title of task
taskTitle : string = '';

// taskList Array
tasksList = signal<ITask[]>([]);

// complete array
completeList = signal<ITask[]>([]);

// active array
activeList  = signal<ITask[]>([]);




// save to localStorage
saveToLocalStorage(key : string , value : any) {
localStorage.setItem(key,JSON.stringify(value));
}


// add task function
addTask():void{
if(this.taskTitle == ''){
this.toastr.error(`please enter valid data and don't make this input is empty`); 
return ;
}else {
this.tasksList.update((oldTask)=> [...oldTask , {id : this.tasksList().length + 1 , active : true , complete : false , title : this.taskTitle}])
this.saveToLocalStorage('tasksList' , this.tasksList());
this.taskTitle = '';
this.activeList = signal(this.tasksList().filter((task)=>task.active == true));
this.toastr.success('your task is added success');
}
}

// delete task from tasksList
deleteTasksList(taskTitle : string):void {
let indexOfDeletedTask = this.tasksList().findIndex((task)=>task.title == taskTitle);
this.tasksList().splice(indexOfDeletedTask , 1);
this.completeList = signal(this.tasksList().filter((task)=>task.complete == true));
this.activeList = signal(this.tasksList().filter((task)=>task.active == true));
this.saveToLocalStorage('tasksList',this.tasksList());
}



// add to compelte
addToComplete(eventInfo : any,taskTitle : string){
let completedTask = this.tasksList().find((task)=>task.title == taskTitle);
let checkElement = eventInfo.target;
if(completedTask){
if(checkElement.checked){
completedTask.complete = true;
completedTask.active = false;
this.activeList = signal(this.tasksList().filter((task)=>task.active == true));
this.completeList = signal(this.tasksList().filter((task)=>task.complete == true));
this.saveToLocalStorage('tasksList',this.tasksList());
}else{
completedTask.complete = false;
completedTask.active = true;
this.activeList = signal(this.tasksList().filter((task)=>task.active == true))
this.completeList = signal(this.tasksList().filter((task)=>task.complete == true));
this.saveToLocalStorage('tasksList',this.tasksList());
}
return;
}else {
return ; 
}



}


// delete from active array 
deleteFromActive(title : string){
let deletedTaskFromActiveArray = this.activeList().findIndex((task)=>task.title == title);
let deleteTaskFromActiveArrayInTaskslist = this.tasksList().find((task)=>task.title == title);
this.saveToLocalStorage('tasksList' , this.tasksList());
this.activeList().splice(deletedTaskFromActiveArray,1);
if(deleteTaskFromActiveArrayInTaskslist){
deleteTaskFromActiveArrayInTaskslist.active = false;
this.saveToLocalStorage('tasksList' , this.tasksList());
}
}


deleteFromComplete(taskTitle : string){
let deletedTaskFromComplete = this.completeList().findIndex((task)=>task.title == taskTitle);
let deletedTaskFromCompleteInTasksList = this.tasksList().find((task)=>task.title == taskTitle);
this.completeList().splice(deletedTaskFromComplete,1);
this.activeList = signal(this.tasksList().filter((task)=>task.active == true));
this.saveToLocalStorage('tasksList',this.tasksList());
if(deletedTaskFromCompleteInTasksList){
deletedTaskFromCompleteInTasksList.complete = false;
deletedTaskFromCompleteInTasksList.active = true;
this.activeList = signal(this.tasksList().filter((task)=>task.active == true));
this.saveToLocalStorage('tasksList' , this.tasksList());
}

}






ngOnInit(): void{
let existTasksListInLocalStorage = localStorage.getItem("tasksList");
if(existTasksListInLocalStorage !==null){
this.tasksList = signal( JSON.parse(existTasksListInLocalStorage));
this.completeList = signal(this.tasksList().filter((task)=>task.complete == true));
this.activeList = signal(this.tasksList().filter((task)=>task.active == true));
}else {
this.tasksList = signal([]);
this.completeList = signal([]);
this.activeList = signal([]);
}



}












}
