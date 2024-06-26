'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'ngRoute',
    'ngCookies',
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngSanitize',
    'angular-uuid',
    'dndLists'
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    $urlRouterProvider.otherwise('/dashboard/home');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad, $q){
                var promises = [];
                promises.push($ocLazyLoad.load(
                  {
                    name:'ngRoute',
                    files:["bower_components/angular-route/angular-route.min.js"]
                  })); 
                promises.push($ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'scripts/app-constants.js',
                    'scripts/messages.js',
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js',
                    'scripts/models/address.js',
                    'scripts/models/category.js',
                    'scripts/models/product.js',
                    'scripts/models/productVariant.js',
                    'scripts/models/user.js',
                    'scripts/models/manufacturer.js',
                    'scripts/models/blog.js',
                    'scripts/models/client.js',
                    'scripts/models/order.js',
                    'scripts/models/orderRow.js',
                    'scripts/models/agent.js',
                    'scripts/utils.js',
                    'scripts/services/modalService.js',
                    'scripts/services/objectBuilder.js',
                    'scripts/services/restService.js',
                    'scripts/services/authenticationService.js',
                    'scripts/services/categoryService.js',
                    'scripts/services/productService.js',
                    'scripts/services/productVariantsService.js',
                    'scripts/services/manufacturerService.js',
                    'scripts/services/usersService.js',
                    'scripts/services/blogService.js',
                    'scripts/services/ordersService.js',
                    'scripts/services/orderRowsService.js',
                    'scripts/services/couponsService.js',
                    'scripts/services/settingsService.js',
                    'scripts/services/agentsService.js',
                    'scripts/services/addressesService.js'
                    ]
                }));
                  promises.push($ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }));
                promises.push($ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:["bower_components/angular-animate/angular-animate.js"]
                })); 
                promises.push($ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:["bower_components/angular-cookies/angular-cookies.js"]
                }));
                promises.push($ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                }));
                promises.push($ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                }));
                promises.push($ocLazyLoad.load(
                  {
                    name:'ngFileUpload',
                    files:[
                      'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
                      'bower_components/ng-file-upload/ng-file-upload.min.js'
                  ]
                  }));
                return $q.all(promises);
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            }), 
            $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            })
          }
        }
      })
      .state('dashboard.products-list', {
        url:'/products-list',
        controller: 'ProductsListCtrl',
        templateUrl: 'views/pages/products/productList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/products/productsListController.js']
            })
          }
        }
    })
      .state('dashboard.add-product', {
        url:'/add-product',
        controller: 'AddProductCtrl',
        templateUrl: 'views/pages/products/addProduct.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/products/addProductController.js']
            })
          }
        }
    })
      .state('dashboard.reorder-products', {
        url:'/reorder-products',
        controller: 'ReorderProductsCtrl',
        templateUrl: 'views/pages/products/reorderProducts.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/products/reorderProductsController.js']
            })
          }
        }
    })
      .state('dashboard.edit-product', {
        url:'/edit-product/:productId',
        controller: 'EditProductCtrl',
        templateUrl: 'views/pages/products/editProduct.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/products/editProductController.js']
            })
          }
        }
    })
      .state('dashboard.add-manufacturer', {
        url:'/add-manufacturer',
        controller: 'AddManufacturerCtrl',
        templateUrl: 'views/pages/products/addManufacturer.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/products/addManufacturerController.js']
            })
          }
        }
      })
      .state('dashboard.edit-manufacturer', {
        url:'/edit-manufacturer/:manufacturerId',
        controller: 'EditManufacturerCtrl',
        templateUrl: 'views/pages/products/editManufacturer.html',
        resolve: {
          manufacturer: function(ManufacturerService, $state, $stateParams) {
            return ManufacturerService.getById($stateParams.manufacturerId).then(
              function(manufacturer) {
                return manufacturer;
              }, function (err) {
                $state.go('dashboard.home');
              }
          )},
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/products/editManufacturerController.js']
            })
          }
        }
      })
      .state('dashboard.manufacturers-list', {
        url:'/manufacturers-list',
        controller: 'ManufacturersListCtrl',
        templateUrl: 'views/pages/products/manufacturersList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/products/manufacturersListController.js']
            })
          }
        }
      })
      .state('dashboard.categories-list', {
        url:'/categories-list',
        controller: 'CategoriesListCtrl',
        templateUrl: 'views/pages/categories/categoriesList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/categories/categoriesListController.js']
            })
          }
        }
    })
      .state('dashboard.categories-order', {
        url:'/categories-order',
        controller: 'CategoriesOrderCtrl',
        templateUrl: 'views/pages/categories/categoriesOrder.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/categories/categoriesOrderController.js']
            })
          }
        }
    })
      .state('dashboard.edit-category', {
        url:'/edit-category/:categoryId',
        controller: 'EditCategoryCtrl',
        templateUrl: 'views/pages/categories/editCategory.html',
        resolve: {
          category: function(CategoryService, $state, $stateParams) {
            return CategoryService.getCategoryById($stateParams.categoryId).then(
              function(category) {
                return category;
              }, function (err) {
                $state.go('dashboard.home')
              }
            )
          },
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/categories/editCategoryController.js']
            })
          }
        }
    })
      .state('dashboard.add-category', {
        url:'/add-category',
        controller: 'AddCategoryCtrl',
        templateUrl: 'views/pages/categories/addCategory.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/categories/addCategoryController.js']
            })
          }
        }
    })
      .state('dashboard.orders-list', {
        url:'/orders-list',
        controller: 'OrdersListCtrl',
        templateUrl: 'views/pages/orders/ordersList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/ordersListController.js']
            })
          }
        }
    })
      .state('dashboard.add-order', {
        url:'/add-order/:clientId',
        controller: 'AddOrderCtrl',
        templateUrl: 'views/pages/orders/addOrder.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/addOrderController.js']
            })
          }
        }
    })
      .state('dashboard.current-orders', {
        url:'/current-orders',
        controller: 'CurrentOrdersCtrl',
        templateUrl: 'views/pages/orders/currentOrders.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/currentOrdersController.js']
            })
          }
        }
    })
      .state('dashboard.unpaid-orders', {
        url:'/unpaid-orders',
        controller: 'UnpaidOrdersCtrl',
        templateUrl: 'views/pages/orders/unpaidOrders.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/unpaidOrdersController.js']
            })
          }
        }
    })
      .state('dashboard.order-details', {
        url:'/order-details/:id',
        controller: 'OrderDetailsCtrl',
        templateUrl: 'views/pages/orders/orderDetails.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/orderDetailsController.js']
            })
          }
        }
    })

      .state('dashboard.invoices', {
        url:'/invoices',
        controller: 'InvoicesListCtrl',
        templateUrl: 'views/pages/orders/invoicesList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/invoicesListController.js']
            })
          }
        }
    })
      .state('dashboard.delivery-invoices', {
        url:'/delivery-invoices',
        controller: 'DeliveryInvoicesListCtrl',
        templateUrl: 'views/pages/orders/deliveryInvoicesList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/deliveryInvoicesListController.js']
            })
          }
        }
    })
      .state('dashboard.credit-invoices', {
        url:'/credit-invoices',
        controller: 'CreditInvoicesListCtrl',
        templateUrl: 'views/pages/orders/creditInvoicesList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/orders/creditInvoicesListController.js']
            })
          }
        }
    })
      .state('dashboard.devis-invoices', {
              url:'/devis-invoices',
              controller: 'DevisInvoicesListCtrl',
              templateUrl: 'views/pages/orders/devisInvoicesList.html',
              resolve: {
                loadMyFile:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:['scripts/controllers/orders/devisInvoicesListController.js']
                  })
                }
              }
          })
      .state('dashboard.add-pub', {
        url:'/add-pub',
        controller: 'AddPubCtrl',
        templateUrl: 'views/pages/blog/addPub.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/pub/addPubController.js']
            })
          }
        }
    })
      .state('dashboard.edit-pub/:id', {
        url:'/edit-pub/:id',
        controller: 'EditPubCtrl',
        templateUrl: 'views/pages/blog/editPub.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/controllers/pub/editPubController.js'
                ]
            })
          }
        }
    })
      .state('dashboard.pubs-list', {
        url:'/pubs-list',
        controller: 'PubsListCtrl',
        templateUrl: 'views/pages/blog/pubsList.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/pub/pubsListController.js']
            })
          }
        }
    })
      .state('dashboard.add-client', {
        url:'/add-client',
        controller: 'AddClientCtrl',
        templateUrl: 'views/pages/clients/addClient.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/clients/addClientController.js']
            })
          }
        }
    })
  .state('dashboard.clients-list', {
    url:'/clients-list',
    controller: 'ClientsListCtrl',
    templateUrl: 'views/pages/clients/clientsList.html',
    resolve: {
      loadMyFile:function($ocLazyLoad) {
        return $ocLazyLoad.load({
            name:'sbAdminApp',
            files:['scripts/controllers/clients/clientsListController.js']
        })
      }
    }
  })
    .state('dashboard.edit-client', {
        url:'/edit-client/:id',
        controller: 'EditClientCtrl',
        templateUrl: 'views/pages/clients/editClient.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/clients/editClientController.js']
            })
          }
        }
    })
    .state('dashboard.show-client', {
        url:'/client/:id',
        controller: 'ClientCtrl',
        templateUrl: 'views/pages/clients/client.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/clients/clientController.js']
            })
          }
        }
    })
      .state('dashboard.settings', {
        url:'/settings',
        controller: 'SettingsCtrl',
        templateUrl: 'views/pages/settings/settings.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/settings/settingsController.js']
            })
          }
        }
    })
    .state('dashboard.export', {
        url:'/export',
        controller: 'ExportCtrl',
        templateUrl: 'views/pages/export/export.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/export/exportController.js']
            })
          }
        }
    })
    .state('dashboard.agents-list', {
      url:'/agents-list',
      controller: 'AgentsListCtrl',
      templateUrl: 'views/pages/agents/agentsList.html',
      resolve: {
        loadMyFile:function($ocLazyLoad) {
          return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:['scripts/controllers/agents/agentsListController.js']
          })
        }
      }
  })
      .state('dashboard.subscribers', {
        url:'/subscribers',
        controller: 'SubscribersCtrl',
        templateUrl: 'views/pages/newsletter/subscribers.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/newsletter/subscribersController.js']
            })
          }
        }
    })
      .state('dashboard.send-mail', {
        url:'/send-mail',
        controller: 'SendMailCtrl',
        templateUrl: 'views/pages/newsletter/sendMail.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/newsletter/sendMailController.js']
            })
          }
        }
    })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
    })
      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login',
        controller: 'LoginCtrl',
        isNonRestricted: true,
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/app-constants.js',
                  'scripts/utils.js',
                  'scripts/models/user.js',
                  'scripts/services/restService.js',
                  'scripts/services/authenticationService.js',
                  'scripts/services/objectBuilder.js',
                  'scripts/controllers/login/loginController.js',
                  'bower_components/angular-cookies/angular-cookies.js'
                ]
            }), $ocLazyLoad.load(
              {
                name:'ngCookies',
                files:["bower_components/angular-cookies/angular-cookies.js"]
              })
          }
        }
    })
      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.table',{
        templateUrl:'views/table.html',
        url:'/table'
    })
      .state('dashboard.panels-wells',{
          templateUrl:'views/ui-elements/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   })
  
  }])
  .run(function ($rootScope, $location, $cookieStore, $http) {
    // change page title based on state
    /*
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
      $rootScope.setPageTitle(toState.title);
    });*/

    // Helper method for setting the page's title
    $rootScope.setPageTitle = function (title) {
      $rootScope.pageTitle = '';
      if (title) {
        $rootScope.pageTitle += title;
        $rootScope.pageTitle += ' \u2014 ';
      }
      $rootScope.pageTitle += AppConstants.appName;
    };

    // keep user logged in after page refresh
    $rootScope.adminGlobals = $cookieStore.get('adminGlobals') || {};
    if ($rootScope.adminGlobals && $rootScope.adminGlobals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.adminGlobals.currentUser.token;
        $http.defaults.headers.common['userId'] = $rootScope.adminGlobals.currentUser.id;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      var loggedIn = $rootScope.adminGlobals.currentUser;
      if (!loggedIn) {
          $location.path('/login');
      }  
    });
  });

    
