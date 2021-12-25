var gameData = {
	gold: 0,
	gems: 0,
	day: 1,
	dungeonTickets: 0,
	owned_heros: []
}

class Hero {
	constructor(id, name, stars, element, hp, attack, defence, resistance, description, image) {
		this.id = id;
		this.stars = stars;
		this.name = name;
		this.element = element;
		this.hp = hp;
		this.attack = attack;
		this.defence = defence;
		this.resistance = resistance;
		this.description = description;
		this.image = image;
	}
}

var hero_pool = [
	new Hero(1, "Sarah the Saintly", 3, "Light", 100, 10, 10, 5, "An Archangel", "assets/archangel_female.png"),
	new Hero(2, "Samuel the Special", 3, "Light", 100, 10, 10, 5, "An Archangel", "assets/archangel_male.png"),
	new Hero(3, "Debra the Daring", 3, "Dark", 80, 12, 5, 10, "An Archdemon", "assets/archdemon_female.png"),
	new Hero(4, "Daniel the Duke", 3, "Dark", 80, 12, 5, 10, "An Archdemon", "assets/archdemon_male.png"),
	new Hero(5, "Patricia the Painless", 3, "Light", 120, 8, 8, 8, "A Paladin", "assets/paladin_female.png"),
	new Hero(6, "Percy the Precarious", 3, "Light", 120, 8, 8, 8, "A Paladin", "assets/paladin_male.png")
];

function genCalendar() {
	// change data into the 1-28 range
	calendarDay = gameData.day%28
	if (calendarDay == 0) {
		calendarDay = 28
	}
	const cont = document.getElementById('dailyCalendarDiv')
	const ul = document.createElement('ul')

	ul.setAttribute('class', 'dailyCalendar')

	for (i = 1; i < 29; i++) {
		const li = document.createElement('li')
		const sp = document.createElement('span')
		if (i == calendarDay) {
			sp.setAttribute('class', 'active')
		} else{
			sp.setAttribute('class', 'inactive')
		}
		
		sp.innerHTML = i
		li.appendChild(sp)
		ul.appendChild(li)
	}
	//remove old children
	if (cont.hasChildNodes()) {
		cont.removeChild(cont.childNodes[0])
	}
	cont.appendChild(ul)
}

function tab(tab) {
	document.getElementById("colDailyMenu").style.display = "none"
	document.getElementById("pullBannerMenu").style.display = "none"
	document.getElementById("charCollection").style.display = "none"
	document.getElementById("theDungeonMenu").style.display = "none"

	document.getElementById("bannermenu").className = "inactive"
	document.getElementById("dailymenu").className = "inactive"
	document.getElementById("collect").className = "inactive"
	document.getElementById("dungeonmenu").className = "inactive"

	document.getElementById(tab).style.display = "inline-block"

	if(tab == "charCollection") {
		document.getElementById("collect").className = "active"
	} else if (tab == "pullBannerMenu") {
		document.getElementById("bannermenu").className = "active"
	} else if (tab == "colDailyMenu") {
		document.getElementById("dailymenu").className = "active"
	} else if (tab == "theDungeonMenu") {
		document.getElementById("dungeonmenu").className = "active"
	}
}

function enterDungeon() {
	if (gameData.dungeonTickets > 0) {
		gameData.dungeonTickets -= 1
		document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"
		document.getElementById("theDungeon").style.display = "inline-block"
		if (gameData.dungeonTickets < 1) {
			document.getElementById("enterDungeonButton").disabled = true
		}
	}
}

function grabDaily() {
	document.getElementById("dailyRewardButton").disabled = true
	if (gameData.day % 28 == 0) {
		gameData.gems += 5
		document.getElementById("dailyRewardText").innerHTML = "Recieved 5 Gems"
		updateGems()
	} else if (gameData.day % 7 == 0) {
		gameData.gems += 1
		document.getElementById("dailyRewardText").innerHTML = "Recieved 1 Gem"
		updateGems()
	} else if (gameData.day % 3 == 0) {
		gameData.dungeonTickets += 1
		document.getElementById("dailyRewardText").innerHTML = "Recieved 1 Dungeon Ticket"
		document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"
		document.getElementById("enterDungeonButton").disabled = false
	}
	else {
		gameData.gold += 10
		document.getElementById("dailyRewardText").innerHTML = "Recieved 10 Gold"
		document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"
	}
}

function incrementDay() {
	//increment the day
	gameData.day += 1

	//update calendar
	genCalendar()

	//update currencies
	document.getElementById("currentDay").innerHTML = "Day " + gameData.day
	document.getElementById("gemsOwned").innerHTML = gameData.gems + " Gem"
	document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"

	//enable login reward
	document.getElementById("dailyRewardButton").disabled = false

	//close the dungeon
	document.getElementById("theDungeon").style.display = "none"
}

function updateGems() {
	document.getElementById("gemsOwned").innerHTML = gameData.gems + " Gem"
	if (gameData.gems >= 1) {
		document.getElementById("pullOnBanner").disabled = false
	}
}

function generateRandomNumber(min, max) {
	return parseInt(Math.random() * (max - min + 1) + min)
}

function pullBanner() {
	if(gameData.gems >= 1) {
		gameData.gems -= 1
		updateGems()
		rng = generateRandomNumber(0, 5)
		result_hero = hero_pool[rng]
		gameData.owned_heros.push(result_hero)
		hero_image = document.createElement('img')
		hero_image2 = document.createElement('img')
		hero_image.setAttribute('src', result_hero.image)
		hero_image2.setAttribute('src', result_hero.image)
		hero_image.setAttribute('class', 'hero_image')
		hero_image2.setAttribute('class', 'hero')
		document.getElementById('charCollection').appendChild(hero_image)
		document.getElementById('theDungeon').appendChild(hero_image2)
		document.getElementById("pullOnBanner").disabled = true
	}
}

//save data stuff
/*var saveGameLoop = window.setInterval(function() {
	localStorage.setItem('gachaIdleSave', JSON.stringify(gameData))
}, 15000)

var savegame = JSON.parse(localStorage.getItem("gachaIdleSave"))
if (savegame !== null) {
	gameData = savegame
}
*/

/* MAIN? */
tab("colDailyMenu")
genCalendar()
document.getElementById("theDungeon").style.display = "none"