import { Component, OnInit, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sections: any = [];
  testimonials: any = [];
  questions: any = [];

  localizations: any = [];
  // read language from cookie if exist, otherwise, its En
  lan: any = this.getCookie("language") ? this.getCookie("language") : "En";

  ngOnInit(): void {
    // params: Object = { // get
    // fields: "Title,Section,Text,specs",
    // limit: -1,
    // locale: "En,Ar",
    // media: "images"
    //   // where: {
    //   //   Title: "hello"
    //   // }
    // };

    // Put or Post
    // params = { 
    //   Title: "gjdos",
    //   Text: "fdsjhfdskj",
    // }

    // Put and delete -> path = /table/objectId


    //Get for sections

    // this.api('/Sections/', 'get', {
    //   fields: "Title,Section,Text,specs,Brief",
    //   limit: -1,
    //   locale: "En,Ar",
    //   media: "images"
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Success:', data);
    //     this.sections = data.results;


    //Get for testimonials

    this.api('/Testimonials/', 'get', {
      fields: "Name,positionName,Text",
      limit: -1,
      locale: "En,Ar",
      media: "images"
    })
      .then(response => response.json())
      .then(data => {
        console.log('testimonials:', data);
        this.testimonials = data.results;
      })
      .catch((error) => {
        console.error('Error:', error);
      });


    //Get for QnA

    this.api('/QnA/', 'get', {
      fields: "Question,Answer",
      limit: -1,
      locale: "En,Ar",
    })
      .then(response => response.json())
      .then(data => {
        console.log('questions:', data);
        this.questions = data.results;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    //get for sections

    this.api('/Sections/', 'get', {
      fields: "Title,Section,Text,specs,Brief",
      limit: -1,
      locale: "En,Ar",
      media: "images"
    })
      .then(response => response.json())
      .then(data => {
        console.log('sections:', data);
        this.sections = data.results;

        // Make specs Arabic and english
        for (let index = 0; index < Object.keys(this.sections).length; index++) {
          let key = Object.keys(this.sections)[index];
          let specs: any = {
            En: [],
            Ar: []
          };
          for (let i = 0; i < this.sections[key]?.specs?.length; i++) {
            if (this.sections[key].specs[i].Name.slice(-3) == '_en') {
              this.sections[key].specs[i].Name = this.sections[key].specs[i].Name.slice(0, -3);
              specs.En.push(this.sections[key].specs[i]);
            }
            else {
              specs.Ar.push(this.sections[key].specs[i]);
            }
          }
          this.sections[key].specs = specs;
        }

        // only in sections (array to object + localstorage)
        let obj = Object.assign(
          {},
          ...this.sections.map((x: any) => ({ [x.Section]: x }))
        );
        this.sections = obj;


        console.log("localstorage", this.sections);
        localStorage.setItem("sections", JSON.stringify(obj));
        // End
      })


      .catch((error) => {
        console.error('Error:', error);
      });


    //localizations
    this.api('/_Locale/', 'get', {
      fields: "Key,En,Ar",
      limit: -1,
    })
      .then(response => response.json())
      .then(data => {
        console.log('localizations:', data);
        this.localizations = data.results;

        // only in localizations (array to object + localstorage)
        let obj = Object.assign(
          {},
          ...this.localizations.map((x: any) => ({ [x.Key]: x }))
        );
        this.localizations = obj;
        console.log('localizations:', this.localizations);
        localStorage.setItem("localizations", JSON.stringify(obj));
        // End
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }


  api(path: String, method: String, obj: any): Promise<Response> {
    let p = 'https://beaapis.com/1' + path;
    method = method.toUpperCase();
    if (method == 'GET') p += ('?' + new URLSearchParams(obj));
    let o: any = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        "X-BEA-Application-ID": "fmvXhJD8y762E1qDkxcXWQJWcMaa3ds67i7WEA0wBkk",
        "X-BEA-Authorization": "lnsONvkZXx4orqYMmEYDgTfdv2VbXvRCJBRThdKAkoQ",
      }
    };
    if (method != 'GET') o['body'] = JSON.stringify(obj);
    return fetch(p, o);
  }

  changeLanguage() {
    if (this.lan == 'En') this.lan = 'Ar';
    else this.lan = 'En';

    // when language changes, change the cookie
    this.setCookie("language", this.lan, null);
    console.log(this.lan)
  }




  // functions related to cookies
  setCookie(name: any, value: any, days: any) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  getCookie(name: any) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
}



