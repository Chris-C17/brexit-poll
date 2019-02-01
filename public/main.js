const form = document.getElementById('vote-form');

// Form Submit Event
form.addEventListener('submit', e => {
   const choice = document.querySelector('input[name=option]:checked').value;
   const data = {option: choice};

   fetch('http://localhost:3000/poll', {
       method: 'post',
       body: JSON.stringify(data),
       headers: new Headers({
           'Content-Type': 'application/json'
        })
       })
       .then(res => res.json())
       .then(data => console.log(data))
       .catch(err => console.log(err));

   e.preventDefault();
});

// Fetch data from DB
fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        // Count vote points - accumulator/current value
        const voteCounts = votes.reduce((acc, vote) =>
            ((acc[vote.option] = (acc[vote.option] || 0) + parseInt(vote.points)), acc), {});

        let dataPoints = [
            {label: 'Remain', y: voteCounts.Remain},
            {label: 'noDeal', y: voteCounts.noDeal},
            {label: 'Deal', y: voteCounts.Deal},
            {label: 'Other', y: voteCounts.Other},
        ];

        const chartContainer = document.querySelector
        ('#chartContainer');

        if(chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer',
                {
                    animationEnabled: true,
                    theme: 'theme2',
                    title: {
                        text: `Total Votes: ${totalVotes}`
                    },
                    data: [
                        {
                            type: "column",
                            dataPoints: dataPoints
                        }
                    ]
                });
            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('fd463010ca4a6e83b28c', {
                cluster: 'eu',
                forceTLS: true
            });

            var channel = pusher.subscribe('brexit-poll');
            channel.bind('brexit-vote', function(data) {
                dataPoints = dataPoints.map( x => {
                    if(x.label === data.option) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                });
                chart.render();
            });
        }
    });

