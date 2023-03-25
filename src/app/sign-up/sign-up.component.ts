import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../database.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})


export class SignUpComponent implements OnInit {
  checkoutForm = this.formBuilder.group({
    fname: '',
    lname: '',
    email: '',
    password: '',
    privilege: ''

  });
  constructor(private dbService: DatabaseService, private formBuilder: FormBuilder) {


  }

  ngOnInit(): void {


  }

  signUp() {
    console.log({
      Email: this.checkoutForm.value.email,
      Password: this.checkoutForm.value.password,
      firstName: this.checkoutForm.value.fname,
      lastName: this.checkoutForm.value.lname,
    })
    this.dbService.api("/Users", "post", {
      Email: this.checkoutForm.value.email,
      Password: this.checkoutForm.value.password,
      firstName: this.checkoutForm.value.fname,
      lastName: this.checkoutForm.value.lname,
    }).then(response => response.json())
      .then(data => {
        console.log(data);

        this.dbService.api("/Privileges", "post", {
          User: data.results[0].objectId,
          Type: this.checkoutForm.value.privilege
        })
      })
  }
}

