import { z } from "zod"
import data from "../src/data/data.json"
import { card } from "./card"

type Timeframe = "daily" | "weekly" | "monthly"

const tabButtons = document.body.querySelectorAll<HTMLElement>(".tab-button")
const tabPanels = document.body.querySelectorAll<HTMLElement>(".panel")
let currentTabIndex = 0
const numOfTabs = tabButtons.length

// Validate the data received from the server
function validateData() {
  const dataSchema = z.array(
    z.object({
      title: z.enum([
        "Work",
        "Play",
        "Study",
        "Exercise",
        "Social",
        "Self Care",
      ]),

      timeframes: z.object({
        daily: z.object({
          current: z.number(),
          previous: z.number(),
        }),

        weekly: z.object({
          current: z.number(),
          previous: z.number(),
        }),

        monthly: z.object({
          current: z.number(),
          previous: z.number(),
        }),
      }),
    })
  )
  return dataSchema.parse(data)
}

const cardExtraData = {
  Work: {
    icon: "/assets/images/icon-work.svg",
    color: "orange",
  },
  Play: {
    icon: "/assets/images/icon-work.svg",
    color: "aqua",
  },
  Study: {
    icon: "/assets/images/icon-work.svg",
    color: "red",
  },
  Exercise: {
    icon: "/assets/images/icon-work.svg",
    color: "green",
  },
  Social: {
    icon: "/assets/images/icon-work.svg",
    color: "purple",
  },
  "Self Care": {
    icon: "/assets/images/icon-work.svg",
    color: "yellow",
  },
}

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

    const currentPanel = tabPanels[index]

    if (isCurrentTabSelected) {
      currentPanel.hidden = false
      populatePanelWithCards(currentPanel)
    } else {
      currentPanel.hidden = true
    }
  })
}

function generateCardsForPanel(timeframe: Timeframe) {
  const cards = validateData().map((item) => {
    const cardData = {
      title: item.title,
      currentHours: item.timeframes[timeframe].current,
      previousHours: item.timeframes[timeframe].previous,
      icon: cardExtraData[item.title].icon,
    }

    return card(cardData)
  })
  return cards.join("")
}

function populatePanelWithCards(panel: HTMLElement) {
  const panelTimeframe = panel.dataset.timeframe
  const ul = panel.querySelector("ul")

  if (
    panelTimeframe &&
    ul &&
    (panelTimeframe === "daily" ||
      panelTimeframe === "weekly" ||
      panelTimeframe === "monthly")
  ) {
    ul.innerHTML = generateCardsForPanel(panelTimeframe)
  }
}
