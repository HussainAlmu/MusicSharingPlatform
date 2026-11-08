document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#rating-chart');

    if (!canvas) return;

    const ratingCounts = JSON.parse(canvas.dataset.ratingCounts);
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5'],
            datasets: [{
                data: ratingCounts,
                backgroundColor: ['#5b5b5b', '#777777', '#b8b8b8', '#f5f0f1', '#b8b8b8'],
                borderRadius: 8,
                borderSkipped: false,
                barPercentage: 0.82,
                categoryPercentage: 0.9,
            }],
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                padding: { top: 24 },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => `${items[0].label} star${items[0].label === '1' ? '' : 's'}`,
                        label: (item) => `${item.raw} review${item.raw === 1 ? '' : 's'}`,
                    },
                },
            },
            scales: {
                x: {
                    display: false,
                    grid: { display: false },
                },
                y: {
                    display: false,
                    beginAtZero: true,
                    max: Math.max(...ratingCounts, 1) * 1.3,
                    grid: { display: false },
                },
            },
        },
        plugins: [{
            id: 'rating-count-labels',
            afterDatasetsDraw(chart) {
                const { ctx } = chart;
                const meta = chart.getDatasetMeta(0);

                ctx.save();
                ctx.fillStyle = '#aaa4ad';
                ctx.font = '16px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                meta.data.forEach((bar, index) => {
                    ctx.fillText(String(ratingCounts[index]), bar.x, bar.y - 8);
                });

                ctx.restore();
            },
        }],
    });
});
