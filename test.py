from openai import OpenAI
client = OpenAI(
    base_url='http://localhost:11434/v1/',
    api_key='ollama',  # required but ignored
)

def add_schema(schema):
    schema=str(schema)+"\n your goal is to provide SQL query for the task given in the prompt."
    print(schema)
    chat_completion = client.chat.completions.create(
    messages=[
            {
                'role': 'system',
                'content': schema
            }
        ],
        model='codeqwen',
    )
    
def get_completion(prompt):
    chat_completion = client.chat.completions.create(
    messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ],
        model='codeqwen',
    )
    return chat_completion.choices[0]

def system():
    schema = input("Enter schema: ")
    add_schema(schema)
    print("Schema added successfully")
    
    while True:
        prompt = input("User: ")
        if prompt == "exit":
            break
        completion = get_completion(prompt)
        print("Bot: ", completion)
        
system()