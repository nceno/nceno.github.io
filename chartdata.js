//chart1
//<script>
var config1 = {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
        datasets: [{
          label: 'Locked stake %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#ccff00',
          borderColor: '#ccff00',
          fill: false,
          borderDash: [5, 5],
          pointRadius: [1, 2.5, 3.5, 2.5, 4.5, 7.5, 5, 1.5, 4, 9, 5.5, 3.5],
        },{
          label: 'Competitor success rate %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#f442b3',
          borderColor: '#f442b3',
          fill: false,
          pointHitRadius: 20,
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Week'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }],
          gridlines: [{
          display: true,
          color: '#848484'
          }]
        },
        title: {
          display: true,
          text: 'Weekly payouts'
        }
      }
    };

//</script>
// end chart1

//chart2
//<script>
var config2 = {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
        datasets: [{
          label: 'Locked stake %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#ccff00',
          borderColor: '#ccff00',
          fill: false,
          borderDash: [5, 5],
          pointRadius: [1, 2.5, 3.5, 2.5, 4.5, 7.5, 5, 1.5, 4, 9, 5.5, 3.5],
        },{
          label: 'Competitor success rate %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#f442b3',
          borderColor: '#f442b3',
          fill: false,
          pointHitRadius: 20,
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Week'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }],
          gridlines: [{
          display: true,
          color: '#848484'
          }]
        },
        title: {
          display: true,
          text: 'Weekly payouts'
        }
      }
    };

//</script>
// end chart2

//chart3
//<script>
var config3 = {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'],
        datasets: [{
          label: 'Locked stake %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#ccff00',
          borderColor: '#ccff00',
          fill: false,
          borderDash: [5, 5],
          pointRadius: [1, 2.5, 3.5, 2.5, 4.5, 7.5, 5, 1.5, 4, 9, 5.5, 3.5],
        },{
          label: 'Competitor success rate %',
          data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
          ],
          backgroundColor: '#f442b3',
          borderColor: '#f442b3',
          fill: false,
          pointHitRadius: 20,
        }]
      },
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
        },
        hover: {
          mode: 'index'
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Week'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }],
          gridlines: [{
          display: true,
          color: '#848484'
          }]
        },
        title: {
          display: true,
          text: 'Weekly payouts'
        }
      }
    };