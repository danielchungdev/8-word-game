import React, { useEffect, useRef, FC, useState } from 'react';
import * as d3 from 'd3';

interface StatsProps {
    screenWidth: number,
    screenHeight: number,
    data: { date: string, tries: number }[]
}

export const Stats: FC<StatsProps> = ({ screenWidth, screenHeight, data }) => {
    const chartRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const margin = { top: 0, right: 0, bottom: 0, left: 40};
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current);

        // Remove existing elements
        svg.selectAll('*').remove();

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const groupedData = data.reduce<{ [key: string]: number }>((acc, item) => {
            if (item.tries < 5) {
                acc['< 5'] = (acc['< 5'] || 0) + 1;
            } else if (item.tries < 10) {
                acc['+5'] = (acc['+5'] || 0) + 1;
            } else if (item.tries < 15) {
                acc['+10'] = (acc['+10'] || 0) + 1;
            } else if (item.tries < 20) {
                acc['+15'] = (acc['+15'] || 0) + 1;
            } else {
                acc['+20'] = (acc['+20'] || 0) + 1;
            }
            return acc;
        }, {});

        const transformedData = Object.entries(groupedData).map(([tries, count]) => ({
            tries,
            count
        }));

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(groupedData))!])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(['< 5', '+5', '+10', '+15', '+20'])
            .range([0, height]) // Adjusted range to flip the bars
            .padding(0.1);

        // Bars
        g.selectAll('rect')
            .data(transformedData)
            .enter().append('rect')
            .attr('x', 0)
            .attr('y', d => yScale(d.tries)!)
            .attr('width', d => xScale(d.count))
            .attr('height', yScale.bandwidth())
            .attr('fill', '#22c55e');

        // Bar labels
        g.selectAll('text')
            .data(transformedData)
            .enter().append('text')
            .attr('x', d => xScale(d.count) - 5)
            .attr('y', d => yScale(d.tries)! + yScale.bandwidth() / 2)
            .attr('dy', '.35em')
            .attr('fill', 'white')
            .attr('font-size', '14px')
            .attr('text-anchor', 'end')
            .text(d => d.count);

        // Y-axis
        g.append('g')
            .call(d3.axisLeft(yScale)
                .tickSize(0)
                .tickValues(['< 5', '+5', '+10', '+15', '+20'])
                .tickSizeOuter(0)
                .tickPadding(10)
            )
            .selectAll('.tick text')
            .attr('font-size', '16px')
            .attr('stroke', 'none')
            .attr('fill', 'black');

        g.selectAll('.domain')
            .remove()

    }, [data, dimensions]);

    useEffect(() => {
        const updateDimensions = () => {
            const width = screenWidth > 1200 ? 350 : 280;
            const height = 200;
            setDimensions({ width, height });
        };

        updateDimensions();

        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, [screenWidth]);

    return (
        <svg ref={chartRef} width={dimensions.width} height={dimensions.height}></svg>
    );
};
