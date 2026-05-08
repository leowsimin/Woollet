import * as XLSX from 'xlsx'
import { TAGS } from '../data/constants'

function buildMonthBlock(monthLabel, transactions, settings, trips) {
  const rows = []

  // Header
  rows.push({ A: monthLabel.toUpperCase(), B: '' })
  rows.push({ A: '─────────────────────────', B: '─────────────' })

  // Category spending
  const spentByTag = {}
  TAGS.forEach(t => { spentByTag[t.id] = 0 })
  transactions
    .filter(t => !t.isTripExpense)
    .forEach(t => { spentByTag[t.tag] = (spentByTag[t.tag] || 0) + t.amount })

  TAGS.forEach(tag => {
    rows.push({
      A: '  ' + tag.name,
      B: `S$${(spentByTag[tag.id] || 0).toFixed(2)}`,
    })
  })

  rows.push({ A: '─────────────────────────', B: '─────────────' })

  // Totals
  const totalSpent  = transactions.filter(t => !t.isTripExpense).reduce((s, t) => s + t.amount, 0)
  const salary      = settings?.salary      || 0
  const savingsGoal = settings?.savingsGoal || 0
  const remaining   = salary - savingsGoal - totalSpent

  rows.push({ A: '  Total spent',      B: `S$${totalSpent.toFixed(2)}`  })
  rows.push({ A: '  Savings locked',   B: `S$${savingsGoal.toFixed(2)}` })
  rows.push({ A: '  Remaining',        B: `S$${Math.max(0, remaining).toFixed(2)}` })
  rows.push({ A: '─────────────────────────', B: '─────────────' })

  // Trip expenses for this month
  const monthTrips = trips.filter(trip => {
    const tripStart = new Date(trip.startDate)
    const tripEnd   = new Date(trip.endDate)
    const expenses  = trip.expenses || []
    return expenses.some(e => {
      const txInMonth = transactions.find(t => t.id === e.id)
      return txInMonth !== undefined
    }) || (trip.expenses || []).length > 0
  })

  if (monthTrips.length > 0) {
    monthTrips.forEach(trip => {
      const tripExpenses = trip.expenses || []
      if (tripExpenses.length === 0) return

      rows.push({ A: `  ✈ ${trip.name}`, B: '' })
      rows.push({ A: '  ' + trip.startDate + ' → ' + trip.endDate, B: '' })

      const tripSpentByTag = {}
      TAGS.forEach(t => { tripSpentByTag[t.id] = 0 })
      tripExpenses.forEach(e => {
        tripSpentByTag[e.category] = (tripSpentByTag[e.category] || 0) + e.amount
      })

      TAGS.forEach(tag => {
        const spent  = tripSpentByTag[tag.id] || 0
        const budget = parseFloat(trip.budgets?.[tag.id]) || 0
        if (spent > 0 || budget > 0) {
          rows.push({
            A: '    ' + tag.name,
            B: `S$${spent.toFixed(2)} / S$${budget.toFixed(2)}`,
          })
        }
      })

      const tripTotal = tripExpenses.reduce((s, e) => s + e.amount, 0)
      const tripBudget = Object.values(trip.budgets).reduce((s, v) => s + (parseFloat(v) || 0), 0)
      rows.push({ A: '  Trip total', B: `S$${tripTotal.toFixed(2)} / S$${tripBudget.toFixed(2)}` })
      rows.push({ A: '─────────────────────────', B: '─────────────' })
    })
  }

  // Spacer between months
  rows.push({ A: '', B: '' })
  rows.push({ A: '', B: '' })

  return rows
}

export function exportToExcel(transactions, settings, trips = [], archivedMonths = []) {
  const workbook = XLSX.utils.book_new()

  // ── Sheet 1: Summary (all months stacked) ─────────────────
  let allRows = []

  // Current month
  const today     = new Date()
  const thisMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' })
  allRows = allRows.concat(buildMonthBlock(thisMonth, transactions, settings, trips))

  // Archived months
  archivedMonths.forEach(month => {
    allRows = allRows.concat(buildMonthBlock(month.monthLabel, month.transactions, settings, trips))
  })

  const summarySheet = XLSX.utils.json_to_sheet(allRows, { header: ['A', 'B'], skipHeader: true })

  // Column widths
  summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }]

  // Style trip rows blue — find rows with ✈
  const range = XLSX.utils.decode_range(summarySheet['!ref'])
  for (let R = range.s.r; R <= range.e.r; R++) {
    const cellA = summarySheet[XLSX.utils.encode_cell({ r: R, c: 0 })]
    if (cellA && cellA.v && String(cellA.v).includes('✈')) {
      // Mark for blue — note: basic xlsx doesn't support full styling
      // but we can flag it
      for (let C = 0; C <= 1; C++) {
        const cell = summarySheet[XLSX.utils.encode_cell({ r: R, c: C })]
        if (cell) {
          cell.s = {
            font:  { bold: true, color: { rgb: '2D6A8F' } },
            fill:  { fgColor: { rgb: 'EAF4FB' } },
          }
        }
      }
    }
  }

  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Woollet Summary')

  // ── Sheet 2: All transactions ──────────────────────────────
  const allTx = [
    ...transactions,
    ...archivedMonths.flatMap(m => m.transactions),
  ]

  const txRows = allTx.map(tx => {
    const tag = TAGS.find(t => t.id === tx.tag)
    return {
      'Date':         tx.date,
      'Amount (S$)':  tx.amount.toFixed(2),
      'Category':     tag?.name || tx.tag,
      'Note':         tx.note  || '',
      'Trip expense': tx.isTripExpense ? '✈ Yes' : '',
      'Trip name':    tx.tripName || '',
    }
  })

  const txSheet  = XLSX.utils.json_to_sheet(txRows)
  txSheet['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 16 }, { wch: 30 }, { wch: 14 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(workbook, txSheet, 'All Transactions')

  // ── Download ───────────────────────────────────────────────
  const date     = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `woollet-${date}.xlsx`)
}