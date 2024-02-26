onStart();
var amount = document.getElementById('amt');
var description = document.getElementById('desc');
var category = document.getElementById('category');
let btn = document.getElementById('submit');
let display = document.getElementById('display');
btn.addEventListener('click', addExpense);


async function addExpense(e) {
    e.preventDefault();
    try{
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
        axios.get(`http://localhost:3000/delete/${id}`)
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