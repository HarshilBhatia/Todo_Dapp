pragma solidity ^0.5.0;
// version of solidity

contract TodoList{
    uint public taskCount=0;

    struct Task{
        uint id;
        string content;
        bool completed;
    }


    mapping (uint=> Task) public tasks;

    constructor() public{
        createTasks("Temporary Task");
    }
    // function to create new Tasks
    function createTasks(string memory _content) public {
        taskCount += 1;
        tasks[taskCount] = Task(taskCount,_content,false);
    }

}