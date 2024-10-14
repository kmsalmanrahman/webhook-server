const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, '..', 'data', 'webhookResponses.json');

const readJsonFile = () => {
  try {
    const data = fs.readFileSync(jsonFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJsonFile = (data) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
};

const handleWebhook = (req, res) => {
  console.log('Webhook received!');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  const responses = readJsonFile();

  const newEntry = {
    id: responses.length + 1,
    body: req.body,
  };

  responses.push(newEntry);
  writeJsonFile(responses);

  res.status(200).json({ 
    message: 'Webhook received successfully!', 
    responseHeader: req.headers, 
    responseBody: req.body 
  });
};
const getWebhookResponses = (req, res) => {
  const responses = readJsonFile().reverse();

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const totalResponses = responses.length;
  const totalPages = Math.ceil(totalResponses / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResponses = responses.slice(startIndex, endIndex);

  let html = `
    <html>
      <head>
        <title>Webhook Responses</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          table, th, td { border: 1px solid black; }
          th, td { padding: 8px; text-align: left; }
        </style>
        <script src="/socket.io/socket.io.js"></script>
        <script>
          // Connect to WebSocket
          const socket = io();
          let unreadCount = 0;
          let originalTitle = document.title;

          // Function to update the page title with unread webhook count
          function updateTitle() {
            if (document.hidden) {
              document.title = \`(\${unreadCount}) New Webhooks - Webhook Responses\`;
            } else {
              document.title = originalTitle;
              unreadCount = 0; // Reset count when the page becomes active
            }
          }

          // Function to fetch and update the table body
          function fetchUpdatedTable() {
            fetch(window.location.href)
              .then(response => response.text())
              .then(html => {
                // Extract only the table body part and replace the current one
                const parser = new DOMParser();
                const newDocument = parser.parseFromString(html, 'text/html');
                const newTableBody = newDocument.querySelector('tbody').innerHTML;
                document.querySelector('tbody').innerHTML = newTableBody;
              })
              .catch(err => console.error('Failed to update table:', err));
          }

          // Listen for the 'fileUpdated' event from the server
          socket.on('fileUpdated', () => {
            if (document.hidden) {
              unreadCount++;
            } else {
              // Fetch and update table when the tab is active
              fetchUpdatedTable();
            }
            updateTitle();
          });

          // Detect when the page is active or inactive
          document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
              fetchUpdatedTable(); // Refresh table when user comes back to the page
            }
            updateTitle();
          });
        </script>
      </head>
      <body>
        <h1>Webhook Responses - Page ${page}</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
  `;

  paginatedResponses.forEach(response => {
    html += `
      <tr>
        <td>${response.id}</td>
        <td>
          <pre>${JSON.stringify(response.body, null, 2)}</pre>
        </td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
        <div>
          <p>Page ${page} of ${totalPages}</p>
  `;

  if (page > 1) {
    html += `<a href="?page=${page - 1}">Previous</a>`;
  }

  if (page < totalPages) {
    html += ` <a href="?page=${page + 1}">Next</a>`;
  }

  html += `
        </div>
      </body>
    </html>
  `;

  res.send(html);
};
  
  
module.exports = { handleWebhook, getWebhookResponses };
  
