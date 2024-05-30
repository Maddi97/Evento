from flask import Flask
from flask_cors import CORS
from flask import request
from flask import jsonify
import requests
import re
from bs4 import BeautifulSoup
from datetime import datetime
import pandas as pd
import os


app = Flask(__name__)
CORS(app, origins=["http://localhost:4201","http://192.168.0.112","http://192.168.0.112:3000","http://192.168.0.112:4200","capacitor://localhost",
                   "ionic://localhost","http://localhost","http://localhost:8080","http://localhost:8100","http://localhost:4200","http://localhost:4201",
                   "https://insert.evento-leipzig.de","https://insert.staging.evento-leipzig.de","https://evento-leipzig.de","https://staging.evento-leipzig.de",
                   "https://www.evento-leipzig.de","https://www.staging.evento-leipzig.de","https://backend.evento-leipzig.de",
                   "https://backend.staging.evento-leipzig.de"])  # Enable CORS for all routes

directory = 'datasets'
csv_file_path_linklist = os.path.join(directory, 'linklist.csv')
csv_file_path_event_details = os.path.join(directory, 'event_details.csv')

if not os.path.exists(directory):
    os.makedirs(directory)
    print(f"Directory '{directory}' created.")
    
@app.route('/storeLinklist', methods=['POST'])
def storeLinklist():
    try:
        # Get data from the request body
        data = request.get_json()
        # Extract url and linklist from the data
        url = data.get('url')
        linklist = data.get('linklist')
        print(f"store linklist: {linklist}")
        mybytes = requests.get(url).text
        soup = BeautifulSoup(mybytes, 'html.parser')
        [x.extract() for x in soup.findAll('script')]

        # Find the <body> tag and extract its content
        pagefilling = ''.join(['%s' % x for x in soup.body.contents]) 
        data = {
                'url': [url],
                'date': [datetime.now()],
                'html_content': [pagefilling],
                'linklist': [str(linklist)]
            }
        df = None
        if os.path.exists(csv_file_path_linklist):
            # If the CSV file exists, read it into a DataFrame
            df = pd.read_csv(csv_file_path_linklist)
            new_data_df = pd.DataFrame(data)
            df = pd.concat([df, new_data_df], ignore_index=True)

            print(f"CSV file exists. DataFrame loaded from {csv_file_path_linklist}")
        else:
            # If the CSV file does not exist, create a new DataFrame
            df = pd.DataFrame(data)
            # Save the DataFrame as a CSV file
        df.to_csv(csv_file_path_linklist, index=False)
        print("DF saved")

        return jsonify({'message': 'Linklist Data received successfully'})
    except Exception as e:
        print(f"An error occured while storing linklist: \n\n {e}")

@app.route('/storeEventDetails', methods=['POST'])
def storeEventDetails():
    try:
        data = request.get_json()
        
        # Extract url and linklist from the data
        events = data.get('events')
        data_rows = []
        for event in events:
            print(f"store event: {event['link']}")
            url = event["link"]
            del event["link"]
            mybytes = requests.get(url).text
            soup = BeautifulSoup(mybytes, 'html.parser')
            [x.extract() for x in soup.findAll('script')]

            # Find the <body> tag and extract its content
            pagefilling = ''.join(['%s' % x for x in soup.body.contents]) 
            data = {
                    'url': url,
                    'date': datetime.now().strftime("%m/%d/%Y"),
                    'html_content': pagefilling,
                    'event_details': str(event)
                }
            data_rows.append(data)
        df = None
        if os.path.exists(csv_file_path_event_details):
            # If the CSV file exists, read it into a DataFrame
            df = pd.read_csv(csv_file_path_event_details)
            new_data_df = pd.DataFrame(data_rows)
            df = pd.concat([df, new_data_df], ignore_index=True)

            print(f"CSV file exists. DataFrame loaded from {csv_file_path_event_details}")
        else:
            # If the CSV file does not exist, create a new DataFrame
            df = pd.DataFrame(data_rows)
            # Save the DataFrame as a CSV file
        df.to_csv(csv_file_path_event_details, index=False)
        print("DF saved")

        return jsonify({'message': 'Data event details received successfully'})
    except Exception as e:
        print(f"An error occured while storing event details: \n\n {e}")

if __name__ == "__main__":
  app.run(port=3001)