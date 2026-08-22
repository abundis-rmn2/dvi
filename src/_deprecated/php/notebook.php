<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jupyter Notebook Clone</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        #toolbar {
            background-color: #f0f0f0;
            padding: 10px;
            margin-bottom: 10px;
        }

        #notebook {
            padding: 10px;
        }

        .cell {
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
            padding: 10px;
            background-color: #fff;
        }

        .code-cell {
            background-color: #f5f5f5;
        }

        .html-cell {
            background-color: #fef5e7;
        }

        .markdown-cell {
            background-color: #fcfcfc;
        }

        button {
            padding: 5px 10px;
            margin-right: 5px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
        }

        button:hover {
            background-color: #0056b3;
        }

        textarea {
            width: calc(100% - 20px);
            height: 100px;
            margin-bottom: 5px;
            padding: 5px;
            resize: none;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .output {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <div id="toolbar">
        <button onclick="addCodeCell()">Add Code Cell</button>
        <button onclick="addHTMLCell()">Add HTML Cell</button>
        <button onclick="addMarkdownCell()">Add Markdown Cell</button>
        <button onclick="showGlobalScope()">Show Global Scope</button>
        <button onclick="clearNotebook()">Clear Notebook</button>
    </div>

    <div id="notebook"></div>

    <script>
        // Objeto global para compartir variables y funciones entre celdas de código
        const globalScope = {};

        let notebook = document.getElementById('notebook');

        function executeCode(code, outputDiv) {
            try {
                // Ejecutar el código JavaScript en el ámbito global
                let result = (function() {
                    return eval.apply(this, arguments);
                })(code);
                outputDiv.textContent = 'Return: ' + result;
            } catch (error) {
                console.error('Error:', error);
                outputDiv.textContent = 'Error: ' + error.message;
            }
        }

        function renderHTML(html, htmlCell) {
            let renderedHTML = document.createElement('div');
            renderedHTML.className = 'rendered-html';
            renderedHTML.innerHTML = html;

            htmlCell.querySelector('.rendered-html')?.remove();
            htmlCell.appendChild(renderedHTML);
        }

        function addCodeCell(content = '// Write your JavaScript code here') {
            let codeCell = createCelljs('code-cell');
            let tabs = createTabs(['Pseudocode', 'JavaScript'], ['Write your pseudocode here', '// Write your JavaScript code here']);
            codeCell.appendChild(tabs);

            let outputDiv = document.createElement('div');
            outputDiv.className = 'output';
            codeCell.appendChild(outputDiv);

            let runButton = createButton('Run Cell', function() {
                let activeTabTextarea = codeCell.querySelector('.tab-content.active textarea');
                executeCode(activeTabTextarea.value, outputDiv);
            });
            codeCell.appendChild(runButton);

            notebook.appendChild(codeCell);
        }

        function addHTMLCell(content = '<!-- Write your HTML code here -->') {
            let htmlCell = createCell('html-cell', content);
            let renderButton = createButton('Render HTML', function() {
                let textarea = htmlCell.querySelector('textarea');
                let isRendered = textarea.style.display === 'none';
                if (isRendered) {
                    textarea.style.display = 'block';
                    renderButton.textContent = 'Render HTML';
                    htmlCell.querySelector('.rendered-html')?.remove();
                } else {
                    textarea.style.display = 'none';
                    renderButton.textContent = 'Show HTML Code';
                    renderHTML(textarea.value, htmlCell);
                }
            });
            htmlCell.appendChild(renderButton);
            notebook.appendChild(htmlCell);
        }

        function addMarkdownCell(content = 'Type your markdown text here') {
            let markdownCell = createCell('markdown-cell', content);
            notebook.appendChild(markdownCell);
        }

        function createCell(cellClass, content) {
            let cell = document.createElement('div');
            cell.className = 'cell ' + cellClass;

            let textarea = document.createElement('textarea');
            textarea.value = content;
            textarea.addEventListener('input', function() {
                // Almacenar variables locales en el globalScope
                globalScope[cellClass] = this.value;
            });
            cell.appendChild(textarea);

            return cell;
        }

        function createCelljs(cellClass, content) {
            let cell = document.createElement('div');
            cell.className = 'cell ' + cellClass;
;

            return cell;
        }

        function createButton(text, clickHandler) {
            let button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', clickHandler);
            return button;
        }

        function createTabs(tabTitles, tabContents) {
            let tabsContainer = document.createElement('div');
            let tabButtons = document.createElement('div');
            let tabContent = document.createElement('div');

            tabsContainer.appendChild(tabButtons);
            tabsContainer.appendChild(tabContent);

            tabTitles.forEach((title, index) => {
                let tabButton = document.createElement('button');
                tabButton.textContent = title;
                tabButton.addEventListener('click', function() {
                    showTabContent(index);
                });
                tabButtons.appendChild(tabButton);

                let content = document.createElement('div');
                content.className = 'tab-content';
                if (index === 0) {
                    content.classList.add('active');
                }
                let textarea = document.createElement('textarea');
                textarea.value = tabContents[index];
                textarea.addEventListener('input', function() {
                    // Almacenar variables locales en el globalScope
                    globalScope[tabTitles[index]] = this.value;
                });
                content.appendChild(textarea);
                tabContent.appendChild(content);
            });

            function showTabContent(index) {
                let contents = tabContent.querySelectorAll('.tab-content');
                let buttons = tabButtons.querySelectorAll('button');
                contents.forEach((content, i) => {
                    if (i === index) {
                        content.classList.add('active');
                        buttons[i].classList.add('active');
                    } else {
                        content.classList.remove('active');
                        buttons[i].classList.remove('active');
                    }
                });
            }

            return tabsContainer;
        }

        function showGlobalScope() {
            console.log(globalScope);
        }

        function clearNotebook() {
            notebook.innerHTML = ''; // Limpiar el contenido del notebook
            // Limpiar el ámbito global
            for (let key in globalScope) {
                delete globalScope[key];
            }
        }
    </script>
</body>
</html>
