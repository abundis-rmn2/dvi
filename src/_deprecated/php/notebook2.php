<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jupyter-like Notebook Clone</title>
    <style>
        /* Add your CSS styles here */
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/3.0.2/marked.min.js"></script>
</head>
<body>
    <div id="notebook">
        <button onclick="addCodeCell()">Add Code Cell</button>
        <div id="codeCellsContainer">
            <!-- Code cells will be dynamically added here -->
        </div>
    </div>
    <button onclick="saveNotebook()">Save Notebook</button>
    <button onclick="loadNotebook()">Load Notebook</button>

    <script>
  let codeCellCount = 0;

  function addCodeCell() {
      codeCellCount++;

      const codeCell = document.createElement('div');
      codeCell.id = `codeCell${codeCellCount}`;

      codeCell.innerHTML = `
      <!-- HTML tab -->
          <div id="htmlTab${codeCellCount}" class="tab">
          <button onclick="toggleTab('htmlTab${codeCellCount}')">HTML</button>
          <textarea id="htmlContent${codeCellCount}" rows="10" cols="50" oninput="renderHTML(${codeCellCount})">
            <!-- Initial HTML content here -->
          </textarea>
          </div>

          <div id="renderedTab${codeCellCount}" class="tab" style="display: none;">
              <button onclick="toggleTab('renderedTab${codeCellCount}')">Rendered HTML</button>
              <div id="renderedContent${codeCellCount}">
                  <!-- Rendered HTML content will be displayed here -->
              </div>
          </div>
          <div id="jsTab${codeCellCount}" class="tab">
              <button onclick="toggleTab('jsTab${codeCellCount}')">JavaScript</button>
              <div id="jsButtons${codeCellCount}">
                  <button onclick="toggleJsEditMode(${codeCellCount})">Toggle Edit Mode</button>
              </div>
              <div id="jsEditor${codeCellCount}">
                  <textarea id="jsContent${codeCellCount}" rows="10" cols="50">
                      // Initial JavaScript code here
                  </textarea>
              </div>
              <div id="jsOutput${codeCellCount}" style="display: none;">
                  <!-- JavaScript output will be displayed here -->
              </div>
          </div>
          <!-- Markdown tab -->
          <div id="markdownTab${codeCellCount}" class="tab" style="display: none;">
              <button onclick="toggleTab('markdownTab${codeCellCount}')">Markdown</button>
              <div id="markdownButtons${codeCellCount}">
                  <button onclick="toggleMarkdownEditMode(${codeCellCount})">Toggle Edit Mode</button>
              </div>
              <div id="markdownEditor${codeCellCount}">
                  <textarea id="markdownContent${codeCellCount}" rows="10" cols="50" oninput="renderMarkdown(${codeCellCount})">
                      <!-- Initial Markdown content here -->
                  </textarea>
              </div>
              <div id="markdownPreview${codeCellCount}" style="display: none;">
                  <div id="renderedMarkdownContent${codeCellCount}">
                      <!-- Rendered Markdown content will be displayed here -->
                  </div>
              </div>
              </div>
          <button onclick="deleteCodeCell(${codeCellCount})">Delete Code Cell</button>
      `;

      document.getElementById('codeCellsContainer').appendChild(codeCell);
  }

  function deleteCodeCell(cellId) {
      const codeCell = document.getElementById(`codeCell${cellId}`);
      codeCell.remove();
  }

  function toggleJsEditMode(cellId) {
      const jsEditor = document.getElementById(`jsEditor${cellId}`);
      const jsOutput = document.getElementById(`jsOutput${cellId}`);
      const jsContent = document.getElementById(`jsContent${cellId}`).value;

      if (jsEditor.style.display === "block") {
          jsEditor.style.display = "none";
          jsOutput.style.display = "block";
          runJavaScript(cellId);
      } else {
          jsEditor.style.display = "block";
          jsOutput.style.display = "none";
      }
  }

  function toggleMarkdownEditMode(cellId) {
      const markdownEditor = document.getElementById(`markdownEditor${cellId}`);
      const markdownPreview = document.getElementById(`markdownPreview${cellId}`);
      const markdownContent = document.getElementById(`markdownContent${cellId}`).value;

      if (markdownEditor.style.display === "block") {
          markdownEditor.style.display = "none";
          markdownPreview.style.display = "block";
          renderMarkdown(cellId);
      } else {
          markdownEditor.style.display = "block";
          markdownPreview.style.display = "none";
      }
  }

  function runJavaScript(cellId) {
      const jsCode = document.getElementById(`jsContent${cellId}`).value;
      try {
          const output = eval(jsCode);
          document.getElementById(`jsOutput${cellId}`).innerHTML = output;
      } catch (error) {
          document.getElementById(`jsOutput${cellId}`).innerHTML = "Error: " + error.message;
      }
      document.getElementById(`jsOutput${cellId}`).style.display = "block";
  }

  function renderHTML(cellId) {
      const htmlContent = document.getElementById(`htmlContent${cellId}`).value;
      document.getElementById(`renderedContent${cellId}`).innerHTML = htmlContent;
  }

  function renderMarkdown(cellId) {
      const markdownContent = document.getElementById(`markdownContent${cellId}`).value;
      document.getElementById(`renderedMarkdownContent${cellId}`).innerHTML = marked(markdownContent);
  }
  // Functionality for toggling tabs, saving/loading notebook, etc. remains the same.
</script>


</body>
</html>
