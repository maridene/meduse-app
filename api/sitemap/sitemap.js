const categoriesDao = require('../categories/categories.model');
const productsDao = require('../products/products.model');
const blogService = require('../blog/blog.service');

const buildUrl = (url, lastMod, changeFreq) => ({
    url,
    lastMod: lastMod || true,
    changeFreq: changeFreq || 'weekly'
});

async function getUrls() {
    const contactUsUrl = buildUrl('contact');
    const blogUrl = buildUrl('blog');
    const premiumUrl = buildUrl('premium');
    const staticUrls = [contactUsUrl, premiumUrl, blogUrl];
    const categoriesUrls = await getCategoriesUrls();
    const productsUrls = await getProductsUrls();
    const blogPostsUrls = await getBlogPostsUrls();

    return [...staticUrls, ...categoriesUrls, ...productsUrls, ...blogPostsUrls];
};

const getCategoriesUrls = async () => {
    const categories = await categoriesDao.getAll();
    return categories.map((each) => {
        const url = 'category/' + each.id + '-' + each.label.replace(/ /g, '-');
        return buildUrl(url);
    });
};

const getProductsUrls = async () => {
    const products = await productsDao.getAll();
    return products.filter((each) => each.isHidden !== 1 && each.isExclusif !== 1).map((each) => {
        const url = 'product/' + each.id + '-' + each.label.replace(/ /g, '-');
        return buildUrl(url);
    });
};

const getBlogPostsUrls = async () => {
    const posts = await blogService.getAll();
    return posts.map((each) => buildUrl('blog/' + each.id + '-' + each.title.replace(/ /g, '-')));
};

module.exports = {
    getUrls
};
