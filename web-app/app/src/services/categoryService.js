function categoryService(RestService){

  const getAllCategories = () => {
    const deferred = $q.defer();
    RestService.get(CATEGORIES_URL)
        .then(
            (result) => deferred.resolve(ObjectBuilder.buildObject(RESOURCE.CATEGORIES, result.data)),
            (error) => deferred.reject(error)
        );
    return deferred.promise;
  };

  const getCategoryById = (id) => {
    const deferred = $q.defer();
    RestService.get(`${CATEGORIES_URL}`/`${id}`)
        .then(
            (result) => deferred.resolve(ObjectBuilder.buildObject(RESOURCE.CATEGORY, result.data)),
            (error) => deferred.reject(error));
    return deferred.promise;
  };

  const addCategory = (category) => {
    RestService.post(CATEGORIES_URL, category)
        .then((result) => {

        }, (error) => {

        });
  };

  return {
    getAllCategories,
    getCategoryById,
    addCategory
  }
}

export default { categoryService };