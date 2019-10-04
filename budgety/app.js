//BUDGET CONTROLLER
let budgetController = (function() {

    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };


    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };


    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };


    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type) {
        let sum = 0;
            data.allItems[type].forEach(function(cur){
                sum += cur.value;
            });

            data.totals[type] = sum;
    };

    let data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item based
            if ( type === 'expense' ) {
                newItem = new Expense(ID, des, val);
            } else if ( type === 'income' ){
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);

            // return new element
            return newItem;

        },

        deleteItem: function(type, id){
            let ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('expense');
            calculateTotal('income');


            //calculate the budget: income - expenses
            data.budget = data.totals.income - data.totals.expense;

            //calculate the percentage of income that we spent
            if ( data.totals.income > 0 ) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentages: function() {

            data.allItems.expense.forEach(function(cur) {
               cur.calcPercentage(data.totals.income);
            });
        },


        getPercentages: function() {
            let allPerc = data.allItems.expense.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expense,
                percentage: data.percentage
            }
        },

        // --- Local Storage stuff ---
        storeData: function() {
          localStorage.setItem('data', JSON.stringify(data));
        },

        deleteData: function() {
          localStorage.removeItem('data');
        },

        getStoredData: function() {
          localData = JSON.parse(localStorage.getItem('data'));
          return localData;
        },

        updateData: function(StoredData) {
          data.totals = StoredData.totals;
          data.budget = StoredData.budget;
          data.percentage = StoredData.percentage;
        },

        testing: function(){
            console.log(data);
        },
    };

})();



//UI CONTROLLER
let UIController = (function(){

    let DOMStrings = {
        inputType: '#checkbox',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        budgetLabel: '.summary__budget',
        incomeLabel: '.secondary-panel__income-value',
        expensesLabel: '.secondary-panel__expenses-value',
        percentageLabel: '.secondary-panel__expenses-percentage',
        container: '.panel',
        dateLabel: '.summary__month',
        expensesPercLabel: '.panel__item__value-percentage'

     };

     let formatNumber = function(num, type) {
         let numSplit, int, dec;

         num = Math.abs(num);
         num = num.toFixed(2);

         numSplit = num.split('.');

         int = numSplit[0];
         if (int.length > 3) {
             int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
         }

         dec = numSplit[1];

         return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;

     };

     let nodeListForEach = function(list, callback) {
         for (let i = 0; i < list.length; i++) {
             callback(list[i], i);
         }
     };

    return {

        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).checked ? 'expense' : 'income',
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
              var html, newHtml, element;
              //Create HTMl string with placeholder text
              element = DOMStrings.container;

              if (type === 'income') {
                html =
                  '<div class="panel__item panel__item-income" id="income-%id%"><div class="panel__item__details"><div class="panel__item__details-name">%desc%</div></div><div class="panel__item__value"><div class="panel__item__value-number">%value%</div></div><button class="item__delete--btn"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></button></div>';
              } else if (type === 'expense') {
                html =
                  '<div class="panel__item panel__item-expense" id="expense-%id%"><div class="panel__item__details"><div class="panel__item__details-name">%desc%</div></div><div class="panel__item__value"><div class="panel__item__value-number">%value%</div><div class="panel__item__value-percentage">5%</div></div><button class="item__delete--btn"> <svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></button></div>';
              }

              //Replace Placeholder text with data
              newHtml = html.replace('%id%', obj.id);
              newHtml = newHtml.replace('%desc%', obj.description);
              newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

              //Insert the HTML into the DOM
              document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml);
        },

        deleteListItem: function(selectorID) {

            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function(){
            let fields, feildsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            feildsArr = Array.prototype.slice.call(fields);

            feildsArr.forEach(function(current, index, array){
                current.value = "";
            });

            feildsArr[0].focus();

        },

        displayBudget: function(obj) {
            var type;

            obj.budget > 0 ? (type = 'income') : (type = 'expense');

            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'income');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'expense');
            // document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages) {
          var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

          Array.prototype.forEach.call(fields, function(current, index) {
            if (percentages[index] > 0) {
              current.textContent = percentages[index] + '%';
            } else {
              current.textContent = '---';
            }
          });
        },


        displayMonth: function() {
            var now, year, month, months;

            now = new Date();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },


        changedType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue
            );

            Array.prototype.forEach.call(fields, function(current) {
                current.classList.toggle('red');
                current.classList.toggle('red-border');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },

        getDOMString: function(){
            return DOMStrings;
        }
    }

})();


//GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    //Button add
    let setupEventListeners = function(){
        let DOM = UICtrl.getDOMString();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e) {
            if ( e.keyCode === 13 || e.which === 13 ) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);


    };

    let loadData = function() {
        let storedData, newIncItem, newExpItem;

        // 1. load the data from the local storage
        storedData = budgetCtrl.getStoredData();

        if (storedData) {
          // 2. insert the data into the data structure
          budgetCtrl.updateData(storedData);

          // 3. Create the Income Object
          storedData.allItems.income.forEach(function(cur) {
            newIncItem = budgetCtrl.addItem('income', cur.description, cur.value);
            UICtrl.addListItem(newIncItem, 'income');
          });

          // 4. Create the Expense Objects
          storedData.allItems.expense.forEach(function(cur) {
            newExpItem = budgetCtrl.addItem('expense', cur.description, cur.value);
            UICtrl.addListItem(newExpItem, 'expense');
          });

          // 5. Display the Budget
          budget = budgetCtrl.getBudget();
          UICtrl.displayBudget(budget);

          // 6. Display the Percentages
          updatePercentages();
        }
  };

    let updateBudget = function() {
        //1. Calculate budget
        budgetCtrl.calculateBudget();

        //2 return the budget
        let budget = budgetCtrl.getBudget();

        //3 Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    let updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    let ctrlAddItem = function() {
        let input, newItem;
        //1. get the field input data
        input = UICtrl.getInput();

        //check if there is data on fields
       if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. Add the item
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the clearFields
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();

            // 7. save to local storage
            budgetCtrl.storeData();
        }
    };


    let ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();

        }

    };

    return {
        init: function() {
            console.log('application has started.');
            UICtrl.displayMonth();

            UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
            });
            setupEventListeners();
            loadData();
        }
    };

})(budgetController, UIController);

controller.init();
