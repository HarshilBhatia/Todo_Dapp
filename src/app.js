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
      console.log(App.account)
  },

    loadContract: async() => {
        const todoList= await $.getJSON('TodoList.json')
        App.contracts.TodoList=TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)
        console.log(todoList)
        // live contract !!!
        App.todoList= await App.contracts.TodoList.deployed()
    },


    hahah: async () => {

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

    renderTasks : async() =>{
      // load tasks from blockchain 
      // render out each tast one by one 
      
      //fetch the tasks from the blockchain 
      const taskCount = await App.todoList.taskCount()
      const $tasktemplate= $('.taskTemplate')
      console.log("asdkj")
      for (let i = 1; i <= taskCount; i++) {
        const task = await App.todoList.tasks(i)    
        const taskid=task[0].toNumber()
        const content=task[1]
        const Completed=task[2]

        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        //.on('click', App.toggleCompleted)
      }
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }      
      
      $newTaskTemplate.show()

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