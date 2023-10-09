import pymongo
import json

mongo_client = pymongo.MongoClient("mongodb+srv://ayashakushwaha:DW1Kuk4tlggaqUTJ@cluster0.85hxlcb.mongodb.net/?retryWrites=true&w=majority")
db = mongo_client["Cluster0"]
collection = db["blackcoffer_data"]

with open("jsondata.json", "r") as json_file:
    data = json.load(json_file)
    
collection.insert_many(data)