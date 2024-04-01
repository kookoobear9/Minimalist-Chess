let currentTurn = 'w'; // 'w' for white's turn, 'b' for black's turn

document.addEventListener('DOMContentLoaded', function() {
    setupBoard();
    addDragAndDropHandlers();
});

function setupBoard() {
    const board = document.getElementById('chessboard');
    const boardSetup = [
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ];

    board.innerHTML = ''; // Clear the board
    for (let i = 0; i < boardSetup.length; i++) {
        for (let j = 0; j < boardSetup[i].length; j++) {
            let square = document.createElement('div');
            square.className = (i + j) % 2 === 0 ? 'square light' : 'square dark';
            square.id = 'square-' + i + '-' + j;
            if (boardSetup[i][j] !== '') {
                let piece = document.createElement('img');
                piece.src = `common/pieces/${boardSetup[i][j]}.svg`;
                piece.className = 'piece';
                piece.draggable = true;
                piece.id = boardSetup[i][j] + '-' + i + '-' + j;
                square.appendChild(piece);
            }
            board.appendChild(square);
        }
    }
}

function addDragAndDropHandlers() {
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => {
        piece.addEventListener('dragstart', handleDragStart);
    });

    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.addEventListener('dragover', handleDragOver);
        square.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    const pieceColor = e.target.id.charAt(0);
    if ((currentTurn === 'w' && pieceColor === 'w') || (currentTurn === 'b' && pieceColor === 'b')) {
        e.dataTransfer.setData('text/plain', e.target.id);
    } else {
        e.preventDefault(); // Prevent dragging if it's not the player's turn
    }
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
}

function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(data);
    const targetSquare = e.target.classList.contains('piece') ? e.target.parentElement : e.target;

    if (isValidMove(piece, targetSquare)) {
        makeMove(piece, targetSquare);
        const opponentColor = currentTurn === 'w' ? 'b' : 'w';
        if (isKingInCheck(currentTurn)) {
            if (isCheckmate(currentTurn)) {
                alert(`Checkmate! ${opponentColor.toUpperCase()} wins!`);
                // Handle end game
            } else {
                revertMove(piece, targetSquare); // Revert move if it leads to self-check
                alert('Invalid move: cannot leave king in check.');
            }
        }
        else {
            toggleTurn();
        }
    }
}


function isValidMove(piece, targetSquare, ignoreTurn = false) {
    const pieceType = piece.id.charAt(1);
    const pieceColor = piece.id.charAt(0);
    const targetPiece = targetSquare.firstChild;
    const targetColor = targetPiece ? targetPiece.id.charAt(0) : null;

    if (!ignoreTurn) {
        const pieceColor = piece.id.charAt(0);
        if (pieceColor !== currentTurn) {
            return false; // It's not this piece's turn
        }
    }

    // Prevent capturing your own pieces
    if (pieceColor === targetColor) {
        return false;
    }

    const sourceX = parseInt(piece.parentElement.id.split('-')[1]);
    const sourceY = parseInt(piece.parentElement.id.split('-')[2]);
    const targetX = parseInt(targetSquare.id.split('-')[1]);
    const targetY = parseInt(targetSquare.id.split('-')[2]);

    switch (pieceType) {
        case 'p': // Pawn
            return isValidPawnMove(sourceX, sourceY, targetX, targetY, piece.id.charAt(0));
        case 'r': // Rook
            return isValidRookMove(sourceX, sourceY, targetX, targetY);
        case 'n': // Knight
            return isValidKnightMove(sourceX, sourceY, targetX, targetY);
        case 'b': // Bishop
            return isValidBishopMove(sourceX, sourceY, targetX, targetY);
        case 'q': // Queen
            return isValidQueenMove(sourceX, sourceY, targetX, targetY);
        case 'k': // King
            return isValidKingMove(sourceX, sourceY, targetX, targetY);
        // Add cases for other pieces here
    }

    return false;
}

function isValidPawnMove(sx, sy, tx, ty, color) {
    // Normal one-square forward move
    if (color === 'w' && sx - tx === 1 && sy === ty && !isPieceAt(tx, ty)) {
        return true; // White pawn move
    }
    if (color === 'b' && tx - sx === 1 && sy === ty && !isPieceAt(tx, ty)) {
        return true; // Black pawn move
    }

    // Diagonal capture
    if (color === 'w' && sx - tx === 1 && Math.abs(sy - ty) === 1) {
        return isOpponentPieceAt(tx, ty, color);
    }
    if (color === 'b' && tx - sx === 1 && Math.abs(sy - ty) === 1) {
        return isOpponentPieceAt(tx, ty, color);
    }

    return false;
}

