(() => {

  simulateScreenInteraction()

  function simulateScreenInteraction() {

    let bln = new Person('Brij Lal Naval','male')
    let blnw = new Person('Mrs Brij Lal Naval','female')

    let slb = new Person('Sravan Lal Bali','male')
    let shakuntalab = new Person('Shankuntal Bali','female')
    //draw box on the last row
    let a = new Person('alok joshi', 'male')
    console.log(`a.name: ${a.name}`)
    let b = new Person('sadhna joshi', 'female',slb.id,shakuntalab.id)
    // console.log(a, b)
    let c = a.addChildDetails('akshay', 'male', b.id)
    let d = a.addChildDetails('manav', 'male', b.id)
    // console.log(c)
    // console.log(a, b)
    
    let blj = new Person('BL Joshi','male')
    let savitrijoshi = new Person('Savitri Joshi','female')
    let e = new Person('Trilok Joshi', 'male', blj.id, savitrijoshi.id)
    let f = new Person('Sneh Joshi', 'female',bln.id,blnw.id)

    e.addChildPerson(a)
    f.addChildPerson(a)
    // console.log(e)
    // console.log(f)
    // console.log(a)
    let g = new Person('Amit Joshi', 'male', e.id, f.id)
    let alka = new Person('Alka Joshi','female')
    let g1 = new Person('Ishan Joshi', 'male', g.id,alka.id)
    let g2 = new Person('Prachi ?','female', g.id,alka.id)
    // console.log(g)
    let h = new Person('Hemant Joshi', 'male', f.id)
    // console.log('After adding Amit and Hemant')
    // console.log(e)
    // console.log(f)
    let i = new Person('Dhruv Joshi', 'male')
    let akanksha= new Person('Akanksha','female',null,null,i.id)
    let akriti = new Person('Akriti ?','female',h.id)
    h.addChildId(i.id)
    // h.addChildId(i.id)
    // h.addChildPerson(i)
    //a.addParentPerson(e)
    let j = new Person('Shama Joshi', 'female')
    let k = new Person('Shruti Mahapatra','female')
    k.addParentPerson(h)
    k.addParentPerson(j)
    // console.log('After adding Shruti')
    // console.log(k)
    // console.log(h)
    // console.log(j)
    let m = new Person('Saki Mahapatra', 'male')
    let n = new Person('Shivan', 'male', k.id, m.id)
    let o = new Person('Amyra', 'female', k.id, m.id)

    

    updateGraph(a)
  }


  document.querySelector('#graph').addEventListener('click',event=>{
    const target = event.target
    if(target.classList.contains('grandgrandparent') ||
       target.classList.contains('grandparent') ||
       target.classList.contains('parent') || 
       target.classList.contains('partner')||
       target.classList.contains('child')){
      const personId=target.dataset.personId
      if(personId){
        const person=Person.persons.find(personId)
        updateGraph(person)
      }
    }
  })

  document.querySelector('#existingpersons').addEventListener('click',(event)=>{
    if(event.target.classList.contains('deleteperson')){
      const parent=event.target.parent
      const id = parent.dataset.personId
      console.log(parent.value,id)
      const person = Person.persons.find(id)
      if(person) person.delete()
    }else{
      const id = event.target.dataset.personId
      const person = Person.persons.find(id)
      if(person) {
        updateGraph(person)
      }
    }
  })

  document.querySelector('#previoussibling').addEventListener('click', () => {
    //get the id of the person which is stored in data-person-id attribute
    //siblings
    let personEl = document.querySelector("#person")
    let currentPersonId = personEl.dataset.personId
    if (currentPersonId) {
      const siblings = Person.persons.meAndMySiblings(currentPersonId)
      const siblingIndex = siblings.findIndex(sib=>sib.id==currentPersonId)
      console.log(`Siblings prev:`,siblings,siblingIndex)
      updateGraph(siblings[siblingIndex==0? siblings.length-1:siblingIndex-1])
    }
  })

  document.querySelector('#addperson').addEventListener('click', () => {

    const name = document.querySelector("#name").value
    const male = document.querySelector("#male").checked
    const female = document.querySelector("#female").checked
    const other = document.querySelector("#other").checked
    const sex = male ? 'male' : female ? 'female' : other ? 'other' : ''
    // console.log(male, female, other)

    const parent = document.querySelector("#rel_parent").checked
    const partner = document.querySelector("#rel_partner").checked
    const sibling = document.querySelector("#rel_sibling").checked
    const child = document.querySelector("#rel_child").checked

    const person = new Person(name, sex)

    const mainPersonId = document.querySelector('#person').dataset.personId
    let mainPerson = Person.persons.find(mainPersonId)

    if (parent) {

      person.addChildPerson(mainPerson)
    
    } else if (partner) {

      mainPerson.addPartnerPerson(person)
      //add mainPerson as the partner of the person as well
      person.addPartnerPerson(mainPerson)

    } else if (sibling) {

      let parents=mainPerson.getParents()
      for(let parent of parents){
        //each parent is also the parent of the person added
        person.addParentPerson(parent)
        //the person added is also the child of the parent
        parent.addChildPerson(person)
      }
      //also we make this person the mainPerson
      mainPerson=person

    } else if (child) {

      person.parent1id=mainPerson.id

    } else {

      let personEl = document.querySelector("#person")
      personEl.innerText = name
      personEl.setAttribute('data-person-id', person.id)
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
    li.setAttribute('data-person-id', person.id)
    li.innerHTML = `<span>${name} ${person.id.substring(1,5)}</span><span class='deleteperson'>X</span>`
    existingPersonsEl.appendChild(li)

    updateGraph(mainPerson)

  })

  document.querySelector('#nextsibling').addEventListener('click', () => {
    //get the id of the person which is stored in data-personid
    const personEl = document.querySelector("#person")
    const currentPersonId = personEl.dataset.personId
    if (currentPersonId) {
      const siblings = Person.persons.meAndMySiblings(currentPersonId)
      const siblingIndex = siblings.findIndex(sib=>sib.id==currentPersonId)
      console.log(`Siblings next:`,siblings,siblingIndex)
      updateGraph(siblings[siblingIndex==siblings.length-1?0:siblingIndex+1])
    }
  })

  function updateGraph(mainPerson){

    //we update the graph based on the main person
    let personEl=document.querySelector('#person')
    personEl.innerText=mainPerson.name
    personEl.setAttribute('data-person-id',mainPerson.id)

    let children=mainPerson.getChildren()
    // console.log(children)

    let childrenEl=document.querySelector('#children')
    childrenEl.innerHTML=""

    
    for(let child of children){
      
      //create div for childandparter
      let candpEl = document.createElement('div')
      candpEl.classList.add('childandpartner')

      let childEl = document.createElement('div')
      childEl.classList.add('child','card')
      childEl.setAttribute('data-person-id',child.id)
      childEl.innerText=child.name
      candpEl.appendChild(childEl)
      
      //similar for partner
      let partnerEl = document.createElement('div')
      partnerEl.classList.add('partner','card')
      partnerEl.setAttribute('data-person-id',child.partnerids[0])
      partnerEl.innerText=child.partnername ||''
      candpEl.appendChild(partnerEl)
      
      childrenEl.appendChild(candpEl)
    }
    
    //update both parents, grandparents and grandgrandparents

    const parents = mainPerson.getParents()
    if(parents){
      let i=1
      for(let parent of parents){
        const parentEl = document.querySelector(`#parent${i}`)
        parentEl.setAttribute('data-person-id',parent?parent.id:'')
        parentEl.innerText=parent?parent.name:''
        let j=1
        let grandparents = parent?.getParents()
        if(grandparents){
          for(let grandparent of grandparents){
            const grandparentEl = document.querySelector(`#parent${i}${j}`)
            grandparentEl.setAttribute('data-person-id',grandparent?grandparent.id:'')
            grandparentEl.innerText=grandparent?grandparent.name:'' 
            let k = 1
            let grandgrandparents = grandparent?.getParents()
            if(grandgrandparents){
              for(let grandgrandparent of grandgrandparents){
                const grandgrandparentEl = document.querySelector(`#parent${i}${j}${k}`)
                grandgrandparentEl.setAttribute('data-person-id',grandgrandparent?grandgrandparent.id:'')
                grandgrandparentEl.innerText=grandgrandparent?grandgrandparent.name:'' 
                k++
              }
            }
            j++
          }
        }
        i++
      }
    }

    //update partner - for the time being assume a single partner
    const partner = mainPerson.getPartners()[0]
    const partnerEl= document.querySelector(`#partner`)
    partnerEl.setAttribute('data-person-id',partner?partner.id:'')
    partnerEl.innerText=partner?partner.name :''
  }

})()//end of immediately invoked function