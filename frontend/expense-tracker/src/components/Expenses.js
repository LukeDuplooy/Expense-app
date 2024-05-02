import React, {useEffect, useState} from 'react';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [addedAmount, setAddedAmount] = useState(0);
    const [newExpense, setNewExpense] = useState({
        type: '',
        amount: 0,
        emoji: '',
    });

    useEffect(() => {
        fetch('http://localhost:8000/expenses')
            .then(response => response.json())
            .then(data => setExpenses(data))
            .catch(error => console.error('Error fetching expenses:', error));

        fetch('http://localhost:8000/total-amount')
            .then(response => response.json())
            .then(data => setTotalAmount(data.total_amount))
            .catch(error => console.error('Error fetching total amount:', error));
    }, []);

    const handleAddMoney = () => {
        fetch('http://localhost:8000/add-money', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: addedAmount,
            }),
        })
            .then(() => {
                setTotalAmount(totalAmount + addedAmount);
                setAddedAmount(0);
            })
            .catch(error => console.error('Error adding money:', error));
    };

    const handleAddExpense = () => {
        fetch('http://localhost:8000/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: newExpense.type,
                amount: newExpense.amount,
                emoji: newExpense.emoji,
                timestamp: new Date().toISOString(), // Include current timestamp in ISO format
            }),
        })
            .then(response => response.json())
            .then(data => {
                setExpenses([...expenses, data]);
                setTotalAmount(totalAmount - newExpense.amount); // Subtract the new expense amount from the total amount
                setNewExpense({type: '', amount: 0, emoji: ''});
            })
            .catch(error => console.error('Error adding expense:', error));
    };


    return (
        <div>
            <h1>Expenses</h1>
            <p>Total Amount: ${totalAmount}</p>
            <ul>
                {expenses.map(expense => (
                    <li key={expense.id}>
                        {expense.type}: ${expense.amount} {expense.emoji && <span>{expense.emoji}</span>}
                    </li>
                ))}
            </ul>
            <div>
                <h2>Add Money</h2>
                <input
                    type="number"
                    value={addedAmount}
                    onChange={e => setAddedAmount(parseFloat(e.target.value))}
                />
                <button onClick={handleAddMoney}>Add</button>
            </div>
            <div>
                <h2>Add Expense</h2>
                <input
                    type="text"
                    placeholder="Type"
                    value={newExpense.type}
                    onChange={e => setNewExpense({...newExpense, type: e.target.value})}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                />
                <input
                    type="text"
                    placeholder="Emoji"
                    value={newExpense.emoji}
                    onChange={e => setNewExpense({...newExpense, emoji: e.target.value})}
                />
                <button onClick={handleAddExpense}>Add</button>
            </div>
        </div>
    );
}

export default Expenses;
