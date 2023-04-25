//test adding a box on the canvas
const FAMTREE_WIDTH = 1200
const FAMTREE_HEIGHT = 900
const SIDE_PANEL_WIDTH = 200
const LEVEL_HEIGHT = 60
const BOX_WIDTH = 35
const BOX_HEIGHT = 30
const HORIZONTAL_GAP = 20
const canvas = document.getElementById('canvas1')
canvas.width = FAMTREE_WIDTH + SIDE_PANEL_WIDTH
canvas.height = FAMTREE_HEIGHT
const ctx = canvas.getContext('2d')

class Persons {
  constructor() {
    this.persons = {}
  }
  add(person) {
    let keys = Object.keys(this.persons)
    if (keys && keys.includes(person.id)) {
      throw new Error('This person already exists')
    } else {
      this.persons = { ...this.persons, [person.id]: person }
    }
  }
  delete(person) {
    //we delete this person from this.persons object
    delete this.persons[person.id]
  }
  find(id) {
    // console.log(this.persons)
    // console.log(Object.keys(this.persons))
    if (Object.keys(this.persons).includes(id)) {
      return this.persons[id]
    }
  }
  findLayerNPersons(n) {
    //all those who have level n (levels start at 0)
    const personids = Object.keys(this.persons)
    let result = []
    for (let pid of personids) {
      if (this.persons[pid].level == n) {
        result.push(this.persons[pid])
      }
    }
    return result
  }
  #updateTopDown() {

