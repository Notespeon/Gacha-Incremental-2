var gameData = {
	gold: 100,
	gems: 0,
	day: 1,
	dungeonTickets: 0,
	autoDungeonTickets: 0, 
	autoDailyClaim: 0,
	unLimiter: 0,
	dailyLevel: 1,
	fastTrainer: 0,
	bottledExp: 0,
	owned_heros: [],
	duplicate_heros: [],
	unique_hero_count: 0,
	displayed_hero: null,
	squad_heros: [],
	squad_hp: 0,
	enemy: null,
	enemysDefeated: 0,
	bestEnemysDefeated: 0,
	dungeonOpen: false,
	pullCounts: [0, 0],
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

function updateHeroStats(hero) {
	hero.hp = hero.basehp * hero.level * hero.hpupgradelevel
	hero.attack = hero.baseatk * hero.level * hero.atkupgradelevel
	hero.defence = hero.basedef * hero.level * hero.defupgradelevel
	hero.resistance = hero.baseres * hero.level * hero.resupgradelevel

	//update hero stats in collection
	if (gameData.displayed_hero != null) {
		showHeroStats(gameData.displayed_hero)
	}
}

function checkLevelUp(hero, slot) {
	var levellingUp = false
	if (hero.experience >= 10*(2**(hero.level-1)) && hero.level < 10) {
		levellingUp = true
	}

	while (hero.experience >= 10*(2**(hero.level-1)) && hero.level < 10) {
		hero.level += 1
	}

	if (levellingUp) {
		document.getElementById("levelUpReward"+(slot+1)).innerHTML = hero.name + " Levelled Up! Level: " + hero.level
	} else {
		document.getElementById("levelUpReward"+(slot+1)).innerHTML = ""
	}
	updateHeroStats(hero)
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
	for (var i = 0; i < gameData.squad_heros.length; i++) {
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
	document.getElementById("trainStat").disabled = true
	if (stat == 'hp') {
		document.getElementById("selectedStat").innerHTML = "Hitpoints"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.basehp*hero.level) + " Hitpoints"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('hp')")

		//enable button if conditions are met
		if (gameData.gold >= 100 && hero.hpupgradelevel < hero.level*5) {
			document.getElementById("trainStat").disabled = false
		}
	}
	if (stat == 'atk') {
		document.getElementById("selectedStat").innerHTML = "Attack"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.baseatk*hero.level) + " Attack"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('atk')")

		//enable button if conditions are met
		if (gameData.gold >= 100 && hero.atkupgradelevel < hero.level*5) {
			document.getElementById("trainStat").disabled = false
		}
	}
	if (stat == 'def') {
		document.getElementById("selectedStat").innerHTML = "Defence"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.basedef*hero.level) + " Defence"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('def')")

		//enable button if conditions are met
		if (gameData.gold >= 100 && hero.defupgradelevel < hero.level*5) {
			document.getElementById("trainStat").disabled = false
		}
	}
	if (stat == 'res') {
		document.getElementById("selectedStat").innerHTML = "Resistance"
		document.getElementById("statCost").innerHTML = "Cost: 100 Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + (hero.baseres*hero.level) + " Resistance"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('res')")

		//enable button if conditions are met
		if (gameData.gold >= 100 && hero.resupgradelevel < hero.level*5) {
			document.getElementById("trainStat").disabled = false
		}
	}

	document.getElementById("heroTrain").style.display = "inline-block"
}

