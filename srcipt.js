particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {"value": "#ffffff"},
        "shape": {
          "type": "circle",
          "stroke": {"width": 0, "color": "#000000"}
        },
        "opacity": {
          "value": 0.5,
          "random": false
        },
        "size": {
          "value": 3,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 4,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out"
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {"enable": true, "mode": "grab"},
          "onclick": {"enable": true, "mode": "push"}
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {"opacity": 1}
          },
          "push": {"particles_nb": 4}
        }
      },
      "retina_detect": true
    });

    // Desplegable de menú en nav
    document.querySelectorAll("header nav .dropdown").forEach(function(dropdown) {
      dropdown.addEventListener("mouseover", function(){
        this.querySelector("ul").style.display = "block";
      });
      dropdown.addEventListener("mouseout", function(){
        this.querySelector("ul").style.display = "none";
      });
    });