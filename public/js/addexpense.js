const message = document.getElementById("exists");
const container = document.getElementById('popup-container');
const close = document.getElementById('close');
const addexpensebtn = document.getElementById('addexpensebtn');
const expenses_list = document.getElementById('expenses-list');
const saveexpensebtn = document.getElementById('saveexpense');

const token = localStorage.getItem('token');

const IP = "localhost";

close.addEventListener("click", (e)=> {
    e.preventDefault();
    container.classList.remove("active");
});

addexpensebtn.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active");
})

document.addEventListener("DOMContentLoaded", getexpenses);

async function getexpenses(){
    expenses_list.innerHTML = "";
    try{
        let response = await axios.get(`http://${IP}:4000/expenses`, 
        { 
            headers: {
                "Authorization" : token
            } 
        });
        response = response.data;
        showexpenses(response.expenses);
    }catch(err){
        if(err){
            console.log(err.response);
            const div = document.createElement('div');
            div.id = "networkerror";
            div.innerText = "❌ Network error";
            expenses_list.appendChild(div);
        }
    }
};

function showexpenses(expenses){
    if(expenses.length > 0){
        for(i=0; i< expenses.length ; i++){
            const expense = expenses[i];
            const div = document.createElement('div');
            div.id = `${expense.id}`;
            div.className = "expense-item";
            div.innerHTML = `<h3 class="showamount">Amount spent: $${expense.amount}</h3>
                            <h3 class="showdesc">Description: ${expense.Description}</h3>
                            <h3 class="showcat">Category: ${expense.category}</h3>
                            <button class="delete-expense-button" type='button'>Delete Expense</button>`;
            expenses_list.appendChild(div);
            const br = document.createElement('br');
            expenses_list.appendChild(br);
        }
    }else{
        const div = document.createElement('div');
        div.id = "noexpenses";
        div.innerText = "No Expenses to show";
        expenses_list.appendChild(div);
    }
}

saveexpensebtn.addEventListener("click", async (e)=> {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const desc = document.getElementById('desc').value;
    const category = document.getElementById('category').value;
    message.innerText = "";
    try{
        const response = await axios.post(`http://${IP}:4000/expenses`,{
            amount : amount,
            Description : desc,
            category : category
        },
        { 
        headers: {
            'Authorization' : token
        }
        });
        document.getElementById('amount').value = "";
        document.getElementById('desc').value = "";
        document.getElementById('category').value = "";
        message.innerText = "✔️ Expense added to your list";
        setTimeout(()=>{
            message.innerText = "";
        },3000)
        getexpenses();
    }
    catch(err){
        if(err.response.data.fields === "empty"){
            message.innerText = "❌ Please fill all the fields";
        } else {
            message.innerText = "❌ Network error";
        }
    }
})

expenses_list.addEventListener("click", async (e)=>{
    e.preventDefault();
    if( e.target.className === "delete-expense-button"){
        const expenseid = e.target.parentNode.id;
        try{
            const response = await axios.post(`http://${IP}:4000/deleteexpense`, {
                expenseid : expenseid
            },
            { 
                headers: {
                    "Authorization" : token
                } 
            })
            getexpenses();
        } catch(err){
            if(err){
                console.log(err.response);
            }
        }

    }
});