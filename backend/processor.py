import pandas as pd
from pydantic import BaseModel
from typing import List
import os

# 1. Define what a "Categorized Transaction" looks like
class Transaction(BaseModel):
    date: str
    description: str
    amount: float
    category: str  # The AI will fill this in

class FinanceProcessor:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self.df = None

    def load_data(self):
        """Load the CSV using Pandas"""
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f" File not found at: {os.path.abspath(self.csv_path)}")
        self.df = pd.read_csv(self.csv_path, sep=",")
        print(f" Loaded {len(self.df)} transactions.")

    def run_simple_logic(self):
        """
        Phase 1: Before we pay for AI, let's make sure we can manipulate the data.
        """

        # Let's add a temporary 'Pending' category to everything
        self.df['category'] = 'Uncategorized'
        return self.df

    def get_ai_category(self, description):
        

# --- Execution Block ---
if __name__ == "__main__":
    PATH_TO_CSV = "../data/transactions.csv"

    processor = FinanceProcessor(PATH_TO_CSV)

    try:
        processor.load_data()

        # 1. Show Total
        total = processor.get_total_spending()
        print(f"Total spending: {total:.2f}")

        # 2. Show expensive stuff
        limit = 20.0
        print(f"\n Items over ${limit}:")
        print(processor.get_expensive_transactions(limit))

    except Exception as e:
        print(f" Error: {e}")

    processor.load_data()
    processed_data = processor.run_simple_logic()

    print(processed_data.head())
