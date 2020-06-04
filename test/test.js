const TodoList= artifacts.require('./TodoList.sol')

contract("TodoList" , (acc)=>{
    before(async() =>{
        this.todoList= await TodoList.deployed();

    })

    it('deployed successfully',async ()=>{
        const address= await this.todoList.address
        // to ensure the smart contract has actually been deployed
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists tasks',async()=>{
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
    })
})