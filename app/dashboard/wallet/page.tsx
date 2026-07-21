"use client";

import { useState, useMemo } from "react";
import { Wallet, TrendingUp, Clock, Gift, ArrowDownLeft, ArrowUpRight, Copy, Check } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SearchBox } from "@/components/ui/SearchBox";
import { Pagination } from "@/components/ui/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTransactions, useDashboardStats } from "@/hooks/useQueries";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionType, TransactionStatus } from "@/types";

const typeBadge: Record<TransactionType, "success" | "info" | "warning" | "error" | "default"> = {
  earning: "success",
  deposit: "info",
  withdrawal: "warning",
  referral_bonus: "info",
  commission: "success",
};

const statusBadge: Record<TransactionStatus, "success" | "warning" | "error" | "default"> = {
  completed: "success",
  approved: "success",
  pending: "warning",
  rejected: "error",
};

const ITEMS_PER_PAGE = 8;

export default function WalletPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [page, setPage] = useState(1);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");

  const b = stats?.balance;
  const sparkData = (b?.sparklineData ?? []).map((v, i) => ({ i, v }));

  const filtered = useMemo(() => {
    let txs = [...transactions];
    if (filter !== "all") txs = txs.filter((t) => t.type === filter);
    if (search) {
      const q = search.toLowerCase();
      txs = txs.filter((t) => t.description.toLowerCase().includes(q) || t.type.includes(q));
    }
    return txs;
  }, [transactions, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (statsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Wallet />}
            label="Balance"
            value={formatCurrency(b?.current ?? 0)}
            sparkline={
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            }
          />
          <StatsCard icon={<TrendingUp />} label="Total Earnings" value={formatCurrency(b?.totalEarnings ?? 0)} trend={{ value: 12, direction: "up" }} />
          <StatsCard icon={<Clock />} label="Pending Rewards" value={formatCurrency(b?.pendingRewards ?? 0)} />
          <StatsCard icon={<Gift />} label="Referral Bonus" value={formatCurrency(b?.referralBonus ?? 0)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="primary" size="md" onClick={() => setWithdrawOpen(true)}>
              <ArrowDownLeft className="h-4 w-4" /> Add Money
            </Button>
            <Button variant="secondary" size="md" onClick={() => setWithdrawOpen(true)}>
              <ArrowUpRight className="h-4 w-4" /> Withdraw
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-3">
              <Select
                options={[
                  { value: "all", label: "All Types" },
                  { value: "earning", label: "Earning" },
                  { value: "deposit", label: "Deposit" },
                  { value: "withdrawal", label: "Withdrawal" },
                  { value: "referral_bonus", label: "Referral Bonus" },
                  { value: "commission", label: "Commission" },
                ]}
                value={filter}
                onChange={(e) => { setFilter(e.target.value as TransactionType | "all"); setPage(1); }}
                className="w-40"
              />
              <SearchBox onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search transactions..." className="w-56" />
            </div>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : paged.length === 0 ? (
              <EmptyState icon={<Wallet />} title="No transactions found" description="Complete tasks or make deposits to see transactions here." />
            ) : (
              <>
                <Table className="hidden md:table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm">{formatDate(tx.createdAt)}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{tx.description}</TableCell>
                        <TableCell><Badge variant={typeBadge[tx.type]}>{tx.type.replace("_", " ")}</Badge></TableCell>
                        <TableCell className={`text-sm font-medium ${tx.type === "withdrawal" ? "text-red-600" : "text-emerald-600"}`}>
                          {tx.type === "withdrawal" ? "-" : "+"}{formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell><Badge variant={statusBadge[tx.status]}>{tx.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="space-y-3 md:hidden">
                  {paged.map((tx) => (
                    <div key={tx.id} className="rounded-lg border border-outline-variant/40 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={typeBadge[tx.type]}>{tx.type.replace("_", " ")}</Badge>
                        <Badge variant={statusBadge[tx.status]}>{tx.status}</Badge>
                      </div>
                      <p className="text-sm text-on-surface">{tx.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-on-surface-variant">{formatDate(tx.createdAt)}</span>
                        <span className={`text-sm font-medium ${tx.type === "withdrawal" ? "text-red-600" : "text-emerald-600"}`}>
                          {tx.type === "withdrawal" ? "-" : "+"}{formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Withdraw Funds">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Select
            label="Withdrawal Method"
            options={[
              { value: "paypal", label: "PayPal" },
              { value: "bank_transfer", label: "Bank Transfer" },
              { value: "crypto", label: "Crypto (USDT)" },
            ]}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="Select method"
          />
          <Input label="Amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} leftIcon={<span className="text-sm">$</span>} />
          <Input label="Account Details" placeholder="Email or wallet address" value={account} onChange={(e) => setAccount(e.target.value)} />
          <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" className="flex-1" disabled={!method || !amount || !account}>Request Withdrawal</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
