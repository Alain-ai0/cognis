from fastapi import FastAPI, UploadFile, File
from backend.services.processor import FinanceProcessor
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict
import pandas as pd
import shutil
import os
import time

# Initialize FastAPI application container with strict metadata schemas
app = FastAPI(
    title="Cognis API",
    description="Backend engine for AI-powered financial tracking",
    version="1.0.0"
)

# Stateful engine injection for abstracting machine learning inference tasks
finance_engine = FinanceProcessor()

# Security Layer: Global CORS Configuration Policies
# In production, swap ["*"] for explicit origin allowlists to avoid cross-origin vector exploits.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Deterministic Path Resolution Matrix
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")

# Enforce systemic directory presence on application startup bootstrapping
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Centralized Single Source of Truth (SSOT) data pointer
ACTIVE_FILE = os.path.join(DATA_DIR, "active_transactions.csv")


def process_and_categorize(file_path: str, proc: FinanceProcessor):
    """
    ETL Pipeline Logic Container.
    Handles data ingestion, distributed AI classification, historical merging, 
    and downstream file deduplication.
    """
    try:
        # Ingestion Layer: Stream raw CSV records into a structured Pandas DataFrame
        new_df = pd.read_csv(file_path)
        print(f"--- NEW UPLOAD: {len(new_df)} rows ---")
        
        # Inference Dispatch: Map the description strings across the LLM classification matrix
        new_df['category'] = new_df['description'].apply(proc.get_ai_category)

        # Storage State Reconciliation Strategy
        if os.path.exists(ACTIVE_FILE):
            existing_df = pd.read_csv(ACTIVE_FILE)
            print(f"--- FOUND EXISTING: {len(existing_df)} rows ---")
            
            # Merge vectors across chronological boundaries
            combined_df = pd.concat([existing_df, new_df], ignore_index=True, sort=False)
            
            # Idempotency Guard: Drop compound records using strict transaction signatures
            final_df = combined_df.drop_duplicates(subset=['date', 'description', 'amount'])
        else:
            final_df = new_df

        # Serialization Layer: Commit mutations down to disk
        final_df.to_csv(ACTIVE_FILE, index=False)
        print(f"--- SUCCESS: Data saved to {ACTIVE_FILE} ---")
        return final_df

    except Exception as e:
        print(f"CRITICAL: ETL Pipeline Ingestion Fail: {e}")
        return None
        

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    """
    Asynchronous File Buffer Stream Receiver.
    Writes payload buffers directly to disk storage before handing execution off to the CPU-bound ETL runner.
    """
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Stream writing chunk-by-chunk preserves server memory overhead on oversized multi-megabyte transfers
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Delegate thread management to the data transformation architecture
    process_and_categorize(file_path, finance_engine)
    return {"status": "success"}


@app.get("/transactions")
async def get_transactions():
    """
    Transactional Context Retrieval Engine.
    Reads data states back to the client while enforcing basic type safety policies.
    """
    if os.path.exists(ACTIVE_FILE):
        try:
            df = pd.read_csv(ACTIVE_FILE)
            if df.empty:
                return {"transactions": []}
            
            # Sanitization Step: Eliminate NaN/Null out of records to maintain structural integrity
            df = df.fillna({"amount": 0, "category": "Uncategorized"})
            
            # Convert structured columns into highly indexable JSON records for frontend clients
            return {"transactions": df.to_dict(orient="records")}
        except Exception as e:
            print(f"Read Exception Intercepted: {e}")
            return {"transactions": []}
    return {"transactions": []}
    

@app.delete("/clear-data")
async def clear_data():
    """
    Destructive Storage Truncation Endpoint.
    Overwrites active storage files back to an empty initial frame rather than deleting them,
    saving downstream file system allocation steps.
    """
    if os.path.exists(ACTIVE_FILE):
        df = pd.DataFrame(columns=["date", 'description', 'amount', 'category'])
        df.to_csv(ACTIVE_FILE, index=False)
        return {"message": "Data cleared"}
    return {"message": "Nothing to clear"}


@app.get("/subscriptions")
def detect_subscriptions():
    """
    Algorithmic Analytics Engine (Subscription Ghost Detector).
    Isolates recurring vendor expenditures through dynamic array vector analysis.
    Computational Complexity Matrix: Average O(N log N) via grouping heuristics.
    """
    try:
        # FIXED: Replaced brittle relative lookup string with our central SSOT configuration variable
        df = pd.read_csv(ACTIVE_FILE)

        # FIXED: Standardized payload key name to "subscriptions" to map correctly to frontend states
        if df.empty:
            return {"subscriptions": [], "total_monthly_burn": 0.0}

        # Vectorized String Normalization Step: Eradicates trailing whitespaces and case mutations
        df['clean_desc'] = df['description'].str.lower().str.strip()

        # Aggregation Pipeline: Compound reduction tracking occurrence counts and running averages
        grouped = df.groupby('clean_desc').agg(
            count=('amount', 'count'),
            avg_amount=('amount', 'mean'),
            original_name=('description', 'first'),
            category=('category', 'first')
        ).reset_index()

        # Filtering Strategy: Transactions appearing multiple times represent recurring subscription vectors
        subs_df = grouped[grouped['count'] >= 2]

        subscriptions = []
        total_burn = 0.0

        # Transform computed vector matrix rows back into a standard JSON payload format
        for _, row in subs_df.iterrows():
            amount = round(float(row['avg_amount']), 2)
            total_burn += amount
            subscriptions.append({
                "name": row['original_name'],
                "amount": amount,
                "category": row['category'],
                "frequency": "Monthly"
            })
            
        return {
            "subscriptions": subscriptions,
            "total_monthly_burn": round(total_burn, 2)
        }
    
    except FileNotFoundError:
        return {"subscriptions": [], "total_monthly_burn": 0.0}
    except Exception as e:
        print(f"Analytics Algorithm Crash: {e}")
        return {"error": str(e)}