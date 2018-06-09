// import Vue from "vue";

function generateBetween(min, max) {
    return Math.max(Math.floor(Math.random() * max), min)
}

class Entity {
    constructor(health, baseDamage, name, isMonster) {
        this.name = name
        this.health = health
        this.currentHealth = health
        this.baseDamage = baseDamage
        this.minDamage = Math.max(Math.floor(baseDamage/10), 3) // 10th of base or 3
        this.bonusDamage = baseDamage + Math.max(Math.floor(baseDamage/3), 15)
        this.isMonster = isMonster
    }
    attack(enemy) {
        let dmg = generateBetween(this.minDamage, this.baseDamage)
        enemy.currentHealth -= dmg
        let message = this.name+ " is using attack: "+ dmg + " on: " + enemy.name
        return message
    }
    specialAttack(enemy) {
        let dmg = generateBetween(this.baseDamage, this.bonusDamage)
        enemy.currentHealth -= dmg
        let message = this.name+ " is using specialAttack: "+ dmg + " on: " + enemy.name
        return message
    }
    heal() {
        let heal = generateBetween(10, this.health/5)
        let message = this.name+ " is using heal: "+ heal
        console.log(message)
        this.currentHealth += heal
        if (this.currentHealth > this.health) {
            this.currentHealth = this.health
        }
        return message
    }
    relativeHealth() {
        return Math.floor(this.currentHealth / this.health * 100)
    }
    isDead() {
        return this.currentHealth <= 0;
    }
}

class Monster extends Entity {
    constructor(health, baseDamage, name) {
        super(health, baseDamage, name, true)
    }
}

class Human extends Entity {
    constructor(health, baseDamage, name) {
        super(health, baseDamage, name, false)
    }
}

new Vue({
    el: '#app',
    data: {
        player: new Human(100, 20, "Matej"),
        monster: new Monster(150, 30, "Ada"),
        isStarted: false,
        logMessages: []
    },
    methods: {
        startGame: function() {
            this.player = new Human(100, 20, "Matej");
            this.monster = new Monster(150, 30, "Ada");
            this.isStarted = true;
            this.logMessages = [];
        },

        action: function(a) {
            let msg = this.player[a](this.monster)
            this.logMessages.push({"msg":msg, "entity":this.player})

            if (this.monster.isDead()) {
                return this.endGame(this.player.name)
            }

            msg = this.monster.attack(this.player)
            this.logMessages.push({"msg":msg, "entity":this.monster})

            if (this.player.isDead()) {
                return this.endGame(this.monster.name)
            }
        },
        attack: function() {
            this.action("attack")
        },
        specialAttack: function() {
            this.action("specialAttack")
        },
        endGame: function(name) {
            alert("Game Over, " + name + " won");
            this.isStarted = false
        },
        heal: function() {
            this.action("heal")
        },
        giveUp: function() {
            this.endGame(this.monster.name)
        }

    }
});