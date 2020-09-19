'use strict';

class Blog {
    constructor(data) {
      this.id = data.id;
      this.title = data.title;
      this.description = data.description;
      this.date = data.date;
      this.videolink = data.videolink;
      this.imagelink = data.imagelink;
    }
}