import type Fraction from 'fraction.js';
import katex from 'katex';

export function matrixToLatex(matrix: Fraction[][]) {
	return '\\begin{bmatrix}' + matrix.map(row => row.map(cell => cell.toLatex()).join(' & ')).join('\\\\') + '\\end{bmatrix}';
}

export function writeTextUnder(stuff: string, message: string) {
	return `\\overset{${message.replaceAll(' ', '\\:')}}{${stuff}}`;
}

interface OrderEntry {
	row: Fraction[];
	pivotIndex: number;
}

export function orderMatrixRows(matrix: Fraction[][]) {
	// collect pivot positions
	const orderedMatrixRows: OrderEntry[] = matrix.map(row => {
		for (let i = 0; i < row.length; i++) {
			if (!row[i].equals(0)) {
				return { row, pivotIndex: i };
			}
		}
		return { row, pivotIndex: Infinity };
	});

	// check if already in order
	let isInOrder = true;
	for (let i = 0; i < orderedMatrixRows.length - 1; i++) {
		if (orderedMatrixRows[i].pivotIndex > orderedMatrixRows[i + 1].pivotIndex) {
			isInOrder = false;
			break;
		}
	}
	if (isInOrder) {
		return { wasInOrder: true, matrix };
	}

	// order rows
	orderedMatrixRows.sort((a, b) => a.pivotIndex - b.pivotIndex);
	return { wasInOrder: false, matrix: orderedMatrixRows.map(r => r.row) };
}

function matrixWithMessage(matrix: Fraction[][], message: string) {
	return writeTextUnder(matrixToLatex(matrix), message);
}

export function solveEquationMatrix(matrix: Fraction[][]) {
	let output = '';


	let pivotIndex = 0;
	for (let i = 0; i < matrix.length; i++) {
		output += '<div class=\'solution-row\'><div><b>Considering row ' + (i + 1) + ':</b></div>';
		let littleOutput = matrixWithMessage(matrix, '');

		// Reordering rows
		const o = orderMatrixRows(matrix);
		if (!o.wasInOrder) {
			littleOutput += ' = ' + matrixWithMessage(o.matrix, 'Reordering rows');
			matrix = o.matrix;
		} else {
			output += '<br>The rows are already in good order.';
		}


		while (pivotIndex !== matrix[0].length && matrix[i][pivotIndex].equals(0)) pivotIndex++;
		if (pivotIndex === matrix[0].length) {
			output += '<br>There is no pivot in this row, so we are finished.</div>';
			break;
		}

		const pivot = matrix[i][pivotIndex];
		if (!pivot.equals(1)) {
			matrix[i] = matrix[i].map(v => v.div(pivot));
			littleOutput += ' = ' + matrixWithMessage(matrix, 'Dividing row ' + (i + 1) + ' by ' + pivot.toLatex());
		}

		let hasChanged = false;
		for (let iNotThis = 0; iNotThis < matrix.length; iNotThis++) {
			if (i === iNotThis) continue;

			const rate = matrix[iNotThis][pivotIndex];
			if (rate.equals(0)) {
				continue;
			}

			hasChanged = true;
			matrix[iNotThis] = matrix[iNotThis].map((v, x) => v.sub(matrix[i][x].mul(rate)));

			const msg = 'subtracting ' + (rate.equals(1) ? '' : rate.toLatex() + ' times ') + 'row ' + (i + 1) + ' from row ' + (iNotThis + 1);
			littleOutput += ' = ' + matrixWithMessage(matrix, msg);
		}

		output += katex.renderToString(littleOutput);
		if (!hasChanged) {
			output += '<br>All the cells (except the pivot) in column ' + (pivotIndex + 1) + ' were already 0.';
		}
		output += '</div>';
	}

	let isImpossible = false;
	let constrains = [];
	for (const row of matrix) {
		const lhs = [];
		for (let i = 0; i < row.length - 1; i++) {
			const cell = row[i];
			if (cell.equals(0)) continue;
			lhs.push({ variable: i, coefficient: cell });
		}
		const rhs = row[row.length - 1];
		if (lhs.length === 0) {
			if (rhs.equals(0)) {
				continue; // don't add constraint
			} else {
				isImpossible = true;
				break;
			}
		}

		constrains.push({ lhs, rhs });
	}

	if (isImpossible) {
		output += '<div class=\'solution-row\'>There is no solution.</div>';
	} else if (constrains.length === 0) {
		output += '<div class=\'solution-row\'>All variables are free.</div>';
	} else {
		console.log(constrains);

		const latex = constrains.map(c => {
			let eq = '';
			for (let i = 0; i < c.lhs.length; i++) {
				const term = c.lhs[i];
				if(term.coefficient.equals(1)){
					if(i != 0) {
						eq += '+';
					}
				} else if (term.coefficient.equals(-1)) {
					eq += '-';
				}
				else if (term.coefficient.compare(0) >= 0) {
					if (i == 0) {
						eq += term.coefficient.toLatex();
					} else {
						eq += '+' + term.coefficient.toLatex();
					}
				} else {
					// negative
					eq += term.coefficient.toLatex();
				}
				eq += 'x_{' + term.variable + '}';
			}
			eq += ' = ' + c.rhs.toLatex();

			return eq;
		}).join(` \\\\ `);

		console.log(latex);
		output += '<div class=\'solution-row\'>' + katex.renderToString(latex) + '</div>';
	}


	return output;
}