const defaultButtonSelections = {
	"SPR": 0,
	"ULT": 0,
	"MAR": 0,
	"PL_SPR": 0,
	"PL_ULT": 0,
	"PL_MAR": 0
}

// Set up session storage if the user doesn't already have it set
if (sessionStorage.length == 0){

	sessionStorage.setItem("Selections", JSON.stringify(defaultButtonSelections))
	
}

buttonSelections = JSON.parse(sessionStorage.getItem("Selections"))

buttons = document.querySelectorAll("button.button.select-button")
let selectedButton = buttonSelections[CURRENT_PAGE]

buttons[selectedButton].classList.add("selected")

function selectButton(id){

	buttons[selectedButton].classList.remove("selected")
	selectedButton = id
	buttons[selectedButton].classList.add("selected")

	buttonSelections[CURRENT_PAGE] = selectedButton
	sessionStorage.setItem("Selections", JSON.stringify(buttonSelections))
	
}