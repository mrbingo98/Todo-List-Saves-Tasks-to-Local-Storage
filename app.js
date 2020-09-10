const todoController = (function(){
    class Task {
        constructor(body, id, type = 'unchecked'){
            this.body=body
            this.id = id
            this.type = type
        }
    }
    let data = []
    return{
        addTaskctrl: function(itemBody){
            let id,newItem;
            if(data.length > 0){
                id = data[data.length-1].id + 1
            }else{
                id = 0
            }
            newItem = new Task(itemBody, id)
            data.push(newItem)
            return newItem
        },
        deleteItem: function(id){
            ids = data.map((cur)=>{
                return cur.id;
            })
            index = ids.indexOf(id)
            if(index !== -1){
                data.splice(index, 1)
            }
            return data
        },
        checkItem: function(id){
            ids = data.map((cur)=>{
                return cur.id;
            })
            index = ids.indexOf(id)
            if(index !== -1){
                data[index].type = 'checked'
            }
            return data
        },
        setData: (localData)=>{
            data = localData;
        }
    }
})();

const localStorageController = (function(){
    return {
        saveitemsLocally: function (item){
            let tasks
            if(localStorage.getItem('tasks') === null){
                tasks = []
            }else{
                tasks = JSON.parse(localStorage.getItem('tasks'))
            }
            tasks.push(item)
            localStorage.setItem('tasks', JSON.stringify(tasks))
        },
        returnTasks: function(){
            let tasks
            if(localStorage.getItem('tasks') === null){
                tasks = []
            }else{
                tasks = JSON.parse(localStorage.getItem('tasks'))
            }
            return tasks 
        },
        resetTasks: function(items){
        localStorage.clear()
        let tasks
            if(localStorage.getItem('tasks') === null){
                tasks = []
            }else{
                tasks = JSON.parse(localStorage.getItem('tasks'))
            }
            tasks = items
            localStorage.setItem('tasks', JSON.stringify(tasks))

        }
    }
})();

const UIController = (function(){
    DOMStrings ={
        addTask: document.querySelector('.add-todo'),
        todoList: document.querySelector('.todo-list'),
        inputTodo: document.querySelector('.input-todo'),
        select: document.querySelector('select')
    }
    return{
        DOM: DOMStrings,
        addTaskUI: function(addedItem){
            let check;
            check = addedItem.type === 'unchecked'?`<button class="complete" id="complete-${addedItem.id}"><i class="fas fa-check"></i></button>`:' '
            const newItem = `<li class="${addedItem.type}" id="todo_item-${addedItem.id}"><div><h5>${addedItem.body}</h5><button class="delete" id="delete-${addedItem.id}"><i class="fas fa-times"></i></button>${check}</div></li>`
            DOMStrings.todoList.insertAdjacentHTML('beforeend',newItem)
        },
        deleteItemUI: function(elementID){
            const element = document.getElementById(elementID).parentNode.parentNode;
            element.classList.add('deleted')
            element.remove();
            
        },
        checkItemUI: function(elementID, id){
            const element = document.getElementById(elementID).parentNode.parentNode;
            element.classList.add('checked')
            element.classList.remove('unchecked')
            document.getElementById('complete-'+id).remove()
        },
        filterTodos: function(value){
            let todos = DOMStrings.todoList.childNodes;
            todos = Array.from(todos)
            todos.splice(0,1)
            for ( item of todos) {
                switch (value) {
                    case 'all':
                        item.style.display = 'block'
                        break;
                
                    case 'completed':
                        if(item.classList.contains('checked')){
                            item.style.display = 'block'
                        }else{
                            item.style.display = 'none'
                        }
                        break;

                    case 'uncompleted':
                        if(item.classList.contains('unchecked')){
                            item.style.display = 'block'
                        }else{
                            item.style.display = 'none'
                        }
                        break;
                }
            };
        },
        clearFields: function(){
            DOMStrings.inputTodo.value = ''
            DOMStrings.inputTodo.focus()
        }
    }
})();

const appController = (function(UIctrl,todoctrl,lsCTRL){
    function setupEventListeners(){
        UIctrl.DOM.addTask.addEventListener('click',addNewTask)
        document.addEventListener('keypress',(event)=>{
            if(event.keyCode===13 || event.which===13){
                addNewTask();
            }
        })
        UIctrl.DOM.todoList.addEventListener('click',deleteCheckItem)
        UIctrl.DOM.select.addEventListener('click',filter)
    }
    
    function addNewTask(event){
        event.preventDefault()
        let taskBody = UIctrl.DOM.inputTodo.value
            if(taskBody !== ''){
                const addedItem = todoctrl.addTaskctrl(taskBody)
                UIctrl.addTaskUI(addedItem)
                UIctrl.clearFields()
                lsCTRL.saveitemsLocally(addedItem)
            }
    }
    function deleteCheckItem (e){
        var elementID,splitID,type,id,allitems;
        elementID = e.target.id
        if(elementID){
            splitID = elementID.split('-');
            type = splitID[0]
            id = parseInt(splitID[1])
            if(type === 'delete'){
            allitems = todoctrl.deleteItem(id)
            UIctrl.deleteItemUI(elementID)
            }else if(type === 'complete'){
                allitems = todoctrl.checkItem(id)
                UIctrl.checkItemUI(elementID, id)
            }
            lsCTRL.resetTasks(allitems)
        }
    }
    setupEventListeners()
    function filter(e){
        const optionValue = e.target.value
        UIctrl.filterTodos(optionValue)
    }
    function renderTasks(){
        let tasks = lsCTRL.returnTasks()
        if(tasks){
            tasks.forEach(task=>{
                UIctrl.addTaskUI(task)
            })
        todoctrl.setData(tasks)
        }
    }
    return{
        init: ()=>{renderTasks()}
    }
    

    
})(UIController,todoController, localStorageController);
appController.init()