onStart();
window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        const token = localStorage.getItem('token')
        const res  = await axios.get('http://localhost:3000/data',{headers:{"Authorization":token}});

       
        for (let i = 0; i < res.data.length; i++) {
            let id = res.data[i].id;
            let exp = `${res.data[i].amount}-${res.data[i].description}-${res.data[i].category}`;
            displayOnScreen(id, exp)
        }
    }
    catch(err){
        console.log(err)
    }
})
var amount = document.getElementById('amt');
var description = document.getElementById('desc');
var category = document.getElementById('category');
let btn = document.getElementById('submit');
let display = document.getElementById('display');
btn.addEventListener('click', addExpense);


//Razorpay integraton

document.getElementById('rzp-button1').onclick = async function(e){
    let flag=false;
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/createorder',{headers:{"Authorization":token}});

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.orderid, 
        "amount": response.data.amount,
        "currency": response.data.currency,
        "name": "Buy premium",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "theme": {
            "color": "#3399cc"
        },
        //handler will be executed if transaction is successful
        "handler" : async function(response){
        await axios.post('http://localhost:3000/purchase/checkout', {
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
        status:"successful"
        }, {headers:{"Authorization":token}})

        alert("You are a premium user now")
        },
    };

    //if transaction successful
    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    //if transaction failed
    rzp1.on('payment.failed',async function (response){
        alert("payment failed try again later");
        console.log("resssp => "+JSON.stringify(response.error.metadata))

        await axios.post('http://localhost:3000/purchase/checkout', {
            order_id: response.error.metadata.order_id,
            payment_id: response.error.metadata.payment_id,
            status:"failed"
    }, {headers:{"Authorization":token}})
    })
}


async function addExpense(e) {
    e.preventDefault();
    try{
        const token = localStorage.getItem('token')
        if(amount.value==''||description.value=='') return false;

        let obj = {
            amount: amount.value,
            description: description.value,
            category: category.value  
        };
        let exp = `${amount.value}  -  ${description.value}  -  ${category.value}`;
    
        const id= await axios.post('http://localhost:3000/', obj,{headers:{"Authorization":token}});
        displayOnExpense(id.data, obj);
    }

    catch(err){
        console.log(err.response);
    }
}

function displayOnScreen(id, expense) {
    let p = `<li id="${id}" style="list-style:none;display:block;height:40px">${expense} <div style="float:right"> 
            <button class="btn btn-secondary btn-sm" style="border-radius:20px; margin-right:10px" onClick="deleteExpense('${id}')">Delete Expense</button>
            <button class="btn btn-secondary btn-sm" style="border-radius:20px" onClick = "editExpense('${id}')">Edit Expense</button>
            </div></li>`;
    display.innerHTML = display.innerHTML + p;
}
function deleteExpense(id) {
    try{
        let elementToRemove = document.getElementById(id);
        // axios.get(`http://localhost:3000/delete/${id}`)
        elementToRemove.remove();
        return axios.get(`http://localhost:3000/delete/${id}`)
    }

    catch(err){
     console.log(err)
    }
}
async function editExpense(id) {
    try{   
        let res = await deleteExpense(id)
        let amt = res.data.amount;
        let des = res.data.description;
        let cat = res.data.category;

        amount.value = amt,
        description.value = des,
        category.value = cat;
    }

    catch(err){
        console.log(err);
    }
}