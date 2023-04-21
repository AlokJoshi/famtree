(() => {
  let currentDroppable = null;
  let mainPerson = null

  simulateScreenInteraction()

  function simulateScreenInteraction() {

    //draw box on the last row
    let a = new Person('alok joshi', 'male')
    let b = new Person('sadhna joshi', 'female')
    // console.log(a, b)
    let c = a.addChildDetails('akshay', 'male', b.id)
    let d = a.addChildDetails('manav', 'male', b.id)
    // console.log(c)
    // console.log(a, b)
    let e = new Person('Trilok Joshi', 'male')
    let f = new Person('Sneh Joshi', 'female')
    e.addChildPerson(a)
    f.addChildPerson(a)
    // console.log(e)
    // console.log(f)
    // console.log(a)
    let g = new Person('Amit Joshi', 'male', e.id, f.id)
    // console.log(g)
    let h = new Person('Hemant Joshi', 'male', f.id)
    // console.log('After adding Amit and Hemant')
    // console.log(e)
    // console.log(f)
    let i = new Person('Dhruv Joshi', 'male')
    h.addChildId(i.id)
    // h.addChildId(i.id)
    // h.addChildPerson(i)
    //a.addParentPerson(e)
    let j = new Person('Shama Joshi', 'female')
    let k = new Person('Shruti Mahapatra', 'female')
    k.addParentPerson(h)
    k.addParentPerson(j)
    // console.log('After adding Shruti')
    // console.log(k)
    // console.log(h)
    // console.log(j)
    let m = new Person('Saki Mahapatra', 'male')
    let n = new Person('Shivan', 'male', k.id, m.id)
    let o = new Person('Amyra', 'female', k.id, m.id)

    let f1 = new Person('Father1', 'male')
    let m1 = new Person('Mother1', 'female')
    let s1 = new Person('Son1', 'male')
    let s2 = new Person('Son2', 'male')
    let s3 = new Person('Son3', 'male')
    let d1 = new Person('Daughter1', 'female')
    let d2 = new Person('Daughter2', 'female')

    f1.addChildren([s1, s2, s3, d1, d2], m1.id)
    // console.log(f1, m1, s1, d1)

    // let topPersons = Person.persons.findLayerNPersons(0)
    // for (let tp of topPersons) {
    //   console.log(tp.name, tp.sex, tp.level)
    // }

    // console.log(`Level 1`)
    // let level1Persons = Person.persons.findLayerNPersons(1)
    // for (let tp of level1Persons) {
    //   console.log(tp.name, tp.sex, tp.level)
    // }

    // console.log(`Level 2`)
    // let level2Persons = Person.persons.findLayerNPersons(2)
    // for (let tp of level2Persons) {
    //   console.log(tp.name, tp.sex, tp.level)
    // }

    // console.log(`Level 3`)
    // let level3Persons = Person.persons.findLayerNPersons(3)
    // for (let tp of level3Persons) {
    //   console.log(tp.name, tp.sex, tp.level)
    // }
  }

  document.querySelector('#addperson').addEventListener('click', () => {

    let name = document.querySelector("#name").value
    let male = document.querySelector("#male").checked
    let female = document.querySelector("#female").checked
    let other = document.querySelector("#other").checked
    let sex = male ? 'male' : female ? 'female' : other ? 'other' : ''
    // console.log(male, female, other)

    let parent = document.querySelector("#rel_parent").checked
    let partner = document.querySelector("#rel_partner").checked
    let sibling = document.querySelector("#rel_sibling").checked
    let child = document.querySelector("#rel_child").checked

    let person = new Person(name, sex)

    if (parent) {
      person.addChildPerson(mainPerson)
    } else if (partner) {
      mainPerson.addPartnerPerson(person)
      //add mainPerson as the partner of the person as well
      person.addPartnerPerson(mainPerson)
    } else if (sibling) {
      let parents=mainPerson.getParents()
      for(let parent of parents){
        person.addParentPerson(parent)
      }
    } else if (child) {
      person.parent1id=mainPerson.id
    } else {
      let personEl = document.querySelector("#person")
      personEl.innerText = name
      personEl.setAttribute('dataset-person-id', person.id)
      mainPerson=person
    }

    //relationships element
    let relationshipgroupEl = document.querySelector('#relationshipgroup')
    if (mainPerson) {
      relationshipgroupEl.style.display = 'block'
    }
    //add this to the list as well
    let existingPersonsEl = document.querySelector('#existingpersons')
    let li = document.createElement('li')
    li.setAttribute('dataset-person-id', person.id)
    li.setAttribute('draggable', true)
    li.innerHTML = `${name}
                    ${person.id}`
    existingPersonsEl.appendChild(li)

    updateGraph()

    // li.removeEventListener('mousedown',onmousedown)
    // li.addEventListener('mousedown',onmousedown)
    function onmousedown(event) {

      console.log('inside mouse down')
      //create a new element, a div to contain the content of the li
      //and append it to the document and set its position to absolute
      let person = document.createElement('div')
      person.innerText = li.innerText

      // let shiftX = event.clientX - person.getBoundingClientRect().left;
      // let shiftY = event.clientY - person.getBoundingClientRect().top;

      person.style.position = 'absolute';
      person.style.zIndex = 1000;
      document.body.append(person);

      moveAt(event.pageX, event.pageY);

      function moveAt(pageX, pageY) {
        person.style.left = pageX + 'px';
        person.style.top = pageY + 'px';
        // person.style.left = pageX - shiftX + 'px';
        // person.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        person.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        person.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.droppable');
        if (currentDroppable != droppableBelow) {
          if (currentDroppable) { // null when we were not over a droppable before this event
            leaveDroppable(currentDroppable);
          }
          currentDroppable = droppableBelow;
          if (currentDroppable) { // null if we're not coming over a droppable now
            // (maybe just left the droppable)
            enterDroppable(currentDroppable);
          }
        }
      }

      document.addEventListener('mousemove', onMouseMove);

      person.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        person.onmouseup = null;
      };

      function enterDroppable(elem) {
        elem.style.background = 'pink';
      }

      function leaveDroppable(elem) {
        elem.style.background = '';
      }

      person.ondragstart = function () {
        return false;
      };
    }

  })
  document.querySelector('#nextsibling').addEventListener('click', () => {
    //get the id of the person which is stored in data-personid
    let person = document.querySelector("#person")
    let currentPersonId = person.dataset.personId
    if (currentPersonId) {
      Person.persons.getNextSibling(currentPersonId)
    }
  })

  function updateGraph(){
    //we update the graph based on the main person
    let personEl=document.querySelector('#person')
    personEl.innerText=mainPerson.name

    let children=mainPerson.getChildren()
    console.log(children)

    let childrenEl=document.querySelector('#children')
    childrenEl.innerHTML=""

    
    for(let child of children){
      
      //create div for childandparter
      let candpEl = document.createElement('div')
      candpEl.classList.add('childandpartner')

      let childEl = document.createElement('div')
      childEl.classList.add('child','card')
      childEl.setAttribute('dataset-person-id',child.id)
      childEl.innerText=child.name
      candpEl.appendChild(childEl)
      
      //similar for partner
      let partnerEl = document.createElement('div')
      partnerEl.classList.add('partner','card')
      partnerEl.setAttribute('dataset-person-id',child.partnerids[0])
      partnerEl.innerText=child.partnername ||''
      candpEl.appendChild(partnerEl)
      
      childrenEl.appendChild(candpEl)
    }
    
    //update both parents
    const parents = mainPerson.getParents()
    let i=1
    for(let parent of parents){
      const parentEl = document.querySelector(`#parent${i}`)
      parentEl.setAttribute('dataset-person-id',parent.id)
      parentEl.innerText=parent?parent.name:''
      i++
    }

    //update partner - for the time being assume a single partner
    const partner = mainPerson.getPartners()[0]
    const partnerEl= document.querySelector(`#partner`)
    partnerEl.setAttribute('dataset-person-id',partner?partner.id:'')
    partnerEl.innerText=partner?partner.name :''
  }
  // for (let li of document.querySelectorAll('li')) {
  //   li.addEventListener('dragstart', (e) => {
  //     console.log('dragging')
  //     alert(`Start drag mode:${e.target["[dataset-person-id"].value}`)
  //   })
  // }

  /*
  for (let li of document.querySelectorAll('li')) {
    li.addEventListener('mousedown', (event) => {

      console.log('inside mouse down')
      //create a new element, a div to contain the content of the li
      //and append it to the document and set its position to absolute
      let person = document.createElement('div')
      person.innerText=li.innerText

      let shiftX = event.clientX - person.getBoundingClientRect().left;
      let shiftY = event.clientY - person.getBoundingClientRect().top;

      person.style.position = 'absolute';
      person.style.zIndex = 1000;
      document.body.append(person);

      moveAt(event.pageX, event.pageY);

      function moveAt(pageX, pageY) {
        person.style.left = pageX - shiftX + 'px';
        person.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        person.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        person.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.droppable');
        if (currentDroppable != droppableBelow) {
          if (currentDroppable) { // null when we were not over a droppable before this event
            leaveDroppable(currentDroppable);
          }
          currentDroppable = droppableBelow;
          if (currentDroppable) { // null if we're not coming over a droppable now
            // (maybe just left the droppable)
            enterDroppable(currentDroppable);
          }
        }
      }

      document.addEventListener('mousemove', onMouseMove);

      person.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        person.onmouseup = null;
      };

      function enterDroppable(elem) {
        elem.style.background = 'pink';
      }
  
      function leaveDroppable(elem) {
        elem.style.background = '';
      }
  
      person.ondragstart = function() {
        return false;
      };
    })
  }
  */
  /*
  ball.onmousedown = function(event) {

    let shiftX = event.clientX - ball.getBoundingClientRect().left;
    let shiftY = event.clientY - ball.getBoundingClientRect().top;

    ball.style.position = 'absolute';
    ball.style.zIndex = 1000;
    document.body.append(ball);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      ball.style.left = pageX - shiftX + 'px';
      ball.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);

      ball.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      ball.hidden = false;

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest('.droppable');
      if (currentDroppable != droppableBelow) {
        if (currentDroppable) { // null when we were not over a droppable before this event
          leaveDroppable(currentDroppable);
        }
        currentDroppable = droppableBelow;
        if (currentDroppable) { // null if we're not coming over a droppable now
          // (maybe just left the droppable)
          enterDroppable(currentDroppable);
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove);

    ball.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      ball.onmouseup = null;
    };

  };
  
  function enterDroppable(elem) {
    elem.style.background = 'pink';
  }

  function leaveDroppable(elem) {
    elem.style.background = '';
  }

  ball.ondragstart = function() {
    return false;
  };
  */
})()//end of immediately invoked function