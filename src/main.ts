import { z } from "zod"
import { card } from "./card"

const tabButtons = document.body.querySelectorAll<HTMLElement>(".tab-button")
const tabPanels = document.body.querySelectorAll<HTMLElement>(".panel")
const tabList = document.getElementById("tab-list")

let isDesktopLayout: boolean

const mediaQuery = window.matchMedia("(min-width: 64rem)")
mediaQuery.addEventListener("change", handleScreenSizeChange)

type TabIndex = 0 | 1 | 2

let currentTabIndex: TabIndex = getCurrentTabFromURL()
const numOfTabs = tabButtons.length

handleTabSelect()
addEventListenersToTabButtons()
handleScreenSizeChange()

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

function handleScreenSizeChange() {
  if (mediaQuery.matches) {
    isDesktopLayout = true
    tabList?.setAttribute("aria-orientation", "vertical")
  } else {
    isDesktopLayout = false
    tabList?.setAttribute("aria-orientation", "horizontal")
  }
}

function addEventListenersToTabButtons() {
  tabButtons.forEach((tabButton, index) => {
    tabButton.addEventListener("keydown", (event) => {
      handleKeyDownOnTab(event, index as TabIndex)
    })

    tabButton.addEventListener("click", () => {
      handleMouseClickOnTab(index as TabIndex)
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
  const tabNameToIndexMap: Record<string, TabIndex> = {
    daily: 0,
    weekly: 1,
    monthly: 2,
  }

  const searchParams = new URLSearchParams(location.search)
  const currentTabInURL = searchParams.get("tab")
  if (currentTabInURL && currentTabInURL in tabNameToIndexMap) {
    return tabNameToIndexMap[currentTabInURL]
  }
  return 0
}

function updateURL() {
  const tabIndexToTabNameMap: Record<TabIndex, string> = {
    0: "daily",
    1: "weekly",
    2: "monthly",
  }

  const searchParams = new URLSearchParams(location.search)
  searchParams.set("tab", tabIndexToTabNameMap[currentTabIndex])
  window.history.replaceState({}, "", `?${searchParams}`)
}

function handleMouseClickOnTab(index: TabIndex) {
  currentTabIndex = index
  handleTabSelect()
}

function handleKeyDownOnTab(event: KeyboardEvent, index: TabIndex) {
  const pressedKey = event.key
  currentTabIndex = index

  if (!isDesktopLayout) {
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
  } else {
    if (["ArrowUp", "ArrowDown", "Home", "End"].includes(pressedKey)) {
      switch (pressedKey) {
        case "ArrowUp":
          selectPreviousTab()
          break

        case "ArrowDown":
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
