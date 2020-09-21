'use strict';

class BlogItem {
  constructor(data, baseUrl) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.date = data.date;
    this.videolink = data.videolink;
    this.imagelink = data.imagefilename ? `${baseUrl}blog/${data.imagefilename}` : null;
  }
}

export default BlogItem;