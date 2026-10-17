// Show the platform-specific search shortcut in the search button tooltip
document.addEventListener("readystatechange", () => {
  if (document.readyState === "interactive") {
    let isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    let searchToggle = document.querySelector("#search-toggle");
    if (searchToggle && isMac) {
      searchToggle.title = "Search (\u2318 K)";
    }
  }
});
