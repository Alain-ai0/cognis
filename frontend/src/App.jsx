import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Wallet, ArrowUpRight, ArrowDownLeft, BarChart3, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Exact category color mapping for the Total Spending chart
const CHART_COLORS = ['#F8395A', '#FA22A1', '#86C5FF', '#B0A6DF', '#FAFAFA'];

const FileUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess(); // Refresh the data list
    } catch (error) {
      alert("upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-8 text-center hover:border-amber-500/70 transition-colors group cursor-pointer relative">
      <input
        type="file"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 bg-neutral-800 rounded-full group-hover:bg-amber-500/10 group-hover:text-amber-100 transition-colors">
          {uploading ? <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-amber-500 rounded-full" /> : "📁"}
        </div>
        <p className="text-white/90 font-medium">Click or drag bank statement (CSV)</p>
        <p className="text-white/60 text-xs uppercase tracking-[0.25em]">Max size: 5MB</p>
      </div>
    </div>
  );
};

function App() {
  // 1. State: This is the memory of my app
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/transactions');
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, []); // The Empty array means this function only get created once

  const handleClearData = async () => {
    if (window.confirm("Are you sure you want to delete all transaction history?")) {
      try {
        await axios.delete('http://127.0.0.1:8000/clear-data');
        setTransactions([]); // Clear UI immediately
        alert("Database reset successfully.");
      } catch (error) {
        alert("Failed to clear data: " + error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    const query = searchQuery.toLowerCase();
    return (
      tx.description.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query) ||
      tx.amount.toString().includes(query)
    );
  });

  const handleNeuralSearch = () => {
    if (!searchQuery) return;
    console.log(`Analyzing: ${searchQuery}`);
  }

// Calculate totals and group data for the chart
const { totalSpent, chartData } = useMemo(() => {
  const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category
  const grouped = transactions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  // Recharts
  const formattedData = Object.keys(grouped).map(key => ({
    name: key,
    value: parseFloat(grouped[key].toFixed(2))
  }));

  return { totalSpent: total, chartData: formattedData };
}, [transactions]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      {/* Header Area */}
      <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-white font-display tracking-[0.04em]">
            <Wallet className="text-amber-400" /> Cognis
          </h1>
          <p className="text-white/60 font-sans">Advanced financial intelligence</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleClearData}
            className="text-xs font-bold text-white/80 hover:text-amber-200 uppercase tracking-[0.25em] transition-colors border border-neutral-800 hover:border-amber-500/70 px-3 py-2 rounded-sm"
          >
            Clear history
          </button>
        
        <div className="bg-neutral-900 px-4 py-2 rounded-sm border border-neutral-800 flex items-center gap-3">
          <span className="h-2 w-2 bg-[#E2E412] rounded-full"></span>
          <span className="text-sm font-mono text-[#0a0a0a] bg-[#E2E412] px-2 py-1 rounded-sm">API CONNECTED</span>
        </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        {/* TOP CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 p-6 rounded-sm border border-neutral-800">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <TrendingDown size={18} />
              <span className="text-sm font-medium uppercase tracking-[0.25em]">Total Spending</span>
            </div>
            <div className="text-3xl font-bold font-mono text-white/95">${totalSpent.toFixed(2)}</div>
          </div>

          <div className="bg-neutral-900 p-6 rounded-sm border border-neutral-800 md:col-span-2 flex items-center justify-between">
            <div className="h-[200px] w-full min-w-0">
              {/* PIE CHART */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #2c2c2c', borderRadius: '2px' }}
                    itemStyle={{ color: '#eaeaec' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="hidden lg:block pr-8">
              <h3 className="text-white/80 text-sm mb-1 uppercase tracking-[0.25em]">Breakdown</h3>
              <p className="text-xs text-white/60 max-w-[200px]">Visualizing your expenses across {chartData.length} AI-identified categories.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-white/80 text-sm mb-4 uppercase tracking-[0.35em]">Data Input</h3>
          <FileUpload onUploadSuccess={fetchData} />
        </div>
            
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 font-semibold">
              Intelligent Search
            </p>

            <div className="relative group w-full max-w-xl mx-auto my-6">
  {/* Thee search bar component */}
  <div className="absolute -inset-0.5 bg-amber-500/10 rounded-sm opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
  
  <div className="relative flex items-center">
    {/* Fixed Icon Gutter */}
    <div className="absolute left-4 z-10 flex items-center pointer-events-none">
      <svg 
        className="w-5 h-5 text-white/60 group-focus-within:text-amber-100 transition-colors" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    {/* Input with increased left padding (pl-14) */}
    <input
      type="text"
      placeholder="Query the neural engine..."
      className="w-full bg-neutral-950 text-[#FEF3D7] placeholder-white/40 pl-14 pr-16 py-3.5 rounded-sm border border-neutral-800 focus:border-[#E2E412] outline-none transition-all"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleNeuralSearch()}
    />

    {/* CTRL + K Decoration */}
    <div className="absolute right-4 flex items-center space-x-1 opacity-30 select-none">
      <span className="px-1.5 py-0.5 text-[9px] font-bold border border-neutral-800 rounded-sm bg-neutral-900 text-white/70">CTRL</span>
      <span className="px-1.5 py-0.5 text-[9px] font-bold border border-neutral-800 rounded-sm bg-neutral-900 text-white/70">K</span>
    </div>
  </div>
</div>
            
            {/* Recent transactions table */}
            <div className="bg-neutral-900 rounded-sm border border-neutral-800 overflow-hidden">
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                <h2 className="text-xl font-semibold font-display">Transactions History</h2>
                <BarChart3 className="text-white/60" size={20} />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-white/60 text-xs uppercase tracking-[0.25em] border-b border-neutral-800">
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Description</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTransactions.map((t, index) => (
                      <tr key={index} className="hover:bg-neutral-800/70 transition-colors group">
                        <td className="p-4 text-sm text-white/70 font-mono">{t.date}</td>
                        <td className="p-4 font-medium text-white/90">{t.description}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-[0.25em] bg-[#68303B] text-[#FEF3D7] border border-[#68303B] transition-all inline-block">
                            {t.category}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-white/95">
                          ${t.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}

                    {/* Show this if search returns nothing */}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-white/60 italic">
                          No transactions found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
      </main>
    </div>
  );
}

export default App;