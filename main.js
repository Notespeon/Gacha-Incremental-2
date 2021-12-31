var gameData = {
	version: 0.17,
	gold: 100,
	gems: 0,
	superGems: 0,
	bestSuperGems: 0,
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
	squad_stats: [0, 0, 0],
	enemy: null,
	enemysDefeated: 0,
	bestEnemysDefeated: 0,
	dungeonOpen: false,
	pullCounts: [0, 0, 0],
	loginObtained: false,
	autoDungeon: false,
	autoDungeonDelay: 0,
	autoClaim: false,
	prestigeCount: 0,
	qolTicket: 0,
	permAutoDungeon: false,
	permAutoClaim: false,
	permFastTrainer: false,
	luckyStreak: 0
}

class Hero {
	constructor(id, name, stars, element, hp, attack, defence, resistance, description, image) {
		this.id = id;
		this.name = name;
		this.stars = stars;
		this.rank = 0;
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

function formatValue(value) {
	if (value >= 10000) {
		let expValue = value.toExponential(2)
		return expValue.replace("+", "")
	} else {
		return value
	}
}

function updateHeroStats(hero) {
	let bonusMulti = hero.level * (2**hero.rank) * Math.max(1, hero.level - 9) * Math.max(1, hero.level - 19)

	hero.hp = hero.basehp * hero.hpupgradelevel * bonusMulti
	hero.attack = hero.baseatk * hero.atkupgradelevel * bonusMulti
	hero.defence = hero.basedef * hero.defupgradelevel * bonusMulti
	hero.resistance = hero.baseres * hero.resupgradelevel * bonusMulti

	//update hero stats in collection
	if (gameData.displayed_hero != null) {
		showHeroStats(gameData.displayed_hero)
	}
}

function checkPullMilestoneLevel(id) {
	level = gameData.pullCounts[id]

	for (var i = 0; i < 11; i++) {
		let milestoneElement = document.getElementById("banner" + id + "MilestoneLevel" + (i*5))
		if (typeof(milestoneElement) != 'undefined' && milestoneElement != null) {
			if (level >= i*50) {
				milestoneElement.className = "green"
			} else {
				milestoneElement.className = "white"
			}
			
		}
	}
}

function checkDailyRewardLevel() {
	level = gameData.dailyLevel

	for (var i = 0; i < 11; i++) {
		let dailyLevelElement = document.getElementById("dailyLevel" + i)
		if (typeof(dailyLevelElement) != 'undefined' && dailyLevelElement != null) {
			if (level >= i) {
				dailyLevelElement.className = "green"
			} else {
				dailyLevelElement.className = "white"
			}
			
		}
	}
}

function checkLevelUp(hero, slot) {
	let levellingUp = false
	if (hero.experience >= 10*(2**(hero.level-1)) && hero.level < (10 * (1 + hero.rank))) {
		levellingUp = true
	}

	while (hero.experience >= 10*(2**(hero.level-1)) && hero.level < (10 * (1 + hero.rank))) {
		hero.level += 1
	}

	if (gameData.bestEnemysDefeated >= 10 || gameData.prestigeCount > 0) {
		updateSuperGems()
	}

	if (slot == 3) {
		if (levellingUp) {
			if (hero.level >= (10 * (1 + hero.rank))) {
				document.getElementById("giveExpText").innerHTML = hero.name + " Achieves Max Level: " + formatValue(hero.level) + ". Rank Up to Increase Max Level!"
			} else {
				document.getElementById("giveExpText").innerHTML = hero.name + " Levelled Up! Level: " + formatValue(hero.level)
			}
		} else {
			document.getElementById("giveExpText").innerHTML = ""
		}
	} else {
		if (levellingUp) {
			if (hero.level >= (10 * (1 + hero.rank))) {
				document.getElementById("levelUpReward"+(slot+1)).innerHTML = hero.name + " Achieves Max Level: " + formatValue(hero.level) + ". Rank Up to Increase Max Level!"
			} else {
				document.getElementById("levelUpReward"+(slot+1)).innerHTML = hero.name + " Levelled Up! Level: " + formatValue(hero.level)
			}
		} else {
			document.getElementById("levelUpReward"+(slot+1)).innerHTML = ""
		}
	}

	updateHeroStats(hero)
}

function showHeroStats(id) {
	gameData.displayed_hero = id
	let hero = gameData.owned_heros[id]
	//display hero stats
	document.getElementById("display_name").innerHTML = hero.name
	document.getElementById("display_stars").innerHTML = hero.stars
	document.getElementById("display_rank").innerHTML = formatValue(hero.rank)
	document.getElementById("display_element").innerHTML = hero.element
	document.getElementById("display_lvl").innerHTML = formatValue(hero.level)
	document.getElementById("display_xp").innerHTML = formatValue(hero.experience)
	document.getElementById("display_hp").innerHTML = formatValue(hero.hp)
	document.getElementById("display_atk").innerHTML = formatValue(hero.attack)
	document.getElementById("display_def").innerHTML = formatValue(hero.defence)
	document.getElementById("display_res").innerHTML = formatValue(hero.resistance)
	document.getElementById("display_description").innerHTML = hero.description

	document.getElementById("charStats").style.display = "inline-block"
	if (document.getElementById("heroTrain").style.display != "none") {
		if (document.getElementById("selectedStat").innerHTML == "Hitpoints") {
			trainHeroDisplay("hp")
		} else if (document.getElementById("selectedStat").innerHTML == "Attack") {
			trainHeroDisplay("atk")
		} else if (document.getElementById("selectedStat").innerHTML == "Defence") {
			trainHeroDisplay("def")
		} else if (document.getElementById("selectedStat").innerHTML == "Resistance") {
			trainHeroDisplay("res")
		}
	}

	document.getElementById("rankUp").style.display = "none"
}

function selectHero() {
	let id = gameData.displayed_hero
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
	let parent = document.getElementById("theDungeonImages")

	//clear all elements
	while (parent.firstChild) {
		parent.firstChild.remove()
	}

	//set background
	let background_image = document.createElement('img')
	background_image.setAttribute('src', 'scuffed_assets/SnowBackgroundNight.png')
	background_image.setAttribute('class', 'dgbackground')
	parent.appendChild(background_image)

	//place heros
	for (var i = 0; i < gameData.squad_heros.length; i++) {
		let hero_image = document.createElement('img')
		hero_image.setAttribute('src', gameData.owned_heros[gameData.squad_heros[i]].image)
		hero_image.setAttribute('class', 'hero'+i)
		parent.appendChild(hero_image)
	}

	//place enemies
	if (gameData.enemy != null && gameData.squad_heros.length > 0) {
		showEnemyStats()
		let enemy_image = document.createElement('img')
		enemy_image.setAttribute('src', 'scuffed_assets/enemy_1.png')
		enemy_image.setAttribute('class', 'enemy')
		parent.appendChild(enemy_image)

		//update health
		updateHealth()
	}
}

function rankUpHero() {
	let id = gameData.displayed_hero
	let hero = gameData.owned_heros[id]
	let rank = hero.rank

	if ((hero.level >= (10+(rank*10))) && (gameData.duplicate_heros[id] >= (10**rank)) && (gameData.unLimiter >= (10**rank))) {
		document.getElementById("rankUpConfirm").disabled = true
		hero.rank += 1
		hero.level = 1
		hero.experience = 0
		gameData.unLimiter -= 10**rank

	}
	updateHeroStats(hero)
	rankUpDisplay()
}

function rankUpDisplay() {
	let id = gameData.displayed_hero
	let hero = gameData.owned_heros[id]
	let rank = hero.rank

	document.getElementById("rankUp").style.display = "inline-block"
	document.getElementById("heroTrain").style.display = "none"
	document.getElementById("giveExpText").innerHTML = ""
	
	document.getElementById("rankUpLevelRequired").innerHTML = "Level " + formatValue(hero.level) + "/" + formatValue(10+rank*10)
	document.getElementById("dupeCost").innerHTML = formatValue(gameData.duplicate_heros[id]) + "/" + formatValue(10**rank) + " Duplicates"
	document.getElementById("unlimitCost").innerHTML = formatValue(gameData.unLimiter) + "/" + formatValue(10**rank) + " UN-LIMITERS"

	if ((hero.level >= (10+(rank*10))) && (gameData.duplicate_heros[id] >= (10**rank)) && (gameData.unLimiter >= (10**rank))) {
		document.getElementById("rankUpConfirm").disabled = false
	}
}

function trainHeroDisplay(stat) {
	let id = gameData.displayed_hero
	let hero = gameData.owned_heros[id]
	document.getElementById("trainStat").disabled = true
	document.getElementById("fasttrainStat").disabled = true
	document.getElementById("rankUp").style.display = "none"
	document.getElementById("giveExpText").innerHTML = ""
	document.getElementById("trainCap").innerHTML = ""
	if (stat == 'hp') {
		document.getElementById("selectedStat").innerHTML = "Hitpoints"
		document.getElementById("statCost").innerHTML = "Cost: " + (100*(5**Math.floor(hero.hpupgradelevel/50))) + " Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + formatValue(hero.basehp * hero.level * (2**hero.rank)) + " Hitpoints"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('hp')")
		document.getElementById("fasttrainStat").setAttribute('onclick', "fastTrainHero('hp')")

		//enable button if conditions are met
		if (gameData.gold >= (100*(5**Math.floor(hero.hpupgradelevel/50))) && hero.hpupgradelevel < (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainStat").disabled = false
			if (gameData.fastTrainer > 0) {
				document.getElementById("fasttrainStat").disabled = false
			}
		}

		//add warning text if capped
		if (hero.hpupgradelevel >= (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainCap").innerHTML = "Training Capped: Increase Level or Rank to continue"
		}
	}
	if (stat == 'atk') {
		document.getElementById("selectedStat").innerHTML = "Attack"
		document.getElementById("statCost").innerHTML = "Cost: " + (100*(5**Math.floor(hero.atkupgradelevel/50))) + " Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + formatValue(hero.baseatk * hero.level * (2**hero.rank)) + " Attack"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('atk')")
		document.getElementById("fasttrainStat").setAttribute('onclick', "fastTrainHero('atk')")

		//enable button if conditions are met
		if (gameData.gold >= (100*(5**Math.floor(hero.atkupgradelevel/50))) && hero.atkupgradelevel < (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainStat").disabled = false
			if (gameData.fastTrainer > 0) {
				document.getElementById("fasttrainStat").disabled = false
			}
		}

		//add warning text if capped
		if (hero.atkupgradelevel >= (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainCap").innerHTML = "Training Capped: Increase Level or Rank to continue"
		}
	}
	if (stat == 'def') {
		document.getElementById("selectedStat").innerHTML = "Defence"
		document.getElementById("statCost").innerHTML = "Cost: " + (100*(5**Math.floor(hero.defupgradelevel/50))) + " Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + formatValue(hero.basedef * hero.level * (2**hero.rank)) + " Defence"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('def')")
		document.getElementById("fasttrainStat").setAttribute('onclick', "fastTrainHero('def')")

		//enable button if conditions are met
		if (gameData.gold >= (100*(5**Math.floor(hero.defupgradelevel/50))) && hero.defupgradelevel < (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainStat").disabled = false
			if (gameData.fastTrainer > 0) {
				document.getElementById("fasttrainStat").disabled = false
			}
		}

		//add warning text if capped
		if (hero.defupgradelevel >= (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainCap").innerHTML = "Training Capped: Increase Level or Rank to continue"
		}
	}
	if (stat == 'res') {
		document.getElementById("selectedStat").innerHTML = "Resistance"
		document.getElementById("statCost").innerHTML = "Cost: " + (100*(5**Math.floor(hero.resupgradelevel/50))) + " Gold"
		document.getElementById("statChange").innerHTML = "Increase: +" + formatValue(hero.baseres * hero.level * (2**hero.rank)) + " Resistance"
		document.getElementById("trainStat").setAttribute('onclick', "trainHero('res')")
		document.getElementById("fasttrainStat").setAttribute('onclick', "fastTrainHero('res')")

		//enable button if conditions are met
		if (gameData.gold >= (100*(5**Math.floor(hero.resupgradelevel/50))) && hero.resupgradelevel < (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainStat").disabled = false
			if (gameData.fastTrainer > 0) {
				document.getElementById("fasttrainStat").disabled = false
			}
		}

		//add warning text if capped
		if (hero.resupgradelevel >= (hero.level*5 * (2**hero.rank))) {
			document.getElementById("trainCap").innerHTML = "Training Capped: Increase Level or Rank to continue"
		}
	}

	document.getElementById("heroTrain").style.display = "inline-block"
}

function bottleGains(level) {
	let prestigeMulti = (1 + gameData.bestSuperGems)

	/*if (level == 1) {
		return 1*prestigeMulti
	} else {
		let downScaling = 2**(Math.floor((level)/10))
		return 0.5*prestigeMulti*(2**(level-1))/downScaling
	}*/

	return gameData.bestEnemysDefeated*10*prestigeMulti
}

function giveHeroExp() {
	let id = gameData.displayed_hero
	let hero = gameData.owned_heros[id]

	if (gameData.bottledExp > 0) {
		gameData.bottledExp -= 1
		hero.experience += bottleGains(hero.level)

		checkLevelUp(hero, 3)
	}

	if (gameData.bottledExp <= 0) {
		document.getElementById("giveexp").disabled = true
	}
}

function fastTrainHero(stat) {
	gameData.fastTrainer -= 1

	for (var i = 0; i < 10; i++) {
		trainHero(stat)
	}
}

function trainHero(stat) {
	let id = gameData.displayed_hero
	let hero = gameData.owned_heros[id]

	if (stat == 'hp') {
		if (gameData.gold >= (100*(5**Math.floor(hero.hpupgradelevel/50)))) {
			if (hero.hpupgradelevel < (hero.level*5 * (2**hero.rank))) {
				hero.hpupgradelevel += 1
				gameData.gold -= (100*(5**Math.floor(hero.hpupgradelevel/50)))
				updateHealth()
			}
		}
	}
	if (stat == 'atk') {
		if (gameData.gold >= (100*(5**Math.floor(hero.atkupgradelevel/50)))) {
			if (hero.atkupgradelevel < (hero.level*5 * (2**hero.rank))) {
				hero.atkupgradelevel += 1
				gameData.gold -= (100*(5**Math.floor(hero.atkupgradelevel/50)))
			}
		}
	}
	if (stat == 'def') {
		if (gameData.gold >= (100*(5**Math.floor(hero.defupgradelevel/50)))) {
			if (hero.defupgradelevel < (hero.level*5 * (2**hero.rank))) {
				hero.defupgradelevel += 1
				gameData.gold -= (100*(5**Math.floor(hero.defupgradelevel/50)))
			}
		}
	}
	if (stat == 'res') {
		if (gameData.gold >= (100*(5**Math.floor(hero.resupgradelevel/50)))) {
			if (hero.resupgradelevel < (hero.level*5 * (2**hero.rank))) {
				hero.resupgradelevel += 1
				gameData.gold -= (100*(5**Math.floor(hero.resupgradelevel/50)))
			}
		}
	}

	updateGold()
	updateHeroStats(hero)

	//update train button
	trainHeroDisplay(stat)
}

function generateCurrencyElement(name, value) {
	let currency = document.createElement('p')
	currency.innerHTML = "You have " + value + " " + name
	return currency
}

function generateCurrencyElement2(name, value) {
	let currency = document.createElement('p')
	currency.innerHTML = "You have " + name + " " + value
	return currency
}

function generateCurrencyElement3(name, value) {
	let currency = document.createElement('p')
	currency.innerHTML = "You have " + name + " " + value + " times"
	return currency
}

function generateDupeHeroString(name, value) {
	let currency = document.createElement('p')
	currency.innerHTML = "You have "
	for (var i = 0; i < value.length; i++) {
		currency.innerHTML += value[i]
		if ((i < value.length - 1) && value.length > 1) {
			currency.innerHTML += ", "
		} 
	}
	currency.innerHTML += " " + name
	return currency
}

function updateCurrencyPage() {
	//set the div as the parent
	let parent = document.getElementById('currencyCollection')

	//clear all elements
	while (parent.firstChild) {
		parent.firstChild.remove()
	}

	//add a p as a buffer
	parent.appendChild(document.createElement('p'))

	//place each currency
	parent.appendChild(generateCurrencyElement("Gold", gameData.gold))
	parent.appendChild(generateCurrencyElement("Gems", gameData.gems))
	if (gameData.prestigeCount > 0) {
		parent.appendChild(generateCurrencyElement("S-Gems", gameData.superGems))
		parent.appendChild(generateCurrencyElement("Total S-Gems", gameData.bestSuperGems))
	}
	parent.appendChild(generateCurrencyElement("Dungeon Tickets", gameData.dungeonTickets))
	parent.appendChild(generateCurrencyElement("Auto Dungeon Tickets", gameData.autoDungeonTickets))
	parent.appendChild(generateCurrencyElement("Auto Claim Tickets", gameData.autoDailyClaim))
	parent.appendChild(generateCurrencyElement("Fast Training Tickets", gameData.fastTrainer))
	parent.appendChild(generateCurrencyElement("UN-LIMITERS", gameData.unLimiter))
	parent.appendChild(generateCurrencyElement("Bottled EXP", gameData.bottledExp))
	parent.appendChild(generateDupeHeroString("Duplicate Heros", gameData.duplicate_heros))
	//parent.appendChild(generateCurrencyElement(name, value))
	parent.appendChild(document.createElement('p'))
	parent.appendChild(generateCurrencyElement2("Daily Level", gameData.dailyLevel))
	parent.appendChild(generateCurrencyElement2("Cleared Dungeon Level", gameData.bestEnemysDefeated))
	parent.appendChild(generateCurrencyElement3("pulled from the Standard Banner", gameData.pullCounts[1]))
	parent.appendChild(generateCurrencyElement3("pulled from the Improvement Banner", gameData.pullCounts[2]))
	if (gameData.prestigeCount > 0) {
		parent.appendChild(generateCurrencyElement3("Prestiged", gameData.prestigeCount))
	}
}

function genCalendar() {
	// change data into the 1-28 range
	let calendarDay = gameData.day%28
	if (calendarDay == 0) {
		calendarDay = 28
	}
	let cont = document.getElementById('dailyCalendarDiv')
	let ul = document.createElement('ul')

	ul.setAttribute('class', 'dailyCalendar')

	for (var i = 1; i < 29; i++) {
		let li = document.createElement('li')
		let sp = document.createElement('span')
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
	document.getElementById("prestigeMenu").style.display = "none"
	document.getElementById("currencyCollection").style.display = "none"

	document.getElementById("bannermenu").className = "inactive"
	document.getElementById("dailymenu").className = "inactive"
	document.getElementById("collect").className = "inactive"
	document.getElementById("dungeonmenu").className = "inactive"
	document.getElementById("settings").className = "inactive"
	document.getElementById("prestige").className = "inactive"
	document.getElementById("currency").className = "inactive"

	document.getElementById(tab).style.display = "inline-block"

	if (tab == "charCollection") {
		document.getElementById("collect").className = "active"
	} else if (tab == "pullBannerMenu") {
		document.getElementById("bannermenu").className = "active"
	} else if (tab == "colDailyMenu") {
		document.getElementById("dailymenu").className = "active"
	} else if (tab == "theDungeonMenu") {
		document.getElementById("dungeonmenu").className = "active"
	} else if (tab == "settingsMenu") {
		document.getElementById("settings").className = "active"
	} else if (tab == "prestigeMenu") {
		document.getElementById("prestige").className = "active"
	} else if (tab == "currencyCollection") {
		updateCurrencyPage()
		document.getElementById("currency").className = "active"
	}
}

function generateEnemy(level) {
	let element = 'snow'
	let rng = generateRandomNumber(0, 100)
	let hp = 50 + rng
	hp = hp*(2**level)
	rng = generateRandomNumber(0, 10)
	let attack = 5 + rng
	attack = attack*(2**level)
	rng = generateRandomNumber(0, 10)
	let defence = 5 + rng
	defence = defence*(2**level)
	rng = generateRandomNumber(0, 1)
	let style = 'defence'
	if (rng == 0) {
		style = 'resistance'
	}

	newEnemy = new Enemy(0, element, hp, attack, defence, style)
	return newEnemy
}

function updateHealth() {
	let squadtotalhp = 0
	let squadcurrenthp = gameData.squad_hp
	for (var i = 0; i < gameData.squad_heros.length; i++) {
		squadtotalhp += gameData.owned_heros[gameData.squad_heros[i]].hp
	}
	if (squadtotalhp > 0) {
		document.getElementById("squadhealth").value = formatValue(Math.round(squadcurrenthp/squadtotalhp*100))
		document.getElementById("enemyhealth").value = formatValue(Math.round(gameData.enemy.currenthp/gameData.enemy.hp*100))
	}
}

function showEnemyStats() {
	document.getElementById("display_enemy_name").innerHTML = "enemy"
	document.getElementById("display_enemy_element").innerHTML = gameData.enemy.element
	document.getElementById("display_enemy_lvl").innerHTML = formatValue(gameData.enemysDefeated + 1)
	document.getElementById("display_enemy_hp").innerHTML = formatValue(gameData.enemy.hp)
	document.getElementById("display_enemy_atk").innerHTML = formatValue(gameData.enemy.attack)
	document.getElementById("display_enemy_def").innerHTML = formatValue(gameData.enemy.defence)
	document.getElementById("display_enemy_style").innerHTML = gameData.enemy.style
	document.getElementById("display_enemy_description").innerHTML = "placeholder"
}

function dungeonBattle() {
	gameData.enemy = generateEnemy(gameData.enemysDefeated)
	showEnemyStats()
	document.getElementById("enemyhealth").value = formatValue(gameData.enemy.currenthp/gameData.enemy.hp*100)

	gameData.squad_stats = [0, 0, 0]

	for (var i = 0; i < gameData.squad_heros.length; i++) {
		let unit = gameData.owned_heros[gameData.squad_heros[0]]
		gameData.squad_stats[0] += unit.attack
		gameData.squad_stats[1] += unit.defence
		gameData.squad_stats[2] += unit.resistance
	}
}

function gainExperience(kills) {
	let xpGained = 0
	for (var i = 0; i < kills; i++) {
		xpGained += (i + 1)
	}
	let prestigeMulti = (1 + gameData.bestSuperGems)

	xpGained = xpGained * prestigeMulti

	document.getElementById("xpReward").innerHTML = "Experience Obtained: " + formatValue(xpGained)

	return xpGained
}

function gainGold(kills) {
	let goldGained = 0
	for (var i = 0; i < kills; i++) {
		goldGained += (i + 1)
	}

	let prestigeMulti = (1 + gameData.bestSuperGems)

	return goldGained * 5 * prestigeMulti
}

function battleDefeat() {
	gameData.autoDungeonDelay = 3
	if (gameData.squad_heros.length > 0) {
		gameData.squad_hp = 0
		for (var i = 0; i < gameData.squad_heros.length; i++) {
			let hero = gameData.owned_heros[gameData.squad_heros[i]]
			gameData.squad_hp += hero.hp
			hero.experience += gainExperience(gameData.enemysDefeated)
			checkLevelUp(hero, i)
		}
		document.getElementById("squadhealth").value = 100
	}
	document.getElementById("goldReward").innerHTML = "Gold Obtained: " + formatValue(gainGold(gameData.enemysDefeated))
	gameData.gold += gainGold(gameData.enemysDefeated)
	updateGold()

	document.getElementById("specialReward").innerHTML = ""
	document.getElementById("extraReward").innerHTML = ""
	
	if (gameData.enemysDefeated > gameData.bestEnemysDefeated) {
		//reward for clearing level 5
		if (gameData.bestEnemysDefeated < 5) {
			if (gameData.enemysDefeated >= 5) {
				if (gameData.pullCounts[2] == 0) {
					document.getElementById("specialReward").innerHTML = "Level 5 Bonus: NEW BANNER UNLOCKED!"
				}	
			}
		}

		//reward for clearing level 10
		if (gameData.bestEnemysDefeated < 10) {
			if (gameData.enemysDefeated >= 10) {
				if (gameData.prestigeCount == 0) {
					document.getElementById("specialReward").innerHTML = "Level 10 Bonus: PRESTIGE UNLOCKED!"
					document.getElementById("extraReward").innerHTML = "To celebrate, here's some rank up materials for your first hero!"
				} else {
					document.getElementById("extraReward").innerHTML = "Level 10 Bonus: Rank up materials"
				}
				gameData.unLimiter += 1
				gameData.duplicate_heros[0] += 1
			}
		}

		//reward gems per level cleared, increasing per 5 levels
		let rewardGems = 0
		while(gameData.bestEnemysDefeated < gameData.enemysDefeated) {
			rewardGems += 1 + Math.floor((1 + gameData.bestEnemysDefeated)/5)
			gameData.bestEnemysDefeated += 1
		}

		gameData.gems += rewardGems
		document.getElementById("gemReward").innerHTML = "Best Clear Bonus: " + formatValue(rewardGems) + " Gem(s) Obtained!"

		updateGems()
	} else {
		document.getElementById("gemReward").innerHTML = ""
	}

	//unlock prestige
	if (gameData.enemysDefeated >= 10 || gameData.prestigeCount > 0) {
		document.getElementById("prestige").style.display = "inline-block"
		document.getElementById("superGemsOwned").style.display = "inline-block"
		document.getElementById("superGemPipe").style.display = "inline-block"
		document.getElementById("milestonesButton1").style.display = "inline-block"
		document.getElementById("milestonesButton2").style.display = "inline-block"
		updateSuperGems()
	}

	//re-enable reward text
	document.getElementById("dungeonReward").style.display = "inline-block"

	//close the dungeon
	gameData.enemysDefeated = 0
	gameData.dungeonOpen = false
	document.getElementById("theDungeon").style.display = "none"
	document.getElementById("enemyStats").style.display = "none"
}

function battleTick(squad, enemy) {
	enemy.currenthp -= Math.max(0, 2*squad[0] - enemy.defence)

	if (enemy.style == 'defence') {
		gameData.squad_hp -= Math.max(0, 2*enemy.attack - squad[1])
	} else {
		gameData.squad_hp -= Math.max(0, 2*enemy.attack - squad[2])
	}
	
	updateHealth()
}

function battleAttack() {
	let enemy = gameData.enemy

	//atk, def, res
	let squad = gameData.squad_stats

	battleTick(squad, enemy)

	if (enemy.currenthp <= 0) {
		gameData.enemysDefeated += 1
		dungeonBattle()
	}

	if (gameData.squad_hp <= 0) {
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
			document.getElementById("ticketCount").innerHTML = "You have " + formatValue(gameData.dungeonTickets) + " Dungeon Tickets"
			document.getElementById("theDungeon").style.display = "inline-block"
			document.getElementById("enemyStats").style.display = "inline-block"
			if (gameData.dungeonTickets < 1) {
				document.getElementById("enterDungeonButton").disabled = true
			}
			updateDungeon()
			dungeonBattle()
		}
		else {
			document.getElementById("dungeonWarningMessage").innerHTML = "You need a hero assigned to enter the dungeon."
		}
	}
}

//battle loop
var battleLoop = window.setInterval(function() {
	if (gameData.dungeonOpen) {
		battleAttack()
	}

	//autodungeonLoop
	if (!gameData.dungeonOpen && gameData.autoDungeon && gameData.autoDungeonTickets > 0) {
		if (gameData.autoDungeonDelay > 0) {
			gameData.autoDungeonDelay -= 1
		} else {
			gameData.autoDungeonTickets -= 1
			enterDungeon()
		}
	}
	if (gameData.autoDungeon && gameData.autoDungeonTickets <= 0) {
		document.getElementById("autoDungeonButton").className = "unpressed"
		document.getElementById("autoDungeonButton").disabled = true
		gameData.autoDungeon = false
	}
}, 1000)

function autoClaimDaily() {
	if (!gameData.autoClaim) {
		document.getElementById("autoClaimButton").className = "pressed"
		gameData.autoClaim = true
	} else {
		document.getElementById("autoClaimButton").className = "unpressed"
		gameData.autoClaim = false
	}
}

function autoDungeon() {
	if (!gameData.autoDungeon) {
		document.getElementById("autoDungeonButton").className = "pressed"
		gameData.autoDungeon = true
	} else {
		document.getElementById("autoDungeonButton").className = "unpressed"
		gameData.autoDungeon = false
	}
}

function grabDaily() {
	let rng = generateRandomNumber(0, 1)
	if (rng == 1) {
		gameData.loginObtained = true
		document.getElementById("dailyRewardButton").disabled = true
		document.getElementById("dailySavedText").innerHTML = ""
	} else {
		gameData.luckyStreak += 1
		if (gameData.luckyStreak > 1) {
			document.getElementById("dailySavedText").innerHTML = "BONUS: Claim Additional Reward! x" + gameData.luckyStreak
		} else {
			document.getElementById("dailySavedText").innerHTML = "BONUS: Claim Additional Reward!"
		}
	}
	

	document.getElementById("dailyGoldRewardText").innerHTML = ""
	document.getElementById("dailyDungeonRewardText").innerHTML = ""
	document.getElementById("dailyGemRewardText").innerHTML = ""
	document.getElementById("dailyTicketRewardText").innerHTML = ""

	if (gameData.day % 28 == 0) {
		if (gameData.dailyLevel >= 10) {
			gameData.gems += 10
			document.getElementById("dailyGemRewardText").innerHTML = "Received 10 Gems"
		} else {
			gameData.gems += 5
			document.getElementById("dailyGemRewardText").innerHTML = "Received 5 Gems"
		}
		updateGems()
	} else if (gameData.day % 7 == 0) {
		gameData.gems += 1
		document.getElementById("dailyGemRewardText").innerHTML = "Received 1 Gem"
		updateGems()
	} else if (gameData.day % 3 == 0) {
		if (gameData.dailyLevel < 2) {
			gameData.dungeonTickets += 1
			document.getElementById("dailyDungeonRewardText").innerHTML = "Received 1 Dungeon Ticket"
			document.getElementById("ticketCount").innerHTML = "You have " + formatValue(gameData.dungeonTickets) + " Dungeon Tickets"
			document.getElementById("enterDungeonButton").disabled = false
		}
	} else {
		if (gameData.dailyLevel < 2) {
			let prestigeMulti = (1 + gameData.bestSuperGems)
			let dailyGold = (10 + (10 * gameData.bestEnemysDefeated)) * prestigeMulti
			gameData.gold += dailyGold
			document.getElementById("dailyGoldRewardText").innerHTML = "Received " + formatValue(dailyGold) + " Gold"
			updateGold()
		}
	}

	if (gameData.dailyLevel >= 2) {
		//daily gold
		let prestigeMulti = (1 + gameData.bestSuperGems)
		let dailyGold = (10 + (10 * gameData.bestEnemysDefeated)) * prestigeMulti
		gameData.gold += dailyGold
		document.getElementById("dailyGoldRewardText").innerHTML = "Received " + formatValue(dailyGold) + " Gold"
		updateGold()

		//daily dungeon tickets
		gameData.dungeonTickets += 1
		document.getElementById("dailyDungeonRewardText").innerHTML = "Received 1 Dungeon Ticket"
		document.getElementById("ticketCount").innerHTML = "You have " + formatValue(gameData.dungeonTickets) + " Dungeon Tickets"
		document.getElementById("enterDungeonButton").disabled = false
	}

	//auto dungeon tickets every 3rd day
	if (gameData.dailyLevel >= 3) {
		if (gameData.day % 3 == 0) {
			gameData.autoDungeonTickets += 1
			document.getElementById("dailyTicketRewardText").innerHTML = "Received 1 Auto Dungeon Ticket"
			document.getElementById("autoDungeonButton").disabled = false
		}
	}

	//auto claim tickets every 3rd day (offset 1)
	if (gameData.dailyLevel >= 4) {
		if (gameData.day % 3 == 1) {
			gameData.autoDailyClaim += 1
			document.getElementById("dailyTicketRewardText").innerHTML = "Received 1 Auto Claim Ticket"
			document.getElementById("autoClaimButton").disabled = false
		}
	}

	//fast training tickets every 3rd day (offset 2)
	if (gameData.dailyLevel >= 5) {
		if (gameData.day % 3 == 2) {
			gameData.fastTrainer += 1
			document.getElementById("dailyTicketRewardText").innerHTML = "Received 1 Fast Training Ticket"
			document.getElementById("fasttrainStat").disabled = false
		}
	}
}

//runs when n is pressed
/*function doc_keyN(e) {
    if (e.key === 78) {
        incrementDay();
    }
}
//register the handler 
document.addEventListener('keyN', doc_keyN, false);

//runs when l is pressed
function doc_keyL(e) {
    if (e.key === 76) {
        grabDaily();
    }
}
//register the handler 
document.addEventListener('keyL', doc_keyL, false);*/

document.onkeydown = function (e) {
	var evt = window.event || e
	switch (evt.keyCode) {
		case 76:
			grabDaily()
			break
		case 78:
			incrementDay()
			break
		case 85:
			enterDungeon()
			break
	}
}

function incrementDay() {
	//increment the day
	gameData.day += 1
	
	//reset lucky streak
	gameData.luckyStreak = 0

	//update calendar
	genCalendar()
	checkDailyRewardLevel()

	//update currencies
	document.getElementById("currentDay").innerHTML = "Day " + formatValue(gameData.day)
	updateGems()
	updateGold()

	//enable login reward
	gameData.loginObtained = false
	document.getElementById("dailyRewardButton").disabled = false
	document.getElementById("dailyGoldRewardText").innerHTML = ""
	document.getElementById("dailyDungeonRewardText").innerHTML = ""
	document.getElementById("dailyGemRewardText").innerHTML = ""
	document.getElementById("dailyTicketRewardText").innerHTML = ""

	//claim login reward automatically
	if (gameData.autoDailyClaim > 0 && !gameData.loginObtained && gameData.autoClaim) {
		gameData.autoDailyClaim -= 1
		grabDaily()
	}
	if (gameData.autoClaim && gameData.autoDailyClaim <= 0) {
		document.getElementById("autoClaimButton").className = "unpressed"
		document.getElementById("autoClaimButton").disabled = true
		gameData.autoClaim = false
	}

	//end dungeon session
	if (gameData.dungeonOpen) {
		battleDefeat()
	}

	if (gameData.bestEnemysDefeated >= 10 || gameData.prestigeCount > 0) {
		updateSuperGems()
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

function superGemDayMultiCalc(day) {
	if (day < 10) {
		return 10 - Math.floor((day)/2)
	} else if (day < 100) {
		return 5 - Math.floor((day-10)/30)
	} else if (day < 365) {
		return 2
	} else {
		return 1
	}
}

function futureHeroSuperGemsCalc() {
	let futureHeroSuperGems = 0
	for (var i = 0; i < gameData.owned_heros.length; i++) {
		if (gameData.owned_heros[i].level > 10) {
			futureHeroSuperGems += (gameData.owned_heros[i].level - 10)
		}
	}

	return futureHeroSuperGems
}

//update super gem count
function updateSuperGems() {
	let futureHeroSuperGems = futureHeroSuperGemsCalc()

	if (gameData.bestEnemysDefeated > 10) {
		futureDungeonSuperGems = gameData.bestEnemysDefeated - 10
	} else {
		futureDungeonSuperGems = 0
	}

	let superGemDayMulti = superGemDayMultiCalc(gameData.day)

	let futureSuperGems = (futureHeroSuperGems + futureDungeonSuperGems) * superGemDayMulti

	document.getElementById("superGemsOwned").innerHTML = formatValue(gameData.superGems) + " S-Gems"
	document.getElementById("superGemCount").innerHTML = "You currently have " + formatValue(gameData.superGems) + " Super Gems"
	document.getElementById("bestSuperGemCount").innerHTML = "Your received " + formatValue(gameData.bestSuperGems) + " total Super Gems: Multiplying Gold and EXP Gained by " + formatValue(1+gameData.bestSuperGems)
	document.getElementById("futureSuperGemCount").innerHTML = "Receive " + formatValue(futureSuperGems) + " Super Gems"
	document.getElementById("futureHeroSuperGems").innerHTML = formatValue(futureHeroSuperGems) + " Super Gems for hero levels past 10"
	document.getElementById("futureDungeonSuperGems").innerHTML = formatValue(futureDungeonSuperGems) + " Super Gems for dungeon levels cleared past 10"
	document.getElementById("superGemDayMulti").innerHTML = formatValue(superGemDayMulti) + "x Multiplier for prestiging on day " + formatValue(gameData.day)

	if (futureSuperGems > 0) {
		document.getElementById("prestigeConfirm").disabled = false
	}
}

//prestige
function prestigeGame() {
	//give super gems
	let futureHeroSuperGems = futureHeroSuperGemsCalc()

	if (gameData.bestEnemysDefeated > 10) {
		futureDungeonSuperGems = gameData.bestEnemysDefeated - 10
	} else {
		futureDungeonSuperGems = 0
	}

	let superGemDayMulti = superGemDayMultiCalc(gameData.day)

	let futureSuperGems = (futureHeroSuperGems + futureDungeonSuperGems) * superGemDayMulti

	//update super gems
	gameData.superGems += futureSuperGems

	let newSuperGemCount = gameData.superGems
	
	//update best super gems
	gameData.bestSuperGems += futureSuperGems

	let bestCurrentSuperGems = gameData.bestSuperGems

	document.getElementById("prestigeConfirm").disabled = true
	let newPrestigeCount = gameData.prestigeCount += 1

	let oldPullCounts = gameData.pullCounts

	let newDailyLevel = 1

	if (gameData.pullCounts[2] >= 150) {
		newDailyLevel = floor(gameData.pullCounts[2]/50)
	} else if (gameData.pullCounts[2] >= 50) {
		newDailyLevel = 2
	} else {
		newDailyLevel = 1
	}

	//reset everything
	gameData = {
		version: 0.17,
		gold: 100,
		gems: futureSuperGems,
		superGems: newSuperGemCount,
		bestSuperGems: bestCurrentSuperGems,
		day: 1,
		dungeonTickets: 0,
		autoDungeonTickets: 0, 
		autoDailyClaim: 0,
		unLimiter: 0,
		dailyLevel: newDailyLevel,
		fastTrainer: 0,
		bottledExp: 0,
		owned_heros: [],
		duplicate_heros: [],
		unique_hero_count: 0,
		displayed_hero: null,
		squad_heros: [],
		squad_hp: 0,
		squad_stats: [0, 0, 0],
		enemy: null,
		enemysDefeated: 0,
		bestEnemysDefeated: 0,
		dungeonOpen: false,
		pullCounts: [0, oldPullCounts[1], oldPullCounts[2]],
		loginObtained: false,
		autoDungeon: false,
		autoDungeonDelay: 0,
		autoClaim: false,
		prestigeCount: newPrestigeCount,
		qolTicket: 0,
		permAutoDungeon: false,
		permAutoClaim: false,
		permFastTrainer: false,
		luckyStreak: 0
	}

	soft_reset()
	updateSuperGems()
}

function updateGems() {
	//unlock second banner
	if (gameData.pullCounts[0] != 0) {
		document.getElementById("nextBanner1").disabled = false
		document.getElementById("prevBanner2").disabled = false
		document.getElementById("banner1PullCount").innerHTML = "You have pulled from the Standard Banner " + formatValue(gameData.pullCounts[1]) + " times"
		checkPullMilestoneLevel(1)
	}

	//unlock third banner
	if (gameData.bestEnemysDefeated >= 5 || gameData.prestigeCount > 0) {
		document.getElementById("nextBanner2").disabled = false
		document.getElementById("prevBanner3").disabled = false
		document.getElementById("banner2PullCount").innerHTML = "You have pulled from the Improvement Banner " + formatValue(gameData.pullCounts[2]) + " times"
		checkPullMilestoneLevel(2)
	
		let newDailyLevel = 1
		if (gameData.pullCounts[2] >= 150) {
			newDailyLevel = floor(gameData.pullCounts[2]/50)
		} else if (gameData.pullCounts[2] >= 50) {
			newDailyLevel = 2
		} else {
			newDailyLevel = 1
		}

		if (newDailyLevel > gameData.dailyLevel) {
			gameData.dailyLevel = newDailyLevel
		}
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
	if (gameData.gems >= 10 && (gameData.bestEnemysDefeated >= 5 || gameData.prestigeCount > 0)) {
		document.getElementById("pullOnBanner3").disabled = false
	} else {
		document.getElementById("pullOnBanner3").disabled = true
	}

	//update gem count
	document.getElementById("gemsOwned").innerHTML = formatValue(gameData.gems) + " Gems"
}

function updateGold() {
	document.getElementById("goldOwned").innerHTML = formatValue(gameData.gold) + " Gold"
	if (gameData.displayed_hero != null) {
		if (document.getElementById("heroTrain").style.display != "none") {
			if (document.getElementById("selectedStat").innerHTML == "Hitpoints") {
				trainHeroDisplay("hp")
			} else if (document.getElementById("selectedStat").innerHTML == "Attack") {
				trainHeroDisplay("atk")
			} else if (document.getElementById("selectedStat").innerHTML == "Defence") {
				trainHeroDisplay("def")
			} else if (document.getElementById("selectedStat").innerHTML == "Resistance") {
				trainHeroDisplay("res")
			}
		}
	}
	document.getElementById("rankUp").style.display = "none"
}

function generateRandomNumber(min, max) {
	return parseInt(Math.random() * (max - min + 1) + min)
}

function updateCollection() {
	//set the charList as the parent
	let parent = document.getElementById('charList')

	//clear all elements
	while (parent.firstChild) {
		parent.firstChild.remove()
	}

	//add a p as a buffer
	parent.appendChild(document.createElement('p'))

	//place each hero
	for (var i = 0; i < gameData.owned_heros.length; i++) {
		let hero_image = document.createElement('img')
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

function showBannerMilestones(id) {
	milestones = document.getElementById("bannerMilestones"+id)
	if (milestones.style.display == "inline-block") {
		milestones.style.display = "none"
	} else {
		milestones.style.display = "inline-block"
	}
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
	let rng = generateRandomNumber(0, 5)
	let result_hero = JSON.parse(JSON.stringify(hero_pool[rng]))

	//check if duplicate
	let duplicateHero = checkIfDuplicate(result_hero)

	if (duplicateHero) {
		let id = checkWhereDuplicate(result_hero)
		gameData.duplicate_heros[id] += 1
		document.getElementById("bannerReward").innerHTML = "Summoned Duplicate Hero: " + hero_pool[rng].name + ". You have " + formatValue(gameData.duplicate_heros[id]) + " duplicates."
	} else {
		gameData.owned_heros.push(result_hero)
		gameData.duplicate_heros.push(0)
		gameData.unique_hero_count += 1
		document.getElementById("bannerReward").innerHTML = "Summoned New Hero: " + hero_pool[rng].name + "!"
	}

	updateCollection()
}

function summon0star() {
	let rng = generateRandomNumber(0, 1)
	if (rng == 1) {
		let prestigeMulti = (1 + gameData.bestSuperGems)
		let bannerGold = (100 + 100 * gameData.bestEnemysDefeated) * prestigeMulti
		gameData.gold += bannerGold
		updateGold()
		document.getElementById("bannerReward").innerHTML = "Received " + formatValue(bannerGold) + " Gold"
	} else {
		gameData.dungeonTickets += 10
		document.getElementById("ticketCount").innerHTML = "You have " + formatValue(gameData.dungeonTickets) + " Dungeon Tickets"
		document.getElementById("enterDungeonButton").disabled = false
		document.getElementById("bannerReward").innerHTML = "Received 10 Dungeon Tickets"
	}
}

function pullBanner(id) {
	if (id == 0) {
		if (gameData.gems >= 1) {
			gameData.gems -= 1
			gameData.pullCounts[id] += 1
			updateGems()
			summon3star()
			document.getElementById("pullOnBanner1").disabled = true
			document.getElementById("newbieBanner").style.display = "none"
			document.getElementById("standardBanner").style.display = "inline-block"
		}
	} else if (id == 1) {
		if (gameData.gems >= 10) {
			gameData.gems -= 10
			gameData.pullCounts[id] += 1
			updateGems()

			//determine star ranking
			let rng = generateRandomNumber(1, 100)

			if (rng > 50) {
				//3 star
				summon3star()
			} else {
				summon0star()
			}
		}
	} else if (id == 2) {
		if (gameData.gems >= 10) {
			gameData.gems -= 10
			gameData.pullCounts[id] += 1
			updateGems()

			//determine item reward
			let rng = generateRandomNumber(0, 9)
			let rewards = [0, 0, 1, 1, 2, 2, 3, 3, 4, 5]
			let results_reward = rewards[rng]

			if (results_reward == 0) {
				gameData.autoDungeonTickets += 10
				document.getElementById("bannerReward").innerHTML = "Received 10 Auto Dungeon Tickets"
				document.getElementById("autoDungeonButton").disabled = false
			} else if (results_reward == 1) {
				gameData.autoDailyClaim += 10
				document.getElementById("bannerReward").innerHTML = "Received 10 Auto Claim Tickets"
				document.getElementById("autoClaimButton").disabled = false
			} else if (results_reward == 2) {
				gameData.fastTrainer += 10
				document.getElementById("bannerReward").innerHTML = "Received 10 Fast Training Tickets"
			} else if (results_reward == 3) {
				gameData.bottledExp += 5
				document.getElementById("bannerReward").innerHTML = "Received 5 Bottled Experience"
				document.getElementById("giveexp").disabled = false
			} else if (results_reward == 4) {
				gameData.unLimiter += 1
				document.getElementById("bannerReward").innerHTML = "Received 1 UN-LIMITER"
			} else if (results_reward == 5) {
				gameData.dailyLevel += 1
				document.getElementById("bannerReward").innerHTML = "Received 1 Daily Improvement, Increasing your Daily Level!"
				checkDailyRewardLevel()
			}

			//display these buttons after first pull on new banner
			document.getElementById("autoClaimButton").style.display = "inline-block"
			document.getElementById("autoDungeonButton").style.display = "inline-block"
			document.getElementById("fasttrainStat").style.display = "inline-block"
			document.getElementById("giveexp").style.display = "inline-block"
			document.getElementById("dailyLevelMilestones").style.display = "inline-block"
			document.getElementById("currency").style.display = "inline-block"
		}
	}
}

function soft_reset() {
	//reset daily progress
	document.getElementById("dailyRewardButton").disabled = false
	genCalendar()
	checkDailyRewardLevel()

	//update currencies
	document.getElementById("currentDay").innerHTML = "Day " + gameData.day
	updateGems()
	updateGold()
	document.getElementById("ticketCount").innerHTML = "You have " + formatValue(gameData.dungeonTickets) + " Dungeon Tickets"

	//tidy up menus
	if (gameData.pullCounts[2] > 0) {
		document.getElementById("autoClaimButton").style.display = "inline-block"
		document.getElementById("autoDungeonButton").style.display = "inline-block"
		document.getElementById("fasttrainStat").style.display = "inline-block"
		document.getElementById("giveexp").style.display = "inline-block"
		document.getElementById("dailyLevelMilestones").style.display = "inline-block"
		document.getElementById("currency").style.display = "inline-block"
	} else {
		document.getElementById("autoClaimButton").style.display = "none"
		document.getElementById("autoDungeonButton").style.display = "none"
		document.getElementById("fasttrainStat").style.display = "none"
		document.getElementById("giveexp").style.display = "none"
		document.getElementById("dailyLevelMilestones").style.display = "none"
		document.getElementById("currency").style.display = "none"
	}
	document.getElementById("autoClaimButton").disabled = true
	document.getElementById("autoDungeonButton").disabled = true

	updateCollection()
	document.getElementById("charStats").style.display = "none"
	document.getElementById("dungeonReward").style.display = "none"

	//tidy up gacha
	document.getElementById("bannerReward").innerHTML = ""
	document.getElementById("nextBanner1").disabled = false
	document.getElementById("prevBanner2").disabled = false
	if (gameData.prestigeCount == 0) {
		document.getElementById("nextBanner2").disabled = true
		document.getElementById("prevBanner3").disabled = true
		document.getElementById("pullOnBanner3").disabled = true
	}
	if (gameData.gems < 1) {
		document.getElementById("pullOnBanner1").disabled = true
	} else if (gameData.pullCounts[0] == 0) {
		document.getElementById("pullOnBanner1").disabled = false
	}
	document.getElementById("pullOnBanner2").disabled = true

	document.getElementById("newbieBanner").style.display = "inline-block"
	document.getElementById("standardBanner").style.display = "none"
	document.getElementById("improvementBanner").style.display = "none"

	//update dungeon status
	gameData.enemy = generateEnemy(gameData.enemysDefeated)
	document.getElementById("theDungeon").style.display = "none"
	document.getElementById("enemyStats").style.display = "none"
}

function unlock_hard_reset() {
	document.getElementById("truehardreset").style.display = "inline-block"
	document.getElementById("truehardreset").disabled = false
}

function hard_reset() {
	localStorage.clear()
	gameData = {
		version: 0.17,
		gold: 100,
		gems: 0,
		superGems: 0,
		bestSuperGems: 0,
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
		squad_stats: [0, 0, 0],
		enemy: null,
		enemysDefeated: 0,
		bestEnemysDefeated: 0,
		dungeonOpen: false,
		pullCounts: [0, 0, 0],
		loginObtained: false,
		autoDungeon: false,
		autoDungeonDelay: 0,
		autoClaim: false,
		prestigeCount: 0,
		qolTicket: 0,
		permAutoDungeon: false,
		permAutoClaim: false,
		permFastTrainer: false,
		luckyStreak: 0
	}
	localStorage.setItem('gachaIncrementalSave', JSON.stringify(gameData))
	
	//reset stuff common to prestige
	soft_reset()

	//remove prestige stuff
	document.getElementById("prestige").style.display = "none"
	document.getElementById("superGemsOwned").style.display = "none"
	document.getElementById("superGemPipe").style.display = "none"
	document.getElementById("milestonesButton1").style.display = "none"
	document.getElementById("milestonesButton2").style.display = "none"
}

//stops new versions from breaking old saves
function checkSaveFile() {
	if (typeof gameData.version === 'undefined') {
		gameData.version = 0.17
	}
	if (typeof gameData.gold === 'undefined') {
		gameData.gold = 100
	}
	if (typeof gameData.gems === 'undefined') {
		gameData.gems = 0
	}
	if (typeof gameData.superGems === 'undefined') {
		gameData.superGems = 0
	}
	if (typeof gameData.bestSuperGems === 'undefined') {
		gameData.bestSuperGems = 0
	}
	if (typeof gameData.day === 'undefined') {
		gameData.day = 1
	}
	if (typeof gameData.dungeonTickets === 'undefined') {
		gameData.dungeonTickets = 0
	}
	if (typeof gameData.autoDungeonTickets === 'undefined') {
		gameData.autoDungeonTickets = 0
	}
	if (typeof gameData.autoDailyClaim === 'undefined') {
		gameData.autoDailyClaim = 0
	}
	if (typeof gameData.unLimiter === 'undefined') {
		gameData.unLimiter = 0
	}
	if (typeof gameData.dailyLevel === 'undefined') {
		gameData.dailyLevel = 1
	}
	if (typeof gameData.fastTrainer === 'undefined') {
		gameData.fastTrainer = 0
	}
	if (typeof gameData.bottledExp === 'undefined') {
		gameData.bottledExp = 0
	}
	if (typeof gameData.owned_heros === 'undefined') {
		gameData.owned_heros = []
	} else {
		for (var i = 0; i < gameData.owned_heros.length; i++) {
			if (typeof gameData.owned_heros[i].rank === 'undefined') {
				gameData.owned_heros[i].rank = 0
			}
		}
	}
	if (typeof gameData.duplicate_heros === 'undefined') {
		gameData.duplicate_heros = []
	}
	if (typeof gameData.unique_hero_count === 'undefined') {
		gameData.unique_hero_count = 0
	}
	if (typeof gameData.displayed_hero === 'undefined') {
		gameData.displayed_hero = null
	}
	if (typeof gameData.squad_heros === 'undefined') {
		gameData.squad_heros = []
	}
	if (typeof gameData.squad_hp === 'undefined') {
		gameData.squad_hp = 0
	}
	if (typeof gameData.squad_stats === 'undefined') {
		gameData.squad_stats = [0, 0, 0]
	}
	if (typeof gameData.enemy === 'undefined') {
		gameData.enemy = null
	}
	if (typeof gameData.enemysDefeated === 'undefined') {
		gameData.enemysDefeated = 0
	}
	if (typeof gameData.bestEnemysDefeated === 'undefined') {
		gameData.bestEnemysDefeated = 0
	}
	if (typeof gameData.dungeonOpen === 'undefined') {
		gameData.dungeonOpen = false
	}
	if (typeof gameData.pullCounts === 'undefined') {
		gameData.pullCounts = [0, 0, 0]
	}
	if (typeof gameData.loginObtained === 'undefined') {
		gameData.loginObtained = false
	}
	if (typeof gameData.autoDungeon === 'undefined') {
		gameData.autoDungeon = false
	}
	if (typeof gameData.autoDungeonDelay === 'undefined') {
		gameData.autoDungeonDelay = 0
	}
	if (typeof gameData.autoClaim === 'undefined') {
		gameData.autoClaim = false
	}
	if (typeof gameData.prestigeCount === 'undefined') {
		gameData.prestigeCount = 0
	}
	if (typeof gameData.qolTicket === 'undefined') {
		gameData.qolTicket = 0
	}
	if (typeof gameData.permAutoDungeon === 'undefined') {
		gameData.permAutoDungeon = false
	}
	if (typeof gameData.permAutoClaim === 'undefined') {
		gameData.permAutoClaim = false
	}
	if (typeof gameData.permFastTrainer === 'undefined') {
		gameData.permFastTrainer = false
	}
	if (typeof gameData.luckyStreak === 'undefined') {
		gameData.luckyStreak = 0
	}
}

function checkImportedSaveFile(importedSave) {
	if (typeof importedSave.version === 'undefined') {
		return false
	}
	if (typeof importedSave.gold === 'undefined') {
		return false
	}
	if (typeof importedSave.gems === 'undefined') {
		return false
	}
	if (typeof importedSave.superGems === 'undefined') {
		return false
	}
	if (typeof importedSave.bestSuperGems === 'undefined') {
		return false
	}
	if (typeof importedSave.day === 'undefined') {
		return false
	}
	if (typeof importedSave.dungeonTickets === 'undefined') {
		return false
	}
	if (typeof importedSave.autoDungeonTickets === 'undefined') {
		return false
	}
	if (typeof importedSave.autoDailyClaim === 'undefined') {
		return false
	}
	if (typeof importedSave.unLimiter === 'undefined') {
		return false
	}
	if (typeof importedSave.dailyLevel === 'undefined') {
		return false
	}
	if (typeof importedSave.fastTrainer === 'undefined') {
		return false
	}
	if (typeof importedSave.bottledExp === 'undefined') {
		return false
	}
	if (typeof importedSave.owned_heros === 'undefined') {
		return false
	} else {
		for (var i = 0; i < importedSave.owned_heros.length; i++) {
			if (typeof importedSave.owned_heros[i].rank === 'undefined') {
				return false
			}
		}
	}
	if (typeof importedSave.duplicate_heros === 'undefined') {
		return false
	}
	if (typeof importedSave.unique_hero_count === 'undefined') {
		return false
	}
	if (typeof importedSave.displayed_hero === 'undefined') {
		return false
	}
	if (typeof importedSave.squad_heros === 'undefined') {
		return false
	}
	if (typeof importedSave.squad_hp === 'undefined') {
		return false
	}
	if (typeof importedSave.squad_stats === 'undefined') {
		return false
	}
	if (typeof importedSave.enemy === 'undefined') {
		return false
	}
	if (typeof importedSave.enemysDefeated === 'undefined') {
		return false
	}
	if (typeof importedSave.bestEnemysDefeated === 'undefined') {
		return false
	}
	if (typeof importedSave.dungeonOpen === 'undefined') {
		return false
	}
	if (typeof importedSave.pullCounts === 'undefined') {
		return false
	}
	if (typeof importedSave.loginObtained === 'undefined') {
		return false
	}
	if (typeof importedSave.autoDungeon === 'undefined') {
		return false
	}
	if (typeof importedSave.autoDungeonDelay === 'undefined') {
		return false
	}
	if (typeof importedSave.autoClaim === 'undefined') {
		return false
	}
	if (typeof importedSave.prestigeCount === 'undefined') {
		return false
	}
	if (typeof importedSave.qolTicket === 'undefined') {
		return false
	}
	if (typeof importedSave.permAutoDungeon === 'undefined') {
		return false
	}
	if (typeof importedSave.permAutoClaim === 'undefined') {
		return false
	}
	if (typeof importedSave.permFastTrainer === 'undefined') {
		return false
	}
	//all checks past this point need to also do a version check to allow backwards compatibility
	if (importedSave.version < 0.17) {
		if (typeof importedSave.luckyStreak === 'undefined') {
			importedSave.luckyStreak = 0
		}
	} else {
		if (typeof importedSave.luckyStreak === 'undefined') {
			return false
		}
	}

	return true
}

function export_save() {
	window.prompt("Copy to clipboard: Ctrl+C, Enter", btoa(JSON.stringify(gameData)))
}

function import_save() {
	let importedSave = window.prompt("Enter exported data", btoa(JSON.stringify(gameData)))

	if (importedSave !== null) {
		try {
			let decodedSave = atob(importedSave)
			let parsedSave = JSON.parse(decodedSave)
		
			if (checkImportedSaveFile(parsedSave)) {
				gameData = parsedSave
				run_startup()
				document.getElementById("importexporttext").innerHTML = "Imported Save File"
			} else {
				document.getElementById("importexporttext").innerHTML = "Invalid Save File"
			}
		} catch(e) {
			document.getElementById("importexporttext").innerHTML = "Invalid Save File"
		}
	}
}

function run_startup() {
	//check every variable in gameData for definition and initialize if missing
	checkSaveFile()

	//update version number
	gameData.version = 0.17

	//update currencies
	document.getElementById("currentDay").innerHTML = "Day " + formatValue(gameData.day)
	updateGems()
	updateGold()
	document.getElementById("ticketCount").innerHTML = "You have " + formatValue(gameData.dungeonTickets) + " Dungeon Tickets"

	updateCollection()

	//enable daily if unobtained
	if (!gameData.loginObtained) {
		document.getElementById("dailyRewardButton").disabled = false
	}

	//enable auto dungeon if available
	if (gameData.autoDungeonTickets > 0) {
		document.getElementById("autoDungeonButton").disabled = false
	}

	//enable auto claim if available
	if (gameData.autoDailyClaim > 0) {
		document.getElementById("autoClaimButton").disabled = false
	}

	//enable give exp if available
	if (gameData.bottledExp > 0) {
		document.getElementById("giveexp").disabled = false
	}

	//display new features after pulling from banner 3 for the first time
	if (gameData.pullCounts[2] > 0) {
		document.getElementById("autoClaimButton").style.display = "inline-block"
		document.getElementById("autoDungeonButton").style.display = "inline-block"
		document.getElementById("fasttrainStat").style.display = "inline-block"
		document.getElementById("giveexp").style.display = "inline-block"
		document.getElementById("dailyLevelMilestones").style.display = "inline-block"
		document.getElementById("currency").style.display = "inline-block"
	} else {
		document.getElementById("autoClaimButton").style.display = "none"
		document.getElementById("autoDungeonButton").style.display = "none"
		document.getElementById("fasttrainStat").style.display = "none"
		document.getElementById("giveexp").style.display = "none"
		document.getElementById("dailyLevelMilestones").style.display = "none"
		document.getElementById("currency").style.display = "none"
	}

	if (gameData.autoDungeon) {
		if (gameData.autoDungeonTickets > 0) {
			document.getElementById("autoDungeonButton").className = "pressed"
		} else {
			gameData.autoDungeon = false
		}
	}

	if (gameData.autoClaim) {
		if (gameData.autoDailyClaim > 0) {
			document.getElementById("autoClaimButton").className = "pressed"
		} else {
			gameData.autoClaim = false
		}
	}

	//update dungeon status
	if (!gameData.dungeonOpen) {
		document.getElementById("theDungeon").style.display = "none"
		document.getElementById("enemyStats").style.display = "none"
	}

	//only display prestige content if unlocked
	if (gameData.bestEnemysDefeated >= 10 || gameData.prestigeCount > 0) {
		document.getElementById("prestige").style.display = "inline-block"
		document.getElementById("superGemsOwned").style.display = "inline-block"
		document.getElementById("superGemPipe").style.display = "inline-block"
		updateSuperGems()
		document.getElementById("milestonesButton1").style.display = "inline-block"
		document.getElementById("milestonesButton2").style.display = "inline-block"
	} else {
		document.getElementById("prestige").style.display = "none"
		document.getElementById("superGemsOwned").style.display = "none"
		document.getElementById("superGemPipe").style.display = "none"
		document.getElementById("milestonesButton1").style.display = "none"
		document.getElementById("milestonesButton2").style.display = "none"
	}
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
	run_startup()
} else {
	document.getElementById("theDungeon").style.display = "none"
	document.getElementById("enemyStats").style.display = "none"
	document.getElementById("enterDungeonButton").disabled = true
	document.getElementById("autoDungeonButton").style.display = "none"
	document.getElementById("autoClaimButton").style.display = "none"
	document.getElementById("fasttrainStat").style.display = "none"
	document.getElementById("giveexp").style.display = "none"
	document.getElementById("dailyLevelMilestones").style.display = "none"
	document.getElementById("prestige").style.display = "none"
	document.getElementById("superGemsOwned").style.display = "none"
	document.getElementById("superGemPipe").style.display = "none"
	document.getElementById("dailyLevelMilestones").style.display = "none"
	document.getElementById("milestonesButton1").style.display = "none"
	document.getElementById("milestonesButton2").style.display = "none"
	document.getElementById("currency").style.display = "none"
}

/* MAIN? */
tab("colDailyMenu")
genCalendar()
checkDailyRewardLevel()
document.getElementById("heroTrain").style.display = "none"
document.getElementById("rankUp").style.display = "none"
document.getElementById("charStats").style.display = "none"

document.getElementById("newbieBanner").style.display = "inline-block"
document.getElementById("standardBanner").style.display = "none"
document.getElementById("improvementBanner").style.display = "none"
document.getElementById("bannerMilestones1").style.display = "none"
document.getElementById("bannerMilestones2").style.display = "none"

document.getElementById("truehardreset").style.display = "none"

document.getElementById("versionText").innerHTML = "Version: v" + gameData.version