import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js';
import * as d3 from 'd3';

function HomePage() {

    const [budgetData, setBudgetData] = useState([]);

    useEffect(() => {

        axios.get("http://localhost:3001/budget")
        .then((res) => {
            setBudgetData(res.data.myBudget);
            const ctx = document.getElementById("myChart").getContext("2d");
            if (window.myChartInstance) {
                window.myChartInstance.destroy();
            }
            window.myChartInstance = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: res.data.myBudget.map((item) => item.title),
                    datasets: [
                        {
                            data: res.data.myBudget.map((item) => item.budget),
                            backgroundColor: [
                                "#ff6384", "#36a2eb", "#cc65fe", "#ffce56",
                                "#2ecc71", "#e67e22", "#95a5a6"
                            ],
                        },
                    ],
                },
            });

            const data = res.data.myBudget;
            
            d3.select("#myd3Chart").selectAll("*").remove();
            const width = 400;
            const height = 400;
            const radius = Math.min(width, height) / 2;

            const svg = d3.select("#myd3Chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);
            
            const color = d3.scaleOrdinal()
            .domain(data.map(d => d.title))
            .range(["#ff6384", "#36a2eb", "#cc65fe", "#ffce56",
                "#2ecc71", "#e67e22", "#95a5a6"]);
                
            const pie = d3.pie().value(d => d.budget);
            const arc = d3.arc().innerRadius(0).outerRadius(radius);
            
            svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.title))
            .attr("stroke", "white")
            .style("stroke-width", "2px");

        })
        .catch((err) => {
            console.error("Error fetching budget data:", err);
        });
    }, []);

  return (
    <main className="center" id="main" aria-label="Essential budget information">
      <section className="page-area">

        <article>
          <h1>New Chart</h1>
          <div id="myd3Chart" style={{ width: "400px", height: "400px" }}></div>
        </article>

        <article>
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to track it down,
            you would get surprised! Proper budget management depends on real data... and this
            app will help you with that!
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get out of debt faster!
            Also, they live happier lives... since they expend without guilt or fear... 
            because they know it is all good and accounted for.
          </p>
        </article>

        <article>
          <h1>Free</h1>
          <p>
            This app is free!!! And you are the only one holding your data!
          </p>
        </article>

        <article>
          <h1>Chart</h1>
          <p>
            <canvas id="myChart" width="400" height="400"></canvas>
          </p>
        </article>

      </section>
    </main>
  );
}

export default HomePage;
