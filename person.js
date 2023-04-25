class Person {
  static persons = new Persons()

  constructor(name = 'unknown', 
              sex = 'unspecified', 
              parent1id = null, 
              parent2id = null,
              partnerid = null) {
    this.id = window.uuidv4()
    this.name = name
    this.sex = sex
    this.parent1id = parent1id || null
    this.parent2id = parent2id || null
    this.childrenids = []
    this.partnerids = []
    if(partnerid) {
      this.partnerids.push(partnerid)
      //also add this person's partner id to the partner
      Person.persons.find(partnerid).addPartnerPerson(this)
    }

    // these properties are updated each time a new person is created
    this.level = 0
    this.x = 0  //position on screen
    this.y = 0  //position on screen

    Person.persons.add(this)
    if (this.parent1id) {
      const parent = Person.persons.find(this.parent1id)
      parent?.childrenids.push(this.id)
    }
    if (this.parent2id) {
      const parent = Person.persons.find(this.parent2id)
      parent?.childrenids.push(this.id)
    }
    Person.persons.updateLevel(this.id)
  }

  delete() {
    Person.persons.delete(this)
    //now find the parents
    const parents = this.getParents()
    for (const parent of parents) {
      parent.childrenids = parent.childrenids.filter(childid => childid != this.id)
    }
    //now remove the person from partners
    const partners = this.getPartners()
    for (const partner of partners) {
      partner.partnerids = partner.partnerids.filter(id => id != this.id)
    }
    return null
  }

  addChildDetails(name, sex, otherParentid) {
    let child = new Person(name, sex, this.id, otherParentid)
    this.childrenids.push(child.id)

    //we need to add this child to other parent as well
    if (otherParentid) {
      let otherParent = Person.persons.find(otherParentid)
      otherParent.childrenids.push(child.id)
    }
    return child
  }

  addChildId(childid, otherParentId = null) {
    if (this.#childExists(childid)) {
      throw new Error('This child already exists')
    }
    this.childrenids.push(childid)

    if (otherParentId) {
      let otherParent = Person.persons.find(otherParentId)
      otherParent.childrenids.push(childid)
    }

    //get the child and add parentid to it
    let child = Person.persons.find(childid)

    if ((child.parent1id && child.parent1id == this.id) || (child.parent2id && child.parent2id == this.id)) {
      //no need to set this.id as one of the parentids
    } else if (!child.parent1id) {
      child.parent1id = this.id
    } else if (!child.parent2id) {
      child.parent2id = this.id
    }
    if (otherParentId) {
      if ((child.parent1id && child.parent1id == otherParentId) || (child.parent2id && child.parent2id == otherParentId)) {
        //no need to set otherParentId as one of the parentids
      } else if (!child.parent1id) {
        child.parent1id = otherParentId
      } else if (!child.parent2id) {
        child.parent2id = otherParentId
      }
    }
  }

  addChildPerson(person) {
    if (this.#childExists(person.id)) {
      throw new Error('This child already exists')
    }
    this.childrenids.push(person.id)

    //add parentid to this person
    if (person.parent1id == this.id || person.parent2id == this.id) {
      throw new Error('Parent already exists for this person')
    }
    if (!person.parent1id) {
      person.parent1id = this.id
    } else if (!person.parent2id) {
      person.parent2id = this.id
    } else {
      throw new Error('Both parents already exist for this person')
    }
  }

  addParentPerson(person) {
    if ([this.parent1id, this.parent2id].includes(person.id)) {
      //nothing to do
      return
    }
    if (this.parent1id && this.parent1id != person.id &&
      this.parent2id && this.parent2id != person.id) {
      //this is an error since two parents exist and none of
      //parents is same as the person
      throw new Error('Both parents exist for this person')
    }

    if (!this.parent1id) {
      this.parent1id = person.id
    } else if (!this.parent2id) {
      this.parent2id = person.id
    }
    //at the same time add this person in the children array of parent1id
    const parent = Person.persons.find(person.id)
    parent.childrenids.push(this.id)
  }

  addPartnerPerson(person) {
    this.partnerids.push(person.id)
  }

  addChildren(children, otherParentId) {
    for (const child of children) {
      if (!this.#childExists(child.id)) {
        this.addChildId(child.id, otherParentId)
      }
    }
  }

  getParents() {
    let parents = []
    if (this.parent1id) {
      parents.push(Person.persons.find(this.parent1id))
    } else {
      parents.push(null)
    }
    if (this.parent2id) {
      parents.push(Person.persons.find(this.parent2id))
    } else {
      parents.push(null)
    }
    return parents
  }

  getPartners() {
    let pids = [...this.partnerids]
    //either partner has been specifically added in the interface and in this case
    //it ends up in the partnerids property.
    //or we get partners based on the children the person has partnered to produce
    const children = this.getChildren()
    for (let child of children) {
      let otherParentId
      if (child.parent1id != this.id) {
        otherParentId = child.parent1id
      }
      if (child.parent2id != this.id) {
        otherParentId = child.parent2id
      }
      if (!pids.includes(otherParentId)) {
        pids.push(otherParentId)
      }
    }

    const partners = []
    for (const partnerid of pids) {
      partners.push(Person.persons.find(partnerid))
    }
    return partners
  }

  getChildren() {
    //get children of this person. This could be with any partner
    //in case this person has had multiple partners
    const children = []
    const keys = Object.keys(Person.persons.persons)
    for (let key of keys) {
      //person object
      const person = Person.persons.find(key)
      if ((person.parent1id == this.id) || (person.parent2id == this.id)) {
        children.push(person)
      }
    }
    return children
  }

  #childExists(childid) {
    return this.childrenids.includes(childid)
  }
  #bothParentsExist(person) {
    //person object
    return this.parent1id && this.parent2id
  }
}