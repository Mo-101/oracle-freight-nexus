
import React from 'react';

interface ForwarderRanking {
  name: string;
  transitDays: number;
  cost: number;
  risk: number;
  score: number;
  rank: number;
}

interface OutputPanelProps {
  isVisible: boolean;
  rankings: ForwarderRanking[];
  formData: any;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ isVisible, rankings, formData }) => {
  if (!isVisible) return null;

  const getMedalIcon = (rank: number) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[rank - 1] || '🔹';
  };

  const getRankColor = (rank: number) => {
    const colors = ['text-deepcal-light', 'text-amber-400', 'text-rose-400'];
    return colors[rank - 1] || 'text-slate-400';
  };

  const getRiskColor = (risk: number) => {
    if (risk < 10) return 'bg-emerald-900/30 text-emerald-300';
    if (risk < 20) return 'bg-amber-900/30 text-amber-300';
    return 'bg-rose-900/30 text-rose-300';
  };

  const topForwarder = rankings[0];

  return (
    <div className="lg:col-span-2 animate-scroll-appear" id="outputPanel">
      <div className="oracle-card p-6">
        {/* Oracle Transmission Header */}
        <div className="bg-gradient-to-r from-deepcal-dark to-deepcal-purple p-5 rounded-t-xl symbolic-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <i className="fas fa-scroll text-2xl text-white mr-3"></i>
              <div>
                <h2 className="text-xl font-semibold text-white">🕊️ SYMBOLIC LOGISTICS TRANSMISSION</h2>
                <p className="text-sm text-purple-100">DeepCAL++ vΩ LIVING ORACLE REPORT</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-black/20 rounded-full text-sm flex items-center border border-purple-400/30">
              <i className="fas fa-bolt text-yellow-400 mr-2"></i>
              <span>ACTIVE TRANSMISSION • VERDICT PENDING</span>
            </div>
          </div>
        </div>

        {/* Emergency Context */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-deepcal-light mb-2">🚨 Emergency Context</h3>
              <p className="text-sm">Cholera spike reported in Kanyama District. ICU stocks at 23%. WHO pre-clearance granted.</p>
            </div>
            <div>
              <h3 className="font-semibold text-deepcal-light mb-2">📍 Route Intelligence</h3>
              <div className="text-sm grid grid-cols-2 gap-2">
                <div>Distance: <span className="font-mono">2,100 km</span></div>
                <div>Corridor: <span className="font-mono">Great North Road</span></div>
                <div>Border Risk: <span className="text-amber-400">⚠️ Medium</span></div>
                <div>Weather: <span className="text-emerald-400">✅ Clear</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Symbolic Decision Output */}
        <div className="grid grid-cols-1 gap-6">
          {/* Ranked Forwarders Table */}
          <div className="bg-slate-900/50 rounded-xl overflow-hidden symbolic-border">
            <div className="px-5 py-3 bg-gradient-to-r from-deepcal-dark to-deepcal-purple flex justify-between items-center">
              <h3 className="font-semibold flex items-center">
                <i className="fas fa-trophy mr-2"></i>
                TOPSIS Ranking Matrix
              </h3>
              <span className="text-xs bg-black/20 px-2 py-1 rounded">Closeness Coefficient Algorithm</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-deepcal-purple/30">
                  <tr>
                    <th className="px-4 py-3 text-left">Rank</th>
                    <th className="px-4 py-3 text-left">Forwarder</th>
                    <th className="px-4 py-3 text-left">Time (days)</th>
                    <th className="px-4 py-3 text-left">Cost (USD/kg)</th>
                    <th className="px-4 py-3 text-left">Risk</th>
                    <th className="px-4 py-3 text-left">TOPSIS Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((forwarder) => (
                    <tr key={forwarder.name} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                      <td className={`px-4 py-3 font-semibold ${getRankColor(forwarder.rank)}`}>
                        {getMedalIcon(forwarder.rank)} {forwarder.rank}
                      </td>
                      <td className="px-4 py-3 font-medium">{forwarder.name}</td>
                      <td className="px-4 py-3">{forwarder.transitDays}</td>
                      <td className="px-4 py-3">${forwarder.cost}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 ${getRiskColor(forwarder.risk)} rounded text-xs`}>
                          {forwarder.risk}%
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-bold ${getRankColor(forwarder.rank)}`}>
                        {forwarder.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytical Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symbolic Narrative */}
            <div className="oracle-card p-5">
              <div className="flex items-center mb-4">
                <i className="fas fa-book-open text-lg text-blue-400 mr-2"></i>
                <h3 className="font-semibold">Oracle Narrative</h3>
              </div>
              <div className="text-sm leading-relaxed text-slate-200">
                <p className="mb-3">📜 <span className="font-medium">The Whisper of Logistics:</span> In the realm of urgent {formData.cargoType.toLowerCase()} from {formData.origin} to {formData.destination}, where time battles cost and risk shadows every movement, DeepCAL++ has consulted the ancient ledger of probabilities.</p>
                <p className="mb-3">🧠 <span className="font-medium">Symbolic Insight:</span> {topForwarder.name} emerges—not as the cheapest carrier (at ${topForwarder.cost}/kg) nor the swiftest ({topForwarder.transitDays} days), but as the golden mean. Its risk factor of {topForwarder.risk}% is a silent fortress in turbulent times.</p>
                <p className="mb-3">⚖️ <span className="font-medium">The Balance Struck:</span> With your critical weight on time (68%) whispering urgency, and cost (45%) pleading economy, the TOPSIS algorithm rendered its impartial verdict: a dominant {topForwarder.score} score.</p>
                <p>🔱 <span className="font-medium">Oracle Proverb:</span> <em>"In the monsoon of uncertainty, the owl chooses the branch with both roots and reach."</em> {topForwarder.name} is that branch.</p>
              </div>
            </div>

            {/* Symbolic Seal */}
            <div className="oracle-card p-5 flex flex-col items-center justify-center">
              <div className="flex items-center mb-4">
                <i className="fas fa-drafting-compass text-lg text-purple-400 mr-2"></i>
                <h3 className="font-semibold">Decision Covenant</h3>
              </div>
              <div className="decision-seal mb-3">
                <div className="text-center text-white font-bold text-xs leading-tight">
                  DEEP++ SEAL<br />
                  ✦ VERDICT ✦<br />
                  <span className="text-[8px]">SEALED</span>
                </div>
              </div>
              <div className="text-xs text-center mt-2">
                <div>qseal:8fa9c27e</div>
                <div className="text-slate-400 mt-1">TIMESTAMP: {new Date().toISOString()}</div>
                <div className="mt-2 text-purple-300">"{topForwarder.name} honored with cargo blessing"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
