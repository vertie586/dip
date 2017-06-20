'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
        if ((vector instanceof Vector)) {
            return new Vector(this.x + vector.x, this.y  + vector.y);
        } else {
            throw new Error("Можно прибавлять к вектору только вектор типа Vector");
        }
  }

  times(n) {
      return new Vector(this.x * n, this.y * n);
  }

}
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));
console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);


class Actor {
    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        //if (pos === undefined) pos = new Vector(0, 0);
        //if (size === undefined) size = new Vector(1, 1);
       // if (speed === undefined) speed = new Vector(0, 0);
       if (pos instanceof Vector) {
            this.pos = pos;
        } else {
            throw new Error('не Vector');
        }
        if (size instanceof Vector) {
            this.size = size;
        } else {
            throw new Error('не Vector');
        }
        if (speed instanceof Vector) {
            this.speed = speed;
        } else {
            throw new Error('не Vector');
        }
    }

    act() {}

    get left() {
        return this.pos.x;
    }

    get top() {
        return this.pos.y;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }

    get type() {
        return 'actor'
    }

    isIntersect(actor) {
            if (actor instanceof Actor) {
                if (this == actor) {
                    return false;
                }
                //if ((this.left == actor.left) && (this.top == actor.top) && (this.right == actor.right)
                //    && (this.bottom == actor.bottom)) {
                //    return true
                //}
                if ((this.left < actor.right) && (this.right > actor.left) && (this.top < actor.bottom)
                    && (this.bottom > actor.top)) {
                    return true
                } else
                {return false}
            } else {
                throw new Error('argument is not an Actor');
            }
    }
}
class Player extends Actor {
    constructor(pos = new Vector(0, 0)) {
        super()
        //pos.x = pos.x ;
        //pos.y = pos.y - 0.5;
        this.pos.x = pos.x;
        this.pos.y = pos.y - 0.5;
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
    }

    get type() {
        return 'player';
    }
}
const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
    return ['left', 'top', 'right', 'bottom']
        .map(side => `${side}: ${item[side]}`)
        .join(', ');
}

function movePlayer(x, y) {
    player.pos = player.pos.plus(new Vector(x, y));
}

function status(item, title) {
    console.log(`${title}: ${position(item)}`);
    if (player.isIntersect(item)) {
        console.log(`Игрок подобрал ${title}`);
    }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);


class Level {
    constructor(grid , actors) {
        this.grid = grid;
        this.actors = actors;
        if (this.actors != undefined) {
/*
        for (let a of actors) {
            if (a instanceof Player) {
                this.player = a;
            }
        }
 */
        }
        //this.player = new Player();


        if ((grid === undefined)||(grid.length === 0) || (grid == [])) {
            this.height = 0 ;
            this.width = 0 ;
        } else {
            if (grid[0] == undefined) {
                this.width = 1;
                this.height = grid.length
            } else {
                this.height = grid.length;
                let arrr = grid.slice();
                if (arrr == undefined) {
                    this.width = 1
                } else {
                    arrr.sort(function (a, b) {
                        return (b.length - a.length)
                    });
                    //let maxEl = arrr[0].length;
                    //console.log(arrr[0]+' xxxxxxxxxxxxxxxxxxxxxxxxxxx '+arrr[0].length)
                    this.width = arrr[0].length;
                }
            }
        }
        this.status = null;
        this.finishDelay = 1;
    }
    get player() {
        for (let a of this.actors) {
            if (a instanceof Actor) {
               return a;
            }
        }
    }
    isFinished() {
        if ((this.status != null) && (this.finishDelay < 0)) {
            return true;
        } else
        {
            return false;
        }
    }

    actorAt(actor){

            if (actor instanceof Actor)  {

                //console.log(this.actors)

                if(this.actors == undefined) {
                    return undefined;
                }

                if (this.actors.length == 1)  {

                    return undefined;
                }
                let acts = []
                for(let act of this.actors) {
                    if (act instanceof Actor) {
                        acts.push(act)
                    }
                }

                if (acts != undefined) {

                    for (let i = 0; i < acts.length; i++) {
                        //console.log(acts[i])
                        if (acts[i] == actor) {
                        console.log('the same')
                            return undefined;
                        }

                        if ((acts[i].left < actor.right) && (acts[i].right > actor.left) && (acts[i].top < actor.bottom)
                            && (acts[i].bottom > actor.top)&& (acts[i] instanceof Actor)) {

                            return acts[i];
                        }

                    }
                } else {

                    return undefined
                }
            } else {
                throw new Error('аргумент не Actor');
            }
    }