function trainHero(stat) {
	id = gameData.displayed_hero
	hero = gameData.owned_heros[id]

	if (gameData.gold >= 100) {
		if (stat == 'hp') {
			if (hero.hpupgradelevel < hero.level*5) {
				hero.hpupgradelevel += 1
				gameData.gold -= 100
				updateHealth()
			}
		}
		if (stat == 'atk') {
			if (hero.atkupgradelevel < hero.level*5) {
				hero.atkupgradelevel += 1
				gameData.gold -= 100
			}
		}
		if (stat == 'def') {
			if (hero.defupgradelevel < hero.level*5) {
				hero.defupgradelevel += 1
				gameData.gold -= 100
			}
		}
		if (stat == 'res') {
			if (hero.resupgradelevel < hero.level*5) {
				hero.resupgradelevel += 1
				gameData.gold -= 100
			}
		}
	}

	updateGold()

	hero = gameData.owned_heros[id]
	updateHeroStats(hero)

	//update train button
	trainHeroDisplay(stat)
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

	for (var i = 1; i < 29; i++) {
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
	squadtotalhp = 0
	squadcurrenthp = gameData.squad_hp
	for (var i = 0; i < gameData.squad_heros.length; i++) {
		squadtotalhp += gameData.owned_heros[gameData.squad_heros[i]].hp
	}
	if (squadtotalhp > 0) {
		document.getElementById("squadhealth").value = Math.round(squadcurrenthp/squadtotalhp*100)
		document.getElementById("enemyhealth").value = Math.round(gameData.enemy.currenthp/gameData.enemy.hp*100)
	}
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
	for (var i = 0; i < kills; i++) {
		xpGained += (i + 1)
	}
	document.getElementById("xpReward").innerHTML = "Experience Obtained: " + xpGained
	return xpGained
}

function gainGold(kills) {
	goldGained = 0
	for (var i = 0; i < kills; i++) {
		goldGained += (i + 1)
	}
	return goldGained*5
}

function battleDefeat() {
	if (gameData.squad_heros.length > 0) {
		gameData.squad_hp = 0
		for (var i = 0; i < gameData.squad_heros.length; i++) {
			hero = gameData.owned_heros[gameData.squad_heros[i]]
			gameData.squad_hp += hero.hp
			hero.experience += gainExperience(gameData.enemysDefeated)
			checkLevelUp(hero, i)
		}
		document.getElementById("squadhealth").value = 100
	}
	document.getElementById("goldReward").innerHTML = "Gold Obtained: " + (gainGold(gameData.enemysDefeated))
	gameData.gold += gainGold(gameData.enemysDefeated)
	updateGold()

	document.getElementById("specialReward").innerHTML = ""
	
	if (gameData.enemysDefeated > gameData.bestEnemysDefeated) {
		//reward for clearing level 5
		if (gameData.bestEnemysDefeated < 5) {
			if (gameData.enemysDefeated >= 5) {
				document.getElementById("specialReward").innerHTML = "Level 5 Bonus: NEW BANNER UNLOCKED!"
			}
		}

		//reward for clearing levle 10
		if (gameData.bestEnemysDefeated < 10) {
			if (gameData.enemysDefeated >= 10) {
				document.getElementById("specialReward").innerHTML = "Level 10 Bonus: END OF CONTENT REACHED IN " + gameData.day + " Days!"
			}
		}

		//reward gems per level cleared, increasing per 5 levels
		rewardGems = 0
		while(gameData.bestEnemysDefeated < gameData.enemysDefeated) {
			rewardGems += 1 + Math.floor((1 + gameData.bestEnemysDefeated)/5)
			gameData.bestEnemysDefeated += 1
		}

		gameData.gems += rewardGems
		document.getElementById("gemReward").innerHTML = "Best Clear Bonus: " + (rewardGems) + " Gem(s) Obtained!"

		updateGems()
	} else {
		document.getElementById("gemReward").innerHTML = ""
	}

	//close the dungeon
	gameData.enemysDefeated = 0
	gameData.dungeonOpen = false
	document.getElementById("theDungeon").style.display = "none"
	document.getElementById("enemyStats").style.display = "none"
}

function battleTick(squad, enemy) {
	enemy.currenthp -= Math.max(0, 2*squad[0] - enemy.defence)

	if(enemy.style == 'defence') {
		gameData.squad_hp -= Math.max(0, 2*enemy.attack - squad[1])
	} else {
		gameData.squad_hp -= Math.max(0, 2*enemy.attack - squad[2])
	}
	
	updateHealth()
}

function battleAttack() {
	enemy = gameData.enemy

	//atk, def, res
	squad = [0, 0, 0]

	for (var i = 0; i < gameData.squad_heros.length; i++) {
		unit = gameData.owned_heros[gameData.squad_heros[0]]
		squad[0] += unit.attack
		squad[1] += unit.defence
		squad[2] += unit.resistance
	}

	battleTick(squad, enemy)

	if (enemy.currenthp <= 0) {
		gameData.enemysDefeated += 1
		dungeonBattle()
		document.getElementById("enemyhealth").value = (gameData.enemy.currenthp/gameData.enemy.hp*100)
	}

	if (gameData.squad_hp <= 0) {
		battleDefeat()
	}
}

//battle loop
var battleLoop = window.setInterval(function() {
	if (gameData.dungeonOpen) {
		battleAttack()
	}
}, 1000)

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
			updateDungeon()
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
		updateGold()
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
	updateGold()

	//enable login reward
	gameData.loginObtained = false
	document.getElementById("dailyRewardButton").disabled = false

	//end dungeon session
	if (gameData.dungeonOpen) {
		battleDefeat()
	}
}

