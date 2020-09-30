const sql = require("../model/db.js");
const tableName= "blog";

// constructor
const Blog = function(blog) {
  this.id = blog.id;
  this.title = blog.title;
  this.date = blog.date;
  this.description = blog.description;
  this.videokink = blog.videolink;
  this.imagelink = blog.imagelink
};

Blog.create = (newBlog) => {
    return new Promise((resolve, reject) => {
        console.log(newBlog);
        sql.query(`INSERT INTO ${tableName} SET ?`, newBlog, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
            resolve({ id: res.insertId, ...newBlog });
        });
    });
};

Blog.findById = (blogId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tableName} WHERE id = ${blogId}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else if (res.length) {
                console.log("found blog: ", res[0]);
                resolve(res[0]);
            } else {
                console.log("no blog found with id " + blogId);
                resolve();
            }
        });
    });
}

Blog.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Blog.updateById = (id, blog) => {
    return new Promise((resolve, reject) => {
        sql.query(
            `UPDATE ${tableName} SET ` +
            "title = ?, " +
            "description = ?, " +
            "date = ?, " +
            "videolink = ?, " + 
            "imagelink = ?, " + 
            "WHERE id = ?",
            [
                blog.title,
                blog.description,
                blog.date,
                blog.videolink,
                blog.imagelink,
                id
            ],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(null, err);
                }
        
                if (res.affectedRows == 0) {
                    // not found blog with the id
                    reject();
                }
        
                console.log("updated blog: ", { id: id, ...blog });
                resolve({ id: id, ...blog });
            }
        );
    });
};

Blog.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found blog with the id
                reject();
                return;
            }
        
            console.log("deleted blog with id: ", id);
            resolve(res);
        });
    });

};

Blog.removeAll = result => {
sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
    console.log("error: ", err);
    result(null, err);
    return;
    }

    console.log(`deleted ${res.affectedRows} blogs`);
    result(null, res);
});
};


module.exports = Blog;