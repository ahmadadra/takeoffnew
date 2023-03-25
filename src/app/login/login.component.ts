import { DatabaseService } from './../database.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  checkoutForm = this.formBuilder.group({
    email: '',
    password: ''
  });
  constructor(private dbService: DatabaseService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  }

  login() {

    let o = {
      fields: "Email,firstName,lastName",
      where: {
        Email: this.checkoutForm.value.email,
        Password: this.checkoutForm.value.password
      }
    }
    console.log(o);
    this.dbService.api('/Users', 'get', o).then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.results.length) {
          // Sucsess
          alert("Success");
        } else {
          // Failed
          alert("Invalid Username or Password");
        }

      })



  }


}