function isPieceAt(x, y) {
    const square = document.getElementById(`square-${x}-${y}`);
    return square && square.hasChildNodes();
}

function isOpponentPieceAt(x, y, color) {
    const targetSquare = document.getElementById(`square-${x}-${y}`);
    if (!targetSquare) {
        return false; // Target square is out of bounds
    }

    const targetPiece = targetSquare.firstChild;
    return targetPiece && targetPiece.id.charAt(0) !== color;
}

function isValidRookMove(sx, sy, tx, ty) {
    if (sx !== tx && sy !== ty) {
        return false; // Rooks move in a straight line, either horizontally or vertically
    }
    return isPathClear(sx, sy, tx, ty);
}

function isValidKnightMove(sx, sy, tx, ty) {
    // Knights move in an L shape: 2 squares in one direction and 1 square in another
    return (Math.abs(sx - tx) === 2 && Math.abs(sy - ty) === 1) || (Math.abs(sx - tx) === 1 && Math.abs(sy - ty) === 2);
}

function isValidBishopMove(sx, sy, tx, ty) {
    if (Math.abs(sx - tx) !== Math.abs(sy - ty)) {
        return false; // Bishops move diagonally
    }
    return isPathClear(sx, sy, tx, ty);
}

function isValidQueenMove(sx, sy, tx, ty) {
    if ((sx !== tx && sy !== ty) && (Math.abs(sx - tx) !== Math.abs(sy - ty))) {
        return false; // Queens move like rooks and bishops combined
    }
    return isPathClear(sx, sy, tx, ty);
}

function isValidKingMove(sx, sy, tx, ty) {
    // Kings move one square in any direction
    return Math.abs(sx - tx) <= 1 && Math.abs(sy - ty) <= 1;
}

function isPathClear(sx, sy, tx, ty) {
    const deltaX = tx - sx;
    const deltaY = ty - sy;
    const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    const stepX = deltaX / steps;
    const stepY = deltaY / steps;

    for (let i = 1; i < steps; i++) {
        let intermediateX = sx + stepX * i;
        let intermediateY = sy + stepY * i;
        let intermediateSquare = document.getElementById(`square-${intermediateX}-${intermediateY}`);

        if (intermediateSquare.hasChildNodes()) {
            return false; // Path is not clear if an intermediate square has a piece
        }
    }

    return true; // Path is clear if no intermediate squares have pieces
}

function toggleTurn() {
    currentTurn = currentTurn === 'w' ? 'b' : 'w';
}

function isKingInCheck(color) {
    const kingPosition = findKing(color);
    return canBeCaptured(kingPosition, color);
}

function findKing(color) {
    const pieces = document.querySelectorAll(`.piece[id^="${color}k"]`);
    return pieces.length > 0 ? pieces[0].parentElement.id : null;
}

function canBeCaptured(kingPosition, color) {
    const opponentColor = color === 'w' ? 'b' : 'w';
    const opponentPieces = document.querySelectorAll(`.piece[id^="${opponentColor}"]`);
    
    for (let i = 0; i < opponentPieces.length; i++) {
        const piece = opponentPieces[i];
        const sourceSquare = piece.parentElement;
        const targetSquare = document.getElementById(kingPosition);

        if (isValidMove(piece, targetSquare, true)) {
            return true; // The king can be captured by this piece
        }
    }
    return false;
}

function makeMove(piece, targetSquare) {
    // Remember original position
    piece.setAttribute('data-original-square', piece.parentElement.id);
    
    // If there is an opponent's piece on the target square, remove it
    if (targetSquare.firstChild && targetSquare.firstChild !== piece) {
        targetSquare.removeChild(targetSquare.firstChild);
    }
    
    // Move piece to the target square
    targetSquare.appendChild(piece);
}

function revertMove(piece, targetSquare) {
    // Return piece to its original position
    const originalSquareId = piece.getAttribute('data-original-square');
    document.getElementById(originalSquareId).appendChild(piece);
}

