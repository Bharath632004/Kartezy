"use client";

import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, IconButton, Grid, Card, CardContent, TreeItem, TreeView } from '@mui/material';
import { Add, ChevronRight, ExpandMore, AccountBalance, CurrencyRupee } from '@mui/icons-material';

const accounts = [
  { code: '1', name: 'Assets', type: 'ASSET', balance: 3123400, children: [
    { code: '101', name: 'Current Assets', type: 'ASSET', balance: 2987000, children: [
      { code: '101001', name: 'Cash', type: 'ASSET', balance: 2845000 },
      { code: '102001', name: 'Bank Accounts', type: 'ASSET', balance: 125000 },
      { code: '104001', name: 'Accounts Receivable', type: 'ASSET', balance: 124500 },
      { code: '105001', name: 'GST Input Credit', type: 'ASSET', balance: 58350 },
    ]},
    { code: '103', name: 'Fixed Assets', type: 'ASSET', balance: 136400, children: [
      { code: '103001', name: 'Equipment', type: 'ASSET', balance: 85000 },
      { code: '103002', name: 'Vehicles', type: 'ASSET', balance: 51400 },
    ]},
  ]},
  { code: '2', name: 'Liabilities', type: 'LIABILITY', balance: -775600, children: [
    { code: '201001', name: 'Accounts Payable', type: 'LIABILITY', balance: 356000 },
    { code: '202001', name: 'GST Payable', type: 'LIABILITY', balance: 67800 },
    { code: '202002', name: 'TDS Payable', type: 'LIABILITY', balance: 27200 },
    { code: '203001', name: 'Salary Payable', type: 'LIABILITY', balance: 350000 },
  ]},
  { code: '3', name: 'Equity', type: 'EQUITY', balance: -2347800, children: [
    { code: '301001', name: 'Owners Equity', type: 'EQUITY', balance: 1500000 },
    { code: '302001', name: 'Retained Earnings', type: 'EQUITY', balance: 847800 },
  ]},
  { code: '4', name: 'Revenue', type: 'REVENUE', balance: 0, children: [
    { code: '400001', name: 'Sales Revenue', type: 'REVENUE', balance: 0 },
    { code: '401001', name: 'Commission Revenue', type: 'REVENUE', balance: 680000 },
    { code: '402001', name: 'Platform Fees', type: 'REVENUE', balance: 195000 },
    { code: '403001', name: 'Delivery Fees', type: 'REVENUE', balance: 498000 },
  ]},
  { code: '5', name: 'Expenses', type: 'EXPENSE', balance: 0, children: [
    { code: '501001', name: 'Cost of Goods Sold', type: 'EXPENSE', balance: 420000 },
    { code: '502001', name: 'Commission Expense', type: 'EXPENSE', balance: 85000 },
    { code: '503001', name: 'Payment Gateway Fees', type: 'EXPENSE', balance: 45000 },
    { code: '504001', name: 'Salary Expenses', type: 'EXPENSE', balance: 350000 },
    { code: '505001', name: 'Marketing Expenses', type: 'EXPENSE', balance: 120000 },
  ]},
];

const AccountRow = ({ account, depth = 0 }: { account: any; depth?: number }) => (
  <>
    <TableRow hover sx={{ '&:hover': { bgcolor: '#f5f5f5' }, bgcolor: depth === 0 ? '#f8f9fa' : 'transparent' }}>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: depth * 3 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, mr: 1, color: depth === 0 ? '#1976d2' : 'text.secondary' }}>{account.code}</Typography>
          <Typography sx={{ fontWeight: depth <= 1 ? 700 : 500 }}>{account.name}</Typography>
          {account.children && <Chip label={`${account.children.length} sub-accounts`} size="small" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />}
        </Box>
      </TableCell>
      <TableCell><Chip label={account.type} size="small" color={account.type === 'ASSET' ? 'primary' : account.type === 'LIABILITY' ? 'warning' : account.type === 'EQUITY' ? 'success' : account.type === 'REVENUE' ? 'info' : 'default'} variant="outlined" /></TableCell>
      <TableCell align="right" sx={{ fontWeight: 700, color: account.balance >= 0 ? '#388e3c' : '#d32f2f' }}>
        {depth > 0 ? `₹${Math.abs(account.balance).toLocaleString()}` : '-'}
      </TableCell>
    </TableRow>
    {account.children?.map((child: any) => (
      <AccountRow key={child.code} account={child} depth={depth + 1} />
    ))}
  </>
);

export default function AccountingPage() {
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
          { label: 'Total Assets', value: '₹31,23,400', color: '#1976d2' },
          { label: 'Total Liabilities', value: '₹7,75,600', color: '#d32f2f' },
          { label: 'Total Equity', value: '₹23,47,800', color: '#388e3c' },
          { label: 'Total Revenue (YTD)', value: '₹14,13,000', color: '#f57c00' },
        ].map((stat) => (
          <Grid item xs={3} key={stat.label}>
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
            {accounts.map((acc) => (
              <AccountRow key={acc.code} account={acc} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
