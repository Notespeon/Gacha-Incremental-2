var gameData = {
	gold: 100,
	gems: 0,
	day: 1,
	dungeonTickets: 0,
	owned_heros: [],
	unique_hero_count: 0,
	displayed_hero: null,
	squad_heros: [],
	enemy: null,
	enemysDefeated: 0,
	bestEnemysDefeated: 0,
	dungeonOpen: false,
	pullCounts: [0],
	loginObtained: false
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
	new Hero(1, "Sarah the Saintly", 3, "Light", 100, 10, 10, 5, "An Archangel", "scuffed_assets/archangel_female.png"),
	new Hero(2, "Samuel the Special", 3, "Light", 100, 10, 10, 5, "An Archangel", "scuffed_assets/archangel_male.png"),
	new Hero(3, "Debra the Daring", 3, "Dark", 80, 12, 5, 10, "An Archdemon", "scuffed_assets/archdemon_female.png"),
	new Hero(4, "Daniel the Duke", 3, "Dark", 80, 12, 5, 10, "An Archdemon", "scuffed_assets/archdemon_male.png"),
	new Hero(5, "Patricia the Painless", 3, "Light", 120, 8, 8, 8, "A Paladin", "scuffed_assets/paladin_female.png"),
	new Hero(6, "Percy the Precarious", 3, "Light", 120, 8, 8, 8, "A Paladin", "scuffed_assets/paladin_male.png")
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
		document.getElementById("levelUpReward").innerHTML = hero.name + " Levelled Up! Level: " + hero.level
	} else {
		document.getElementById("levelUpReward").innerHTML = ""
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

	updateCollection()
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
	background_image.setAttribute('src', 'scuffed_assets/SnowBackgroundNight.png')
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
	if (gameData.enemy != null && gameData.squad_heros.length > 0) {
		showEnemyStats()
		enemy_image = document.createElement('img')
		enemy_image.setAttribute('src', 'scuffed_assets/enemy_1.png')
		enemy_image.setAttribute('class', 'enemy')
		parent.appendChild(enemy_image)

		//update health
		updateHealth()
	}
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
	document.getElementById("settingsMenu").style.display = "none"

	document.getElementById("bannermenu").className = "inactive"
	document.getElementById("dailymenu").className = "inactive"
	document.getElementById("collect").className = "inactive"
	document.getElementById("settings").className = "inactive"
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
	} else if (tab == "settingsMenu") {
		document.getElementById("settings").className = "active"
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
	return newEnemy
}

function updateHealth() {
	squad = gameData.owned_heros[gameData.squad_heros[0]]
	document.getElementById("enemyhealth").value = Math.round(gameData.enemy.currenthp/gameData.enemy.hp*100)
	document.getElementById("squadhealth").value = Math.round(squad.currenthp/squad.hp*100)
}

function battleTick(squad, enemy) {
	enemy.currenthp -= Math.max(0, 2*squad.attack - enemy.defence)

	if(enemy.style == 'defence') {
		squad.currenthp -= Math.max(0, 2*enemy.attack - squad.defence)
	} else {
		squad.currenthp -= Math.max(0, 2*enemy.attack - squad.resistance)
	}
	
	updateHealth()
	//document.getElementById("enemyhealth").value = Math.round(enemy.currenthp/enemy.hp*100)
	//document.getElementById("squadhealth").value = Math.round(squad.currenthp/squad.hp*100)
}

function showEnemyStats() {
	document.getElementById("display_enemy_name").innerHTML = "enemy"
	document.getElementById("display_enemy_element").innerHTML = gameData.enemy.element
	document.getElementById("display_enemy_lvl").innerHTML = (gameData.enemysDefeated + 1)
	document.getElementById("display_enemy_hp").innerHTML = gameData.enemy.hp
	document.getElementById("display_enemy_atk").innerHTML = gameData.enemy.attack
	document.getElementById("display_enemy_def").innerHTML = gameData.enemy.defence
	document.getElementById("display_enemy_style").innerHTML = gameData.enemy.style
	document.getElementById("display_enemy_description").innerHTML = "placeholder"
}

function dungeonBattle() {
	gameData.enemy = generateEnemy(gameData.enemysDefeated)
	showEnemyStats()
}

function gainExperience(kills) {
	xpGained = 0
	for (i = 0; i < kills; i++) {
		xpGained += (i + 1)
	}
	document.getElementById("xpReward").innerHTML = "Experience Obtained: " + xpGained
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
	document.getElementById("goldReward").innerHTML = "Gold Obtained: " + (gameData.enemysDefeated*10)
	gameData.gold += gameData.enemysDefeated*10
	document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"
	
	if (gameData.enemysDefeated > gameData.bestEnemysDefeated) {
		enemyDefeatProgress = gameData.enemysDefeated - gameData.bestEnemysDefeated
		document.getElementById("gemReward").innerHTML = "Best Clear Bonus: " + (enemyDefeatProgress) + " Gem Obtained!"
		gameData.gems += enemyDefeatProgress
		updateGems()
		gameData.bestEnemysDefeated = gameData.enemysDefeated
	} else {
		document.getElementById("gemReward").innerHTML = ""
	}

	//close the dungeon
	gameData.enemysDefeated = 0
	gameData.dungeonOpen = false
	document.getElementById("theDungeon").style.display = "none"
	document.getElementById("enemyStats").style.display = "none"
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
			gameData.dungeonOpen = true
			document.getElementById("dungeonWarningMessage").innerHTML = ""
			document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"
			document.getElementById("theDungeon").style.display = "inline-block"
			document.getElementById("enemyStats").style.display = "inline-block"
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
	gameData.loginObtained = true
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
		dailyGold = 10 + (10*gameData.bestEnemysDefeated)
		gameData.gold += dailyGold
		document.getElementById("dailyRewardText").innerHTML = "Recieved " + dailyGold + " Gold"
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
	updateGems()
	document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"

	//enable login reward
	gameData.loginObtained = false
	document.getElementById("dailyRewardButton").disabled = false

	//end dungeon session
	if (gameData.dungeonOpen) {
		battleDefeat()
	}
}

