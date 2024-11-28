const plansPage = document.querySelector("#plans");

const loadPlans = () => {
  fetch("./assets/json/plans.json")
    .then((res) => res.json())
    .then((plans) => {
      plans.forEach((plan) => {
        plansPage.innerHTML += `
        <div class="col-md-6 py-2 px-2 px-md-5">
        <div class="card d-flex flex-row">
          <img
            src="./assets/images/plans/${plan.image}"
            class="card-img"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">${plan.title}</h5>
            <p class="card-text">
              ${plan.content}
            </p>
            <a href="${plan.link}" class="btn plan-link">Tìm hiểu thêm ></a>
          </div>
        </div>
        <hr class="mx-2 mt-4" />
      </div>
        `;
      });
    });
};

if (plansPage) {
  loadPlans();
}
