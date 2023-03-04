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
  allOffers: any = [];
  offers: any = [];
  offersCats: any = [];

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

    this.api('/batch', 'post', {
      requests: [
        {
          path: "/Testimonials",
          body: {
            fields: "Name,positionName,Text",
            limit: -1,
            locale: "En,Ar",
            media: "images"
          },
          method: "get",
        },
        {
          path: "/QnA",
          body: {
            fields: "Question,Answer",
            limit: -1,
            locale: "En,Ar",
          },
          method: "get",
        },
        {
          path: "/Sections",
          body: {
            fields: "Title,Section,Text,specs,Brief",
            limit: -1,
            locale: "En,Ar",
            media: "images"
          },
          method: "get",
        },
        {
          path: "/_Locale",
          body: {
            fields: "Key,En,Ar",
            limit: -1,
          },
          method: "get",
        },
        {
          path: "/Offers",
          body: {
            fields: "Title,categories,Text,Price",
            locale: "En,Ar",
            limit: -1,
            media: "images"
          },
          method: "get",
        },
        {
          path: "/Offers/categories",
          body: {},
          method: "get",
        }
      ]
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);


        console.log('testimonials:', data);
        this.testimonials = data[0].results;


        console.log('questions:', data);
        this.questions = data[1].results;



        console.log('sections:', data[2]);
        this.sections = data[2].results;

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

        console.log('localizations:', data[3]);
        this.localizations = data[3].results;

        // only in localizations (array to object + localstorage)
        obj = Object.assign(
          {},
          ...this.localizations.map((x: any) => ({ [x.Key]: x }))
        );
        this.localizations = obj;
        console.log('localizations:', this.localizations);
        localStorage.setItem("localizations", JSON.stringify(obj));


        this.allOffers = data[4].results;
        this.offers = data[4].results;
        console.log('allOffers', this.allOffers)



        this.offersCats = data[5].results;
        console.log('offersCats', this.offersCats)
        // End





        setTimeout(() => {
          let offersCats: any = document.querySelectorAll("#event-flters li");
          for (const o of offersCats) {
            o.addEventListener('click', function () {
              for (const o of offersCats) {
                o.classList.remove('filter-active');
              }
              o.classList.add('filter-active');
            })
          }
        }, 500)
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
    document.querySelector('body')?.classList.add(this.lan);


    // when language changes, change the cookie
    this.setCookie("language", this.lan, null);
    console.log(this.lan)
  }


  changeImages(cat_id: any) {
    if (cat_id == 'all') this.offers = this.allOffers;
    else {
      this.offers = [];
      for (let i = 0; i < this.allOffers.length; i++) {
        const element = this.allOffers[i];
        if (element.categories[0].objectId == cat_id) {
          this.offers.push(element);
        }
      }
    }
    let xx = `new Swiper('.slides-3', {
      speed: 600,
      loop: false,
      autoplay: {
        delay: 5000,
        disableOnInteraction: true
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40
        },

        1200: {
          slidesPerView: ${this.offers.length < 3 ? this.offers.length : 3},
        }
      }
    });`
    setTimeout(() => {
      eval(xx);
    }, 100);
    console.log("hiii", this.offers);
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