function changeBanner(bannerId) {
	document.getElementById("newbieBanner").style.display = "none"
	document.getElementById("standardBanner").style.display = "none"
	document.getElementById("improvementBanner").style.display = "none"

	if (bannerId == 0) {
		document.getElementById("newbieBanner").style.display = "inline-block"
	}

	if (bannerId == 1) {
		document.getElementById("standardBanner").style.display = "inline-block"
	}

	if (bannerId == 2) {
		document.getElementById("improvementBanner").style.display = "inline-block"
	}
}

function updateGems() {
	//unlock second banner
	if (gameData.pullCounts[0] != 0) {
		document.getElementById("nextBanner1").disabled = false
		document.getElementById("prevBanner2").disabled = false
	}

	//unlock third banner
	if (gameData.bestEnemysDefeated >= 5) {
		document.getElementById("nextBanner2").disabled = false
		document.getElementById("prevBanner3").disabled = false
	}

	//enable newbie banner
	if (gameData.gems >= 1 && gameData.pullCounts[0] == 0) {
		document.getElementById("pullOnBanner1").disabled = false
	} else {
		document.getElementById("pullOnBanner1").disabled = true
	}

	//enable standard banner
	if (gameData.gems >= 10 && gameData.pullCounts[0] != 0) {
		document.getElementById("pullOnBanner2").disabled = false
	} else {
		document.getElementById("pullOnBanner2").disabled = true
	}

	//enable improvement banner
	if (gameData.gems >= 10 && gameData.bestEnemysDefeated >= 5) {
		document.getElementById("pullOnBanner3").disabled = false
	} else {
		document.getElementById("pullOnBanner3").disabled = true
	}

	//update gem count
	document.getElementById("gemsOwned").innerHTML = gameData.gems + " Gems"

	/*if (gameData.pullCounts[0] == 0) {
		document.getElementById("standardBanner").style.display = "none"
		document.getElementById("newbieBanner").style.display = "inline-block"
		if (gameData.gems >= 1) {
			document.getElementById("pullOnBanner1").disabled = false
		} else {
			document.getElementById("pullOnBanner1").disabled = true
		}
	} else {
		document.getElementById("newbieBanner").style.display = "none"
		document.getElementById("standardBanner").style.display = "inline-block"
		if (gameData.gems >= 10) {
			document.getElementById("pullOnBanner2").disabled = false
		} else {
			document.getElementById("pullOnBanner2").disabled = true
		}
	}*/
}

function updateGold() {
	document.getElementById("goldOwned").innerHTML = gameData.gold + " Gold"
	document.getElementById("heroTrain").style.display = "none"
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
	for (var i = 0; i < gameData.owned_heros.length; i++) {
		hero_image = document.createElement('img')
		hero_image.setAttribute('src', gameData.owned_heros[i].image)
		hero_image.setAttribute('id', 'heroColImage'+(i+1))
		hero_image.setAttribute('onclick', 'showHeroStats('+(i)+')')
		hero_image.setAttribute('class', 'hero_image')
		parent.appendChild(hero_image)
	}

	//highlight squad heros
	for (var i = 0; i < gameData.owned_heros.length; i++) {
		if (gameData.squad_heros.includes(i)) {
			document.getElementById("heroColImage"+(i+1)).style.background = '#4CAF50'
		} else {
			document.getElementById("heroColImage"+(i+1)).style.background = 'none'
		}
	}

	updateDungeon()
}

function checkIfDuplicate(hero) {
	for (var i = 0; i < gameData.owned_heros.length; i++) {
		if (hero.id == gameData.owned_heros[i].id) {
			return true
		}
	}
	return false
}

function checkWhereDuplicate(hero) {
	for (var i = 0; i < gameData.owned_heros.length; i++) {
		if (hero.id == gameData.owned_heros[i].id) {
			return i
		}
	}
	return -1
}

function summon3star() {
	rng = generateRandomNumber(0, 5)
	result_hero = hero_pool[rng]

	//check if duplicate
	duplicateHero = checkIfDuplicate(result_hero)

	if (duplicateHero) {
		id = checkWhereDuplicate(result_hero)
		gameData.duplicate_heros[id] += 1
		document.getElementById("bannerReward").innerHTML = "Summoned Duplicate Hero: " + hero_pool[rng].name + ". You have " + gameData.duplicate_heros[id] + " duplicates."
	} else {
		gameData.owned_heros.push(result_hero)
		gameData.duplicate_heros.push(0)
		gameData.unique_hero_count += 1
		document.getElementById("bannerReward").innerHTML = "Summoned New Hero: " + hero_pool[rng].name + "!"
	}

	updateCollection()
}

