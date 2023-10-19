// Override background settings with Plastic Attack theme
BOARD_IMAGE.src = "../../../../assets/plastic-background/board.png"
GHOST_IMAGE.src = "../../../../assets/plastic-background/ghost.png"
HOLD_DISABLED_IMAGE.src = "../../../../assets/plastic-background/hold-disabled.png"
INDICATOR_IMAGE.src = "../../../../assets/plastic-background/indicator.png"

canvas.setAttribute("style", "background-color: rgba(0, 0, 0, 0.5);")
background.setAttribute("style", "background-size: cover; background-image: url(../../../../assets/plastic-background/background.png);")

plasticMode = true

let currentPlasticLines = 0
let targetPlasticLines = 0

// Function that creates plastic lines
function createPlasticLine(amount){

	// Create our plastic line to insert
	let line = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
	line[Math.floor(Math.random() * 10)] = 0

	for (let i = 0; i < amount; i ++){
		collisionMap.splice(0, 1)
		collisionMap.splice(19, 0, line.slice())
		currentPlasticLines ++
	}

	checkTopOut()
}

// Function that keeps the current amount of plastic lines on the board in check
function updatePlasticLines(){

	currentPlasticLines = 0

	// Update the amount of plastic lines on the board
	// Loop through every line on the collision map
	for (y = 0; y < 20; y ++){

		if (collisionMap[y].includes(8)){
			currentPlasticLines ++
		}
	}
}