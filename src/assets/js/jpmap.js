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


