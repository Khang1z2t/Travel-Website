const addFav = document.querySelectorAll(".addFavorite");
const listFavHTML = document.querySelector(".fav-list");
const removeFav = document.querySelectorAll(".removeFavorite");

let favList = [];
let favorites = [];

const initFav = () => {
  fetch("./assets/json/favorite.json")
    .then((res) => res.json())
    .then((data) => {
      favList = data;

      if (localStorage.getItem("favorites")) {
        favorites = JSON.parse(localStorage.getItem("favorites"));
        addFav.forEach((btn) => {
          const blogId = btn.parentElement.dataset.id;
          if (favorites.includes(blogId)) {
            btn.classList.add("active");
          }
        });
        addFavToHTML();
      }
    });
};

addFav.forEach((btn) => {
  btn.addEventListener("click", () => {
    const blogId = btn.parentElement.dataset.id;
    btn.classList.toggle("active");
    addtoFav(blogId);
  });
});

const addtoFav = (blogId) => {
  let positionInFav = favorites.findIndex((fav) => fav === blogId);
  if (positionInFav === -1) {
    favorites.push(blogId);
  } else {
    favorites.splice(positionInFav, 1);
  }
  addFavToMemory();
};

const addFavToHTML = () => {
  if (listFavHTML) {
    listFavHTML.innerHTML = "";
    if (favorites.length > 0) {
      favorites.forEach((fav) => {
        const favData = favList.find((data) => data.id === fav);
        const favDiv = document.createElement("div");

        favDiv.dataset.id = favData.id;
        favDiv.classList.add(
          "col-md-11",
          "d-flex",
          "favorite",
          "mb-3",
          "mb-md-5"
        );

        favDiv.innerHTML += `
            <a href="${favData.link}" aria-label="${favData.name}" class="text-decoration-none d-flex">
                <img src="${favData.image}" alt="" class="rounded" />

            <div class="fav-content">
                <h2>${favData.name}</h2>
                <p>${favData.description}</p>
            </div>
            </a>
            <button class="fav-icon removeFavorite" aria-label="destination">
                <i class="fa-solid fa-heart fa-xl"></i>
            </button>
      `;
        listFavHTML.appendChild(favDiv);
      });

      document.querySelectorAll(".removeFavorite").forEach((btn) => {
        btn.addEventListener("click", () => {
          //   alert(
          //     "Bạn có chắc chắn muốn xóa bài viết này khỏi danh sách yêu thích không?"
          //   );
          const blogId = btn.parentElement.dataset.id;
          const positionInFav = favorites.findIndex((fav) => fav === blogId);
          if (positionInFav !== -1) {
            favorites.splice(positionInFav, 1);
          }
          addFavToMemory();
          addFavToHTML();
        });
      });
    } else {
      listFavHTML.innerHTML += `
      <div class="col-md-11 d-flex no-fav mb-3 mb-md-5">
      <img
        src="./assets/images/fav/no-fav.jpg"
        alt=""
        width="20%"
        class="rounded"
      />
      <h3
        class="d-flex justify-content-center align-items-center h-100 px-5"
      >
        Bạn chưa có yêu thích bài viết nào hết!
      </h3>
    </div>`;
    }
  }
};

const addFavToMemory = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

initFav();
