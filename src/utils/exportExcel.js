import * as XLSX from 'xlsx'
import { TAGS, calcSpentByTag } from '../data/constants'

export function exportToExcel(transactions, settings) {
  const SALARY       = settings.salary
  const SAVINGS_GOAL = settings.savingsGoal
  const budgets      = settings.budgets

  // ── Sheet 1: Transactions ──────────────────────────────
  const txRows = transactions.map(tx => {
    const tag = TAGS.find(t => t.id === tx.tag)
    return {
      'Date':       tx.date,
      'Amount (S$)': tx.amount.toFixed(2),
      'Category':   tag?.name || tx.tag,
      'Note':       tx.note || '',
    }
  })

  const txSheet = XLSX.utils.json_to_sheet(txRows)
  txSheet['!cols'] = [{ wch: 22 }, { wch: 14 }, { wch: 16 }, { wch: 30 }]

  // ── Sheet 2: Monthly Summary ───────────────────────────
  const spentByTag = calcSpentByTag(transactions)

  const summaryRows = TAGS.map(tag => {
    const spent     = spentByTag[tag.id] || 0
    const budget    = budgets[tag.id]    || 0
    const remaining = budget - spent
    const pct       = budget > 0 ? ((spent / budget) * 100).toFixed(1) + '%' : '0%'
    return {
      'Category':        tag.name,
      'Budget (S$)':     budget.toFixed(2),
      'Spent (S$)':      spent.toFixed(2),
      'Remaining (S$)':  remaining.toFixed(2),
      'Used %':          pct,
      'Status':          spent > budget ? '⚠️ Over budget' : spent / budget > 0.85 ? '🔶 Almost full' : '✅ On track',
    }
  })

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows)
  summarySheet['!cols'] = [{ wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 18 }]

  // ── Sheet 3: Plan ──────────────────────────────────────
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0)
  const spendable  = SALARY - SAVINGS_GOAL
  const remaining  = spendable - totalSpent

  const planRows = [
    { 'Item': 'Monthly Salary',    'Amount (S$)': SALARY.toFixed(2),            'Notes': ''                                            },
    { 'Item': 'Savings Goal',      'Amount (S$)': `-${SAVINGS_GOAL.toFixed(2)}`, 'Notes': `${Math.round((SAVINGS_GOAL / SALARY) * 100)}% of salary` },
    { 'Item': 'Total Spendable',   'Amount (S$)': spendable.toFixed(2),          'Notes': 'After savings'                               },
    { 'Item': '',                  'Amount (S$)': '',                             'Notes': ''                                            },
    { 'Item': 'Spent This Month',  'Amount (S$)': `-${totalSpent.toFixed(2)}`,   'Notes': `${transactions.length} transactions`         },
    { 'Item': 'Remaining Balance', 'Amount (S$)': remaining.toFixed(2),          'Notes': remaining < 0 ? 'Over budget!' : 'Available'  },
  ]

  const planSheet = XLSX.utils.json_to_sheet(planRows)
  planSheet['!cols'] = [{ wch: 20 }, { wch: 14 }, { wch: 24 }]

  // ── Build & download ───────────────────────────────────
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, txSheet,      'Transactions')
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Monthly Summary')
  XLSX.utils.book_append_sheet(workbook, planSheet,    'Plan')

  const date     = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `kaching-${date}.xlsx`)
}