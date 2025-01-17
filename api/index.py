import pandas as pd
import json
import uvicorn
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware



el_df = pd.read_csv('entrylevel.csv')
ml_df = pd.read_csv('midlevel.csv')

filtered_el = el_df[el_df["Role"].str.contains('engineer', case=False) | el_df["Role"].str.contains('tech', case=False)]
filtered_ml = ml_df[ml_df["Role"].str.contains('engineer', case=False) | ml_df["Role"].str.contains('tech', case=False)]

# print(filtered_el.head(3))
# print(filtered_ml.head(3))

app = FastAPI()

origins = [
    # "chrome-extensions://goaflbcinbleijooddkoogpjdoaecboa",
    "https://www.linkedin.com",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

@app.get("/df/healthcheck")
def healthcheck(payload: dict):
    if ml_df.shape[0] > 0 and el_df.shape[0] > 0:
        return { "status": "READY" }
    return { "status": "NOT_READY"}

@app.put("/job")
def send_job():
    if random.random() < 0.5:
        link = filtered_el["Link"]
    else:
        link = filtered_ml["Link"]
    
    return { "link": link }