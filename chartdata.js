//chart1
//<script>
var config1 = {
      type: 'bar',
      data: {
        datasets: [{
            //bar
            label: 'Workouts you completed',
            yAxisID: 'A',
            data: [3, 3, 2, 3, 1, 0, 3, 1, 3, 3, 2, 3],
            backgroundColor: '#ccff00',
            borderColor: '#ccff00',
            fill: true
        }, {
            //line
            label: '% Competitors finished the week',
            yAxisID: 'B',
            data: [90, 95, 60, 40, 55, 70, 30, 45, 40, 30, 20, 43],
            type: 'line',
            backgroundColor: '#f442b3',
            borderColor: '#f442b3',
            fill: false
        }],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
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

          yAxes: [
            {
              //bar axis
              id: 'A',
              type: 'linear',
              position: 'right',
              ticks: {
                max: 100,
                min: 0
              }
              },
            {
              //line axis
              id: 'B',
              type: 'linear',
              position: 'left',
              ticks: {
                max: 3,
                min: 0
              }
            }
          ],

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
      type: 'bar',
      data: {
        datasets: [{
            //bar data
            label: '% stake locked up',
            yAxisID: 'A',
            data: [2, 5, 7, 5, 9, 15, 10, 3, 8, 18, 11, 7],
            backgroundColor: '#ccff00',
            borderColor: '#ccff00',
            fill: true
        }, {
            //line data
            label: 'Your cumulative % stake earned back',
            yAxisID: 'B',
            data: [2, 7, 12, 26, 26, 30, 45, 45, 78, 85, 85, 90],
            backgroundColor: '#f442b3',
            borderColor: '#f442b3',
            fill: false,
            type: 'line'
        }],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12']
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

          yAxes: [
            {
              //bar axis
              id: 'A',
              type: 'linear',
              position: 'right',
              ticks: {
                max: 60,
                min: 0
              }
              },
            {
              //line axis
              id: 'B',
              type: 'linear',
              position: 'left',
              ticks: {
                max: 120,
                min: 0
              }
            }
          ],

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

