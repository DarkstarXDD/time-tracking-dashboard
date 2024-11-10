import data from "../src/data/data.json"
import { card } from "./card"

type Timeframe = "daily" | "weekly" | "monthly"

const tabButtons = document.body.querySelectorAll<HTMLElement>(".tab-button")
const tabPanels = document.body.querySelectorAll<HTMLElement>(".panel")
let currentTabIndex = 0
const numOfTabs = tabButtons.length

// Since currentTabIndex = 0 (see above), on page load the first tab and panel will be selected.
handleTabSelect()

tabButtons.forEach((tabButton, index) => {
  tabButton.addEventListener("keydown", (event) => {
    handleKeyDownOnTab(event, index)
  })

  tabButton.addEventListener("click", () => {
    handleMouseClickOnTab(index)
  })
})

function handleKeyDownOnTab(event: KeyboardEvent, index: number) {
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

function handleMouseClickOnTab(index: number) {
  currentTabIndex = index
  handleTabSelect()
}

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
  if (currentTabIndex === numOfTabs - 1) {
    selectFirstTab()
  } else {
    currentTabIndex++
    tabButtons[currentTabIndex].focus()
  }
}

function handleTabSelect() {
  tabButtons.forEach((tabButton, index) => {
    const isCurrentTabSelected = index === currentTabIndex

    tabButton.setAttribute("aria-selected", isCurrentTabSelected.toString())
    tabButton.setAttribute("tabindex", isCurrentTabSelected ? "0" : "-1")

    if (tabPanels[index]) {
      tabPanels[index].hidden = !isCurrentTabSelected
    }
  })
}

function addCards(timeframe: Timeframe) {
  const cards = data.map((item) => {
    const cardData = {
      title: item.title,
      currentHours: item.timeframes[timeframe].current,
      previousHours: item.timeframes[timeframe].previous,
    }

    return card(cardData)
  })
  return cards.join("")
}

tabPanels.forEach((tabPanel) => {
  const panelTimeframe = tabPanel.dataset.timeframe
  const ul = tabPanel.querySelector("ul")

  if (
    panelTimeframe &&
    ul &&
    (panelTimeframe === "daily" ||
      panelTimeframe === "weekly" ||
      panelTimeframe === "monthly")
  ) {
    ul.innerHTML = addCards(panelTimeframe)
  }
})
