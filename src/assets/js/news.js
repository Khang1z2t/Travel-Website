const blogPage = document.querySelector(".blog-page");

const loadBlog = () => {
  fetch("./assets/json/news.json")
    .then((res) => res.json())
    .then((blogs) => {
      blogs.forEach((blog) => {
        blogPage.innerHTML += `
            <div class="col-md-10 d-flex mx-5 mb-3 mb-md-4" data-id="${blog.id}">
          <a
            href="#"
            class="d-flex flex-column text-black text-decoration-none w-100"
          >
            <h3 class="px-5 py-3 blog-title">
              ${blog.title}
            </h3>
            <p class="px-5 py-3 m-0 blog-date">
              ${blog.date}
            </p>
          </a>
        </div>`;
      });
    });
};

if (blogPage) {
  loadBlog();
}
