'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Table7Transaction {
  id: string;
  type: string;
  amount: string | number;
  method?: string;
  description?: string;
  category?: string;
  date?: string;
}

interface Table7Props {
  data?: Table7Transaction[];
  netBalance?: string;
  onRowClick?: (id: string) => void;
  showCaption?: boolean;
}

const defaultTransactions: Table7Transaction[] = [
  { id: 'TXN001', type: 'Credit', amount: '₹2,500.00', method: 'UPI' },
  { id: 'TXN002', type: 'Debit', amount: '₹1,200.00', method: 'Credit Card' },
  { id: 'TXN003', type: 'Credit', amount: '₹3,800.00', method: 'Net Banking' },
  { id: 'TXN004', type: 'Debit', amount: '₹900.00', method: 'Wallet' },
  { id: 'TXN005', type: 'Credit', amount: '₹4,200.00', method: 'UPI' },
  { id: 'TXN006', type: 'Debit', amount: '₹700.00', method: 'Debit Card' },
  { id: 'TXN007', type: 'Credit', amount: '₹1,500.00', method: 'Bank Transfer' },
];

export const Table7 = ({
  data = defaultTransactions,
  netBalance = '₹9,200.00',
  onRowClick,
  showCaption = true,
}: Table7Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleRowSelect = (id: string) => {
    const nextId = selectedId === id ? null : id;
    setSelectedId(nextId);
    if (onRowClick) onRowClick(id);
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <Table className="w-full">
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-b border-slate-200">
              <TableHead className="w-32 font-bold text-slate-500 uppercase text-[11px]">Transaction ID</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[11px]">Type</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[11px]">Method</TableHead>
              <TableHead className="text-right font-bold text-slate-500 uppercase text-[11px]">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100 text-xs">
            {data.map((txn) => {
              const isSelected = selectedId === txn.id;

              return (
                <TableRow
                  key={txn.id}
                  onClick={() => handleRowSelect(txn.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/15 hover:bg-emerald-500/20 text-slate-900 font-semibold'
                      : 'hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <TableCell className="font-medium text-slate-900">{txn.id}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      txn.type.toLowerCase() === 'debit' || txn.type.toLowerCase() === 'expense'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {txn.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">{txn.method || txn.category || 'Standard'}</TableCell>
                  <TableCell className={`text-right font-extrabold tabular-nums ${
                    txn.type.toLowerCase() === 'debit' || txn.type.toLowerCase() === 'expense'
                      ? 'text-rose-500'
                      : 'text-emerald-600'
                  }`}>
                    {typeof txn.amount === 'number' ? `₹${txn.amount.toLocaleString('en-IN')}` : txn.amount}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter className="bg-slate-50 border-t border-slate-200">
            <TableRow>
              <TableCell colSpan={3} className="font-bold text-slate-700 text-xs">Net Balance</TableCell>
              <TableCell className="text-right font-black text-emerald-600 text-sm tabular-nums">{netBalance}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      {showCaption && (
        <p className="text-slate-400 mt-3 text-center text-xs">
          Click a row to highlight it
        </p>
      )}
    </div>
  );
};

export default Table7;
