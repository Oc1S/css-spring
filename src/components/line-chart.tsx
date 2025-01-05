import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

export const Chart: React.FC<{
  data: any[];
  keys: string | string[];
}> = ({ data, keys }) => {
  const dataKeys = Array.isArray(keys) ? keys : [keys];

  return (
    <LineChart width={400} height={400} data={data}>
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis
        dataKey="time"
        domain={[0, 'dataMax']}
        tickCount={1}
        type="number"
      />
      <YAxis />
      <Tooltip
        labelStyle={{
          color: '#eee',
        }}
      />
      <Legend />
      {dataKeys.map((key) => {
        return (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke="#fad657"
            dot={false}
            strokeWidth={2}
          />
        );
      })}
    </LineChart>
  );
};
