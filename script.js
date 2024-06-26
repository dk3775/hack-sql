function checkInput() {
  var inputText = document.getElementById("inputText").value;
  var submitButton = document.getElementById("submitButton");

  if (inputText.trim() !== "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

let i = 0;
const loaderElement = document.getElementById('loader');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

function addUserMessage(message) {
  const userMessage = document.createElement('div');
  userMessage.className = 'message user-message';
  userMessage.textContent = message;
  chatMessages.appendChild(userMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
  const botMessage = document.createElement('div');
  botMessage.className = 'message bot-message';

  // const response = JSON.parse(messageWithLineBreaks);
  console.log(message);
  let filtered = sqlFilter(message.completion);

  botMessage.innerText = filtered;

  const copyButton = createCopyButton(filtered);
  // const runButton = createRunButton(filtered);
  // botMessage.appendChild(runButton);



  // Extract the SQL query from the JSON response


  // Append the copy button to the bot message div
  botMessage.appendChild(copyButton);

  // Append the bot message div to the chat messages container
  chatMessages.appendChild(botMessage);

  // Scroll to the bottom of the chat messages container
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
// Function to create a copy button
// function createRunButton(message) {
//   const runButton = document.createElement('run');
//   runButton.innerHTML = '<i class="fa fa-rocket"></i>';
//   runButton.className = 'class-button run-button';

//   // Add click event listener to copy the message to clipboard
//   runButton.addEventListener('click', function () {
//     const sqlRegex = /(SELECT|UPDATE|INSERT|DELETE|CREATE|DROP|ALTER|SET|SHOW|DESCRIBE|USE)\b[\s\S]+?;/i;
//     // Extract SQL query from the NLP response
//     const match = message.match(sqlRegex);
//     const sqlQuery = match ? match[0] : '';

//     navigator.clipboard.writeText(sqlQuery)
//       .then(() => {
//         alert('Query running');
//       })
//       .catch(error => {
//         console.error('Error running query:', error);
//       });
//   });

//   return runButton;
// }

// Function to create a copy button
function createCopyButton(message) {
  const copyButton = document.createElement('button');
  copyButton.innerHTML = '<i class="fa fa-copy"></i>';
  copyButton.className = 'copy-button';

  // Add click event listener to copy the message to clipboard
  copyButton.addEventListener('click', function () {
    const sqlRegex = /(SELECT|UPDATE|INSERT|DELETE|CREATE|DROP|ALTER|SET|SHOW|DESCRIBE|USE)\b[\s\S]+?;/i;
    // Extract SQL query from the NLP response
    const match = message.match(sqlRegex);
    const sqlQuery = match ? match[0] : '';

    navigator.clipboard.writeText(sqlQuery)
      .then(() => {
        alert('Message copied to clipboard');
      })
      .catch(error => {
        console.error('Error copying message to clipboard:', error);
      });
  });

  return copyButton;
}

function sqlFilter(message) {
  message = message.replace(/```sql|```/g, '');

  // Parse newlines correctly
  message = message.replace(/\\n/g, '<br>');

  console.log(message);

  return message;
}

function clearChat() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = ''; // Remove all messages
}

document.getElementById('submitButton').addEventListener('click', clearChat);

// function createCopyButton(message) {
//   const copyButton = document.createElement('button');
//   copyButton.className = 'copy-button';
//   copyButton.innerHTML = '<i class="fa fa-copy"></i>'
//   copyButton.addEventListener('click', function() {
//     navigator.clipboard.writeText(message);
//     alert('Message copied to clipboard: ' + message);
//   });
//   return copyButton;
// }

// function handleUserInput() {
//   const message = userInput.value.trim();
//   if (message !== '') {
//     addUserMessage(message);
//     addBotMessage(message);
//     userInput.value = '';
//   }
// }

//   document.getElementById('submitButton').addEventListener('click', function() {
//     var schema = document.getElementById('inputText').value;
//     fetch('http://localhost:3000/add-schema', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ schema: schema })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         // Handle response data if needed
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// });
$(document).ready(function () {
  document.getElementById('submitButton').addEventListener('click', function () {
    var schema = document.getElementById('inputText').value;
    console.log(schema);
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/add-schema',
      contentType: 'application/json', // Set content type to JSON
      data: JSON.stringify({ schema: schema }), // Convert data to JSON format
      success: function (data) {
        console.log(data);
        // Handle response data if needed
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  });
});

function waitForAllElementsToExist(elementClass) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      const elements = document.getElementsByClassName(elementClass);
      if (elements.length > i) {
        clearInterval(intervalId);
        resolve(elements);
      }
    }, 100); // Check every 100 milliseconds
  });
}

$('#user-input').on('keypress', function (event) {
  if (event.key === 'Enter') {
    loaderElement.style.display = 'inline-block';
    let message = $('#user-input').val().trim();
    addUserMessage(message);
    userInput.value = '';
    if (message !== '') {
      $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/get-completion',
        contentType: 'application/json', // Set content type to JSON
        data: JSON.stringify({ prompt: message }), // Convert data to JSON string
        xhrFields: {
          withCredentials: true // Include cookies in the request
        },
        crossDomain: true, // Enable cross-domain requests
        success: function (data) {
          addBotMessage(data);
          $('#user-input').val('');
          waitForAllElementsToExist('bot-message').then((newElements) => {
            // Once all elements exist, hide the loader
            loaderElement.style.display = 'none';
            i = newElements.length;
          });
        }
      });
    }
  }
});
