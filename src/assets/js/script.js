// slide button next pre

// $(".mod-slider").each(function () {
//   let carouselWidth = $(this).find(".mod-slider-inner")[0].scrollWidth;
//   let cardWidth = $(this).find(".mod-slider-item").width();
//   let scrollPosition = 0;
//   let autoScrollInterval;

//   const autoScroll = () => {
//     autoScrollInterval = setInterval(() => {
//       $(this).find(".mod-slider-next").click();
//     }, 15000);
//   };

//   autoScroll();

//   $(this)
//     .find(".mod-slider-next")
//     .on("click", () => {
//       if (scrollPosition < carouselWidth - cardWidth * 5) {
//         scrollPosition = scrollPosition + cardWidth;
//       } else {
//         scrollPosition = 0;
//       }
//       $(this)
//         .find(".mod-slider-inner")
//         .animate({ scrollLeft: scrollPosition }, 600);

//     });

//   $(this)
//     .find(".mod-slider-prev")
//     .on("click", () => {
//       clearInterval(autoScrollInterval);
//       if (scrollPosition > 0) {
//         scrollPosition = scrollPosition - cardWidth;
//       } else {
//         scrollPosition = carouselWidth - cardWidth;
//       }
//       $(this)
//         .find(".mod-slider-inner")
//         .animate({ scrollLeft: scrollPosition }, 600);

//       setTimeout(() => {
//         autoScroll();
//       }, 30000);
//     });
// });

