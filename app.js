    (function () {

        const COLS = 9;
        const ROWS = 9;
        const board = document.getElementById('board');

        board.style.setProperty('--cols', COLS);

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell hidden';
                cell.setAttribute('role', 'gridcell');
                cell.setAttribute('tabindex', '0');
                cell.dataset.r = r;
                cell.dataset.c = c;
                if ((r === 1 && c === 2) || (r === 4 && c === 4)) {
                    cell.className = 'cell revealed number1';
                    cell.textContent = '1';
                } else if (r === 3 && c === 5) {
                    cell.className = 'cell mine revealed';
                    cell.textContent = 'B';
                } else if (r === 6 && c === 1) {
                    cell.className = 'cell hidden flag';
                    cell.textContent = 'F';
                }

                board.appendChild(cell);
            }
        }
    })();

      function showRules() {
           document.getElementById('rules').style.display = 'block';
     }
         function hideRules() {
             document.getElementById('rules').style.display = 'none';
     }