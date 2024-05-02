from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Sample data
class Expense(BaseModel):
    id: int
    type: str
    amount: float
    timestamp: datetime
    emoji: str = ""  # Add an emoji field with default value ""

expenses_db = [
    Expense(id=1, type="Groceries", amount=50.00, timestamp=datetime.utcnow(), emoji="🛒"),
    Expense(id=2, type="Transportation", amount=25.00, timestamp=datetime.utcnow(), emoji="🚗"),
]

total_amount = 500.00  # Starting total amount

# Endpoint to get all expenses
@app.get("/expenses", response_model=List[Expense])
async def read_expenses():
    return expenses_db

# Endpoint to add a new expense
@app.post("/expenses", response_model=Expense, status_code=201)
async def create_expense(expense: Expense):
    global total_amount
    if expense.amount > total_amount:
        raise HTTPException(status_code=400, detail="Expense amount exceeds total amount")
    total_amount -= expense.amount
    expense_with_id = expense.dict()
    expense_with_id["id"] = len(expenses_db) + 1
    expenses_db.append(expense_with_id)
    return expense_with_id

# Endpoint to add money
@app.post("/add-money", status_code=200)
async def add_money(amount: float):
    global total_amount
    total_amount += amount
    return {"message": f"Added {amount} to total amount"}

# Endpoint to get total amount
@app.get("/total-amount", status_code=200)
async def get_total_amount():
    global total_amount
    return {"total_amount": total_amount}
