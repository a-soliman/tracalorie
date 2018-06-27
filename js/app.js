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

    return {
        logData: function() {
            return data;
        }
    };
})();

// UI Ctrl
const UICtrl = (function() {
    
})();

// App Ctrl
const App = (function(ItemCtrl, UICtrl) {
    return {
        init: function() {
            console.log('init app');
        }
    };

})(ItemCtrl, UICtrl);

App.init();