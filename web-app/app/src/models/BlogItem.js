'use strict';

class BlogItem {
  constructor(data, baseUrl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.date = data.date ? new Date(data.date.split('T')[0]).toLocaleDateString('fr-FR', options) : '';
    this.videolink = data.videolink;
    this.imagelink = data.imagefilename ? `${baseUrl}${data.imagefilename}` : null;
    this.coverlink = data.coverfilename ? `${baseUrl}${data.coverfilename}` : null;
    this.tags = data.tags && data.tags.length ? data.tags.split(',') : [];
  }
}

export default BlogItem;