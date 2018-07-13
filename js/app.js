// Storage Ctrl

// Item Ctrl
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function ( id, name, calories ) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data Structure
    const data = {
        items: [
            {id: 0, name: 'Steak Dinner', calories: 600},
            {id: 1, name: 'Eggs', calories: 120},
            {id: 2, name: 'Cookie', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    };

    // PUBLIC METHODS
    return {
        getItems: function() {
            return data.items;
        },

        getItemById: function(id) {
            return data.items.filter( item => item.id === id )[0] || null;
        },

        getTotalCalories: function() {
            let totalCalories = 0;
            data.items.forEach((item) => {
                totalCalories += item.calories;
            });

            // Set total Cal to the datastructure
            data.totalCalories = totalCalories;
            return totalCalories;
        },

        addItem: function(name, calories) {
            // Generate ID
            let ID;
            if ( data.items.length > 0 ) {
                ID = data.items[data.items.length-1].id + 1;
            } else {
                ID = 0;
            }
            
            // Calories to number
            calories = parseInt(calories);
            const newItem = new Item(ID, name, calories);
            
            // Add to Items array
            data.items.push(newItem);

            return newItem;
        },

        updateItem: function(name, calories) {
            // Calories to num
            calories = parseInt(calories);

            // Get the item
            const item = this.getItemById(data.currentItem.id);
            
            // Update the item data
            item.name = name;
            item.calories = calories;
            return item;
        },

        deleteItem: function(id) {
            data.items = data.items.filter( item  => item.id !== id);
        },

        getCurrentItem: function() {
            return data.currentItem;
        },

        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        logData: function() {
            return data;
        }
    };
})();

// UI Ctrl
const UICtrl = (function() {

    // 
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        nameInput: '#item-name',
        caloriesInput: '#item-calories',
        totalCaloriesContainer: '.total-calories'
    };
    
    // PUBLIC METHODS
    return {
        populateItemList: function(items) {
            const listContainer = document.querySelector(UISelectors.itemList);
            let html = '';

            items.forEach( (item) => {
                html+= `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-edit"></i>
                    </a>
                </li>
                `;
            });
            listContainer.innerHTML = html;
        },

        clearEditState: function() {
            UICtrl.clearInputFields();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        getUISelectors: function() {
            return UISelectors;
        },

        getformInput: function() {
            return {
                name: document.querySelector(UISelectors.nameInput).value.trim(),
                calories: document.querySelector(UISelectors.caloriesInput).value.trim()
            };
        },

        addListItem: function(item) {
            // Create li elment
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.setAttribute('id', `item-${item.id}`);
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-edit"></i>
                </a>
            `;

            const listContainer = document.querySelector(UISelectors.itemList);
            listContainer.appendChild(li);
            console.log('Done');

        },

        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn nodelist to array
            listItems = Array.from(listItems);

            listItems.forEach( listItem => {
                const itemId = listItem.getAttribute('id');
                if ( itemId == `item-${item.id}` ) {
                    document.querySelector(`#${itemId}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-edit"></i>
                        </a>
                    `;
                }
            });
        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        addItemToForm: function() {
            document.querySelector(UISelectors.nameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.caloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },

        updateTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCaloriesContainer).innerText = totalCalories;
        },

        clearInputFields: function() {
            document.querySelector(UISelectors.nameInput).value = '';
            document.querySelector(UISelectors.caloriesInput).value = '';
        }
    };
})();

// App Ctrl
const App = (function(ItemCtrl, UICtrl) {

    // Load event listeners
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getUISelectors();
        
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        
        // Disable submit on 'enter'
        document.addEventListener('keypress', e => {
            if ( e.keyCode == 13 || e.which == 13 ) {
                e.preventDefault();
                return false;
            }
        });
        // Edit Icon click even
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateClick);

        // Update Item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete Item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back Event
        document.querySelector(UISelectors.backBtn).addEventListener('click', backClick);
    };

    const itemAddSubmit = function(e) {
        e.preventDefault();
        
        // Get form input from UICtrl
        const input = UICtrl.getformInput();
        
        // Validate name and calories
        if ( input.name == '' || input.calories == '' ) { return false; }

        // AddItem
        const newItem = ItemCtrl.addItem(input.name, input.calories);

        // Add Item to UI List
        UICtrl.addListItem(newItem);

        // Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Update the Total Calories in UI
        UICtrl.updateTotalCalories(totalCalories);

        // Clear UI Input
        UICtrl.clearInputFields();
    };

    const itemUpdateClick = function(e) {
        e.preventDefault();
        if ( !e.target.classList.contains('edit-item') ) return;

        // get the list item id
        const listId = e.target.parentNode.parentNode.id;

        // clear out the id
        const id = parseInt(listId.split('-')[1]);

        // Get Item 
        const itemToEdit = ItemCtrl.getItemById(id);
        
        // Set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        // Add item to form
        UICtrl.addItemToForm();

    };

    const itemUpdateSubmit = function(e) {
        e.preventDefault();
        // Get item input
        const input = UICtrl.getformInput();
        
        // Update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Update the Total Calories in UI
        UICtrl.updateTotalCalories(totalCalories);

        UICtrl.clearEditState();
    };

    const itemDeleteSubmit = function(e) {
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();
        
        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Update UI
        UICtrl.deleteListItem(currentItem.id);

        // Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        
        // Update the Total Calories in UI
        UICtrl.updateTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    };

    const backClick = function(e) {
        UICtrl.clearEditState();
        e.preventDefault();
    };
    
    // PUBLIC METHODS
    return {
        init: function() {
            console.log('init app');

            // Clear Edit State
            UICtrl.clearEditState();
            
            // Fetch Items from datastructure
            const items = ItemCtrl.getItems();

            // Populate list with items
            UICtrl.populateItemList(items);

            // Get totalCalories
            const totalCalories = ItemCtrl.getTotalCalories();
            
            // Update totalCalories in UI
            UICtrl.updateTotalCalories(totalCalories);

            // Load Event listeners
            loadEventListeners();
        }
    };

})(ItemCtrl, UICtrl);

App.init();