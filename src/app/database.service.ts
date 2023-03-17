import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

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
}
