const message = document.getElementById("exists");
const container = document.getElementById('popup-container');
const premiumcontainer = document.getElementById('popup-container-premium');
const close = document.getElementById('close');
const closepremium = document.getElementById('closepremium');
const addexpensebtn = document.getElementById('addexpensebtn');
const premiumaccountbtn = document.getElementById('premium');
const proceedtopayment = document.getElementById('payment');
const savecreditbtn = document.getElementById('savecredit');
const saveexpensebtn = document.getElementById('saveexpense');
const token = localStorage.getItem('token');
const credits_list = document.getElementById('dailyleft');
const debits_list = document.getElementById('dailyright');
const list_container = document.getElementById('expenses-list');
document.cookie = "witcher=Geralt; SameSite=None; Secure"

const headers = { 
    headers: {
        'Authorization' : token
    }
}

let payment_success = "";

const IP = "localhost";

function openpopupTab(evt, tabname) {
    let i, popuptabcontent, popuptablinks;
    popuptabcontent = document.getElementsByClassName("popup-tabcontent");
  
    for (i = 0; i < popuptabcontent.length; i++) {
      popuptabcontent[i].style.display = "none";
    }
  
    popuptablinks = document.getElementsByClassName("popup-tablinks");
  
    for (i = 0; i < popuptablinks.length; i++) {
      popuptablinks[i].className = popuptablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(tabname).style.display = "block";
    evt.target.classList.add("active");
}

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
                var url = new URL(`http://${IP}:4000/premiumhtml/practice.html`);
                location.replace(url);
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




// close.addEventListener("click", (e)=> {
//     e.preventDefault();
//     container.classList.remove("active");
//     premiumcontainer.classList.remove("active");
// });

closepremium.addEventListener("click", (e)=> {
    e.preventDefault();
    premiumcontainer.classList.remove("active");
});

addexpensebtn.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active");
    // defaultPopuptab("creditform","credittab");
    // document.getElementById("creditdetails").classList.add("show");
    // document.getElementById("credittab").classList.add("active");
})

// function defaultPopuptab(conte,butt){
//     let i, popuptabcontent, popuptablinks;
//     popuptabcontent = document.getElementsByClassName("popup-tabcontent");
  
//     for (i = 0; i < popuptabcontent.length; i++) {
//       popuptabcontent[i].style.display = "none";
//     }
  
//     popuptablinks = document.getElementsByClassName("popup-tablinks");
  
//     for (i = 0; i < popuptablinks.length; i++) {
//       popuptablinks[i].className = popuptablinks[i].className.replace(" active", "");
//     }
  
//     document.getElementById(conte).style.display = "block";
//     document.getElementById(butt).classList.add("active");
// }

document.addEventListener("DOMContentLoaded", getexpenses);
getcredits();

async function getcredits(){
    try{
      container.innerHTML = "";
      let response = await axios.get(`http://${IP}:4000/credits`, headers);
      response = response.data;
      showcredits(response.credits);
    }catch(err){
      if(err !== null){
          console.log(err);
          const div = document.createElement('div');
          div.id = "networkerror";
          div.className = "no-credits global";
          div.innerText = "❌ Something went wrong";
          credits_list.appendChild(div);
      }
    }
}
  
async function getexpenses(){
try{
    container.innerHTML = "";
    let response = await axios.get(`http://${IP}:4000/expenses`, headers);
    response = response.data;
    showexpenses(response.expenses);
    if(type === "date"){
        document.getElementById('dailycredits').innerText = `Total credit: $${response.totalcredits}`;
        document.getElementById('dailydebits').innerText = `Total debit: $${response.totalexpenses}`;
        document.getElementById('dailysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
    }else if(type === "week"){
        document.getElementById('weeklycredits').innerText = `Total credit: $${response.totalcredits}`;
        document.getElementById('weeklydebits').innerText = `Total debit: $${response.totalexpenses}`;
        document.getElementById('weeklysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
    }else if(type === "month"){
        document.getElementById('monthlycredits').innerText = `Total credit: $${response.totalcredits}`;
        document.getElementById('monthlydebits').innerText = `Total debit: $${response.totalexpenses}`;
        document.getElementById('monthlysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
    }
}catch(err){
    if(err){
        console.log(err);
        const div = document.createElement('div');
        div.id = "networkerror";
        div.className = "no-credits global";
        div.innerText = "❌ Something went wrong";
        debits_list.appendChild(div);
    }
}
};

function showexpenses(expenses){
    container.innerHTML = "";
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
            debits_list.appendChild(div);
            const br = document.createElement('br');
            debits_list.appendChild(br);
        }
    }else{
        const div = document.createElement('div');
        div.id = "noexpenses";
        div.className = "no-expenses global";
        div.innerText = "No Expenses to show";
        debits_list.appendChild(div);
    }
  }
  
function showcredits(credits){
    container.innerHTML = "";
    if(credits.length > 0){
      for(i=0; i< credits.length ; i++){
          const credit = credits[i];
          const div = document.createElement('div');
          div.id = `${credit.id}`;
          div.className = "expense-item";
          div.innerHTML = `<h3 class="showamount">Amount spent: $${credit.amount}</h3>
                          <h3 class="showdesc">Description: ${credit.Description}</h3>
                          <h3 class="showcat">Category: ${credit.category}</h3>
                          <button class="delete-credit-button" type='button'>Delete credit</button>`;
           credits_list.appendChild(div);
          const br = document.createElement('br');
          credits_list.appendChild(br);
      }
    }else{
        const div = document.createElement('div');
        div.id = "nocredits";
        div.className = "no-credits global";
        div.innerText = "No Credits to show";
        credits_list.appendChild(div);
    }
}

savecreditbtn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    creditmessage.innerText = "";
    const creditamount = document.getElementById('creditamount').value;
    const creditdesc = document.getElementById('creditdesc').value;
    const creditcategory = document.getElementById('creditcategory').value;

    if(creditamount === "" || creditdesc === "" || creditcategory === ""){
        creditmessage.innerText = "❌ Please fill all the fields";
    }
    else {
        try{
        const result = await axios.post(`http://${IP}:4000/credits`,{
            amount : creditamount,
            Description : creditdesc,
            category : creditcategory
        },
        headers);
        creditmessage.innerText = "✔️ Credit added to your list";
        setTimeout(()=>{
            creditmessage.innerText = "";
        },3000);
        }catch(err){
        if(err){
            console.log(err);
        }
        }
    }
});
  
saveexpensebtn.addEventListener("click", async (evt)=> {
evt.preventDefault();
const amount = document.getElementById('amount').value;
const desc = document.getElementById('desc').value;
const category = document.getElementById('category').value;
debitmessage.innerText = "";
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
    debitmessage.innerText = "✔️ Expense added to your list";
    setTimeout(()=>{
        debitmessage.innerText = "";
    },3000);
}
catch(err){
    if(err.response.data.fields === "empty"){
        debitmessage.innerText = "❌ Please fill all the fields";
    } else {
        debitmessage.innerText = "❌ Something went wrong";
    }
}
})

list_container.addEventListener("click", async (e)=>{
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