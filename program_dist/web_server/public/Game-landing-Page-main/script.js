  // Mouse Controller
  const cursor = document.getElementById("cursor");
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const imageWidth = cursor.clientWidth; // Get the actual image width
  const imageHeight = cursor.clientHeight; // Get the actual image height
  let currentX = 0;
  let currentY = 0;

  document.addEventListener("keydown", function (event) {
      const movement = 5; // Adjust this value to change the movement distance per key press

      switch (event.key) {
          case "ArrowUp":
              currentY = Math.max(0, currentY - movement); // Restrict top movement to 0 (screen edge)
              break;
          case "ArrowDown":
              currentY = Math.min(windowHeight - imageHeight, currentY + movement); // Restrict bottom movement to screen height - image height
              break;
          case "ArrowLeft":
              currentX = Math.max(0, currentX - movement); // Restrict left movement to 0 (screen edge)
              break;
          case "ArrowRight":
              currentX = Math.min(windowWidth - imageWidth, currentX + movement); // Restrict right movement to screen width - image width
              break;
      }

      cursor.style.top = currentY + "px";
      cursor.style.left = currentX + "px";
  });