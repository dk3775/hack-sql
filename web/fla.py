import ollama
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
cors=CORS(app, resources={r"/*": {"origins": "*"}},supports_credentials=True) 
# Define functions to set and get schema within the application context
def set_schema(schema):
    schema = str(schema) + "\n your goal is to provide SQL query for the task given in the prompt."

def get_schema():
    return schema

def get_completion(schema, prompt):
    message = [
        {
            'role': 'system',
            'content': schema,
        },
        {
            'role': 'user',
            'content': prompt
        }
    ]
    response = ollama.chat(model='codeqwen', messages=message, stream=False)
    # response = {'message': {'content': 'hi'}}
    # response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
    return response['message']['content']

# Define Flask routes within the application context

@app.route('/add-schema', methods=['POST'])
def add_schema_api():
    global schema
    schema = request.json['schema']
    set_schema(schema)
    return jsonify({"message": "Schema added successfully"})

@app.route('/get-completion', methods=['POST'])
def get_completion_api():
    prompt = request.json['prompt']
    schema = get_schema()
    if schema is None:
        return jsonify({"error": "Schema not found"})
    completion = get_completion(schema, prompt)
    return jsonify({"completion": completion})

if __name__ == '__main__':
    app.run(port=3000, debug=True)