    obstacleAt(position, size) {
        position.x = Math.ceil(position.x)
        position.y = Math.ceil(position.y)
        let act = new Actor(position, size);



            if ((position instanceof Vector) && (size instanceof Vector)) {

                if ( (act.pos.x + act.size.x  > this.width) || (act.pos.x + act.size.x < 0) || (act.pos.y + act.size.y < 0)
                 || (act.pos.x > this.width) || (act.pos.y  > this.height) || (act.pos.x < 0) || (act.pos.y < 0 )
                    || (act.pos.x + act.size.x  > this.height)
                 ) {
                    //console.log('выход за границы 2')
                    return 'wall'
                }
                if (act.pos.y + act.size.y > this.height)  {
                    //console.log('выход за границы')
                    return 'lava'
                }
                //this.level.actorAt(act)

                for(let i = act.left; i< act.right; i++) {
                    for(let j = act.top; j< act.bottom; j++) {

                        if (this.grid[i][j] != undefined) {
                            return this.grid[i][j]
                        }  else {
                            return undefined
                        }
                    }
                }

                return undefined
            } else {
                throw 'один из аргументов не Vector';
            }
    }

    removeActor(actor) {
        for(let act of this.actors) {
            if ((actor.top == act.top)&&(actor.bottom == act.bottom)&&(actor.left == act.left)&&(actor.right == act.right)) {
                let index = this.actors.indexOf(act);
                this.actors.splice(index,1);
            }
        }
    }

    noMoreActors(type) {
        if (this.actors == undefined) {
            return true
        }
        for(let act of this.actors) {

            if (act.type == type) {
                return false;
            }
            return true
        }

    }

    playerTouched(obstacle, coin) {
        if (this.status != null) {
            //return;
        } else {
            if ((obstacle == 'lava') || (obstacle == 'fireball')) {
                this.status = 'lost'
                return;
            }
            if ((obstacle == 'coin') && (coin.type == 'coin')) {
                let index = this.actors.indexOf(coin);
                this.actors.splice(index,1);
            }
            if ((this.noMoreActors(obstacle)) && (obstacle == 'coin')) {

                this.status = 'won';
               // return
            }

        }

    }
}




console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
const grid = [
    [undefined, undefined],
    ['wall', 'wall']
];

const goldCoin = { type: 'coin', title: 'Золото' };
const bronzeCoin = { type: 'coin', title: 'Бронза' };

const playerLev = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ bronzeCoin, goldCoin, playerLev, fireball]);


level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
    console.log('Все монеты собраны');
    console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(0.5, 0.5), playerLev.size);
if (obstacle) {
    console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(playerLev);
if (otherActor === fireball) {
    console.log('Пользователь столкнулся с шаровой молнией');
}
console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')

class LevelParser {
    constructor(object) {
        this.object = object;
    }
    actorFromSymbol(symb) {
        if (symb == undefined) {
            return undefined
        }
        if (symb in this.object) {

            return  this.object[symb];

        } else {
            return undefined;
        }
    }
    obstacleFromSymbol(symb) {
        let ooo = this.object

        if (symb == 'x'){
            return 'wall';
        } else if (symb == '!'){
            return 'lava';
        } else if (symb == undefined){
            return undefined;
        }
        for(let s in ooo) {
            if (s == symb) {
                return (new this.object[symb]).type ;
            }
        }
        //if (symb in ooo){
        //        return (new this.object[symb]).type ;
        //} else {
        //    return undefined;
        //}
    }
    createGrid(plan) {
        let arr = []
        for (var p of plan) {
            let m = p.split('')
            for (var i = 0; i< m.length; i++) {
                if (m[i] === 'x') {
                    m.splice(i,1,'wall');
                } else if (m[i] === '!') {
                    m.splice(i,1,'lava');
                } else if (m[i] === 'o') {
                    m.splice(i,1,undefined);
                } else if (m[i] === ' ') {
                    m.splice(i,1,undefined);
                } else if (m[i] === undefined) {
                    m.splice(i,1,undefined);
                } else if((this.object != undefined) && ( new this.object[m[i]] instanceof Actor)) {
                    m.splice(i,1,undefined);
                }
            }
            arr.push(m)
        }
        return arr;
    }

    createActors(plan) {
        if (this.object == undefined) {
            return []
        }
        if (plan.length == 0) {
            return [];
        }
            let arr = [];
            let arrActors = [];
            for (let p of plan) {
                let m = p.split('');
                arr.push(m);
            }
            for (var j = 0; j < plan[0].length; j++) {
                for (var i = 0; i < arr.length; i++) {
                    if ( (arr[i][j] in this.object) && (typeof  this.object[arr[i][j]] == 'function') && ( new this.object[arr[i][j]] instanceof Actor)) {
                        arrActors.push(new this.object[arr[i][j]](new Vector(j, i)))
                    }
                }
            }
        return arrActors
    }

    parse(plan) {
        console.log(this)
        let z = new Level(this.createGrid(plan),this.createActors(plan))
        return z
    }
}

const plan2 = [
    '  x  ',
    '!x x!',
    '  x  '
];

const actorsDict = Object.create(null);
actorsDict['@'] = Actor;


const parser = new LevelParser(actorsDict);

console.log(parser.obstacleFromSymbol('2'))
console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
const level3 = parser.parse(plan2);
console.log(level3)
console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
level3.grid.forEach((line, y) => {
    line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
});

level3.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));


