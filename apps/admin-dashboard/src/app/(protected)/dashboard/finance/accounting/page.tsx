"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Grid, Card, CardContent } from '@mui/material';
import { Add, AccountBalance } from '@mui/icons-material';
import { useFinanceStore } from '@/store/financeStore';

// Chart of Accounts structure - balance values are placeholders awaiting API data
const accountStructure: AccountNode[] = [
  { code: '1', name: 'Assets', type: 'ASSET', balance: 0, children: [
    { code: '101', name: 'Current Assets', type: 'ASSET', balance: 0, children: [
      { code: '101001', name: 'Cash', type: 'ASSET', balance: 0 },
      { code: '102001', name: 'Bank Accounts', type: 'ASSET', balance: 0 },
      { code: '104001', name: 'Accounts Receivable', type: 'ASSET', balance: 0 },
      { code: '105001', name: 'GST Input Credit', type: 'ASSET', balance: 0 },
    ]},
    { code: '103', name: 'Fixed Assets', type: 'ASSET', balance: 0, children: [
      { code: '103001', name: 'Equipment', type: 'ASSET', balance: 0 },
      { code: '103002', name: 'Vehicles', type: 'ASSET', balance: 0 },
    ]},
  ]},
  { code: '2', name: 'Liabilities', type: 'LIABILITY', balance: 0, children: [
    { code: '201001', name: 'Accounts Payable', type: 'LIABILITY', balance: 0 },
    { code: '202001', name: 'GST Payable', type: 'LIABILITY', balance: 0 },
    { code: '202002', name: 'TDS Payable', type: 'LIABILITY', balance: 0 },
    { code: '203001', name: 'Salary Payable', type: 'LIABILITY', balance: 0 },
  ]},
  { code: '3', name: 'Equity', type: 'EQUITY', balance: 0, children: [
    { code: '301001', name: 'Owners Equity', type: 'EQUITY', balance: 0 },
    { code: '302001', name: 'Retained Earnings', type: 'EQUITY', balance: 0 },
  ]},
  { code: '4', name: 'Revenue', type: 'REVENUE', balance: 0, children: [
    { code: '400001', name: 'Sales Revenue', type: 'REVENUE', balance: 0 },
    { code: '401001', name: 'Commission Revenue', type: 'REVENUE', balance: 0 },
    { code: '402001', name: 'Platform Fees', type: 'REVENUE', balance: 0 },
    { code: '403001', name: 'Delivery Fees', type: 'REVENUE', balance: 0 },
  ]},
  { code: '5', name: 'Expenses', type: 'EXPENSE', balance: 0, children: [
    { code: '501001', name: 'Cost of Goods Sold', type: 'EXPENSE', balance: 0 },
    { code: '502001', name: 'Commission Expense', type: 'EXPENSE', balance: 0 },
    { code: '503001', name: 'Payment Gateway Fees', type: 'EXPENSE', balance: 0 },
    { code: '504001', name: 'Salary Expenses', type: 'EXPENSE', balance: 0 },
    { code: '505001', name: 'Marketing Expenses', type: 'EXPENSE', balance: 0 },
  ]},
];

interface AccountNode {
  code: string;
  name: string;
  type: string;
  balance: number;
  children?: AccountNode[];
}

const AccountRow = ({ account, depth = 0 }: { account: AccountNode; depth?: number }) => (
  <>
    <TableRow hover sx={{ '&:hover': { bgcolor: '#f5f5f5' }, bgcolor: depth === 0 ? '#f8f9fa' : 'transparent' }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: depth * 3 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, mr: 1, color: depth === 0 ? '#1976d2' : 'text.secondary' }}>{account.code}</Typography>
          <Typography sx={{ fontWeight: depth <= 1 ? 700 : 500 }}>{account.name}</Typography>
          {account.children && <Chip label={`${account.children.length} sub-accounts`} size="small" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />}
        </Box>
      </TableCell>
      <TableCell>
        <Chip label={account.type} size="small" 
          color={account.type === 'ASSET' ? 'primary' : account.type === 'LIABILITY' ? 'warning' : account.type === 'EQUITY' ? 'success' : account.type === 'REVENUE' ? 'info' : 'default'} 
          variant="outlined" 
        />
      </TableCell>
      <TableCell align="right" sx={{ fontWeight: 700, color: account.balance >= 0 ? '#388e3c' : '#d32f2f' }}>
        {depth > 0 ? `₹${Math.abs(account.balance).toLocaleString()}` : '-'}
      </TableCell>
    </TableRow>
    {account.children?.map((child: AccountNode) => (
      <AccountRow key={child.code} account={child} depth={depth + 1} />
    ))}
  </>
);

export default function AccountingPage() {
  const { overview, loading, fetchOverview } = useFinanceStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Derive balances from API data when available
  const accounts = accountStructure.map(acc => {
    if (acc.name === 'Assets' && overview?.totalRevenue) {
      return { ...acc, balance: overview.totalRevenue || 0 };
    }
    return acc;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Chart of Accounts</Typography>
          <Typography variant="body2" color="text.secondary">Financial accounting and account management</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained">Add Account</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Assets', value: overview ? `₹${overview.totalRevenue?.toLocaleString()}` : 'Awaiting API', color: '#1976d2' },
          { label: 'Total Revenue (YTD)', value: overview ? `₹${overview.totalRevenue?.toLocaleString()}` : 'Awaiting API', color: '#f57c00' },
          { label: 'Net Revenue', value: overview ? `₹${overview.netRevenue?.toLocaleString()}` : 'Awaiting API', color: '#388e3c' },
          { label: 'Transactions', value: `${overview?.totalTransactions || 0}`, color: '#7b1fa2' },
        ].map((stat) => (
          <Grid size={{ xs: 3 }} key={stat.label}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color, mt: 0.5 }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#e8eaf6' }}>
              <TableCell sx={{ fontWeight: 700, width: '50%' }}>Account</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((acc: AccountNode) => (
              <AccountRow key={acc.code} account={acc} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
