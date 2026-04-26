from fastapi import FastAPI, UploadFile, File
from processor import FinanceProcessor
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import shutil
import os
import time


app = FastAPI()
finance_engine = FinanceProcessor()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)
UPLOAD_DIR = "../data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def process_and_categorize(file_path: str, proc: FinanceProcessor):
    try:
        # 1. Load and Categorize New Data
        new_df = pd.read_csv(file_path)
        print(f"--- NEW UPLOAD: {len(new_df)} rows ---")
        
        new_df['category'] = new_df['description'].apply(proc.get_ai_category)

        active_path = os.path.join(DATA_DIR, "active_transactions.csv")
        
        # 2. Check for Existing Data
        if os.path.exists(active_path):
            try:
                existing_df = pd.read_csv(active_path)
                print(f"--- FOUND EXISTING: {len(existing_df)} rows ---")
                
                # Combine
                combined_df = pd.concat([existing_df, new_df], ignore_index=True, sort=False)
                
                # De-duplicate
                final_df = combined_df.drop_duplicates(subset=['date', 'description', 'amount'])
                print(f"--- MERGE COMPLETE: Total rows now {len(final_df)} ---")
            except Exception as merge_err:
                print(f"Merge failed, falling back to new data only: {merge_err}")
                final_df = new_df
        else:
            print("--- NO EXISTING FILE: Starting fresh ---")
            final_df = new_df

        # 3. Final Save
        final_df.to_csv(active_path, index=False)
        print(f"--- FILE SAVED TO: {active_path} ---")
        return final_df

    except Exception as e:
        print(f"Critical Pipeline Error: {e}")
        return None
        

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    # creating the path to save the file
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save the file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Triger the ai pipeline
    # This turns the raw CSV into a categorized "Active" file
    process_and_categorize(file_path, finance_engine)
    return {
        "message": "AI Categorization Complete",
        "filename": file.filename,
        "status": "success"
    }


@app.get("/transactions")
async def get_transactions():
    # Always read from the 'active' file created by the pipeline
    active_path = os.path.join(DATA_DIR, "active_transactions.csv")
    if os.path.exists(active_path):
        df = pd.read_csv(active_path)
        # Handle empty amounts or NaNs just in case
        df = df.fillna({"amount": 0, "category": "Uncategorized"})
        return {"transactions": df.to_dict(orient="records")}
    return {"transactions": []}