function summon0star() {
	rng = generateRandomNumber(0, 1)
	if (rng == 1) {
		bannerGold = 100 + (100*gameData.bestEnemysDefeated)
		gameData.gold += bannerGold
		updateGold()
		document.getElementById("bannerReward").innerHTML = "Recieved " + bannerGold + " Gold"
	} else {
		gameData.dungeonTickets += 10
		document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"
		document.getElementById("enterDungeonButton").disabled = false
		document.getElementById("bannerReward").innerHTML = "Recieved 10 Dungeon Tickets"
	}
}

function pullBanner(id) {
	if(id == 0) {
		if(gameData.gems >= 1) {
			gameData.gems -= 1
			gameData.pullCounts[id] += 1
			updateGems()
			summon3star()
			document.getElementById("pullOnBanner1").disabled = true
			document.getElementById("newbieBanner").style.display = "none"
			document.getElementById("standardBanner").style.display = "inline-block"
		}
	} else if (id == 1) {
		if(gameData.gems >= 10) {
			gameData.gems -= 10
			gameData.pullCounts[id] += 1
			updateGems()

			//determine star ranking
			rng = generateRandomNumber(1, 100)

			if (rng > 50) {
				//3 star
				summon3star()
			} else {
				summon0star()
			}
		}
	} else if (id == 2) {
		if(gameData.gems >= 10) {
			gameData.gems -= 10
			gameData.pullCounts[id] += 1
			updateGems()

			//determine item reward
			rng = generateRandomNumber(0, 9)
			rewards = [0, 0, 1, 1, 2, 2, 3, 3, 4, 5]
			results_reward = rewards[rng]

			if (results_reward == 0) {
				gameData.autoDungeonTickets += 10
				document.getElementById("bannerReward").innerHTML = "Recieved 10 Auto Dungeon Tickets"
			} else if (results_reward == 1) {
				gameData.autoDailyClaim += 10
				document.getElementById("bannerReward").innerHTML = "Recieved 10 Auto Login-Claims"
			} else if (results_reward == 2) {
				gameData.fastTrainer += 10
				document.getElementById("bannerReward").innerHTML = "Recieved 10 Dungeon Tickets"
			} else if (results_reward == 3) {
				gameData.bottledExp += 5
				document.getElementById("bannerReward").innerHTML = "Recieved 5 Bottled Experience"
			} else if (results_reward == 4) {
				gameData.unLimiter += 1
				document.getElementById("bannerReward").innerHTML = "Recieved 1 UN-LIMITER"
			} else if (results_reward == 5) {
				gameData.adailyLevel += 1
				document.getElementById("bannerReward").innerHTML = "Recieved 1 Daily Improvement, Increasing your Daily Level!"
			}
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
		autoDungeonTickets: 0, 
		autoDailyClaim: 0,
		unLimiter: 0,
		dailyLevel: 1,
		fastTrainer: 0,
		bottledExp: 0,
		owned_heros: [],
		duplicate_heros: [],
		unique_hero_count: 0,
		displayed_hero: null,
		squad_heros: [],
		squad_hp: 0,
		enemy: null,
		enemysDefeated: 0,
		bestEnemysDefeated: 0,
		dungeonOpen: false,
		pullCounts: [0, 0],
		loginObtained: false
	}
	localStorage.setItem('gachaIncrementalSave', JSON.stringify(gameData))

	//reset daily progress
	document.getElementById("dailyRewardButton").disabled = false
	genCalendar()

	//update currencies
	document.getElementById("currentDay").innerHTML = "Day " + gameData.day
	updateGems()
	updateGold()
	document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"

	//tidy up menus
	document.getElementById("bannerReward").innerHTML = ""
	updateCollection()

	document.getElementById("nextBanner1").disabled = true
	document.getElementById("prevBanner2").disabled = true
	document.getElementById("nextBanner2").disabled = false
	document.getElementById("prevBanner3").disabled = false
	document.getElementById("pullOnBanner1").disabled = true
	document.getElementById("pullOnBanner2").disabled = true
	document.getElementById("pullOnBanner3").disabled = true

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
	updateGold()
	document.getElementById("ticketCount").innerHTML = "You have " + gameData.dungeonTickets + " Dungeon Tickets"

	updateCollection()

	//enable daily if unobtained
	if (!gameData.loginObtained) {
		document.getElementById("dailyRewardButton").disabled = false
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
	document.getElementById("standardBanner").style.display = "none"
}

/* MAIN? */
tab("colDailyMenu")
genCalendar()
document.getElementById("heroTrain").style.display = "none"
document.getElementById("charStats").style.display = "none"

document.getElementById("newbieBanner").style.display = "inline-block"
document.getElementById("standardBanner").style.display = "none"
document.getElementById("improvementBanner").style.display = "none"