class Fireball extends Actor {
    constructor(pos,speed) {
        super(pos);

        this.speed = speed;
        this.size = new Vector(1, 1);

    }

    get type() {
        return 'fireball';
    }

    getNextPosition(time = 1) {
        return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
    }

    handleObstacle() {
        this.speed.x = this.speed.x*(-1);
        this.speed.y = this.speed.y*(-1);
    }

    act(time, level) {
        console.log(this.getNextPosition(time))
        let nextPos = this.getNextPosition(time);

        let obstacle = level.obstacleAt(nextPos, this.size)
        if (obstacle) {
            console.log(obstacle)
            this.handleObstacle()
        } else {
            console.log('не врезался')
            this.pos = this.getNextPosition(time);
        }

    }
}

console.log()

const time = 5;
const speed = new Vector(1, 0);
const position22 = new Vector(5, 5);

const ball = new Fireball(position22, speed);

const nextPosition = ball.getNextPosition(time);
console.log(`Новая позиция: ${nextPosition.x}: ${nextPosition.y}`);

ball.handleObstacle();
console.log(`Текущая скорость: ${ball.speed.x}: ${ball.speed.y}`);

class HorizontalFireball extends Fireball{
    constructor(pos) {
        super(pos);
        this.speed = new Vector(2, 0);
        this.size = new Vector(1, 1);
    }
}



class VerticalFireball extends Fireball {
    constructor(pos) {
        super(pos);
        this.speed = new Vector(0, 2);
        this.size = new Vector(1, 1);
    }
}

class FireRain extends Fireball {
    constructor(pos) {
        super(pos);
        this.speed = new Vector(0, 3);
        this.size = new Vector(1, 1);
        this.firstPos = pos;
    }

    handleObstacle() {
        this.pos = this.firstPos;
    }
}


const le = new Level([
    [undefined, undefined,undefined , 'wall', undefined],
    [undefined, 'wall', undefined, undefined, undefined],
    [undefined, undefined,undefined , undefined, undefined],
    [undefined, undefined,undefined , undefined, undefined],
    ['wall', undefined,undefined , undefined, undefined]
])
const time1 = 1;
const fr = new FireRain(new Vector(0, 0));
fr.act(time1, le)
console.log(fr.pos)
console.log(fr.pos)

class Coin extends Actor {
    constructor(pos = new Vector(0, 0)) {

        super();
        this.size = new Vector(0.6, 0.6);
        this.pos.x = pos.x+0.2;
        this.pos.y = pos.y+ 0.1;
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.random(0, 2 * Math.PI);
    }

    get type() {
        return 'coin';
    }

    updateSpring(time = 1) {
        this.spring = this.spring + this.springSpeed * time;
    }

    getSpringVector() {
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    }

    getNextPosition(time = 1) {
        this.updateSpring(time);
        let newSpringVec = this.getSpringVector();
        console.log(newSpringVec)
        this.pos.y = this.pos.y + newSpringVec.y
        return new Vector(this.pos.x ,  this.pos.y + newSpringVec.y)
    }

    act(time) {
        //console.log(pos)
        this.getNextPosition(time)
    }
}
/*
const ppp = new Actor(new Vector(0,1),new Vector(1, 1));
const gridd = [
    [undefined, undefined , undefined],
    ['wall', ppp,'wall'],
    [undefined, undefined , undefined]
]

const c = new Coin(new Vector(4, 4));
const playerr2 = new Actor(new Vector(0, 0), new Vector(1, 1));
const levell = new Level(undefined, [c,c,c]);
console.log('ПРОВЕРКА ACTORAT')

console.log(levell.actorAt(ppp));
console.log(c.pos);
console.log(c.size);
console.log('------')
console.log(ppp.pos);
console.log(ppp.size);

*/



/*/
let wawa = new Array(2).fill(new Array(2).fill('wall'));
console.log(wawa)
const lele = new Level(wawa);
const popo = new Vector(0.5, 0.5);
console.log(lele)
const w = lele.obstacleAt(popo, new Vector(1,1));
console.log('cпать')
console.log(w)
*/

/*
console.log('ПРОВЕРКА ТЕСТА С PLAYEROМ')
let player2 = new Fireball()
let player3= new Player(new Vector(2,2))
let lll = new Level(undefined, [ player2]);
console.log( lll.player.type)
*/


const schemaa = [
    '         ',
    '         ',
    '         ',
    '         ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
];
const actorDictt = {
    '@': Player
}
const parserr = new LevelParser(actorDictt);
const levelll = parserr.parse(schemaa);
console.log(levelll)
runLevel(levelll, DOMDisplay);

//const p = new Player();
//console.log(p)

/*
console.log('---------------------------------------------')
let c = new Coin(new Vector(5, 5))
//console.log(c.pos)
//c.act(5)
let n = c.getNextPosition(5)
//console.log(n)
console.log(c.pos)*/

