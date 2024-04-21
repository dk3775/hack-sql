import ollama
from flask import Flask, jsonify, request

modelfile="""
FROM llama3

SYSTEM You are supposed to return SQL queries from the schema provided to you only. Respond 
'out of context' if question is out of context from the schema provided. Note that if you don't find the answer in the schema, you should respond 'out of context'.
you are not supposed to answer questions that are not related to the schema provided to you.
"""

ollama.create(model='llama3-custom-itn', modelfile=modelfile)

app = Flask(__name__)

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
    response = ollama.chat(model='llama3-custom-itn', messages=message)
    return response['message']['content']

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