    //we go through the this.persons object
    //if we find any person with one of his parents in the data then
    //we increase its level to 1 more than the parent
    //we keep track of the fact if we had to update the level. If we did not update the level in
    //that iteration, we stop
    const personids = Object.keys(this.persons)
    let needtodo = true
    let iterations = 0
    do {
      iterations++
      for (const pid of personids) {
        needtodo = false

        const person = this.persons[pid]
        const parent1 = this.find(person.parent1id)
        const parent2 = this.find(person.parent2id)

        let parent1Level = 0;
        let parent2Level = 0;
        if (parent1) parent1Level = parent1.level
        if (parent2) parent2Level = parent2.level

        let highestLevel = Math.max(parent1Level, parent2Level)
        //at least one parent exists
        if ((parent1 || parent2) && (person.level < highestLevel + 1)) {
          person.level = highestLevel + 1
          needtodo = true
        }
      }

    } while (needtodo || iterations > 20);
    console.log(`updateTopDown iterations: ${iterations}`)
  }

  #updateBottomUp() {
    //here we set the level of the parent as one lower than the level of the children
    const personids = Object.keys(this.persons)
    let needtodo = true
    let iterations = 0
    do {
      iterations++
      for (const pid of personids) {
        needtodo = false

        const person = this.persons[pid]
        const parent1 = this.find(person.parent1id)
        const parent2 = this.find(person.parent2id)

        let parent1Level = 0;
        let parent2Level = 0;
        if (parent1) parent1Level = parent1.level
        if (parent2) parent2Level = parent2.level
        if (parent1 && parent1Level < parent2Level) {
          parent1.level = parent2Level
          needtodo = true
        }
        if (parent2 && parent2Level < parent1Level) {
          parent2.level = parent1Level
          needtodo = true
        }
      }

    } while (needtodo || iterations > 20);
    console.log(`updateBottomUp iterations:${iterations}`)
  }
  #calcNumLevels() {
    const personids = Object.keys(this.persons)
    let max = -10000
    for (let pid of personids) {
      if (this.persons[pid].level > max) {
        max = this.persons[pid].level
      }
    }
    return max
  }

  updateLevel(id) {
    this.#updateTopDown()
    this.#updateBottomUp()
    this.#draw(id)
  }

  #draw(id) {

    // we have to see if these calculations need to be done!
    let numLevels = this.#calcNumLevels()
    // console.log(`numLevels: ${numLevels}`)

    let objLevelObjects = {}

    for (let level = numLevels; level >= 0; level--) {
      let objLevelObject = {}
      let objSiblingGroups = this.#siblingGroupsAtLevel(level)
      objLevelObject['numSiblingGroups'] = objSiblingGroups.numSiblingGroups
      objLevelObject['siblingGoups'] = objSiblingGroups.siblingGroups
      objLevelObjects[level] = objLevelObject
    }
    // console.log(`objLevelObjects:`)
    // console.log(objLevelObjects)
    // we have to see if these calculations need to be done!

    this.#drawBackGround()
    //the person with this id is the selected person
    // let meAndMySiblings = this.meAndMySiblings(id)
    // let numMeAndMySiblings = meAndMySiblings.length
    // let totalWidth = numMeAndMySiblings*2*BOX_WIDTH+ (numMeAndMySiblings-1)*HORIZONTAL_GAP
    // let startx = (FAMTREE_WIDTH-totalWidth)/2
    // let x = startx
    // for(let i=0;i<numMeAndMySiblings;i++){
    //   let sibling=meAndMySiblings[i]
    //   //draw the sibling
    //   ctx.moveTo(x,sibling.level*LEVEL_HEIGHT)
    //   ctx.rect(x,sibling.level*LEVEL_HEIGHT,BOX_WIDTH*2,BOX_HEIGHT)
    //   ctx.stroke()
    //   x+=BOX_WIDTH*2+HORIZONTAL_GAP
    // }
    //let us draw them

  }

  meAndMySiblings(id) {
    console.log(id)
    let keys = Object.keys(this.persons)
    let parents = [this.persons[id].parent1id, this.persons[id].parent2id]
    if (!parents[0] && !parents[1]) {
      return [this.persons[id]]
    }
    //for a sibling at least one parent Id must be not null and matching
    let siblings = [] //pass person objects
    for (let pid of keys) {
      let person = this.persons[pid]
      if ((person.parent1id && parents.includes(person.parent1id))
        || (person.parent2id && parents.includes(person.parent2id))) {
        console.log(person.name)
        siblings.push(person)
      }
    }
    return siblings
  }

  #siblingGroupsAtLevel(n) {
    //num Sibling Groups are defined as number of groups that have distinct parents if A and B have parent C and D
    //and X and Y and Z have parent C and E then there are 2 groups
    let numSiblingGroups = 0
    //contains an object with keys 
    //parents which is an array [parent1id,parent2id]
    //siblings an array of siblings
    let siblingGroups = []
    let personIds = Object.keys(this.persons)
    let personIdsForLevel = personIds.filter(pid => this.persons[pid].level == n)
    for (let pid of personIdsForLevel) {
      let parent1id = this.persons[pid].parent1id
      let parent2id = this.persons[pid].parent2id
      if (siblingGroups.length == 0) {
        let siblingGroup = {}
        siblingGroup.parents = [parent1id, parent2id]
        siblingGroup.siblings = [this.persons[pid]]
        siblingGroups.push(siblingGroup)
        numSiblingGroups++
      } else {
        let parentGroupFound = false
        for (let siblingGroup of siblingGroups) {
          if (siblingGroup.parents.includes(parent1id) && siblingGroup.parents.includes(parent2id)) {
            parentGroupFound = true
            siblingGroup.siblings.push(this.persons[pid])
          }
        }
        if (!parentGroupFound) {
          let siblingGroup = {}
          siblingGroup.parents = [parent1id, parent2id]
          siblingGroup.siblings = [this.persons[pid]]
          siblingGroups.push(siblingGroup)
          numSiblingGroups++
        }
      }
    }
    return { numSiblingGroups, siblingGroups }
  }

  getSiblings(personId) {
    let allOfUs = this.meAndMySiblings(personId)
    let siblings = allOfUs.filter(p => p.id != personId)
    return siblings
  }

  #drawBackGround() {

    for (let row = 0; row < FAMTREE_HEIGHT; row += LEVEL_HEIGHT) {
      ctx.strokeStyle = 'white'
      ctx.moveTo(0, row)
      ctx.lineTo(FAMTREE_WIDTH, row)
      ctx.stroke()

      ctx.strokeStyle = 'white'
      //draw boxes in very light color
      let x = HORIZONTAL_GAP
      for (let box = 0; box < 16; box++) {
        ctx.moveTo(x, row)
        ctx.strokeRect(x, row, 2 * BOX_WIDTH, BOX_HEIGHT);
        ctx.stroke()
        x += 2 * BOX_WIDTH + HORIZONTAL_GAP
        // ctx.lineTo()
      }
    }

    ctx.moveTo(FAMTREE_WIDTH, 0)
    ctx.lineTo(FAMTREE_WIDTH, FAMTREE_HEIGHT)


    ctx.strokeStyle = 'black'
    ctx.moveTo(FAMTREE_WIDTH, 50)
    ctx.font = 'bold 20px serif'
    ctx.strokeText('Tree 1', FAMTREE_WIDTH, 50, SIDE_PANEL_WIDTH);


  }
}