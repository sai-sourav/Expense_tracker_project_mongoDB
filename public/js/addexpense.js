const message = document.getElementById("exists");
const container = document.getElementById('popup-container');
const premiumcontainer = document.getElementById('popup-container-premium');
const close = document.getElementById('close');
const closepremium = document.getElementById('closepremium');
const addexpensebtn = document.getElementById('addexpensebtn');
const expenses_list = document.getElementById('expenses-list');
const saveexpensebtn = document.getElementById('saveexpense');
const premiumaccountbtn = document.getElementById('premium');
const proceedtopayment = document.getElementById('payment');
const darkmode = document.getElementById('darkmode');
const token = localStorage.getItem('token');
const toggleswitch = document.getElementById("toggle");
const headers = { 
    headers: {
        'Authorization' : token
    }
}

let payment_success = "";

const IP = "localhost";

premiumaccountbtn.addEventListener("click", (e)=>{
    e.preventDefault();
    premiumcontainer.classList.add("active");
});

proceedtopayment.addEventListener("click", async (e)=> {
    e.preventDefault();
    const response  = await axios.get(`http://${IP}:4000/premiummembership`,headers);
    var options =
    {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
         "name": "Test Company",
         "order_id": response.data.order.id, // For one time payment
        "prefill": {
            "name": "Test User",
            "email": "test.user@example.com",
            "contact": "7003442036"
        },
        "theme": {
            "color": "#3399cc"
        },
        // This handler function will handle the success payment
        "handler": function (response) {
            axios.post(`http://${IP}:4000/updatetransactionstatus`,{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, headers).then(() => {
                alert('You are a Premium User Now')
                location.reload();
            }).catch(() => {
                alert('Something went wrong. Try Again!!!')
            })
        },
    };
    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', function (response){
        alert("payment failed");
    });
})




close.addEventListener("click", (e)=> {
    e.preventDefault();
    container.classList.remove("active");
    premiumcontainer.classList.remove("active");
});

closepremium.addEventListener("click", (e)=> {
    e.preventDefault();
    premiumcontainer.classList.remove("active");
});

addexpensebtn.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active");
})

document.addEventListener("DOMContentLoaded", getexpenses);

async function getexpenses(){
    expenses_list.innerHTML = "";
    try{
        let response = await axios.get(`http://${IP}:4000/expenses`, headers);
        response = response.data;
        showexpenses(response.expenses);
        ispremiumuser(response.ispremiumuser);
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
        headers);
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
            headers)
            getexpenses();
        } catch(err){
            if(err){
                console.log(err.response);
            }
        }

    }
});
const cont = document.getElementById('container');
// expenses_list
// close
const inputfield = document.getElementById('amount');
const descfield = document.getElementById('desc');
const expenseform = document.getElementById('expenseform');
const categoryfield = document.getElementById('category');
const labels = document.getElementsByTagName('label');
const formtitle = document.getElementById("formtitle");

// console.log(divs);
function ispremiumuser(bool) {
    if (bool === true){
        darkmode.classList.add("show");
        cont.classList.add("dark");
        expenses_list.classList.add("dark");
        expenseform.classList.add("dark");
        close.classList.add("dark");
        inputfield.classList.add("dark");
        descfield.classList.add("dark");
        categoryfield.classList.add('dark');
        for(i=0; i<labels.length; i++){
            labels[i].classList.add("dark");
        }
        for(i=0; i<expenses.length; i++){
            expenses[i].classList.add("dark");
        }
        formtitle.classList.add("dark");
    }else {
        premiumaccountbtn.classList.add("show");
    }
}

toggleswitch.addEventListener("change", function() { 
    if (this.checked) {
        darkmode.classList.add("show");
        cont.classList.add("dark");
        expenses_list.classList.add("dark");
        expenseform.classList.add("dark");
        close.classList.add("dark");
        inputfield.classList.add("dark");
        descfield.classList.add("dark");
        categoryfield.classList.add('dark');
        for(i=0; i<labels.length; i++){
            labels[i].classList.add("dark");
        }
        formtitle.classList.add("dark");
    } else {
        cont.classList.remove("dark");
        expenses_list.classList.remove("dark");
        expenseform.classList.remove("dark");
        close.classList.remove("dark");
        inputfield.classList.remove("dark");
        descfield.classList.remove("dark");
        categoryfield.classList.remove('dark');
        for(i=0; i<labels.length; i++){
            labels[i].classList.remove("dark");
        }
        formtitle.classList.remove("dark");
    }
})