function updateGems() {
	document.getElementById("gemsOwned").innerHTML = gameData.gems + " Gems"
	//small bug where if you go down to 0 gems and then back to 1 it lets you
	//pull on the banner a second time
	if (gameData.gems >= 1 && gameData.pullCounts[0] == 0) {
		document.getElementById("pullOnBanner").disabled = false
	}
}

function generateRandomNumber(min, max) {
	return parseInt(Math.random() * (max - min + 1) + min)
}

function updateCollection() {
	//set the charList as the parent
	const parent = document.getElementById('charList')

	//clear all elements
	while (parent.firstChild) {
		parent.firstChild.remove()
	}

	//add a p as a buffer
	parent.appendChild(document.createElement('p'))

	//place each hero
	for (i = 0; i < gameData.owned_heros.length; i++) {
		hero_image = document.createElement('img')
		hero_image.setAttribute('src', gameData.owned_heros[i].image)
		hero_image.setAttribute('id', 'heroColImage'+(i+1))
		hero_image.setAttribute('onclick', 'showHeroStats('+(i)+')')
		hero_image.setAttribute('class', 'hero_image')
		parent.appendChild(hero_image)
	}

	//highlight squad heros
	for (i = 0; i < gameData.owned_heros.length; i++) {
		if (gameData.squad_heros.includes(i)) {
			document.getElementById("heroColImage"+(i+1)).style.background = '#4CAF50'
		} else {
			document.getElementById("heroColImage"+(i+1)).style.background = 'none'
		}
	}

	updateDungeon()
}

function pullBanner(id) {
	if(id == 0) {
		if(gameData.gems >= 1) {
			gameData.gems -= 1
			gameData.pullCounts[id] += 1
			updateGems()
			rng = generateRandomNumber(0, 5)
			result_hero = hero_pool[rng]
			gameData.owned_heros.push(result_hero)
			updateCollection()
			gameData.unique_hero_count += 1
			document.getElementById("pullOnBanner").disabled = true
		}
	}
}

function hard_reset() {
	localStorage.clear()
	gameData = {
		gold: 100,
		gems: 0,
		day: 1,
		dungeonTickets: 0,
		owned_heros: [],
		unique_hero_count: 0,
		displayed_hero: null,
		squad_heros: [],
		enemy: null,
		enemysDefeated: 0,
		bestEnemysDefeated: 0,
		dungeonOpen: false,
		pullCounts: [0],
		loginObtained: false
	}
	localStorage.setItem('gachaIncrementalSave', JSON.stringify(gameData))

	//reset daily progress
	document.getElementById("dailyRewardButton").disabled = false
	genCalendar()

	//update currencies
	document.getElementById("currentDay").innerHTML = "Day " + gameData.day
	updateGems()
	document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"
	document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"

	updateCollection()

	//update dungeon status
	gameData.enemy = generateEnemy(gameData.enemysDefeated)
	document.getElementById("theDungeon").style.display = "none"
	document.getElementById("enemyStats").style.display = "none"

}

//save data stuff
var saveGameLoop = window.setInterval(function() {
	localStorage.setItem('gachaIncrementalSave', JSON.stringify(gameData))
	console.log('saving...')
}, 15000)

//load data stuff
var savegame = JSON.parse(localStorage.getItem('gachaIncrementalSave'))
console.log(savegame)
if (savegame !== null) {
	gameData = savegame

	//update currencies
	document.getElementById("currentDay").innerHTML = "Day " + gameData.day
	updateGems()
	document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"
	document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"

	updateCollection()

	//enable daily if unobtained
	if (!gameData.loginObtained) {
		document.getElementById("dailyRewardButton").disabled = false
	}

	//enable banner if gems are available
	if (gameData.gems >= 1 && gameData.pullCounts[0] == 0) {
		document.getElementById("pullOnBanner").disabled = false
	}

	//update dungeon status
	if (!gameData.dungeonOpen) {
		document.getElementById("theDungeon").style.display = "none"
		document.getElementById("enemyStats").style.display = "none"
	}
} else {
	document.getElementById("theDungeon").style.display = "none"
	document.getElementById("enemyStats").style.display = "none"
	document.getElementById("enterDungeonButton").disabled = true
}

/* MAIN? */
tab("colDailyMenu")
genCalendar()
document.getElementById("heroTrain").style.display = "none"
document.getElementById("charStats").style.display = "none"