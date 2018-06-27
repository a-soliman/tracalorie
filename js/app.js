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

        logData: function() {
            return data;
        }
    };
})();

// UI Ctrl
const UICtrl = (function() {
    
    // PUBLIC METHODS
    return {
        populateItemList: function(items) {
            const listContainer = document.querySelector('#item-list');
            let html = '';

            items.forEach( (item) => {
                html+= `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="fa fa-edit"></i>
                    </a>
                </li>
                `;
            });
            listContainer.innerHTML = html;
        }
    };
})();

// App Ctrl
const App = (function(ItemCtrl, UICtrl) {
    
    // PUBLIC METHODS
    return {
        init: function() {
            console.log('init app');
            
            // Fetch Items from datastructure
            const items = ItemCtrl.getItems();

            // Populate list with items
            UICtrl.populateItemList(items);

        }
    };

})(ItemCtrl, UICtrl);

App.init();