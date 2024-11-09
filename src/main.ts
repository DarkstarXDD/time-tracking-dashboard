const tabButtons = document.body.querySelectorAll<HTMLElement>(".tab-button")
let currentTabIndex = 0
const numOfTabs = tabButtons.length

tabButtons.forEach((tabButton, index) => {
  tabButton.addEventListener("keydown", (event) => {
    if (event instanceof KeyboardEvent) {
      const pressedKey = event.key
      currentTabIndex = index

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

      handleTabSelect()
    }
  })
})

function selectFirstTab() {
  currentTabIndex = 0
  tabButtons[currentTabIndex].focus()
}

function selectLastTab() {
  currentTabIndex = numOfTabs - 1
  tabButtons[currentTabIndex].focus()
}

function selectPreviousTab() {
  if (currentTabIndex === 0) {
    selectLastTab()
  } else {
    currentTabIndex--
    tabButtons[currentTabIndex].focus()
  }
}

function selectNextTab() {
  console.log("Right Arrow Clicked!")
  if (currentTabIndex === numOfTabs - 1) {
    selectFirstTab()
  } else {
    currentTabIndex++
    tabButtons[currentTabIndex].focus()
  }
}

function handleTabSelect() {
  tabButtons.forEach((tabButton, index) => {
    if (index === currentTabIndex) {
      tabButton.setAttribute("aria-selected", "true")
      tabButton.setAttribute("tabindex", "0")
    } else {
      tabButton.setAttribute("aria-selected", "false")
      tabButton.setAttribute("tabindex", "-1")
    }
  })
}