function isCheckmate(color) {
    // Check if any move can get the king out of check
    const pieces = document.querySelectorAll(`.piece[id^="${color}"]`);
    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const originalSquare = piece.parentElement;

        const potentialMoves = getAllPotentialMoves(piece);
        for (let j = 0; j < potentialMoves.length; j++) {
            const targetSquare = potentialMoves[j];
            makeMove(piece, targetSquare);
            const stillInCheck = isKingInCheck(color);
            revertMove(piece, targetSquare);
            if (!stillInCheck) {
                return false; // There is a move that gets the king out of check
            }
        }
    }
    return true; // No move gets the king out of check - checkmate
}

function getAllPotentialMoves(piece) {
    const pieceType = piece.id.charAt(1);
    const sourceX = parseInt(piece.parentElement.id.split('-')[1]);
    const sourceY = parseInt(piece.parentElement.id.split('-')[2]);
    let potentialMoves = [];

    switch (pieceType) {
        case 'p': // Pawn
            potentialMoves = getPotentialPawnMoves(piece, sourceX, sourceY);
            break;
        case 'r': // Rook
            potentialMoves = getPotentialRookMoves(sourceX, sourceY);
            break;
        case 'n': // Knight
            potentialMoves = getPotentialKnightMoves(sourceX, sourceY);
            break;
        case 'b': // Bishop
            potentialMoves = getPotentialBishopMoves(sourceX, sourceY);
            break;
        case 'q': // Queen
            potentialMoves = getPotentialQueenMoves(sourceX, sourceY);
            break;
        case 'k': // King
            potentialMoves = getPotentialKingMoves(sourceX, sourceY);
            break;
        // Additional cases if needed
    }

    return potentialMoves.filter(square => square); // Filter out null values
}

function getPotentialPawnMoves(piece, sx, sy) {
    let moves = [];
    let direction = piece.id.startsWith('w') ? -1 : 1;
    let color = piece.id.charAt(0);
    let forwardSquare = document.getElementById(`square-${sx + direction}-${sy}`);
    if (forwardSquare && !forwardSquare.hasChildNodes()) {
        moves.push(forwardSquare);
    }

    // Diagonal captures
    if (isOpponentPieceAt(sx + direction, sy - 1, color)) {
        moves.push(getSquareIfExists(sx + direction, sy - 1));
    }
    if (isOpponentPieceAt(sx + direction, sy + 1, color)) {
        moves.push(getSquareIfExists(sx + direction, sy + 1));
    }

    return moves;
}

function getPotentialRookMoves(sx, sy) {
    let moves = [];
    // Horizontal and vertical moves
    for (let i = 0; i < 8; i++) {
        if (i !== sx) {
            moves.push(document.getElementById(`square-${i}-${sy}`));
        }
        if (i !== sy) {
            moves.push(document.getElementById(`square-${sx}-${i}`));
        }
    }
    return moves;
}

function getPotentialKnightMoves(sx, sy) {
    const knightMoves = [
        [sx + 2, sy + 1], [sx + 2, sy - 1],
        [sx - 2, sy + 1], [sx - 2, sy - 1],
        [sx + 1, sy + 2], [sx + 1, sy - 2],
        [sx - 1, sy + 2], [sx - 1, sy - 2]
    ];

    return knightMoves.map(([x, y]) => {
        return (x >= 0 && x < 8 && y >= 0 && y < 8) ? document.getElementById(`square-${x}-${y}`) : null;
    });
}

function getPotentialBishopMoves(sx, sy) {
    let moves = [];
    // Diagonal moves
    for (let i = 1; i < 8; i++) {
        moves.push(getSquareIfExists(sx + i, sy + i));
        moves.push(getSquareIfExists(sx + i, sy - i));
        moves.push(getSquareIfExists(sx - i, sy + i));
        moves.push(getSquareIfExists(sx - i, sy - i));
    }
    return moves;
}

function getPotentialQueenMoves(sx, sy) {
    // Combine rook and bishop moves
    return [...getPotentialRookMoves(sx, sy), ...getPotentialBishopMoves(sx, sy)];
}

function getPotentialKingMoves(sx, sy) {
    let moves = [];
    // One square in any direction
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0) {
                moves.push(getSquareIfExists(sx + dx, sy + dy));
            }
        }
    }
    return moves;
}

function getSquareIfExists(x, y) {
    return (x >= 0 && x < 8 && y >= 0 && y < 8) ? document.getElementById(`square-${x}-${y}`) : null;
}