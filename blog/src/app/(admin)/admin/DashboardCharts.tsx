"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb", "#dc2626", "#16a34a", "#ca8a04", "#9333ea",
  "#0891b2", "#db2777", "#ea580c", "#4f46e5", "#65a30d",
];

interface Props {
  tagData: { name: string; count: number }[];
  monthlyPosts: { month: string; count: number }[];
}

export function DashboardCharts({ tagData, monthlyPosts }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Posts by Tag
        </h3>
        {tagData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tagData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name} (${value})`}
              >
                {tagData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Posts per Month
        </h3>
        {monthlyPosts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={2}
                name="Posts"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Posts per Year
        </h3>
        {yearlyPosts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyPosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" name="Posts" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
