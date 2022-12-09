import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Student } from '../models/student';
import { StudentService } from '../services/student.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-modify-student',
  templateUrl: './modify-student.page.html',
  styleUrls: ['./modify-student.page.scss'],
})
export class ModifyStudentPage implements OnInit {

  public student: Student;
  public studentModify: Student;
  public docId: string;
  public myForm: FormGroup;
  public validatorMessages: object;

  constructor(private studentService: StudentService, private fb: FormBuilder,private router:Router,private toastController: ToastController, private activatedRouter: ActivatedRoute) { 
    this.student = {
      controlnumber: '',
      name: '',
      curp: '',
      age: 0,
      nip: 0,
      email: '',
      career: '',
      photo: ''
    }
  }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe((params) => {
      this.studentService.getStudentById(params.id).subscribe(item=>{
        this.student = item as Student;
        this.docId = params.id;
      });
    });

    this.myForm = this.fb.group({
      name:["", Validators.required],
      curp:["", Validators.compose([Validators.required, Validators.pattern('^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$')])],
      age:["", Validators.compose([Validators.required, Validators.min(17)])],
      nip:["", Validators.compose([Validators.required, Validators.min(10)])],
      email:["", Validators.compose([Validators.required, Validators.email])],
      career:["", Validators.required],
      photo:["", Validators.compose([Validators.required])]
    });
    

    this.validatorMessages = {
      'name': [
        { type: 'required', message: "Debe capturar el nombre"}
      ],
      'curp': [
        { type: 'required', message: "Debe capturar la CURP"},
        { type: 'pattern', message: "La CURP parece estar mal formada"}
      ],
      'age': [
        { type: 'required', message: "Debe capturar la edad"},
        { type: 'min', message: "La edad es incorrecta"}
      ],
      'nip': [
        { type: 'required', message: "Debe capturar el NIP"},
        { type: 'min', message: "El NIP debe ser mayor a 9"}
      ],
      'email': [
        { type: 'required', message: "Debe capturar el email"},
        { type: 'email', message: "El email parece estar mal formado"}
      ],
      'career': [
        { type: 'required', message: "Debe capturar la carrera"}
      ],
      'photo': [
        { type: 'required', message: "Debe capturar la url de la fotografía"}
      ]
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Alumno modificado',
      duration: 1500,
      position: 'bottom'
    });
    this.router.navigate([".."]);
    await toast.present();
  }

  public modifyStudent() {
    this.studentModify = {
      controlnumber: this.student.controlnumber,
      name: this.myForm.controls.name.value,
      curp: this.myForm.controls.curp.value,
      age: this.myForm.controls.age.value,
      nip: this.myForm.controls.nip.value,
      email: this.myForm.controls.email.value,
      career: this.myForm.controls.career.value,
      photo: this.myForm.controls.photo.value,
    }
    this.studentService.modifyStudent(this.docId,this.studentModify)
    this.presentToast();
    
  }

}
