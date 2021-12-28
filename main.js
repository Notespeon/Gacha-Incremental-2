var gameData = {
	gold: 300,
	gems: 0,
	day: 1,
	dungeonTickets: 10,
	owned_heros: [],
	unique_hero_count: 0,
	displayed_hero: null,
	squad_heros: [],
	enemysDefeated: 0
}

class Hero {
	constructor(id, name, stars, element, hp, attack, defence, resistance, description, image) {
		this.id = id;
		this.name = name;
		this.stars = stars;
		this.element = element;
		this.level = 1;
		this.experience = 0;
		this.basehp = hp;
		this.hp = hp;
		this.hpupgradelevel = 1;
		this.currenthp = hp;
		this.baseatk = attack;
		this.atkupgradelevel = 1;
		this.attack = attack;
		this.basedef = defence;
		this.defupgradelevel = 1;
		this.defence = defence;
		this.baseres = resistance;
		this.resupgradelevel = 1;
		this.resistance = resistance;
		this.description = description;
		this.image = image;
	}
}

class Enemy {
	constructor(id, element, hp, attack, defence, style) {
		this.id = id;
		this.element = element;
		this.hp = hp;
		this.currenthp = hp;
		this.attack = attack;
		this.defence = defence;
		this.style = style;
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

function updateHeroStats(id) {
	var hero = gameData.owned_heros[id]
	gameData.owned_heros[id].hp = hero.basehp * hero.level * hero.hpupgradelevel
	gameData.owned_heros[id].attack = hero.baseatk * hero.level * hero.atkupgradelevel
	gameData.owned_heros[id].defence = hero.basedef * hero.level * hero.defupgradelevel
	gameData.owned_heros[id].resistance = hero.baseres * hero.level * hero.resupgradelevel

	var hero = gameData.owned_heros[id]
	document.getElementById("display_hp").innerHTML = hero.hp
	document.getElementById("display_atk").innerHTML = hero.attack
	document.getElementById("display_def").innerHTML = hero.defence
	document.getElementById("display_res").innerHTML = hero.resistance
	document.getElementById("display_lvl").innerHTML = hero.level
	document.getElementById("display_xp").innerHTML = hero.experience
}

function checkLevelUp(id) {
	var hero = gameData.owned_heros[id]

	if (hero.experience >= 10*(2**(hero.level-1))) {
		hero.level += 1
	}
	updateHeroStats(id)
}

function showHeroStats(id) {
	gameData.displayed_hero = id
	var hero = gameData.owned_heros[id]
	//display hero stats
	document.getElementById("display_name").innerHTML = hero.name
	document.getElementById("display_stars").innerHTML = hero.stars
	document.getElementById("display_element").innerHTML = hero.element
	document.getElementById("display_lvl").innerHTML = hero.level
	document.getElementById("display_xp").innerHTML = hero.experience
	document.getElementById("display_hp").innerHTML = hero.hp
	document.getElementById("display_atk").innerHTML = hero.attack
	document.getElementById("display_def").innerHTML = hero.defence
	document.getElementById("display_res").innerHTML = hero.resistance
	document.getElementById("display_description").innerHTML = hero.description

	document.getElementById("charStats").style.display = "inline-block"
	document.getElementById("heroTrain").style.display = "none"
}

function selectHero() {
	id = gameData.displayed_hero
	if (gameData.squad_heros.length < 3) {
		if (!gameData.squad_heros.includes(id)) {
			gameData.squad_heros.push(id)
		}
	} else {
		if (!gameData.squad_heros.includes(id)) {
			gameData.squad_heros.shift()
			gameData.squad_heros.push(id)
		}
	}

	for (i = 0; i < gameData.owned_heros.length; i++) {
		if (gameData.squad_heros.includes(i)) {
			document.getElementById("heroColImage"+(i+1)).style.background = '#4CAF50'
		} else {
			document.getElementById("heroColImage"+(i+1)).style.background = 'none'
		}
	}
	updateDungeon()
}

function updateDungeon() {
	//set the dungeon as the parent
	const parent = document.getElementById("theDungeonImages")

	//clear all elements
	while (parent.firstChild) {
		parent.firstChild.remove()
	}

	//set background
	background_image = document.createElement('img')
	background_image.setAttribute('src', 'assets/SnowBackgroundNight.png')
	background_image.setAttribute('class', 'dgbackground')
	parent.appendChild(background_image)

	//place heros
	for (i = 0; i < gameData.squad_heros.length; i++) {
		hero_image = document.createElement('img')
		hero_image.setAttribute('src', gameData.owned_heros[gameData.squad_heros[i]].image)
		hero_image.setAttribute('class', 'hero'+i)
		parent.appendChild(hero_image)
	}

	//place enemies
	enemy_image = document.createElement('img')
	enemy_image.setAttribute('src', 'assets/enemy_1.png')
	enemy_image.setAttribute('class', 'enemy')
	parent.appendChild(enemy_image)
}

function trainHeroDisplay(stat) {
	id = gameData.displayed_hero
	var hero = gameData.owned_heros[id]
	if (stat == 'hp') {
		document.getElementById("selectedStat").innerHTML = "Hitpoints"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.basehp*hero.level) + " Hitpoints"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('hp')")
	}
	if (stat == 'atk') {
		document.getElementById("selectedStat").innerHTML = "Attack"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.baseatk*hero.level) + " Attack"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('atk')")
	}
	if (stat == 'def') {
		document.getElementById("selectedStat").innerHTML = "Defence"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.basedef*hero.level) + " Defence"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('def')")
	}
	if (stat == 'res') {
		document.getElementById("selectedStat").innerHTML = "Resistance"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.baseres*hero.level) + " Resistance"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('res')")
	}

	document.getElementById("heroTrain").style.display = "inline-block"

	if (gameData.gold >= 100) {
		document.getElementById("trainStat").disabled = false
	}
}

