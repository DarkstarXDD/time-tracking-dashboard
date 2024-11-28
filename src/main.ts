import { z } from "zod"
import { card } from "./card"

const tabButtons = document.body.querySelectorAll<HTMLElement>(".tab-button")
const tabPanels = document.body.querySelectorAll<HTMLElement>(".panel")
let currentTabIndex = getCurrentTabFromURL()
const numOfTabs = tabButtons.length

async function fetchData() {
  try {
    const fetchResponse = await fetch("/data/data.json")
    const data = await fetchResponse.json()
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

// Zod schema for server data
export const dataSchema = z.array(
  z.object({
    title: z.enum(["Work", "Play", "Study", "Exercise", "Social", "Self Care"]),

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

// Validate the data received from the server
async function validateData() {
  const fetchedData = await fetchData()
  return dataSchema.parse(fetchedData)
}

// Since currentTabIndex = 0 (see above), on page load the first tab and panel will be selected.
handleTabSelect()
addEventListenersToTabButtons()

function addEventListenersToTabButtons() {
  tabButtons.forEach((tabButton, index) => {
    tabButton.addEventListener("keydown", (event) => {
      handleKeyDownOnTab(event, index)
    })

    tabButton.addEventListener("click", () => {
      handleMouseClickOnTab(index)
    })
  })
}

function handleTabSelect() {
  updateURL()
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

function getCurrentTabFromURL() {
  const searchParamsInstance = new URLSearchParams(location.search)
  if (searchParamsInstance.has("tab")) {
    const currentTabInURL = searchParamsInstance.get("tab")
    if (currentTabInURL) {
      return parseInt(currentTabInURL)
    } else {
      return 0
    }
  } else {
    return 0
  }
}

function updateURL() {
  const searchParamsInstance = new URLSearchParams(location.search)
  searchParamsInstance.set("tab", currentTabIndex.toString())
  window.history.replaceState({}, "", `?${searchParamsInstance}`)
}

function handleMouseClickOnTab(index: number) {
  currentTabIndex = index
  handleTabSelect()
}

function handleKeyDownOnTab(event: KeyboardEvent, index: number) {
  const pressedKey = event.key
  currentTabIndex = index

  // Make sure the handleTabSelect runs only when one of the following 4 keys is pressed
  if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(pressedKey)) {
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

export type Timeframe = "daily" | "weekly" | "monthly"

function generateCardsForPanel(
  timeframe: Timeframe,
  validatedData: z.infer<typeof dataSchema>
) {
  const cards = validatedData.map((item) => {
    const cardData = {
      title: item.title,
      currentHours: item.timeframes[timeframe].current,
      previousHours: item.timeframes[timeframe].previous,
      timeframe,
    }

    return card(cardData)
  })
  return cards.join("")
}

async function populatePanelWithCards(panel: HTMLElement) {
  const panelTimeframe = panel.dataset.timeframe
  const ul = panel.querySelector("ul")

  if (
    panelTimeframe &&
    ul &&
    (panelTimeframe === "daily" ||
      panelTimeframe === "weekly" ||
      panelTimeframe === "monthly")
  ) {
    const validatedData = await validateData()
    ul.innerHTML = generateCardsForPanel(panelTimeframe, validatedData)
  }
}
