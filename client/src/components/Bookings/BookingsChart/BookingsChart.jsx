import React from "react";
import { Bar as BarChart } from "react-chartjs-2";

const BOOKING_BUCKETS = {
  Cheap: {
    min: 0,
    max: 500,
  },
  Normal: {
    min: 500,
    max: 1000,
  },
  Expense: {
    min: 1000,
    max: 90000000,
  },
};

const bookingsChart = (props) => {
  const chartData = {
    labels: [],
    datasets: [],
  };
  let values = [];
  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookinsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKING_BUCKETS[bucket].min &&
        current.event.price < BOOKING_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookinsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
    console.log(chartData);
  }
  return (
    <div className="text-center">
      <BarChart
        data={chartData}
        width={600}
        height={250}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default bookingsChart;
