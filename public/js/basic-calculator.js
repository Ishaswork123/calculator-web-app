document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const previousOperandElement = document.getElementById("previous-operand")
  const currentOperandElement = document.getElementById("current-operand")
  const numberButtons = document.querySelectorAll("[data-number]")
  const operationButtons = document.querySelectorAll("[data-operation]")
  const equalsButton = document.querySelector("[data-equals]")
  const clearButton = document.querySelector('[data-action="clear"]')
  const deleteButton = document.querySelector('[data-action="delete"]')
  const percentButton = document.querySelector('[data-action="percent"]')

  // History Modal Elements
  const historyBtn = document.getElementById("history-btn")
  const historyModal = document.getElementById("history-modal")
  const closeBtn = document.querySelector(".close")
  const historyList = document.getElementById("history-list")
  const clearHistoryBtn = document.getElementById("clear-history")

  // Calculator state
  let currentOperand = ""
  let previousOperand = ""
  let operation = undefined
  let shouldResetScreen = false

  // Initialize calculator
  function init() {
    currentOperand = "0"
    previousOperand = ""
    operation = undefined
    updateDisplay()
  }

  // Update the calculator display
  function updateDisplay() {
    currentOperandElement.textContent = currentOperand

    if (operation != null) {
      previousOperandElement.textContent = `${previousOperand} ${operation}`
    } else {
      previousOperandElement.textContent = previousOperand
    }
  }

  // Append number to current operand
  function appendNumber(number) {
    if (currentOperand === "0" || shouldResetScreen) {
      currentOperand = ""
      shouldResetScreen = false
    }

    // Prevent multiple decimal points
    if (number === "." && currentOperand.includes(".")) return

    currentOperand += number
    updateDisplay()
  }

  // Choose operation
  function chooseOperation(op) {
    if (currentOperand === "") return

    if (previousOperand !== "") {
      compute()
    }

    operation = op
    previousOperand = currentOperand
    currentOperand = ""
    updateDisplay()
  }

  // Compute result
  function compute() {
    let computation
    const prev = Number.parseFloat(previousOperand)
    const current = Number.parseFloat(currentOperand)

    if (isNaN(prev) || isNaN(current)) return

    switch (operation) {
      case "+":
        computation = prev + current
        break
      case "-":
        computation = prev - current
        break
      case "×":
        computation = prev * current
        break
      case "÷":
        computation = prev / current
        break
      default:
        return
    }

    // Save to history
    const calculation = `${previousOperand} ${operation} ${currentOperand} = ${computation}`
    addToHistory(calculation)

    currentOperand = computation.toString()
    operation = undefined
    previousOperand = ""
    shouldResetScreen = true
    updateDisplay()
  }

  // Delete last digit
  function deleteDigit() {
    currentOperand = currentOperand.toString().slice(0, -1)
    if (currentOperand === "") {
      currentOperand = "0"
    }
    updateDisplay()
  }

  // Calculate percentage
  function calculatePercent() {
    currentOperand = (Number.parseFloat(currentOperand) / 100).toString()
    updateDisplay()
  }

  // Add calculation to history
  function addToHistory(calculation) {
    const history = getHistory()
    history.push({
      calculation,
      timestamp: new Date().toLocaleString(),
    })
    localStorage.setItem("basicCalculatorHistory", JSON.stringify(history))
  }

  // Get history from localStorage
  function getHistory() {
    const history = localStorage.getItem("basicCalculatorHistory")
    return history ? JSON.parse(history) : []
  }

  // Display history in modal
  function displayHistory() {
    historyList.innerHTML = ""
    const history = getHistory()

    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-history">No calculations yet.</p>'
      return
    }

    history.forEach((item, index) => {
      const historyItem = document.createElement("div")
      historyItem.classList.add("history-item")
      historyItem.innerHTML = `
        <div>${item.calculation}</div>
        <small>${item.timestamp}</small>
      `
      historyList.appendChild(historyItem)
    })
  }

  // Clear history
  function clearHistory() {
    localStorage.removeItem("basicCalculatorHistory")
    displayHistory()
  }

  // Event Listeners
  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      appendNumber(button.getAttribute("data-number"))
    })
  })

  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      chooseOperation(button.getAttribute("data-operation"))
    })
  })

  equalsButton.addEventListener("click", () => {
    compute()
  })

  clearButton.addEventListener("click", () => {
    init()
  })

  deleteButton.addEventListener("click", () => {
    deleteDigit()
  })

  percentButton.addEventListener("click", () => {
    calculatePercent()
  })

  // History Modal Event Listeners
  historyBtn.addEventListener("click", () => {
    displayHistory()
    historyModal.style.display = "block"
  })

  closeBtn.addEventListener("click", () => {
    historyModal.style.display = "none"
  })

  clearHistoryBtn.addEventListener("click", () => {
    clearHistory()
  })

  window.addEventListener("click", (event) => {
    if (event.target === historyModal) {
      historyModal.style.display = "none"
    }
  })

  // Initialize calculator
  init()
})
