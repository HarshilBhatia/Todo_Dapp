App = {
    contracts: [],
    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.hahah()
    },

/*
 * 
 *BOILER PLATE CODE FOR METAMASK
 */
    loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  
/*
 * 
 * ENDS ! 
 */

  loadAccount:async () =>{
      App.account = web3.eth.accounts[0]
      //console.log(App.account)
      //console.log("account loaded")
  },

    loadContract: async() => {

        const todoList= await $.getJSON('TodoList.json')
        App.contracts.TodoList=TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)
        console.log(todoList)
        // live contract !!!
        App.todoList= await App.contracts.TodoList.deployed()
       // console.log("contract loaded")
    },


    hahah: async () => {
     // console.log("finally loaded")
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#abcde').html(App.account)
  
      // Render Tasks
      await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },

/**
 * MOST COMPLICATED PART OF THE CODE - INTEGRATING THE BLOCKCHAIN
 */

createMenuItem: async(name) =>{
  let li = document.createElement('li');
  li.textContent = name;
  return li;
},

    renderTasks : async() =>{
      // load tasks from blockchain 
      // render out each tast one by one 
      //fetch the tasks from the blockchain 
      const taskCount = await App.todoList.taskCount()
      const $taskTemplate= $('.taskTemplate')

      console.log("asdkj")


      for (var i = 1; i <= taskCount; i++) {
        // Fetch the task data from the blockchain
        const task = await App.todoList.tasks(i)
        const taskId = task[0].toNumber()
        const taskContent = task[1] 
        const taskCompleted = task[2]

        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on('click', App.toggleCompleted)
  
        // Put the task in the correct list
        if (taskCompleted) {
          $('#completedTaskList').append($newTaskTemplate)
        } else {
          $('#taskList').append($newTaskTemplate)
        }
  
        // Show the task
        $newTaskTemplate.show()
      }
    },

    createTask: async () => {
      App.setLoading(true)
      const content = $('#newTask').val()
      await App.todoList.createTasks(content)
      window.location.reload()
    },


    
/**
 * END
 */
    

    setLoading: (boolean) => {

      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
}

  

  $(() => {
    $(window).load(() => {
      App.load()
    })
  })