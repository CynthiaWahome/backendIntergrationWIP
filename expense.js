document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cynthia');
    form.addEventListener('submit',async(e) => {
        e.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const category = document.getElementById('expense-category').value;
        const amount = document.getElementById('expense-amount').value;
        const date = document.getElementById('expense-date').value;
        const authMessage = document.getElementById('auth-msg')
        try{
            const response = await fetch('http://localhost:4000/api/addExpense',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({expenseName, category, amount, date})
            });
            const data = await response.json();
            console.log(data)
            if(response.ok){
                alert(data.message);
                authMessage.textContent = data.message;
            }else{
                alert(data.message);
                authMessage.textContent = data.message;
            }
        }catch(err){
            authMessage.textContent = err;
        }
    });
});
