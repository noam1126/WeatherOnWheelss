import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type WeatherChartProps = {
  lat: number;
  lon: number;
};

export default function WeatherChartComponent({ lat, lon }: WeatherChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const apiKey = "45017ea56ecca68d10012b50cec53ea5";
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const res = await axios.get(url);

        const chartData = res.data.list.map((entry: any) => ({
          time: entry.dt_txt,
          temperature: entry.main.temp,
          pressure: entry.main.pressure,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      }
    }

    fetchWeather();
  }, [lat, lon]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3 style={{ textAlign: "center" }}>Weather Forecast</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis
            yAxisId="left"
            label={{ value: "°C", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "hPa", angle: 90, position: "insideRight" }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            stroke="#8884d8"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pressure"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
