// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyRooksConflictsOn: function(rowIndex, colIndex) {
      return this.hasRowConflictAt(rowIndex) || this.hasColConflictAt(colIndex);
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // console.log('this is', this);
      // console.log('this.attributes is', this.attributes[rowIndex]);
      // console.log('is this an array?', Array.isArray(this.attributes));
      var board = this.attributes;
      return (board[rowIndex].reduce(function (queens, element) { return queens + element; }) > 1) ? true : false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var result = false;
      for (var i = 0; i < Object.keys(this.attributes).length - 1; i++) {
        result = result || this.hasRowConflictAt(i);
      }
      return result;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var board = this.attributes;
      var col = [];
      for (var row in board) {
        if (board.hasOwnProperty(row) && row !== 'n') {
          col.push(board[row][colIndex]);
        }
      }

      return (col.reduce(function (queens, element) { return queens + element; }) > 1) ? true : false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var result = false;
      for (var i = 0; i < Object.keys(this.attributes).length - 1; i++) {
        result = result || this.hasColConflictAt(i);
      }
      return result;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // console.log('is this thing on?');
      // if a negative number:
        // start from the bottom left-most column (referenced by a negative index)
          // traverse up the first column (i++)
          // on each new index: check the diagonal against board[(-index) + 1][j + 1]
            // push each value at that board's position to an array
            // reduce the array: if queens > 1 return true else return false
      // if a positive number:
        // start from top-left of the board
          // traverse across the board i++
          // on each new index: check the diagonal against board[j + 1][index + 1]
            // push each value at that board's position to an array
            // reduce the array: if queens > 1 return true else return false
      var board = this.attributes;
      var index = majorDiagonalColumnIndexAtFirstRow;
      var queens = [];
      var positionTracker = 0;
      if (index <= 0) {
        for (var i = -index; i < board.n; i++) {
          // console.log('board[-index][positionTracker] is', board[-index][positionTracker]);
          // console.log('queens is ', queens);
          // console.log('board[i][positionTracker is', board[i][positionTracker]);
          // console.log('i is', i);
          queens.push(board[i][positionTracker]);
          positionTracker++;
        }
        // console.log('queens is', queens);
        return (queens.reduce(function (numQueens, element) { return numQueens + element; }) > 1) ? true : false;
      } else {
        for (var i = index; i < board.n; i++) {
          queens.push(board[positionTracker][i]);
          positionTracker++;
        }
        return (queens.reduce(function (numQueens, element) { return numQueens + element; }) > 1) ? true : false;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var result = false;
      // start from the bottom left of the board. directionally move to the top right of the board.
      for (var i = -(this.attributes.n - 2); i < this.attributes.n - 1; i++) {
        result = result || this.hasMajorDiagonalConflictAt(i);
      }
      return result; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var board = this.attributes;
      var index = minorDiagonalColumnIndexAtFirstRow;
      var queens = [];
      var positionTracker = 0;
      if (index <= 0) { //may need to be <
        positionTracker = board.n - 1;
        for (var i = -index; i < board.n; i++) {
          // console.log('board[-index][positionTracker] is', board[-index][positionTracker]);
          // console.log('queens is ', queens);
          // console.log('board[i][positionTracker is', board[i][positionTracker]);
          // console.log('i is', i);
          queens.push(board[i][positionTracker]);
          // console.log('board is ', board);
          positionTracker--;
        }
        // console.log('queens is', queens);
        return (queens.reduce(function (numQueens, element) { return numQueens + element; }) > 1) ? true : false;
      } else {
        positionTracker = board.n - index - 1;
        for (var i = 0; i < board.n - index; i++) {
          queens.push(board[i][positionTracker]);
          positionTracker--;
        }
        if (queens.length > 0) {
          return (queens.reduce(function (numQueens, element) { return numQueens + element; }) > 1) ? true : false;
        }
        return; // (queens.reduce(function (numQueens, element) { return numQueens + element; }) > 1) ? true : false;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var result = false;
      // start from the bottom left of the board. directionally move to the top right of the board.
      for (var i = -(this.attributes.n - 2); i < this.attributes.n - 1; i++) {
        result = result || this.hasMinorDiagonalConflictAt(i);
      }
      return result; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
