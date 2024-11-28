let app = angular.module("myapp", ["ngRoute", "ngSanitize"]);
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", { templateUrl: "home.html", controller: "myCtrl" })
    .when("/favorite", { templateUrl: "favorite.html", controller: "myCtrl" })
    .when("/destinations", {
      templateUrl: "destinations.html",
      controller: "myCtrl",
    })
    .when("/thingsToDo", {
      templateUrl: "thingsToDo.html",
      controller: "myCtrl",
    })
    .when("/plan", { templateUrl: "plan.html", controller: "myCtrl" })
    .when("/newsTopics", {
      templateUrl: "newsTopics.html",
      controller: "myCtrl",
    })
    .when("/blog", { templateUrl: "blog.html", controller: "myCtrl" })
    .when("/login", { templateUrl: "login.html", controller: "myCtrl" })
    .when("/user/:id", { templateUrl: "userInfo.html", controller: "myCtrl" })
    .when("/blog/:id", {
      templateUrl: "blogDetail.html",
      controller: "myCtrl",
    })
    .otherwise({ templateUrl: "home.html", controller: "myCtrl" });
});
app.run(function ($rootScope, $location, $anchorScroll) {
  $rootScope.$on("$routeChangeSuccess", function (newRoute, oldRoute) {
    // scroll to top
    $anchorScroll();
  });
});
app.controller("loginCtrl", function ($scope, $rootScope) {
  $scope.signUpMode = false;

  $scope.signMode = () => {
    $scope.signUpMode = !$scope.signUpMode;
  };
  $scope.user = {};
  $scope.signInValid = false;
  $scope.signUpValid = false;

  $scope.signInSubmit = () => {
    if ($scope.signInForm.$valid) {
      fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((data) => {
          let user;
          if ($scope.user.username.includes("@")) {
            user = data.find(
              (user) =>
                user.email === $scope.user.username &&
                user.password === $scope.user.password
            );
          } else {
            user = data.find(
              (user) =>
                user.username === $scope.user.username &&
                user.password === $scope.user.password
            );
          }
          if (user) {
            alert("Đăng nhập thành công!");

            const loginStatus = { login: true, id: user.id };
            localStorage.setItem("login", JSON.stringify(loginStatus));
            window.location.href = "#";
            window.location.reload();
          } else {
            // $scope.signInValid = true;
            alert("Thông tin đăng nhập không chính xác.");
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      $scope.signInValid = true;
      alert("Thông tin đăng nhập không chính xác.");
    }
  };

  $scope.signUpSubmit = () => {
    if ($scope.signUpForm.$valid) {
      // console.log("Username:", $scope.user.username);
      // console.log("Email:", $scope.user.email);
      // console.log("Password:", $scope.user.password);
      // console.log($scope.user);
      // console.log("Form is valid");
      alert("Đăng ký thành công!");

      const user = {
        ...$scope.user,
        avatar: "user.jpg",
        fullName: "",
        gender: "",
        bio: "",
        birthday: "",
        country: "",
        website: "",
        timeJoin: new Date(),
      };

      delete user.confirmPassword;

      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      $scope.signUpValid = true;
      // console.log($scope.signUpValid);
      console.log("Form is invalid");
    }
  };

  $scope.signInSubmitForm = function ($event) {
    $event.preventDefault();
  };

  $scope.signUpSubmitForm = function ($event) {
    $event.preventDefault();
  };

  $scope.checkPasswordMatch = function () {
    $scope.signUpForm.confirmPassword.$error.noMatch =
      $scope.user.password !== $scope.user.confirmPassword;
  };
});
app.controller("myCtrl", function ($scope, $rootScope, $routeParams, $http) {
  const endpoints = ["blogs", "plans", "news", "jpmaps", "users"];

  $scope.loginStatus = JSON.parse(localStorage.getItem("login")) || {
    login: false,
  };

  endpoints.forEach((endpoint) => {
    $http.get(`http://localhost:3000/${endpoint}`).then(
      (response) => {
        $scope[endpoint] = response.data;
        // console.log(`Dữ liệu ${endpoint} :`, $scope[endpoint]);
        if (endpoint === "blogs") {
          $scope.detailBlog = $scope.blogs.find(
            (item) => item.id == $routeParams.id
          );
          // Favorite
          if (localStorage.getItem("favorites")) {
            $rootScope.favorites = JSON.parse(
              localStorage.getItem("favorites")
            );
          } else {
            $rootScope.favorites = [];
          }
          $scope.addFavorite = (blogId) => {
            let blog = $scope.blogs.find((item) => item.id == blogId);
            // console.log(blog);
            if (blog) {
              let index = $rootScope.favorites.findIndex(
                (item) => item.id == blogId
              );
              if (index !== -1) {
                $rootScope.favorites.splice(index, 1);
              } else {
                $rootScope.favorites.push(blog);
              }
              localStorage.setItem(
                "favorites",
                JSON.stringify($rootScope.favorites)
              );
            } else {
              // window.location.href = "#";
            }
          };

          $scope.removeFavorite = (blogId) => {
            let index = $rootScope.favorites.findIndex(
              (item) => item.id == blogId
            );
            if (index !== -1) {
              $rootScope.favorites.splice(index, 1);
              localStorage.setItem(
                "favorites",
                JSON.stringify($rootScope.favorites)
              );
            }
          };

          $scope.checkFavorite = function (blogId) {
            return $rootScope.favorites.some((blog) => blog.id == blogId);
          };
        }
        if (endpoint === "users") {
          if ($scope.loginStatus.login) {
            $scope.user = $scope.users.find(
              (user) => user.id === $scope.loginStatus.id
            );
            $scope.userInfo = $scope.users.find(
              (user) => user.id === $routeParams.id
            );
            $scope.uInfo = $scope.userInfo;
            $scope.oldAvatar = $scope.uInfo.avatar;
            $scope.uInfo.birthday = new Date($scope.uInfo.birthday);
            // if ($scope.uInfo) {
            //   if (typeof $scope.uInfo.birthday === "string") {
            //   }
            // }

            $scope.changPassValid = false;

            $scope.updateInfo = () => {
              if ($scope.currentTab === "changePassword") {
                if (
                  !$scope.u ||
                  !$scope.u.newPassword ||
                  !$scope.u.confirmPassword ||
                  !$scope.u.password
                ) {
                  $scope.changPassValid = true;
                  return;
                }

                if (
                  $scope.u.password === $scope.uInfo.password &&
                  $scope.u.newPassword === $scope.u.confirmPassword
                ) {
                  $scope.uInfo.password = $scope.u.newPassword;
                } else {
                  $scope.changPassValid = true;
                  return;
                }
              }

              fetch(`http://localhost:3000/users/${$scope.uInfo.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify($scope.uInfo),
              })
                .then((response) => response.json())
                .then((data) => {
                  alert("Cập nhật thông tin thành công!");
                  window.location.href = `#!user/${$scope.uInfo.id}`;
                  // window.location.reload();
                })
                .catch((error) => {
                  console.log("Error:", error);
                });
            };

            $scope.resetAvt = () => {
              $scope.uInfo.avatar = $scope.oldAvatar;
              // console.log($scope.uInfo.avatar);
            };
          }
        }
      },
      (error) => {
        console.log(`Lỗi ở: ${endpoint}`, error);
      }
    );
  });

  // user info
  $scope.checkPasswordMatch = function () {
    $scope.passwordsMatch = $scope.u.newPassword === $scope.u.confirmPassword;
  };

  $scope.cancelInfo = () => {};

  $scope.logout = () => {
    localStorage.removeItem("login");
    window.location.href = "#";
    window.location.reload();
  };

  // map
  const getData = async (place) => {
    let jp = [];
    fetch("./assets/json/jpmap.json")
      .then((response) => response.json())
      .then((data) => {
        jp = data.find((e) => e.id === place);

        const title = document.querySelector(".jp-info-title");
        const image = document.querySelector(".jp-info-img");
        const description = document.querySelector(".jp-info-text");

        title.textContent = jp.name;
        image.src = `./assets/images/map/${jp.image}`;
        description.textContent = jp.description;
      });
  };

  document.querySelectorAll(".svgmap").forEach((e) => {
    e.addEventListener("mouseover", () => {
      getData(e.id);
    });
  });

  // lọc
  $scope.sort = "title";
  $scope.tang = function () {
    $scope.sort = "title";
  };
  $scope.giam = function () {
    $scope.sort = "-title";
  };
});
app.filter("customDate", function ($filter) {
  return function (input) {
    if (input == null) {
      return "";
    }
    // console.log(input);

    let parts = input.split("-");
    return "Ngày " + parts[0] + " tháng " + parts[1] + " năm " + parts[2];
  };
});
app.directive("modSlider", function () {
  return function (scope, element, attrs) {
    if (scope.$last) {
      $(".mod-slider").each(function () {
        let carouselWidth = $(this).find(".mod-slider-inner")[0].scrollWidth;
        let cardWidth = $(this).find(".mod-slider-item").width();
        let scrollPosition = 0;
        let autoScrollInterval;

        const autoScroll = () => {
          autoScrollInterval = setInterval(() => {
            $(this).find(".mod-slider-next").click();
          }, 15000);
        };

        autoScroll();

        $(this)
          .find(".mod-slider-next")
          .on("click", () => {
            if (scrollPosition < carouselWidth - cardWidth * 5) {
              scrollPosition = scrollPosition + cardWidth;
            } else {
              scrollPosition = 0;
            }
            $(this)
              .find(".mod-slider-inner")
              .animate({ scrollLeft: scrollPosition }, 600);
          });

        $(this)
          .find(".mod-slider-prev")
          .on("click", () => {
            clearInterval(autoScrollInterval);
            if (scrollPosition > 0) {
              scrollPosition = scrollPosition - cardWidth;
            } else {
              scrollPosition = carouselWidth - cardWidth;
            }
            $(this)
              .find(".mod-slider-inner")
              .animate({ scrollLeft: scrollPosition }, 600);

            setTimeout(() => {
              autoScroll();
            }, 30000);
          });
      });
    }
  };
});
app.directive("customFileInput", function ($http) {
  return {
    scope: {
      file: "=customFileInput",
      onChange: "&",
    },
    link: function (scope, element, attrs) {
      element.on("change", function (event) {
        let files = event.target.files;
        let reader = new FileReader();
        reader.onload = function (event) {
          scope.$apply(function () {
            scope.file = event.target.result;
            scope.onChange();

            let formData = new FormData();
            formData.append("avatar", files[0]);

            // Gửi request đến server để lưu file vào thư mục tạm thời
            $http
              .post("/src/assets/images", formData, {
                headers: { "Content-Type": undefined }, // Defer content type to the browser
                transformRequest: angular.identity, // Do not transform the data
              })
              .then(function () {
                console.log("File uploaded to ./asset/image/avata");
              });
          });
        };
        reader.readAsDataURL(files[0]);
      });
    },
  };
});