function trainHero(stat) {
	id = gameData.displayed_hero
	if (gameData.gold >= 100) {
		gameData.gold -= 100
		document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"
		if (stat == 'hp') {
			gameData.owned_heros[id].hpupgradelevel += 1
		}
		if (stat == 'atk') {
			gameData.owned_heros[id].atkupgradelevel += 1
		}
		if (stat == 'def') {
			gameData.owned_heros[id].defupgradelevel += 1
		}
		if (stat == 'res') {
			gameData.owned_heros[id].resupgradelevel += 1
		}
	}

	updateHeroStats(id)

	if (gameData.gold < 100) {
		document.getElementById("trainStat").disabled = true
	}
}

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

function generateEnemy(level) {
	element = 'snow'
	rng = generateRandomNumber(0, 100)
	hp = 50 + rng
	hp = hp*(2**level)
	rng = generateRandomNumber(0, 10)
	attack = 5 + rng
	attack = attack*(2**level)
	rng = generateRandomNumber(0, 10)
	defence = 5 + rng
	defence = defence*(2**level)
	rng = generateRandomNumber(0, 1)
	style = 'defence'
	if (rng == 0) {
		style = 'resistance'
	}

	newEnemy = new Enemy(0, element, hp, attack, defence, style)
	console.log(newEnemy)
	return newEnemy
}

function battleTick(squad, enemy) {
	enemy.currenthp -= Math.max(0, 2*squad.attack - enemy.defence)
	document.getElementById("enemyhealth").value = (enemy.currenthp/enemy.hp*100)

	if(enemy.style == 'defence') {
		squad.currenthp -= Math.max(0, 2*enemy.attack - squad.defence)
	} else {
		squad.currenthp -= Math.max(0, 2*enemy.attack - squad.resistance)
	}
	
	document.getElementById("squadhealth").value = (squad.currenthp/squad.hp*100)
}

function dungeonBattle() {
	gameData.enemy = generateEnemy(gameData.enemysDefeated)
}

function gainExperience(kills) {
	xpGained = 0
	for (i = 0; i < kills; i++) {
		xpGained += (i + 1)
	}
	console.log(xpGained)
	return xpGained
}

function battleDefeat() {
	if (gameData.squad_heros.length > 0) {
		squad = gameData.owned_heros[gameData.squad_heros[0]]
		squad.currenthp = squad.hp
		document.getElementById("squadhealth").value = (squad.currenthp/squad.hp*100)
		squad.experience += gainExperience(gameData.enemysDefeated)
		checkLevelUp(gameData.squad_heros[0])
		updateHeroStats(gameData.squad_heros[0])
	}
	console.log(gameData.enemysDefeated*10)
	gameData.gold += gameData.enemysDefeated*10
	document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"
	gameData.enemysDefeated = 0

	//close the dungeon
	document.getElementById("theDungeon").style.display = "none"
}

function battleAttack() {
	enemy = gameData.enemy
	squad = gameData.owned_heros[gameData.squad_heros[0]]
	battleTick(squad, enemy)

	if (enemy.currenthp <= 0) {
		gameData.enemysDefeated += 1
		dungeonBattle()
		document.getElementById("enemyhealth").value = (gameData.enemy.currenthp/gameData.enemy.hp*100)
	}

	if (squad.currenthp <= 0) {
		battleDefeat()
	}
}

function enterDungeon() {
	if (gameData.dungeonTickets > 0) {
		if (gameData.squad_heros.length > 0) {
			gameData.dungeonTickets -= 1
			//end previous dungeon session
			battleDefeat()

			//start new dungeon session
			document.getElementById("dungeonWarningMessage").innerHTML = ""
			document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"
			document.getElementById("theDungeon").style.display = "inline-block"
			if (gameData.dungeonTickets < 1) {
				document.getElementById("enterDungeonButton").disabled = true
			}
			dungeonBattle()
			document.getElementById("enemyhealth").value = (gameData.enemy.currenthp/gameData.enemy.hp*100)
		}
		else {
			document.getElementById("dungeonWarningMessage").innerHTML = "You need a hero assigned to enter the dungeon."
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

	//end dungeon session
	battleDefeat()
}

function updateGems() {
	document.getElementById("gemsOwned").innerHTML = gameData.gems + " Gem"
	//small bug where if you go down to 0 gems and then back to 1 it lets you
	//pull on the banner a second time
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
		hero_image.setAttribute('src', result_hero.image)
		hero_image.setAttribute('id', 'heroColImage'+gameData.owned_heros.length)
		hero_image.setAttribute('onclick', 'showHeroStats('+(gameData.owned_heros.length-1)+')')
		hero_image.setAttribute('class', 'hero_image')
		document.getElementById('charList').appendChild(hero_image)
		gameData.unique_hero_count += 1
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
document.getElementById("heroTrain").style.display = "none"
document.getElementById("charStats").style.display = "none"