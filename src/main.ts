const tabButtons = document.body.querySelectorAll<HTMLElement>(".tab-button")
let currentTabIndex = 0

tabButtons.forEach((tabButton, index) => {
  tabButton.addEventListener("keydown", (event) => {
    if (event instanceof KeyboardEvent) {
      const pressedKey = event.key
      currentTabIndex = index
      console.log(currentTabIndex)

      switch (pressedKey) {
        case "ArrowLeft":
          selectPreviousTab()
          break

        case "ArrowRight":
          selectNextTab()
          break

        case "Home":
          selectFirstTab()
          break

        case "End":
          selectLastTab()
          break
      }
    }
  })
})

function selectFirstTab() {
  tabButtons[0].focus()
}

function selectLastTab() {
  tabButtons[tabButtons.length - 1].focus()
}

function selectPreviousTab() {
  if (currentTabIndex === 0) {
    selectLastTab()
  } else {
    tabButtons[currentTabIndex - 1].focus()
  }
}

function selectNextTab() {
  console.log("Right Arrow Clicked!")
  if (currentTabIndex === tabButtons.length - 1) {
    selectFirstTab()
  } else {
    tabButtons[currentTabIndex + 1].focus()
  }
}

// const isTabButtonSelected = tabButton.getAttribute("aria-selected")
// if (isTabButtonSelected === "true") {
//   tabButtons.setAttribute("tabindex", "0")
// }

// tabButtons.forEach((tabButton) => {
//   if (tabButton.getAttribute("aria-selected") === "true") {
//     console.log("This button is selected")
//     tabButton.setAttribute("tabindex", "0")
//   } else {
//     console.log("This button is not selected")
//     tabButton.setAttribute("tabindex", "-1")
//   }
// })
