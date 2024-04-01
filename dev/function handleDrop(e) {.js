function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(data);
    const targetSquare = e.target.classList.contains('piece') ? e.target.parentElement : e.target;

    if (isValidMove(piece, targetSquare)) {
        makeMove(piece, targetSquare);
        if (isKingInCheck(currentTurn)) {
            if (isCheckmate(currentTurn)) {
                alert(`Checkmate! ${currentTurn.toUpperCase()} loses!`);
                window.stop();
                // Handle end game
            } else {
            alert(`${currentTurn.toUpperCase()} king is in check!`);
            revertMove(piece, targetSquare); // Revert move if it leads to self-check
            alert('Invalid move: cannot leave king in check.');
            }
        } else {
            toggleTurn();
        }
    }
}


function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(data);
    const targetSquare = e.target.classList.contains('piece') ? e.target.parentElement : e.target;

    if (isValidMove(piece, targetSquare)) {
        makeMove(piece, targetSquare);
        if (isKingInCheck(currentTurn)) {
            if (isCheckmate(currentTurn)) {
                alert(`Checkmate! ${currentTurn.toUpperCase()} wins!`);
                // Handle end game
            } else {
                alert(`${currentTurn.toUpperCase()} king is in check!`);
                revertMove(piece, targetSquare); // Revert move if it leads to self-check
            }
        } else {
            toggleTurn();
        }
    }
}




function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(data);
    const targetSquare = e.target.classList.contains('piece') ? e.target.parentElement : e.target;

    if (isValidMove(piece, targetSquare)) {
        makeMove(piece, targetSquare);
        if (isKingInCheck(currentTurn)) {
            alert(`${currentTurn.toUpperCase()} king is in check!`);
            revertMove(piece, targetSquare); // Revert move if it leads to self-check
            alert('Invalid move: cannot leave king in check.');
            if (isCheckmate(currentTurn)) {
                alert(`Checkmate! ${currentTurn.toUpperCase()} wins!`);
                // Handle end game
            }
        } else {
            toggleTurn();
        }
    }
}


if (isKingInCheck(currentTurn === 'w' ? 'b' : 'w')) {
    if (isCheckmate(currentTurn)) {
        alert(`Checkmate! ${currentTurn.toUpperCase()} wins!`);
        // Handle end game
    } else {
        alert(`${currentTurn.toUpperCase()} king is in check!`);
    }
}



function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(data);
    const targetSquare = e.target.classList.contains('piece') ? e.target.parentElement : e.target;

    if (isValidMove(piece, targetSquare)) {
        makeMove(piece, targetSquare);
        if (isKingInCheck(currentTurn)) {
            revertMove(piece, targetSquare); // Revert move if it leads to self-check
            alert('Invalid move: cannot leave king in check.');
        } else {
            toggleTurn();
            if (isKingInCheck(oppositeColor(currentTurn))) {
                if (isCheckmate(oppositeColor(currentTurn))) {
                    alert(`Checkmate! ${oppositeColor(currentTurn).toUpperCase()} wins!`);
                    // Handle end game
                } else {
                    alert(`${oppositeColor(currentTurn).toUpperCase()} king is in check!`);
                }
            }
        }
    }
}

function oppositeColor(color) {
    return color === 'w' ? 'b' : 'w';
}
