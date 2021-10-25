const sql = require("../config/db.js");
const tables = require('../config/db.tables.js');

// constructor
const Blog = function(blog) {
  this.id = blog.id;
  this.title = blog.title;
  this.date = blog.date;
  this.description = blog.description;
  this.videolink = blog.videolink;
  this.imagefilename = blog.imagefilename;
  this.coverfilename = blog.coverfilename;
  this.tags = blog.tags;
};

Blog.create = (newBlog) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.BLOG} SET ?`, newBlog, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve({ id: res.insertId, ...newBlog });
        });
    });
};

Blog.findById = (blogId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.BLOG} WHERE id = ${blogId}`, (err, res) => {
            if (err) {
                reject(err);
            } else if (res.length) {
                resolve(res[0]);
            } else {
                resolve();
            }
        });
    });
}

Blog.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.BLOG}`, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Blog.getTags = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT tags FROM ${tables.BLOG}`, (err, res) => {
            if (err) {
                reject(err);
            } else {
                if (res && res.length) {
                    const tags = [];
                res.forEach(element => {
                    element.tags.split(',').forEach((tag) => {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    })
                });
                resolve(tags);
                } else {
                    resolve([]);
                }
            }
        });
    });
}

Blog.updateById = (id, blog) => {
    return new Promise((resolve, reject) => {
        sql.query(
            `UPDATE ${tables.BLOG} SET ` +
            "title = ?, " +
            "description = ?, " +
            "videolink = ?, " + 
            "imagefilename = ?, " + 
            "coverfilename = ?, " +
            "tags = ? " +
            "WHERE id = ?",
            [
                blog.title,
                blog.description,
                blog.videolink,
                blog.imagefilename,
                blog.coverfilename,
                blog.tags,
                id
            ],
            (err, res) => {
                if (err) {
                    reject(null, err);
                }
        
                if (res.affectedRows == 0) {
                    // not found blog with the id
                    reject();
                }
        
                resolve({ id: id, ...blog });
            }
        );
    });
};

Blog.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.BLOG} WHERE id = ?`, id, (err, res) => {
            if (err) {
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found blog with the id
                reject();
                return;
            }
            resolve(res);
        });
    });

};

Blog.removeAll = result => {
sql.query(`DELETE FROM ${tables.BLOG}`, (err, res) => {
    if (err) {
        result(null, err);
        return;
    }
    result(null, res);
});
};


module.exports = Blog;