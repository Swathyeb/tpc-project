import React from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const TrainingAndPlacementCell = () => {
    const createPlacementGraph = () => {
        const ctx = document.getElementById('placementGraph').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2019', '2020', '2021', '2022', '2023'],
                datasets: [{
                    label: 'Placement Percentage',
                    data: [60, 75, 80, 85, 90],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    };

    React.useEffect(() => {
        createPlacementGraph();
    }, []);

    const sectionStyle = {
        flexBasis: '25%',
        backgroundColor: 'rgb(234, 245, 252)',
        borderRadius: '10px',
        marginBottom: '3%',
        padding: '15px 10px',
        boxSizing: 'border-box'
    };

    // Recruiters data
    const recruiters = [
        { name: 'wipro', logo: '/path/to/logoA.png' },
        { name: 'intel', logo: '/path/to/logoB.png' },
        { name: 'google', logo: '/path/to/logoC.png' },
        { name: 'infosys', logo: '/path/to/logoD.png' },
        { name: 'tcs', logo: '/path/to/logoA.png' },
        { name: 'accenture', logo: '/path/to/logoB.png' },
        { name: 'Congizant', logo: '/path/to/logoC.png' },
        { name: 'ustglobal', logo: '/path/to/logoD.png' }
 
    ];

    return (
        <div>
            <main>
                <br />
                <h1 className="text-4xl font-bold text-center">Training And Placement Cell</h1>

                <br />
                <br />
                <section id="about" style={sectionStyle}>
                    <br />
                    <div className="p-6">
                        <h3 className="text-2xl font-bold">About Us</h3>
                        <p className="mt-4 text-lg">
                            The Training and Placement Cell aims to provide the best career opportunities to students.
                        </p>
                    </div>
                </section>

                <section id="staff" style={sectionStyle}>
                    <div className="row">
                        <div className="about-col">
                            <h3 className="text-2xl font-bold">Staff details</h3>
                            <ul>
                                <li>Divya - Head of TPC</li>
                                <li>Jane - Placement Coordinator</li>
                                <li>Joy - Career Counselor</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="placements">
                    <h3 className="text-2xl font-bold">Past Placement Graph</h3>
                    <canvas id="placementGraph" width="400" height="100"></canvas>
                </section>

                <section id="recruiters" style={sectionStyle}>
                <div className="row">
                <h3 className="text-2xl font-bold">Our Recruiters</h3>
        <div className="flex flex-wrap justify-center mt-4">

        <div className="flex justify-center mt-8">
          <img src="../logoA.png.jpeg" alt="Additional Recruiter" style={{ width: '900px', height: 'auto' }} />
         </div>
        </div>
     </div>
        </section>


                <section id="calendar" style={sectionStyle}>
                    <div className="row">
                        <div className="about-col">
                            <h3 className="text-2xl font-bold">TPC Calendar</h3>
                            <p className="mt-4 text-lg">Upcoming events and placement drives will be listed here.</p>
                        </div>
                    </div>
                </section>

                <section id="contact" style={sectionStyle}>
                    <div className="row">
                        <div className="about-col">
                            <h3 className="text-2xl font-bold">Contact</h3>
                            <p className="mt-4 text-lg">Email: tpc@college.edu</p>
                            <p className="mt-4 text-lg">Phone: +123 456 7890</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TrainingAndPlacementCell;