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
        addBtn: '.add-btn',
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
    
    // PUBLIC METHODS
    return {
        init: function() {
            console.log('init app');
            
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