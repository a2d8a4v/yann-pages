(function ($) {
  $( document ).ready(function() {
    const skills = document.querySelectorAll(".point");
    console.log(skills);
    if (skills.length > 0) {
      document.addEventListener("scroll", function () {
        const clientHeight = document.documentElement.clientHeight;
        const skillsY = skills[1].getBoundingClientRect().y;
      
        if (clientHeight > skillsY) {
          skills[0].style.animation =
            "fadeInUp 1s forwards cubic-bezier(0.87, 0, 0.13, 1)";
          skills[1].style.animation =
            "fadeInUp 1s 0.2s forwards cubic-bezier(0.87, 0, 0.13, 1)";
          skills[2].style.animation =
            "fadeInUp 1s 0.4s forwards cubic-bezier(0.87, 0, 0.13, 1)";
          skills[3].style.animation =
            "fadeInUp 1s 0.6s forwards cubic-bezier(0.87, 0, 0.13, 1)";
        }
      });
    }
  });
})(jQuery);
